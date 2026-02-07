import axios from 'axios'

// Reemplaza estos valores con los tuyos
const SHEET_ID = '1HI0uajmoDquzkUovmVM-M9k1YE1H6QhBNuxdUduIeRA'
const API_KEY = 'AIzaSyCBiFrpTNh4WYx97nxczwhMq4ULVLK0UCM'

// Configuración de hojas de Google Sheets
const PRODUCTS_RANGE = 'Productos!A1:G100'
const SETTINGS_RANGE = 'Configuracion!A1:B100'

export const googleSheetsAPI = {
  async getProducts() {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PRODUCTS_RANGE}?key=${API_KEY}`
      const response = await axios.get(url)

      if (!response.data.values || response.data.values.length < 2) {
        return getDefaultProducts()
      }

      const [headers, ...rows] = response.data.values
      void headers

      const products = rows.map((row, index) => ({
        id: index + 1,
        categoria: row[0] || '',
        nombre: row[1] || '',
        descripcion: row[2] || '',
        precio: parseFloat(row[3]) || 0,
        stock: parseInt(row[4]) || 0,
        imagen_url: row[5] || 'https://via.placeholder.com/300x300',
        especificaciones: row[6] || ''
      })).filter(product => product.nombre)

      return products.length ? products : getDefaultProducts()
    } catch (error) {
      console.error('Error fetching products:', error)
      return getDefaultProducts()
    }
  },

  async getSettings() {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SETTINGS_RANGE}?key=${API_KEY}`
      const response = await axios.get(url)

      if (!response.data.values) return {}

      const settings = {}
      response.data.values.forEach(row => {
        settings[row[0]] = row[1]
      })
      return settings
    } catch (error) {
      console.error('Error fetching settings:', error)
      return getDefaultSettings()
    }
  }
}

// Datos por defecto para desarrollo/demo
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
      especificaciones: '13ª generación, 16 núcleos, 24 threads'
    },
    {
      id: 2,
      categoria: 'Procesadores',
      nombre: 'AMD Ryzen 7 7700X',
      descripcion: 'Procesador RYZEN de alto rendimiento',
      precio: 380,
      stock: 10,
      imagen_url: 'https://via.placeholder.com/300x300?text=AMD+Ryzen',
      especificaciones: '7ª generación, 8 núcleos, 16 threads'
    },
    {
      id: 3,
      categoria: 'Tarjetas Gráficas',
      nombre: 'NVIDIA RTX 4080',
      descripcion: 'Tarjeta gráfica de última generación',
      precio: 1200,
      stock: 8,
      imagen_url: 'https://via.placeholder.com/300x300?text=RTX+4080',
      especificaciones: '16GB GDDR6X, CUDA cores: 9728'
    },
    {
      id: 4,
      categoria: 'Tarjetas Gráficas',
      nombre: 'AMD Radeon RX 7900 XTX',
      descripcion: 'GPU AMD de alto desempeño',
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
      descripcion: 'SSD NVMe de última generación',
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
    logo: 'https://via.placeholder.com/200x80?text=Logo'
  }
}
