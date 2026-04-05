import { Router } from "express";
import {
  getDefaultCatalogProducts,
  getCatalogSettings,
  listCatalogProducts,
} from "../services/googleSheets.js";
import {
  clearManagedProducts,
  listManagedCatalogState,
  replaceManagedCatalogState,
  replaceManagedProducts,
} from "../storage/catalogStore.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  createManagedCatalogState,
  hasManagedCatalogLayer,
  mergeCatalogProducts,
} from "./catalog.helpers.js";

const router = Router();

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const buildCatalogPayload = async () => {
  const { managedProducts, hiddenProductIds } = await listManagedCatalogState();
  const hasManagedLayer = hasManagedCatalogLayer(managedProducts, hiddenProductIds);

  try {
    const remoteProducts = await listCatalogProducts();

    if (remoteProducts.length > 0) {
      if (hasManagedLayer) {
        return {
          items: mergeCatalogProducts(remoteProducts, managedProducts, hiddenProductIds),
          source: "managed_remote",
          warning: null,
        };
      }

      return {
        items: remoteProducts,
        source: "google_sheets",
        warning: null,
      };
    }

    if (hasManagedLayer) {
      return {
        items: mergeCatalogProducts([], managedProducts, hiddenProductIds),
        source: "managed",
        warning: "Google Sheets no devolvio productos. Se muestran los productos del panel.",
      };
    }

    return {
      items: getDefaultCatalogProducts(),
      source: "fallback",
      warning: "Google Sheets no devolvio productos. Se muestran productos de respaldo.",
    };
  } catch (error) {
    if (hasManagedLayer) {
      return {
        items: mergeCatalogProducts([], managedProducts, hiddenProductIds),
        source: "managed",
        warning:
          error.message || "No se pudo cargar Google Sheets. Se muestran los productos del panel.",
      };
    }

    return {
      items: getDefaultCatalogProducts(),
      source: "fallback",
      warning:
        error.message || "No se pudo cargar Google Sheets. Se muestran productos de respaldo.",
    };
  }
};

router.get("/products", async (req, res) => {
  return res.json(await buildCatalogPayload());
});

router.put("/products", requireAuth, requireAdmin, async (req, res) => {
  const products = req.body?.products;

  if (!Array.isArray(products) || products.some((product) => !isPlainObject(product))) {
    return res.status(400).json({
      error: "products must be an array of product objects",
    });
  }

  const invalidProduct = products.find((product) => {
    return !String(product.nombre || "").trim() || !Number.isFinite(Number(product.precio));
  });

  if (invalidProduct) {
    return res.status(400).json({
      error: "each product must include a nombre and numeric precio",
    });
  }

  if (products.length === 0) {
    await clearManagedProducts();
    return res.json(await buildCatalogPayload());
  }

  try {
    const remoteProducts = await listCatalogProducts();
    const nextManagedState = createManagedCatalogState(products, remoteProducts);
    await replaceManagedCatalogState(nextManagedState);
    return res.json(await buildCatalogPayload());
  } catch (error) {
    const savedProducts = await replaceManagedProducts(products);

    return res.json({
      items: savedProducts,
      source: "managed",
      warning:
        error.message || "No se pudo sincronizar Google Sheets. Se guardo una copia administrada del catalogo.",
    });
  }
});

router.delete("/products", requireAuth, requireAdmin, async (req, res) => {
  await clearManagedProducts();
  return res.json(await buildCatalogPayload());
});

router.get("/settings", async (req, res) => {
  try {
    const settings = await getCatalogSettings();
    return res.json(settings);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || "Failed to load settings",
    });
  }
});

export default router;
