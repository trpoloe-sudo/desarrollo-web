import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(baseDir, "..", "data");
const databasePath = path.join(dataDir, "app.sqlite");
const DEFAULT_PRODUCT_IMAGE = "/brand-logo-transparent.png";

fs.mkdirSync(dataDir, { recursive: true });

const readJsonFile = (filePath, fallbackValue) => {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
};

const database = new DatabaseSync(databasePath);

database.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    picture TEXT,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL,
    provider TEXT NOT NULL,
    password_hash TEXT,
    password_salt TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_user_id
  ON sessions(user_id);

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items_json TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    billing_address_json TEXT,
    user_email TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_orders_user_id
  ON orders(user_id);

  CREATE TABLE IF NOT EXISTS catalog_products (
    id TEXT PRIMARY KEY,
    position INTEGER NOT NULL,
    categoria TEXT NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL,
    imagen_url TEXT NOT NULL,
    especificaciones TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS catalog_hidden_product_ids (
    product_id TEXT PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const tableHasRows = (tableName) => {
  const row = database.prepare(`SELECT 1 AS found FROM ${tableName} LIMIT 1`).get();
  return Boolean(row?.found);
};

const runTransaction = (callback) => {
  database.exec("BEGIN");

  try {
    const result = callback();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
};

const migrateAuthJson = () => {
  if (tableHasRows("users") || tableHasRows("sessions") || tableHasRows("orders")) {
    return;
  }

  const authPath = path.join(dataDir, "auth.json");
  const parsed = readJsonFile(authPath, { users: [], sessions: [] });
  const users = Array.isArray(parsed?.users) ? parsed.users : [];
  const sessions = Array.isArray(parsed?.sessions) ? parsed.sessions : [];

  if (users.length === 0 && sessions.length === 0) {
    return;
  }

  const insertUser = database.prepare(`
    INSERT INTO users (
      id, email, name, picture, role, created_at, provider, password_hash, password_salt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertSession = database.prepare(`
    INSERT INTO sessions (token, user_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `);
  const insertOrder = database.prepare(`
    INSERT INTO orders (
      id, user_id, items_json, subtotal, tax, total, payment_method,
      billing_address_json, user_email, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  runTransaction(() => {
    for (const user of users) {
      insertUser.run(
        String(user.id || ""),
        String(user.email || "").trim().toLowerCase(),
        String(user.name || "").trim() || String(user.email || "").split("@")[0],
        user.picture ? String(user.picture) : null,
        String(user.role || "customer"),
        String(user.createdAt || new Date().toISOString()),
        String(user.provider || "email"),
        user.passwordHash ? String(user.passwordHash) : null,
        user.passwordSalt ? String(user.passwordSalt) : null
      );

      for (const order of Array.isArray(user.orders) ? user.orders : []) {
        insertOrder.run(
          String(order.id || ""),
          String(user.id || ""),
          JSON.stringify(Array.isArray(order.items) ? order.items : []),
          Number(order.subtotal ?? 0),
          Number(order.tax ?? 0),
          Number(order.total ?? 0),
          String(order.paymentMethod || "No definido"),
          order.billingAddress ? JSON.stringify(order.billingAddress) : null,
          String(order.userEmail || user.email || ""),
          String(order.status || "pending"),
          String(order.createdAt || new Date().toISOString())
        );
      }
    }

    for (const session of sessions) {
      insertSession.run(
        String(session.token || ""),
        String(session.userId || ""),
        String(session.createdAt || new Date().toISOString()),
        String(session.expiresAt || new Date().toISOString())
      );
    }
  });
};

const migrateCatalogJson = () => {
  if (tableHasRows("catalog_products") || tableHasRows("catalog_hidden_product_ids")) {
    return;
  }

  const catalogPath = path.join(dataDir, "catalog.json");
  const parsed = readJsonFile(catalogPath, { managedProducts: [], hiddenProductIds: [] });
  const managedProducts = Array.isArray(parsed?.managedProducts) ? parsed.managedProducts : [];
  const hiddenProductIds = Array.isArray(parsed?.hiddenProductIds) ? parsed.hiddenProductIds : [];

  if (managedProducts.length === 0 && hiddenProductIds.length === 0) {
    return;
  }

  const insertProduct = database.prepare(`
    INSERT INTO catalog_products (
      id, position, categoria, nombre, descripcion, precio, stock, imagen_url, especificaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertHiddenId = database.prepare(`
    INSERT INTO catalog_hidden_product_ids (product_id)
    VALUES (?)
  `);

  runTransaction(() => {
    managedProducts.forEach((product, index) => {
      insertProduct.run(
        String(product?.id ?? `${Date.now()}-${index}`),
        index,
        String(product?.categoria || "General").trim(),
        String(product?.nombre || "Producto sin nombre").trim(),
        String(product?.descripcion || "").trim(),
        Number(product?.precio ?? 0),
        Math.max(0, Math.trunc(Number(product?.stock ?? 0) || 0)),
        String(product?.imagen_url || DEFAULT_PRODUCT_IMAGE).trim(),
        String(product?.especificaciones || "").trim()
      );
    });

    hiddenProductIds.forEach((productId) => {
      insertHiddenId.run(String(productId ?? "").trim());
    });
  });
};

const migrateLeadsJson = () => {
  if (tableHasRows("leads")) {
    return;
  }

  const leadsPath = path.join(dataDir, "leads.json");
  const parsed = readJsonFile(leadsPath, []);
  const leads = Array.isArray(parsed) ? parsed : [];

  if (leads.length === 0) {
    return;
  }

  const insertLead = database.prepare(`
    INSERT INTO leads (
      id, name, phone, company, subject, message, source, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  runTransaction(() => {
    for (const lead of leads) {
      insertLead.run(
        String(lead.id || ""),
        String(lead.name || "").trim(),
        String(lead.phone || "").trim(),
        String(lead.company || "").trim(),
        String(lead.subject || "").trim(),
        String(lead.message || "").trim(),
        String(lead.source || "web").trim(),
        String(lead.status || "new").trim(),
        String(lead.createdAt || new Date().toISOString()),
        String(lead.updatedAt || lead.createdAt || new Date().toISOString())
      );
    }
  });
};

migrateAuthJson();
migrateCatalogJson();
migrateLeadsJson();

export const db = database;
export { runTransaction };
