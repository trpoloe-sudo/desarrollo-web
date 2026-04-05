const normalizeProductId = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : String(value ?? "").trim();
};

const comparableProduct = (product) => ({
  id: normalizeProductId(product?.id),
  categoria: String(product?.categoria || "").trim(),
  nombre: String(product?.nombre || "").trim(),
  descripcion: String(product?.descripcion || "").trim(),
  precio: Number(product?.precio || 0),
  stock: Number(product?.stock || 0),
  imagen_url: String(product?.imagen_url || "").trim(),
  especificaciones: String(product?.especificaciones || "").trim(),
});

export const mergeCatalogProducts = (
  remoteProducts = [],
  managedProducts = [],
  hiddenProductIds = []
) => {
  const hiddenIds = new Set(
    (Array.isArray(hiddenProductIds) ? hiddenProductIds : []).map(normalizeProductId)
  );
  const mergedProducts = new Map();

  for (const product of Array.isArray(remoteProducts) ? remoteProducts : []) {
    const normalizedId = normalizeProductId(product?.id);

    if (!hiddenIds.has(normalizedId)) {
      mergedProducts.set(normalizedId, product);
    }
  }

  for (const product of Array.isArray(managedProducts) ? managedProducts : []) {
    mergedProducts.set(normalizeProductId(product?.id), product);
  }

  return Array.from(mergedProducts.values());
};

export const createManagedCatalogState = (
  submittedProducts = [],
  remoteProducts = []
) => {
  const normalizedRemoteProducts = Array.isArray(remoteProducts) ? remoteProducts : [];
  const remoteProductsById = new Map(
    normalizedRemoteProducts.map((product) => [normalizeProductId(product?.id), product])
  );
  const submittedIds = new Set();
  const managedProducts = [];

  for (const product of Array.isArray(submittedProducts) ? submittedProducts : []) {
    const normalizedId = normalizeProductId(product?.id);
    const matchingRemoteProduct = remoteProductsById.get(normalizedId);
    submittedIds.add(normalizedId);

    if (!matchingRemoteProduct) {
      managedProducts.push(product);
      continue;
    }

    if (JSON.stringify(comparableProduct(matchingRemoteProduct)) !== JSON.stringify(comparableProduct(product))) {
      managedProducts.push(product);
    }
  }

  const hiddenProductIds = normalizedRemoteProducts
    .map((product) => normalizeProductId(product?.id))
    .filter((productId) => !submittedIds.has(productId));

  return {
    managedProducts,
    hiddenProductIds,
  };
};

export const hasManagedCatalogLayer = (managedProducts = [], hiddenProductIds = []) => {
  return (Array.isArray(managedProducts) && managedProducts.length > 0)
    || (Array.isArray(hiddenProductIds) && hiddenProductIds.length > 0);
};
