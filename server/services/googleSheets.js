const PRODUCTS_RANGE = "Productos!A:G";
const SETTINGS_RANGE = "Configuracion!A1:B100";

const defaultProducts = [
  {
    id: 1,
    categoria: "Procesadores",
    nombre: "Intel Core i7-13700K",
    descripcion: "Procesador de alta performance para gaming y productividad",
    precio: 450,
    stock: 15,
    imagen_url: "https://via.placeholder.com/300x300?text=Intel+i7",
    especificaciones: "13A generacion, 16 nucleos, 24 threads",
  },
  {
    id: 2,
    categoria: "Procesadores",
    nombre: "AMD Ryzen 7 7700X",
    descripcion: "Procesador RYZEN de alto rendimiento",
    precio: 380,
    stock: 10,
    imagen_url: "https://via.placeholder.com/300x300?text=AMD+Ryzen",
    especificaciones: "7A generacion, 8 nucleos, 16 threads",
  },
  {
    id: 3,
    categoria: "Tarjetas Graficas",
    nombre: "NVIDIA RTX 4080",
    descripcion: "Tarjeta grafica de ultima generacion",
    precio: 1200,
    stock: 8,
    imagen_url: "https://via.placeholder.com/300x300?text=RTX+4080",
    especificaciones: "16GB GDDR6X, CUDA cores: 9728",
  },
  {
    id: 4,
    categoria: "Tarjetas Graficas",
    nombre: "AMD Radeon RX 7900 XTX",
    descripcion: "GPU AMD de alto desempeno",
    precio: 899,
    stock: 12,
    imagen_url: "https://via.placeholder.com/300x300?text=AMD+GPU",
    especificaciones: "24GB GDDR6, 6144 Stream Processors",
  },
  {
    id: 5,
    categoria: "Memoria RAM",
    nombre: "Corsair Vengeance RGB 32GB",
    descripcion: "Memoria RAM DDR5 de alta velocidad",
    precio: 180,
    stock: 25,
    imagen_url: "https://via.placeholder.com/300x300?text=Corsair+RAM",
    especificaciones: "DDR5, 6000MHz, CAS 30",
  },
  {
    id: 6,
    categoria: "Almacenamiento",
    nombre: "Samsung 990 Pro NVMe 2TB",
    descripcion: "SSD NVMe de ultima generacion",
    precio: 220,
    stock: 30,
    imagen_url: "https://via.placeholder.com/300x300?text=Samsung+SSD",
    especificaciones: "PCIe 4.0, Lectura: 7450MB/s",
  },
];

const getSheetsConfig = () => ({
  sheetId: process.env.GOOGLE_SHEETS_ID || process.env.VITE_SHEET_ID || "",
  apiKey:
    process.env.GOOGLE_SHEETS_API_KEY ||
    process.env.VITE_GOOGLE_SHEETS_API_KEY ||
    process.env.VITE_API_KEY ||
    "",
});

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getValue = (row, index) => row[index] ?? "";

const fetchSheetValues = async (range) => {
  const { sheetId, apiKey } = getSheetsConfig();

  if (!sheetId || !apiKey) {
    throw createHttpError(
      503,
      "Google Sheets is not configured on the server"
    );
  }

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`
  );
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    let detail = "";

    try {
      const errorPayload = await response.json();
      detail = errorPayload?.error?.message ?? "";
    } catch {
      detail = "";
    }

    throw createHttpError(
      response.status,
      detail || `Google Sheets request failed with status ${response.status}`
    );
  }

  const payload = await response.json();
  return Array.isArray(payload.values) ? payload.values : [];
};

export const listCatalogProducts = async () => {
  try {
    const values = await fetchSheetValues(PRODUCTS_RANGE);

    if (values.length < 2) {
      return [];
    }

    const [, ...rows] = values;

    return rows
      .map((row, index) => ({
        id: index + 1,
        categoria: getValue(row, 0),
        nombre: getValue(row, 1),
        descripcion: getValue(row, 2),
        precio: Number.parseFloat(getValue(row, 3)) || 0,
        stock: Number.parseInt(getValue(row, 4), 10) || 0,
        imagen_url: getValue(row, 5) || "https://via.placeholder.com/300x300",
        especificaciones: getValue(row, 6),
      }))
      .filter((product) => product.nombre);
  } catch (error) {
    // If Google Sheets is not configured or request fails, return empty array
    // This triggers the fallback to default products in buildCatalogPayload()
    console.warn("Failed to fetch from Google Sheets:", error.message);
    return [];
  }
};

export const getDefaultCatalogProducts = () =>
  defaultProducts.map((product) => ({ ...product }));

export const getCatalogSettings = async () => {
  try {
    const values = await fetchSheetValues(SETTINGS_RANGE);

    return values.reduce((settings, row) => {
      const key = getValue(row, 0);
      if (!key) return settings;

      settings[key] = getValue(row, 1);
      return settings;
    }, {});
  } catch (error) {
    // If Google Sheets is not configured, return empty settings
    console.warn("Failed to fetch catalog settings from Google Sheets:", error.message);
    return {};
  }
};
