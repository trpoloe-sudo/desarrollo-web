import axios from 'axios'
import bundledCatalogData from '../../server/data/catalog.json'

const apiBaseURL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || '/api')

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 4000,
  withCredentials: true
})

const toNumber = (value, fallback = 0) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

function normalizeProduct(product, index = 0) {
  const fallbackId = Date.now() + index
  const rawId = product?.id ?? fallbackId
  const parsedId = Number(rawId)

  return {
    id: Number.isFinite(parsedId) ? parsedId : String(rawId),
    categoria: String(product?.categoria || 'General').trim(),
    nombre: String(product?.nombre || 'Producto sin nombre').trim(),
    descripcion: String(product?.descripcion || '').trim(),
    precio: toNumber(product?.precio, 0),
    stock: Math.max(0, Math.trunc(toNumber(product?.stock, 0))),
    imagen_url: String(product?.imagen_url || 'https://via.placeholder.com/300x300?text=Producto').trim(),
    especificaciones: String(product?.especificaciones || '').trim()
  }
}

function normalizeProducts(products) {
  return (Array.isArray(products) ? products : []).map((product, index) => normalizeProduct(product, index))
}

const bundledCatalogProducts = normalizeProducts(
  Array.isArray(bundledCatalogData?.managedProducts)
    ? bundledCatalogData.managedProducts
    : Array.isArray(bundledCatalogData?.items)
      ? bundledCatalogData.items
      : Array.isArray(bundledCatalogData)
        ? bundledCatalogData
        : []
)

function normalizeCatalogResponse(data) {
  if (Array.isArray(data)) {
    return {
      items: normalizeProducts(data),
      source: 'legacy',
      warning: null
    }
  }

  return {
    items: normalizeProducts(data?.items),
    source: String(data?.source || 'unknown'),
    warning: data?.warning ? String(data.warning) : null
  }
}

function getFallbackCatalogResponse(errorMessage = null) {
  return {
    items: bundledCatalogProducts.length ? bundledCatalogProducts : getDefaultProducts(),
    source: 'fallback',
    warning: errorMessage || 'No se pudo cargar el catalogo remoto. Se muestran productos incluidos en el sitio.'
  }
}

export const googleSheetsAPI = {
  async getCatalogSnapshot(options = {}) {
    const requestConfig = options?.preferRemote
      ? { params: { preferRemote: true } }
      : undefined

    try {
      const { data } = requestConfig
        ? await api.get('/catalog/products', requestConfig)
        : await api.get('/catalog/products')
      const snapshot = normalizeCatalogResponse(data)

      return snapshot.items.length ? snapshot : getFallbackCatalogResponse('El catalogo remoto no devolvio productos.')
    } catch (error) {
      console.error('Error fetching products:', error)
      return getFallbackCatalogResponse(error?.message)
    }
  },

  async getProducts(options = {}) {
    const snapshot = await this.getCatalogSnapshot(options)
    return snapshot.items
  },

  async saveManagedProducts(products) {
    const { data } = await api.put('/catalog/products', {
      products: normalizeProducts(products)
    })

    return normalizeCatalogResponse(data)
  },

  async clearManagedProducts() {
    const { data } = await api.delete('/catalog/products')
    return normalizeCatalogResponse(data)
  },

  async getSettings() {
    try {
      const { data } = await api.get('/catalog/settings')
      return data && typeof data === 'object' ? data : {}
    } catch (error) {
      console.error('Error fetching settings:', error)
      return getDefaultSettings()
    }
  }
}

function getDefaultProducts() {
  return [
    {
      id: 1,
      categoria: 'Procesadores',
      nombre: 'Intel Core i7-13700K',
      descripcion: 'Procesador de alta performance para gaming y productividad',
      precio: 450,
      stock: 15,
      imagen_url: 'https://via.placeholder.com/300x300?text=Intel+i7',
      especificaciones: '13A generacion, 16 nucleos, 24 threads'
    },
    {
      id: 2,
      categoria: 'Procesadores',
      nombre: 'AMD Ryzen 7 7700X',
      descripcion: 'Procesador RYZEN de alto rendimiento',
      precio: 380,
      stock: 10,
      imagen_url: 'https://via.placeholder.com/300x300?text=AMD+Ryzen',
      especificaciones: '7A generacion, 8 nucleos, 16 threads'
    },
    {
      id: 3,
      categoria: 'Tarjetas Graficas',
      nombre: 'NVIDIA RTX 4080',
      descripcion: 'Tarjeta grafica de ultima generacion',
      precio: 1200,
      stock: 8,
      imagen_url: 'https://via.placeholder.com/300x300?text=RTX+4080',
      especificaciones: '16GB GDDR6X, CUDA cores: 9728'
    },
    {
      id: 4,
      categoria: 'Tarjetas Graficas',
      nombre: 'AMD Radeon RX 7900 XTX',
      descripcion: 'GPU AMD de alto desempeno',
      precio: 899,
      stock: 12,
      imagen_url: 'https://via.placeholder.com/300x300?text=AMD+GPU',
      especificaciones: '24GB GDDR6, 6144 Stream Processors'
    },
    {
      id: 5,
      categoria: 'Memoria RAM',
      nombre: 'Corsair Vengeance RGB 32GB',
      descripcion: 'Memoria RAM DDR5 de alta velocidad',
      precio: 180,
      stock: 25,
      imagen_url: 'https://via.placeholder.com/300x300?text=Corsair+RAM',
      especificaciones: 'DDR5, 6000MHz, CAS 30'
    },
    {
      id: 6,
      categoria: 'Almacenamiento',
      nombre: 'Samsung 990 Pro NVMe 2TB',
      descripcion: 'SSD NVMe de ultima generacion',
      precio: 220,
      stock: 30,
      imagen_url: 'https://via.placeholder.com/300x300?text=Samsung+SSD',
      especificaciones: 'PCIe 4.0, Lectura: 7450MB/s'
    }
  ]
}

function getDefaultSettings() {
  return {
    empresa: 'Tech Distributor',
    descripcion: 'Distribuidor de computadoras y partes de calidad',
    email: 'contacto@techdistributor.com',
    telefono: '+34 900 123 456',
    logo: '/brand-logo-transparent.png'
  }
}
