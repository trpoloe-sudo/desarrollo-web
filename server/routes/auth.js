import { Router } from "express";
import {
  addOrderToUser,
  authenticateUser,
  authenticateWithGoogle,
  deleteSession,
  listUsers,
  registerUser,
  updateOrderStatus,
  updateUserRole,
} from "../storage/authStore.js";
import {
  getRequestSessionToken,
  requireAdmin,
  requireAuth,
} from "../middleware/auth.js";
import {
  clearSessionCookie,
  setSessionCookie,
} from "../utils/sessionCookie.js";
import { createPublicKey, verify as verifySignature } from "crypto";

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = new Set(["admin", "customer"]);
const VALID_ORDER_STATUSES = new Set(["pending", "completed", "cancelled"]);
const GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v1/certs";
const VALID_GOOGLE_ISSUERS = new Set([
  "accounts.google.com",
  "https://accounts.google.com",
]);
const DEFAULT_CERTS_CACHE_MS = 60 * 60 * 1000;
const DEFAULT_GOOGLE_CLIENT_ID =
  "830570310646-ogjq785e6i3skd9hnv13mm3f797lj4gi.apps.googleusercontent.com";

let cachedGoogleCerts = null;
let cachedGoogleCertsExpiresAt = 0;

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidEmail = (value) => isNonEmptyString(value) && EMAIL_PATTERN.test(value.trim());

const isFiniteNumber = (value) => Number.isFinite(Number(value));

const respondWithAuthenticatedUser = (res, payload, statusCode = 200) => {
  setSessionCookie(res, payload.session.token);
  return res.status(statusCode).json({ user: payload.user });
};

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const parseMaxAgeMs = (cacheControlHeader) => {
  const match = String(cacheControlHeader || "").match(/max-age=(\d+)/i);
  const seconds = Number.parseInt(match?.[1] || "", 10);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return DEFAULT_CERTS_CACHE_MS;
  }

  return seconds * 1000;
};

const base64UrlToBuffer = (value) => {
  const normalized = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padding = normalized.length % 4;
  const padded = padding === 0 ? normalized : normalized + "=".repeat(4 - padding);

  return Buffer.from(padded, "base64");
};

const parseJwtSection = (value, label) => {
  try {
    return JSON.parse(base64UrlToBuffer(value).toString("utf8"));
  } catch {
    throw createHttpError(400, `La respuesta de Google contiene un ${label} invalido.`);
  }
};

const getConfiguredGoogleClientIds = () => {
  const configuredClientIds = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.VITE_GOOGLE_CLIENT_ID,
    ...(process.env.GOOGLE_ALLOWED_CLIENT_IDS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  ].filter(Boolean);

  return configuredClientIds.length ? configuredClientIds : [DEFAULT_GOOGLE_CLIENT_ID];
};

const getGoogleCertificates = async () => {
  if (cachedGoogleCerts && Date.now() < cachedGoogleCertsExpiresAt) {
    return cachedGoogleCerts;
  }

  const response = await fetch(GOOGLE_CERTS_URL);

  if (!response.ok) {
    throw createHttpError(503, "No se pudo validar Google Sign-In en este momento.");
  }

  const certificates = await response.json();

  if (!certificates || typeof certificates !== "object") {
    throw createHttpError(503, "Google no devolvio certificados validos para el inicio de sesion.");
  }

  cachedGoogleCerts = certificates;
  cachedGoogleCertsExpiresAt =
    Date.now() + parseMaxAgeMs(response.headers.get("cache-control"));

  return certificates;
};

const isAllowedAudience = (audience, allowedAudiences) => {
  if (Array.isArray(audience)) {
    return audience.some((item) => allowedAudiences.includes(item));
  }

  return allowedAudiences.includes(String(audience || ""));
};

