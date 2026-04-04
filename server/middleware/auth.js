import { getSessionRecord } from "../storage/authStore.js";
import {
  clearSessionCookie,
  getSessionTokenFromCookies,
} from "../utils/sessionCookie.js";

export const getBearerToken = (req) => {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return authorization.slice(7).trim() || null;
};

export const getRequestSessionToken = (req) => {
  return getSessionTokenFromCookies(req) || getBearerToken(req);
};

export const requireAuth = async (req, res, next) => {
  const cookieToken = getSessionTokenFromCookies(req);
  const token = cookieToken || getBearerToken(req);

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const record = await getSessionRecord(token);

  if (!record) {
    if (cookieToken) {
      clearSessionCookie(res);
    }

    return res.status(401).json({ error: "Sesion invalida o expirada" });
  }

  req.auth = {
    token,
    user: record.user,
    session: record.session,
  };

  return next();
};

export const requireAdmin = (req, res, next) => {
  if (req.auth?.user?.role !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores" });
  }

  return next();
};
