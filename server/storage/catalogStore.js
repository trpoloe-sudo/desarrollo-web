import { randomUUID } from "crypto";
import { db, runTransaction } from "./database.js";

const DEFAULT_PRODUCT_IMAGE = "/brand-logo-transparent.png";

const toNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const normalizeProductId = (value) => {
  const parsedId = Number(value);
  return Number.isFinite(parsedId) ? parsedId : String(value ?? "").trim();
};

const normalizeProduct = (product, index = 0) => {
  const rawId = product?.id ?? `${Date.now()}-${index}-${randomUUID()}`;
  const parsedId = Number(rawId);

  return {
    id: Number.isFinite(parsedId) ? parsedId : String(rawId),
    categoria: String(product?.categoria || "General").trim(),
    nombre: String(product?.nombre || "Producto sin nombre").trim(),
    descripcion: String(product?.descripcion || "").trim(),
    precio: toNumber(product?.precio, 0),
    stock: Math.max(0, Math.trunc(toNumber(product?.stock, 0))),
    imagen_url: String(product?.imagen_url || DEFAULT_PRODUCT_IMAGE).trim(),
    especificaciones: String(product?.especificaciones || "").trim(),
  };
};

const normalizeProducts = (products) =>
  (Array.isArray(products) ? products : [])
    .map((product, index) => normalizeProduct(product, index))
    .filter((product) => product.nombre);

const normalizeHiddenProductIds = (productIds) =>
  [...new Set((Array.isArray(productIds) ? productIds : []).map((productId) => {
    return normalizeProductId(productId);
  }).filter(Boolean))];

const listManagedProductsRows = () => {
  return db.prepare(`
    SELECT * FROM catalog_products
    ORDER BY position ASC, nombre ASC
  `).all();
};

export const listManagedProducts = async () => {
  return listManagedProductsRows().map((row) => normalizeProduct({
    id: row.id,
    categoria: row.categoria,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: row.precio,
    stock: row.stock,
    imagen_url: row.imagen_url,
    especificaciones: row.especificaciones,
  }));
};

export const listManagedCatalogState = async () => {
  const hiddenRows = db.prepare(`
    SELECT product_id
    FROM catalog_hidden_product_ids
    ORDER BY product_id ASC
  `).all();

  return {
    managedProducts: await listManagedProducts(),
    hiddenProductIds: normalizeHiddenProductIds(hiddenRows.map((row) => row.product_id)),
  };
};

export const replaceManagedProducts = async (products) => {
  const managedProducts = normalizeProducts(products);

  runTransaction(() => {
    db.exec("DELETE FROM catalog_products");
    db.exec("DELETE FROM catalog_hidden_product_ids");

    const insertProduct = db.prepare(`
      INSERT INTO catalog_products (
        id, position, categoria, nombre, descripcion, precio, stock, imagen_url, especificaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    managedProducts.forEach((product, index) => {
      insertProduct.run(
        String(product.id),
        index,
        product.categoria,
        product.nombre,
        product.descripcion,
        product.precio,
        product.stock,
        product.imagen_url,
        product.especificaciones
      );
    });
  });

  return managedProducts;
};

export const replaceManagedCatalogState = async ({
  managedProducts = [],
  hiddenProductIds = [],
}) => {
  const normalizedProducts = normalizeProducts(managedProducts);
  const normalizedHiddenIds = normalizeHiddenProductIds(hiddenProductIds);

  runTransaction(() => {
    db.exec("DELETE FROM catalog_products");
    db.exec("DELETE FROM catalog_hidden_product_ids");

    const insertProduct = db.prepare(`
      INSERT INTO catalog_products (
        id, position, categoria, nombre, descripcion, precio, stock, imagen_url, especificaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertHiddenId = db.prepare(`
      INSERT INTO catalog_hidden_product_ids (product_id)
      VALUES (?)
    `);

    normalizedProducts.forEach((product, index) => {
      insertProduct.run(
        String(product.id),
        index,
        product.categoria,
        product.nombre,
        product.descripcion,
        product.precio,
        product.stock,
        product.imagen_url,
        product.especificaciones
      );
    });

    normalizedHiddenIds.forEach((productId) => {
      insertHiddenId.run(String(productId));
    });
  });

  return {
    managedProducts: normalizedProducts,
    hiddenProductIds: normalizedHiddenIds,
  };
};

export const clearManagedProducts = async () => {
  runTransaction(() => {
    db.exec("DELETE FROM catalog_products");
    db.exec("DELETE FROM catalog_hidden_product_ids");
  });

  return [];
};