const verifyGoogleCredential = async (credential) => {
  if (!isNonEmptyString(credential)) {
    throw createHttpError(400, "Google no devolvio una credencial valida.");
  }

  const clientIds = getConfiguredGoogleClientIds();

  if (clientIds.length === 0) {
    throw createHttpError(503, "Google Sign-In no esta configurado en el servidor.");
  }

  const parts = credential.split(".");

  if (parts.length !== 3) {
    throw createHttpError(400, "La credencial de Google no tiene un formato valido.");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = parseJwtSection(encodedHeader, "encabezado");
  const payload = parseJwtSection(encodedPayload, "contenido");

  if (header.alg !== "RS256" || !header.kid) {
    throw createHttpError(400, "La credencial de Google usa una firma no soportada.");
  }

  let certificates = await getGoogleCertificates();
  let certificate = certificates[header.kid];

  if (!certificate) {
    cachedGoogleCerts = null;
    cachedGoogleCertsExpiresAt = 0;
    certificates = await getGoogleCertificates();
    certificate = certificates[header.kid];
  }

  if (!certificate) {
    throw createHttpError(401, "La credencial de Google ya no es valida. Intenta nuevamente.");
  }

  const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`);
  const signature = base64UrlToBuffer(encodedSignature);
  const publicKey = createPublicKey(certificate);
  const isSignatureValid = verifySignature("RSA-SHA256", signingInput, publicKey, signature);

  if (!isSignatureValid) {
    throw createHttpError(401, "No se pudo verificar la firma de Google.");
  }

  if (!VALID_GOOGLE_ISSUERS.has(String(payload.iss || ""))) {
    throw createHttpError(401, "El emisor de la credencial de Google no es valido.");
  }

  if (!isAllowedAudience(payload.aud, clientIds)) {
    throw createHttpError(401, "La credencial de Google no corresponde a esta aplicacion.");
  }

  const expirationTime = Number.parseInt(String(payload.exp || ""), 10);

  if (!Number.isFinite(expirationTime) || expirationTime * 1000 <= Date.now()) {
    throw createHttpError(401, "La credencial de Google ya expiro. Intenta nuevamente.");
  }

  const email = String(payload.email || "").trim().toLowerCase();
  const emailVerified =
    payload.email_verified === true || payload.email_verified === "true";

  if (!email) {
    throw createHttpError(400, "Google no devolvio un email para esta cuenta.");
  }

  if (!emailVerified) {
    throw createHttpError(403, "La cuenta de Google no tiene el email verificado.");
  }

  return {
    email,
    name: String(payload.name || "").trim() || email.split("@")[0],
    picture: payload.picture ? String(payload.picture).trim() : null,
  };
};

const validateRegisterBody = (body) => {
  const errors = [];

  if (!isValidEmail(body.email)) {
    errors.push("email must be a valid email address");
  }

  if (!isNonEmptyString(body.password) || body.password.trim().length < 6) {
    errors.push("password must have at least 6 characters");
  }

  if (!isNonEmptyString(body.name) || body.name.trim().length < 2) {
    errors.push("name must have at least 2 characters");
  }

  return errors;
};

const validateLoginBody = (body) => {
  const errors = [];

  if (!isValidEmail(body.email)) {
    errors.push("email must be a valid email address");
  }

  if (!isNonEmptyString(body.password)) {
    errors.push("password is required");
  }

  return errors;
};

const validateGoogleBody = (body) => {
  const errors = [];

  if (!isNonEmptyString(body.credential)) {
    errors.push("credential is required");
  }

  return errors;
};

const validateOrderBody = (body) => {
  const errors = [];

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items must be a non-empty array");
  }

  if (!isFiniteNumber(body.subtotal)) {
    errors.push("subtotal must be a number");
  }

  if (!isFiniteNumber(body.tax)) {
    errors.push("tax must be a number");
  }

  if (!isFiniteNumber(body.total)) {
    errors.push("total must be a number");
  }

  if (!isNonEmptyString(body.paymentMethod)) {
    errors.push("paymentMethod is required");
  }

  if ("billingAddress" in body && body.billingAddress != null && typeof body.billingAddress !== "object") {
    errors.push("billingAddress must be an object when provided");
  }

  if ("status" in body && !VALID_ORDER_STATUSES.has(body.status)) {
    errors.push("status must be one of pending, completed, cancelled");
  }

  return errors;
};

router.post("/register", async (req, res) => {
  const errors = validateRegisterBody(req.body ?? {});

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const payload = await registerUser({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });

    return respondWithAuthenticatedUser(res, payload, 201);
  } catch (error) {
    return res.status(409).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const errors = validateLoginBody(req.body ?? {});

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const payload = await authenticateUser({
      email: req.body.email,
      password: req.body.password,
    });

    return respondWithAuthenticatedUser(res, payload);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

router.post("/google", async (req, res) => {
  const errors = validateGoogleBody(req.body ?? {});

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const googleProfile = await verifyGoogleCredential(req.body.credential);
    const payload = await authenticateWithGoogle({
      email: googleProfile.email,
      name: googleProfile.name,
      picture: googleProfile.picture,
    });

    return respondWithAuthenticatedUser(res, payload);
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ error: error.message || "No se pudo iniciar sesion con Google." });
  }
});

router.get("/session", requireAuth, async (req, res) => {
  return res.json(req.auth.user);
});

router.post("/logout", async (req, res) => {
  const token = getRequestSessionToken(req);

  if (token) {
    await deleteSession(token);
  }

  clearSessionCookie(res);
  return res.json({ ok: true });
});

router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  const users = await listUsers();
  return res.json(users);
});

router.patch("/users/:email/role", requireAuth, requireAdmin, async (req, res) => {
  const role = req.body?.role;

  if (!VALID_ROLES.has(role)) {
    return res.status(400).json({ error: "role must be one of admin or customer" });
  }

  try {
    const user = await updateUserRole(decodeURIComponent(req.params.email), role);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/orders", requireAuth, async (req, res) => {
  const errors = validateOrderBody(req.body ?? {});

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const createdOrder = await addOrderToUser(req.auth.user.id, req.body);

  if (!createdOrder) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  return res.status(201).json(createdOrder);
});

router.get("/orders", requireAuth, async (req, res) => {
  return res.json(req.auth.user.orders || []);
});

router.patch("/orders/:orderId/status", requireAuth, requireAdmin, async (req, res) => {
  const status = req.body?.status;

  if (!VALID_ORDER_STATUSES.has(status)) {
    return res.status(400).json({ error: "status must be one of pending, completed, cancelled" });
  }

  const updated = await updateOrderStatus(req.params.orderId, status);

  if (!updated) {
    return res.status(404).json({ error: "Orden no encontrada" });
  }

  return res.json(updated);
});

export default router;
