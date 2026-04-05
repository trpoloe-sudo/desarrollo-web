import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(baseDir, "..", "data");
const dataFile = path.join(dataDir, "catalog.json");

let state = {
  managedProducts: [],
  hiddenProductIds: [],
};

const normalizeState = (parsed) => ({
  managedProducts: Array.isArray(parsed?.managedProducts) ? parsed.managedProducts : [],
  hiddenProductIds: Array.isArray(parsed?.hiddenProductIds) ? parsed.hiddenProductIds : [],
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

const toNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
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
    imagen_url: String(product?.imagen_url || "https://via.placeholder.com/300x300?text=Producto").trim(),
    especificaciones: String(product?.especificaciones || "").trim(),
  };
};

const normalizeProducts = (products) =>
  (Array.isArray(products) ? products : [])
    .map((product, index) => normalizeProduct(product, index))
    .filter((product) => product.nombre);

const normalizeHiddenProductIds = (productIds) =>
  [...new Set((Array.isArray(productIds) ? productIds : []).map((productId) => {
    const parsedId = Number(productId);
    return Number.isFinite(parsedId) ? parsedId : String(productId ?? "").trim();
  }).filter(Boolean))];

export const listManagedProducts = async () => {
  await ready;
  return normalizeProducts(state.managedProducts);
};

export const listManagedCatalogState = async () => {
  await ready;
  return {
    managedProducts: normalizeProducts(state.managedProducts),
    hiddenProductIds: normalizeHiddenProductIds(state.hiddenProductIds),
  };
};

export const replaceManagedProducts = async (products) => {
  await ready;
  state.managedProducts = normalizeProducts(products);
  state.hiddenProductIds = [];
  await persist();
  return state.managedProducts;
};

export const replaceManagedCatalogState = async ({
  managedProducts = [],
  hiddenProductIds = [],
}) => {
  await ready;
  state.managedProducts = normalizeProducts(managedProducts);
  state.hiddenProductIds = normalizeHiddenProductIds(hiddenProductIds);
  await persist();

  return {
    managedProducts: state.managedProducts,
    hiddenProductIds: state.hiddenProductIds,
  };
};

export const clearManagedProducts = async () => {
  await ready;
  state.managedProducts = [];
  state.hiddenProductIds = [];
  await persist();
  return [];
};
