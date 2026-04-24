import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { db, runTransaction } from "./database.js";
import { SESSION_TTL_MS } from "../utils/sessionCookie.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const parseJson = (value, fallbackValue) => {
  try {
    return value ? JSON.parse(value) : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

const mapOrderRow = (row) => ({
  id: row.id,
  items: parseJson(row.items_json, []),
  subtotal: Number(row.subtotal ?? 0),
  tax: Number(row.tax ?? 0),
  total: Number(row.total ?? 0),
  paymentMethod: row.payment_method,
  billingAddress: parseJson(row.billing_address_json, null),
  userEmail: row.user_email,
  status: row.status,
  createdAt: row.created_at,
});

const listOrdersByUserId = (userId) => {
  const rows = db.prepare(`
    SELECT * FROM orders
    WHERE user_id = ?
    ORDER BY datetime(created_at) DESC
  `).all(userId);

  return rows.map(mapOrderRow);
};

const sanitizeUserRow = (userRow) => {
  if (!userRow) {
    return null;
  }

  return {
    id: userRow.id,
    email: userRow.email,
    name: userRow.name,
    picture: userRow.picture,
    role: userRow.role,
    createdAt: userRow.created_at,
    orders: listOrdersByUserId(userRow.id),
    provider: userRow.provider,
  };
};

const hashPassword = (password, salt = randomBytes(16).toString("hex")) => ({
  passwordHash: scryptSync(password, salt, 64).toString("hex"),
  passwordSalt: salt,
});

const verifyPassword = (userRow, password) => {
  if (!userRow?.password_hash || !userRow?.password_salt) {
    return false;
  }

  const derivedKey = scryptSync(password, userRow.password_salt, 64);
  const storedKey = Buffer.from(userRow.password_hash, "hex");

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
};

const pruneExpiredSessions = () => {
  db.prepare(`
    DELETE FROM sessions
    WHERE datetime(expires_at) <= datetime(?)
  `).run(new Date().toISOString());
};

const getUserCount = () => {
  const row = db.prepare("SELECT COUNT(*) AS total FROM users").get();
  return Number(row?.total ?? 0);
};

const getUserRowByEmail = (email) => {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(normalizeEmail(email)) ?? null;
};

const getUserRowById = (userId) => {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(userId) ?? null;
};

const getSessionRowByToken = (token) => {
  return db.prepare("SELECT * FROM sessions WHERE token = ?").get(token) ?? null;
};

const createSession = (userId) => {
  const now = new Date();
  const session = {
    userId,
    token: randomBytes(24).toString("hex"),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };

  runTransaction(() => {
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
    db.prepare(`
      INSERT INTO sessions (token, user_id, created_at, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(session.token, session.userId, session.createdAt, session.expiresAt);
  });

  return session;
};

const buildAuthPayload = (userRow, session) => ({
  user: sanitizeUserRow(userRow),
  session,
});

export const registerUser = async ({ email, password, name, picture = null, provider = "email" }) => {
  pruneExpiredSessions();

  const normalizedEmail = normalizeEmail(email);

  if (getUserRowByEmail(normalizedEmail)) {
    throw new Error("Ya existe una cuenta con ese email");
  }

  const now = new Date().toISOString();
  const userId = randomUUID();
  const nextRole = getUserCount() === 0 ? "admin" : "customer";
  const nextUser = {
    id: userId,
    email: normalizedEmail,
    name: String(name || "").trim() || normalizedEmail.split("@")[0],
    picture,
    role: nextRole,
    createdAt: now,
    provider,
  };

  const passwordData = provider === "email" ? hashPassword(password) : {
    passwordHash: null,
    passwordSalt: null,
  };

  db.prepare(`
    INSERT INTO users (
      id, email, name, picture, role, created_at, provider, password_hash, password_salt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    nextUser.id,
    nextUser.email,
    nextUser.name,
    nextUser.picture,
    nextUser.role,
    nextUser.createdAt,
    nextUser.provider,
    passwordData.passwordHash,
    passwordData.passwordSalt
  );

  const userRow = getUserRowById(userId);
  const session = createSession(userId);
  return buildAuthPayload(userRow, session);
};

export const authenticateUser = async ({ email, password }) => {
  pruneExpiredSessions();

  const userRow = getUserRowByEmail(email);

  if (!userRow) {
    throw new Error("No existe una cuenta con ese email");
  }

  if (!userRow.password_hash || !userRow.password_salt) {
    throw new Error("Esta cuenta usa Google Sign-In");
  }

  if (!verifyPassword(userRow, password)) {
    throw new Error("Credenciales invalidas");
  }

  const session = createSession(userRow.id);
  return buildAuthPayload(userRow, session);
};

export const authenticateWithGoogle = async ({ email, name, picture = null }) => {
  pruneExpiredSessions();

  const normalizedEmail = normalizeEmail(email);
  const existingUser = getUserRowByEmail(normalizedEmail);

  if (existingUser) {
    db.prepare(`
      UPDATE users
      SET name = ?, picture = ?, provider = ?
      WHERE id = ?
    `).run(
      String(name || "").trim() || existingUser.name,
      picture ?? existingUser.picture ?? null,
      existingUser.password_hash ? "email" : "google",
      existingUser.id
    );

    const refreshedUser = getUserRowById(existingUser.id);
    const session = createSession(existingUser.id);
    return buildAuthPayload(refreshedUser, session);
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
  pruneExpiredSessions();

  const session = getSessionRowByToken(token);

  if (!session) {
    return null;
  }

  const userRow = getUserRowById(session.user_id);

  if (!userRow) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }

  return {
    session: {
      userId: session.user_id,
      token: session.token,
      createdAt: session.created_at,
      expiresAt: session.expires_at,
    },
    user: sanitizeUserRow(userRow),
  };
};

export const getSessionUser = async (token) => {
  const record = await getSessionRecord(token);
  return record?.user ?? null;
};

export const deleteSession = async (token) => {
  const result = db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  return result.changes > 0;
};

export const listUsers = async () => {
  pruneExpiredSessions();
  const rows = db.prepare("SELECT * FROM users ORDER BY datetime(created_at) DESC").all();
  return rows.map(sanitizeUserRow);
};

export const updateUserRole = async (email, role) => {
  const userRow = getUserRowByEmail(email);

  if (!userRow) {
    return null;
  }

  if (userRow.role === "admin" && role !== "admin") {
    const row = db.prepare(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE role = 'admin'
    `).get();

    if (Number(row?.total ?? 0) === 1) {
      throw new Error("Debe existir al menos un administrador");
    }
  }

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userRow.id);
  return sanitizeUserRow(getUserRowById(userRow.id));
};

export const addOrderToUser = async (userId, orderData) => {
  const userRow = getUserRowById(userId);

  if (!userRow) {
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
    userEmail: userRow.email,
    status: orderData.status ?? "pending",
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO orders (
      id, user_id, items_json, subtotal, tax, total, payment_method,
      billing_address_json, user_email, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    order.id,
    userRow.id,
    JSON.stringify(order.items),
    order.subtotal,
    order.tax,
    order.total,
    order.paymentMethod,
    order.billingAddress ? JSON.stringify(order.billingAddress) : null,
    order.userEmail,
    order.status,
    order.createdAt
  );

  return {
    order,
    user: sanitizeUserRow(getUserRowById(userRow.id)),
  };
};

export const updateOrderStatus = async (orderId, status) => {
  const orderRow = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);

  if (!orderRow) {
    return null;
  }

  const previousOrder = mapOrderRow(orderRow);
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, orderId);

  const updatedOrderRow = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);

  return {
    previousStatus: previousOrder.status,
    order: mapOrderRow(updatedOrderRow),
    user: sanitizeUserRow(getUserRowById(updatedOrderRow.user_id)),
  };
};
