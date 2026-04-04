import { promises as fs } from "fs";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { SESSION_TTL_MS } from "../utils/sessionCookie.js";

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(baseDir, "..", "data");
const dataFile = path.join(dataDir, "auth.json");

let state = {
  users: [],
  sessions: [],
};

const normalizeState = (parsed) => ({
  users: Array.isArray(parsed?.users) ? parsed.users : [],
  sessions: Array.isArray(parsed?.sessions) ? parsed.sessions : [],
});

const ensureDataFile = async () => {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    const raw = await fs.readFile(dataFile, "utf8");
    state = normalizeState(JSON.parse(raw));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    await fs.writeFile(dataFile, JSON.stringify(state, null, 2), "utf8");
  }
};

const ready = ensureDataFile();

const persist = async () => {
  await fs.writeFile(dataFile, JSON.stringify(state, null, 2), "utf8");
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { passwordHash, passwordSalt, ...publicUser } = user;
  return {
    ...publicUser,
    orders: Array.isArray(publicUser.orders) ? publicUser.orders : [],
  };
};

const hashPassword = (password, salt = randomBytes(16).toString("hex")) => ({
  passwordHash: scryptSync(password, salt, 64).toString("hex"),
  passwordSalt: salt,
});

const verifyPassword = (user, password) => {
  if (!user?.passwordHash || !user?.passwordSalt) {
    return false;
  }

  const derivedKey = scryptSync(password, user.passwordSalt, 64);
  const storedKey = Buffer.from(user.passwordHash, "hex");

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
};

const isSessionExpired = (session) => {
  if (!session?.expiresAt) {
    return true;
  }

  const expiresAt = new Date(session.expiresAt).getTime();
  return !Number.isFinite(expiresAt) || expiresAt <= Date.now();
};

const pruneExpiredSessions = () => {
  const nextSessions = state.sessions.filter((session) => {
    return session?.token && session?.userId && !isSessionExpired(session);
  });

  if (nextSessions.length === state.sessions.length) {
    return false;
  }

  state.sessions = nextSessions;
  return true;
};

const ensureStateReady = async () => {
  await ready;

  if (pruneExpiredSessions()) {
    await persist();
  }
};

const getUserByEmail = (email) =>
  state.users.find((user) => user.email === normalizeEmail(email)) ?? null;

const getUserById = (userId) =>
  state.users.find((user) => user.id === userId) ?? null;

const findSessionByToken = (token) =>
  state.sessions.find((session) => session.token === token) ?? null;

const createSession = (userId) => {
  const now = new Date();
  const session = {
    userId,
    token: randomBytes(24).toString("hex"),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };

  const existingIndex = state.sessions.findIndex((item) => item.userId === userId);

  if (existingIndex >= 0) {
    state.sessions[existingIndex] = session;
  } else {
    state.sessions.push(session);
  }

  return session;
};

const buildAuthPayload = (user, session) => ({
  user: sanitizeUser(user),
  session,
});

export const registerUser = async ({ email, password, name, picture = null, provider = "email" }) => {
  await ensureStateReady();

  const normalizedEmail = normalizeEmail(email);

  if (getUserByEmail(normalizedEmail)) {
    throw new Error("Ya existe una cuenta con ese email");
  }

  const now = new Date().toISOString();
  const nextUser = {
    id: randomUUID(),
    email: normalizedEmail,
    name: String(name || "").trim() || normalizedEmail.split("@")[0],
    picture,
    role: state.users.length === 0 ? "admin" : "customer",
    createdAt: now,
    orders: [],
    provider,
  };

  if (provider === "email") {
    Object.assign(nextUser, hashPassword(password));
  }

  state.users.push(nextUser);

  const session = createSession(nextUser.id);
  await persist();

  return buildAuthPayload(nextUser, session);
};

export const authenticateUser = async ({ email, password }) => {
  await ensureStateReady();

  const user = getUserByEmail(email);

  if (!user) {
    throw new Error("No existe una cuenta con ese email");
  }

  if (!user.passwordHash || !user.passwordSalt) {
    throw new Error("Esta cuenta usa Google Sign-In");
  }

  if (!verifyPassword(user, password)) {
    throw new Error("Credenciales invalidas");
  }

  const session = createSession(user.id);
  await persist();

  return buildAuthPayload(user, session);
};

export const authenticateWithGoogle = async ({ email, name, picture = null }) => {
  await ensureStateReady();

  const normalizedEmail = normalizeEmail(email);
  const existingUser = getUserByEmail(normalizedEmail);

  if (existingUser) {
    existingUser.name = String(name || "").trim() || existingUser.name;
    existingUser.picture = picture ?? existingUser.picture ?? null;
    existingUser.provider = existingUser.passwordHash ? "email" : "google";

    const session = createSession(existingUser.id);
    await persist();

    return buildAuthPayload(existingUser, session);
  }

  return registerUser({
    email: normalizedEmail,
    password: null,
    name,
    picture,
    provider: "google",
  });
};

export const getSessionRecord = async (token) => {
  await ensureStateReady();

  const session = findSessionByToken(token);

  if (!session) {
    return null;
  }

  if (isSessionExpired(session)) {
    state.sessions = state.sessions.filter((item) => item.token !== token);
    await persist();
    return null;
  }

  const user = getUserById(session.userId);

  if (!user) {
    state.sessions = state.sessions.filter((item) => item.token !== token);
    await persist();
    return null;
  }

  return {
    session,
    user: sanitizeUser(user),
  };
};

export const getSessionUser = async (token) => {
  const record = await getSessionRecord(token);
  return record?.user ?? null;
};

export const deleteSession = async (token) => {
  await ensureStateReady();

  const nextSessions = state.sessions.filter((item) => item.token !== token);

  if (nextSessions.length === state.sessions.length) {
    return false;
  }

  state.sessions = nextSessions;
  await persist();
  return true;
};

export const listUsers = async () => {
  await ensureStateReady();
  return state.users.map((user) => sanitizeUser(user));
};

export const updateUserRole = async (email, role) => {
  await ensureStateReady();

  const user = getUserByEmail(email);

  if (!user) {
    return null;
  }

  if (user.role === "admin" && role !== "admin") {
    const adminCount = state.users.filter((item) => item.role === "admin").length;
    if (adminCount === 1) {
      throw new Error("Debe existir al menos un administrador");
    }
  }

  user.role = role;
  await persist();
  return sanitizeUser(user);
};

export const addOrderToUser = async (userId, orderData) => {
  await ensureStateReady();

  const user = getUserById(userId);

  if (!user) {
    return null;
  }

  const order = {
    id: randomUUID(),
    items: Array.isArray(orderData.items) ? orderData.items : [],
    subtotal: Number(orderData.subtotal ?? 0),
    tax: Number(orderData.tax ?? 0),
    total: Number(orderData.total ?? 0),
    paymentMethod: orderData.paymentMethod ?? "No definido",
    billingAddress: orderData.billingAddress ?? null,
    userEmail: user.email,
    status: orderData.status ?? "pending",
    createdAt: new Date().toISOString(),
  };

  user.orders = Array.isArray(user.orders) ? user.orders : [];
  user.orders.push(order);
  await persist();

  return {
    order,
    user: sanitizeUser(user),
  };
};

export const updateOrderStatus = async (orderId, status) => {
  await ensureStateReady();

  for (const user of state.users) {
    const order = (user.orders || []).find((item) => item.id === orderId);

    if (!order) {
      continue;
    }

    order.status = status;
    await persist();

    return {
      order: { ...order },
      user: sanitizeUser(user),
    };
  }

  return null;
};
