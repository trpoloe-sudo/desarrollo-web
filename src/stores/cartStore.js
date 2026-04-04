import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // Cargar desde localStorage
  function initCart() {
    const saved = localStorage.getItem('cartItems')
    if (!saved) {
      return
    }

    try {
      const parsed = JSON.parse(saved)
      items.value = Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Error restoring cart:', error)
      items.value = []
      localStorage.removeItem('cartItems')
    }
  }

  function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(items.value))
  }

  function addItem(product, quantity = Number(product?.quantity ?? 1)) {
    const normalizedQuantity = Number.isFinite(quantity) && quantity > 0
      ? Math.floor(quantity)
      : 1
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += normalizedQuantity
    } else {
      items.value.push({
        ...product,
        quantity: normalizedQuantity
      })
    }

    saveCart()
  }

  function removeItem(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    saveCart()
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  function clearCart() {
    items.value = []
    localStorage.removeItem('cartItems')
  }

  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.precio * item.quantity), 0)
  })

  const tax = computed(() => {
    return 0
  })

  const shipping = computed(() => 0) // Envio gratis

  const total = computed(() => {
    return subtotal.value + shipping.value
  })

  return {
    items,
    itemCount,
    subtotal,
    tax,
    shipping,
    total,
    initCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
