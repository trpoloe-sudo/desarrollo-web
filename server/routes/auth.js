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

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = new Set(["admin", "customer"]);
const VALID_ORDER_STATUSES = new Set(["pending", "completed", "cancelled"]);

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidEmail = (value) => isNonEmptyString(value) && EMAIL_PATTERN.test(value.trim());

const isFiniteNumber = (value) => Number.isFinite(Number(value));

const respondWithAuthenticatedUser = (res, payload, statusCode = 200) => {
  setSessionCookie(res, payload.session.token);
  return res.status(statusCode).json({ user: payload.user });
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

  if (!isValidEmail(body.email)) {
    errors.push("email must be a valid email address");
  }

  if (!isNonEmptyString(body.name)) {
    errors.push("name is required");
  }

  if ("picture" in body && body.picture != null && typeof body.picture !== "string") {
    errors.push("picture must be a string when provided");
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
    const payload = await authenticateWithGoogle({
      email: req.body.email,
      name: req.body.name,
      picture: req.body.picture ?? null,
    });

    return respondWithAuthenticatedUser(res, payload);
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
