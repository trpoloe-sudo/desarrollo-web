import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { apiGetMock, apiPutMock, apiDeleteMock } = vi.hoisted(() => ({
  apiGetMock: vi.fn(),
  apiPutMock: vi.fn(),
  apiDeleteMock: vi.fn()
}))

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: apiGetMock,
      put: apiPutMock,
      delete: apiDeleteMock,
      interceptors: {
        request: {
          use: vi.fn()
        }
      }
    }))
  }
}))

import { googleSheetsAPI } from './googleSheetsAPI'

describe('googleSheetsAPI', () => {
  let consoleErrorSpy

  beforeEach(() => {
    localStorage.clear()
    apiGetMock.mockReset()
    apiPutMock.mockReset()
    apiDeleteMock.mockReset()
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('returns products and metadata from the catalog endpoint', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        items: [
          {
            id: '202',
            nombre: 'Producto API',
            categoria: 'Procesadores',
            descripcion: 'Desde API',
            precio: '250',
            stock: '8',
            especificaciones: 'Specs',
            imagen_url: 'https://example.com/producto.png'
          }
        ],
        source: 'google_sheets',
        warning: null
      }
    })

    const snapshot = await googleSheetsAPI.getCatalogSnapshot()

    expect(apiGetMock).toHaveBeenCalledWith('/catalog/products')
    expect(snapshot.source).toBe('google_sheets')
    expect(snapshot.warning).toBeNull()
    expect(snapshot.items).toHaveLength(1)
    expect(snapshot.items[0].id).toBe(202)
    expect(snapshot.items[0].precio).toBe(250)
    expect(snapshot.items[0].stock).toBe(8)
  })

  it('returns normalized items when reading products directly', async () => {
    apiGetMock.mockResolvedValue({
      data: {
        items: [
          {
            id: '404',
            nombre: 'Remoto',
            categoria: 'Tarjetas',
            descripcion: 'Catalogo remoto',
            precio: 400,
            stock: 6,
            especificaciones: 'Specs',
            imagen_url: 'https://example.com/remote.png'
          }
        ],
        source: 'managed',
        warning: null
      }
    })

    const products = await googleSheetsAPI.getProducts()

    expect(products).toHaveLength(1)
    expect(products[0].id).toBe(404)
  })

  it('saves the managed catalog through the backend', async () => {
    apiPutMock.mockResolvedValue({
      data: {
        items: [
          {
            id: '101',
            nombre: 'Producto Admin',
            categoria: 'Demo',
            descripcion: 'Creado desde admin',
            precio: '99.9',
            stock: '4',
            especificaciones: 'Demo',
            imagen_url: ''
          }
        ],
        source: 'managed',
        warning: null
      }
    })

    const snapshot = await googleSheetsAPI.saveManagedProducts([
      {
        id: '101',
        nombre: 'Producto Admin',
        categoria: 'Demo',
        descripcion: 'Creado desde admin',
        precio: '99.9',
        stock: '4',
        especificaciones: 'Demo',
        imagen_url: ''
      }
    ])

    expect(apiPutMock).toHaveBeenCalledWith('/catalog/products', {
      products: [
        {
          id: 101,
          nombre: 'Producto Admin',
          categoria: 'Demo',
          descripcion: 'Creado desde admin',
          precio: 99.9,
          stock: 4,
          especificaciones: 'Demo',
          imagen_url: 'https://via.placeholder.com/300x300?text=Producto'
        }
      ]
    })
    expect(snapshot.source).toBe('managed')
    expect(snapshot.items[0].id).toBe(101)
  })

  it('clears the managed catalog through the backend', async () => {
    apiDeleteMock.mockResolvedValue({
      data: {
        items: [
          {
            id: 505,
            nombre: 'Fallback',
            categoria: 'Demo',
            descripcion: 'Respaldo',
            precio: 10,
            stock: 2,
            especificaciones: 'Specs',
            imagen_url: 'https://example.com/fallback.png'
          }
        ],
        source: 'fallback',
        warning: 'Catalogo administrado restaurado.'
      }
    })

    const snapshot = await googleSheetsAPI.clearManagedProducts()

    expect(apiDeleteMock).toHaveBeenCalledWith('/catalog/products')
    expect(snapshot.source).toBe('fallback')
    expect(snapshot.items[0].id).toBe(505)
  })

  it('falls back to default products if the catalog endpoint fails', async () => {
    apiGetMock.mockRejectedValue(new Error('network down'))

    const snapshot = await googleSheetsAPI.getCatalogSnapshot()

    expect(snapshot.source).toBe('fallback')
    expect(snapshot.items.length).toBeGreaterThan(0)
    expect(snapshot.warning).toContain('network down')
  })

  it('retries the remote catalog after a previous failure', async () => {
    apiGetMock.mockRejectedValueOnce(new Error('cold start'))
    apiGetMock.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: '808',
            nombre: 'Producto Recuperado',
            categoria: 'Demo',
            descripcion: 'Vuelve al remoto',
            precio: 80,
            stock: 3,
            especificaciones: 'Specs',
            imagen_url: 'https://example.com/recovered.png'
          }
        ],
        source: 'google_sheets',
        warning: null
      }
    })

    const firstSnapshot = await googleSheetsAPI.getCatalogSnapshot()
    const secondSnapshot = await googleSheetsAPI.getCatalogSnapshot()

    expect(firstSnapshot.source).toBe('fallback')
    expect(secondSnapshot.source).toBe('google_sheets')
    expect(secondSnapshot.items[0].id).toBe(808)
    expect(apiGetMock).toHaveBeenCalledTimes(2)
  })
})
