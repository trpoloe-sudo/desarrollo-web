import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/stores/cartStore'
import { setActivePinia, createPinia } from 'pinia'

describe('CartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty items', () => {
    const cartStore = useCartStore()
    expect(cartStore.items).toEqual([])
  })

  it('adds item to cart', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      nombre: 'Test Product',
      precio: 100,
      categoria: 'Test',
      stock: 10,
      imagen_url: 'test.jpg',
      descripcion: 'Test',
      especificaciones: 'Test',
      quantity: 1
    }

    cartStore.addItem(product)
    expect(cartStore.items.length).toBe(1)
    expect(cartStore.items[0].nombre).toBe('Test Product')
  })

  it('increases quantity of existing item', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      nombre: 'Test Product',
      precio: 100,
      categoria: 'Test',
      stock: 10,
      imagen_url: 'test.jpg',
      descripcion: 'Test',
      especificaciones: 'Test',
      quantity: 1
    }

    cartStore.addItem(product)
    cartStore.addItem(product)
    expect(cartStore.items[0].quantity).toBe(2)
  })

  it('removes item from cart', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      nombre: 'Test Product',
      precio: 100,
      categoria: 'Test',
      stock: 10,
      imagen_url: 'test.jpg',
      descripcion: 'Test',
      especificaciones: 'Test',
      quantity: 1
    }

    cartStore.addItem(product)
    cartStore.removeItem('1')
    expect(cartStore.items.length).toBe(0)
  })

  it('calculates subtotal correctly', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      nombre: 'Test Product',
      precio: 100,
      categoria: 'Test',
      stock: 10,
      imagen_url: 'test.jpg',
      descripcion: 'Test',
      especificaciones: 'Test',
      quantity: 2
    }

    cartStore.addItem(product)
    expect(cartStore.subtotal).toBe(200)
  })

  it('calculates tax correctly', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      nombre: 'Test Product',
      precio: 100,
      categoria: 'Test',
      stock: 10,
      imagen_url: 'test.jpg',
      descripcion: 'Test',
      especificaciones: 'Test',
      quantity: 1
    }

    cartStore.addItem(product)
    expect(cartStore.tax).toBe(18) // 18% of 100 (IGV Perú)
  })

  it('clears cart', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      nombre: 'Test Product',
      precio: 100,
      categoria: 'Test',
      stock: 10,
      imagen_url: 'test.jpg',
      descripcion: 'Test',
      especificaciones: 'Test',
      quantity: 1
    }

    cartStore.addItem(product)
    cartStore.clearCart()
    expect(cartStore.items.length).toBe(0)
  })
})
