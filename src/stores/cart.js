import { reactive } from 'vue'

export const cartStore = reactive({
  items: [],
  
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push({
        ...product,
        quantity: 1
      })
    }
  },
  
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId)
  },
  
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId)
    if (item && quantity > 0) {
      item.quantity = quantity
    } else if (quantity <= 0) {
      this.removeItem(productId)
    }
  },
  
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0)
  },
  
  clearCart() {
    this.items = []
  }
})
