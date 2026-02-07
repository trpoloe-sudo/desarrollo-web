<template>
  <div class="cart">
    <div class="container">
      <h1>🛒 Carrito de Compras</h1>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <p>Tu carrito está vacío</p>
        <RouterLink to="/products" class="continue-shopping">
          Continuar comprando
        </RouterLink>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.imagen_url" :alt="item.nombre" />
            </div>
            <div class="item-details">
              <h3>{{ item.nombre }}</h3>
              <p class="category">{{ item.categoria }}</p>
              <p class="price">${{ item.precio.toFixed(2) }}</p>
            </div>
            <div class="item-quantity">
              <label>Cantidad:</label>
              <div class="quantity-control">
                <button @click="decreaseQuantity(item.id)">-</button>
                <input
                  :value="item.quantity"
                  @change="e => cartStore.updateQuantity(item.id, parseInt(e.target.value))"
                  type="number"
                  min="1"
                />
                <button @click="increaseQuantity(item.id)">+</button>
              </div>
            </div>
            <div class="item-total">
              <p class="total">${{ (item.precio * item.quantity).toFixed(2) }}</p>
              <button @click="cartStore.removeItem(item.id)" class="remove-btn">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-box">
            <h2>Resumen del Pedido</h2>
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div class="summary-row">
              <span>IGV (18%):</span>
              <span>${{ cartStore.tax.toFixed(2) }}</span>
            </div>
            <div class="summary-total">
              <span>Total:</span>
              <span>${{ cartStore.total.toFixed(2) }}</span>
            </div>
            <button @click="goToCheckout" class="checkout-btn">Proceder al Pago</button>
            <button @click="clearCart" class="clear-btn">Vaciar Carrito</button>
            <RouterLink to="/products" class="continue-shopping-btn">
              Continuar Comprando
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showWhatsAppModal" class="modal-overlay" @click="closeWhatsAppModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Datos para el Pedido</h3>
          <button class="modal-close" @click="closeWhatsAppModal">×</button>
        </div>
        <p class="modal-subtitle">Estos datos son opcionales y se enviarán por WhatsApp.</p>
        <div class="modal-form">
          <label for="wa-phone">Teléfono de contacto</label>
          <input
            id="wa-phone"
            v-model="waPhone"
            type="tel"
            placeholder="Ej: 978 418 809"
          />
          <label for="wa-address">Dirección de entrega</label>
          <textarea
            id="wa-address"
            v-model="waAddress"
            rows="3"
            placeholder="Ej: Calle Principal 123, Lima"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeWhatsAppModal">Cancelar</button>
          <button class="btn-primary" @click="sendToWhatsApp">Enviar a WhatsApp</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useUserStore } from '../stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const showWhatsAppModal = ref(false)
const waPhone = ref('')
const waAddress = ref('')

const increaseQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId)
  if (item) {
    cartStore.updateQuantity(productId, item.quantity + 1)
  }
}

const decreaseQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1)
  }
}

const clearCart = () => {
  if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
    cartStore.clearCart()
  }
}

const goToCheckout = () => {
  if (cartStore.items.length === 0) {
    alert('Tu carrito está vacío')
    return
  }

  if (!userStore.isLoggedIn) {
    alert('Debes iniciar sesión para proceder al pago')
    router.push('/auth')
    return
  }

  waPhone.value = userStore.user?.phone || ''
  waAddress.value = userStore.user?.address || ''
  showWhatsAppModal.value = true
}

const closeWhatsAppModal = () => {
  showWhatsAppModal.value = false
}

const sendToWhatsApp = () => {
  const phone = waPhone.value?.trim()
  const address = waAddress.value?.trim()

  const lines = cartStore.items.map((item, index) => {
    const total = (item.precio * item.quantity).toFixed(2)
    return `${index + 1}. ${item.nombre} (x${item.quantity}) - $${total}`
  })

  const messageLines = [
    'Hola Ztar Tech, quiero confirmar mi pedido:',
    '',
    ...lines,
    '',
    `Subtotal: $${cartStore.subtotal.toFixed(2)}`,
    `IGV (18%): $${cartStore.tax.toFixed(2)}`,
    `Total: $${cartStore.total.toFixed(2)}`,
    '',
    `Cliente: ${userStore.user?.name || userStore.user?.email}`,
    phone ? `Teléfono: ${phone}` : null,
    address ? `Dirección: ${address}` : null,
  ].filter(Boolean)

  const message = messageLines.join('\n')
  const phoneNumber = '51978418809'
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
  showWhatsAppModal.value = false
}
</script>

<style scoped>
.cart {
  background-color: var(--surface-color);
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: var(--color-primary);
  margin-bottom: 30px;
  font-size: 32px;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-light);
}

.empty-cart p {
  font-size: 18px;
  margin-bottom: 20px;
}

.continue-shopping {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.continue-shopping:hover {
  background-color: #2f6fb4;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 150px 150px 100px;
  gap: 15px;
  align-items: center;
  padding: 15px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-bg-light);
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--color-bg-light);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h3 {
  margin: 0 0 5px 0;
  color: var(--color-primary);
}

.item-details p {
  margin: 3px 0;
  font-size: 12px;
  color: var(--color-text-light);
}

.price {
  color: var(--danger-color);
  font-weight: 700;
}

.item-quantity label {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  color: var(--color-text-light);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  width: fit-content;
  background: white;
}

.quantity-control button {
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: 700;
  color: var(--color-accent);
}

.quantity-control input {
  width: 40px;
  border: none;
  text-align: center;
  font-size: 14px;
  padding: 5px 0;
}

.quantity-control input:focus {
  outline: none;
}

.item-total {
  text-align: center;
}

.item-total .total {
  font-size: 18px;
  font-weight: 700;
  color: var(--danger-color);
  margin: 0 0 10px 0;
}

.remove-btn {
  padding: 6px 10px;
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: #c0392b;
}

.cart-summary {
  height: fit-content;
  position: sticky;
  top: 100px;
}

.summary-box {
  background-color: var(--color-bg-light);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.summary-box h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: var(--color-primary);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-accent);
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--success-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;
}

.checkout-btn:hover {
  background-color: #229954;
}

.clear-btn {
  width: 100%;
  padding: 10px;
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.clear-btn:hover {
  background-color: #c0392b;
}

.continue-shopping-btn {
  display: block;
  text-align: center;
  padding: 10px;
  background-color: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.continue-shopping-btn:hover {
  background-color: #2f6fb4;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 18, 32, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

.modal {
  background: var(--surface-color);
  border-radius: 14px;
  width: min(520px, 92vw);
  padding: 20px;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(77, 184, 255, 0.15);
  animation: slideUp 0.25s ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.modal-header h3 {
  margin: 0;
  color: var(--color-text);
}

.modal-subtitle {
  margin: 8px 0 16px;
  color: var(--color-text-light);
  font-size: 14px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-light);
}

.modal-close:hover {
  color: var(--color-text);
}

.modal-form {
  display: grid;
  gap: 10px;
}

.modal-form label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-light);
}

.modal-form input,
.modal-form textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
}

.modal-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 10px;
  }

  .item-quantity,
  .item-total {
    grid-column: 2;
  }

  .summary-box {
    position: static;
  }

  h1 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .item-image {
    width: 100%;
    height: 150px;
  }

  .item-quantity,
  .item-total {
    grid-column: 1;
  }

  .quantity-control {
    width: 100%;
  }

  .quantity-control input {
    flex: 1;
  }

  h1 {
    font-size: 20px;
  }
}
</style>
