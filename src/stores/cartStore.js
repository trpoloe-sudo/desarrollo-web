import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // Cargar desde localStorage
  function initCart() {
    const saved = localStorage.getItem('cartItems')
    if (saved) {
      items.value = JSON.parse(saved)
    }
  }

  function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(items.value))
  }

  function addItem(product) {
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        ...product,
        quantity: 1
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
    return subtotal.value * 0.18 // IGV 18% (Impuesto General a las Ventas - Perú)
  })

  const shipping = computed(() => 0) // Envío gratis

  const total = computed(() => {
    return subtotal.value + tax.value + shipping.value
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
