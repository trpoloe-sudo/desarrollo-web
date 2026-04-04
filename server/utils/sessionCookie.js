const DEFAULT_SESSION_TTL_HOURS = 24 * 7;
const VALID_SAME_SITE_VALUES = new Set(["lax", "strict", "none"]);

const toPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getSessionTtlHours = () =>
  toPositiveInteger(process.env.SESSION_TTL_HOURS, DEFAULT_SESSION_TTL_HOURS);

const getCookieSameSite = () => {
  const sameSite = String(process.env.SESSION_COOKIE_SAME_SITE || "lax").toLowerCase();
  return VALID_SAME_SITE_VALUES.has(sameSite) ? sameSite : "lax";
};

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "ztar_session";
export const SESSION_TTL_MS = getSessionTtlHours() * 60 * 60 * 1000;

export const getSessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: getCookieSameSite(),
  secure: process.env.SESSION_COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_MS,
});

export const setSessionCookie = (res, token) => {
  res.cookie(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
};

export const clearSessionCookie = (res) => {
  const { maxAge, ...options } = getSessionCookieOptions();
  res.clearCookie(SESSION_COOKIE_NAME, options);
};

export const parseCookies = (cookieHeader) => {
  return String(cookieHeader || "")
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce((cookies, chunk) => {
      const separatorIndex = chunk.indexOf("=");

      if (separatorIndex < 0) {
        return cookies;
      }

      const key = chunk.slice(0, separatorIndex).trim();
      const value = chunk.slice(separatorIndex + 1).trim();

      if (!key) {
        return cookies;
      }

      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});
};

export const getSessionTokenFromCookies = (req) => {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[SESSION_COOKIE_NAME] || null;
};
