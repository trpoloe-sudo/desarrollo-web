<template>
  <div class="checkout-container">
    <h1><ShoppingCart class="title-icon" size="22" /> Carrito de Compras</h1>

    <div class="checkout-grid">
      <section class="cart-summary">
        <h2>Resumen de Compra</h2>

        <div v-if="cartStore.items.length === 0" class="empty-cart">
          <p>Tu carrito está vacío</p>
          <RouterLink to="/products" class="btn-primary">Continuar Comprando</RouterLink>
        </div>

        <div v-else>
          <div class="cart-items">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
              <div class="item-image">
                <img :src="item.imagen_url" :alt="item.nombre" />
              </div>
              <div class="item-details">
                <h3>{{ item.nombre }}</h3>
                <p class="item-category">{{ item.categoria }}</p>
              </div>
              <div class="item-quantity">
                <button @click="decreaseQuantity(item.id)" class="qty-btn">-</button>
                <input v-model.number="item.quantity" type="number" min="1" />
                <button @click="increaseQuantity(item.id)" class="qty-btn">+</button>
              </div>
              <div class="item-price">
                <p>${{ (item.precio * item.quantity).toFixed(2) }}</p>
                <button @click="cartStore.removeItem(item.id)" class="btn-remove">Eliminar</button>
              </div>
            </div>
          </div>

          <div class="order-totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div class="total-row">
              <span>IGV (18%):</span>
              <span>${{ cartStore.tax.toFixed(2) }}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total a Pagar:</span>
              <span>${{ cartStore.total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="cart-actions">
            <button @click="cartStore.clearCart()" class="btn-secondary">Vaciar Carrito</button>
            <RouterLink to="/products" class="btn-secondary">Continuar Comprando</RouterLink>
            <button @click="proceedToPayment" class="btn-primary" :disabled="isProcessing">
              {{ isProcessing ? 'Procesando...' : 'Proceder al Pago' }}
            </button>
          </div>
        </div>
      </section>

      <section v-if="cartStore.items.length > 0" class="payment-section">
        <h2>Información de Pago</h2>

        <div v-if="!paymentProcessed" class="payment-form">
          <div class="form-group">
            <label>Método de Pago:</label>
            <div class="payment-methods">
              <label class="payment-option">
                <input v-model="paymentMethod" type="radio" value="card" />
                <span>Tarjeta de Crédito</span>
              </label>
              <label class="payment-option">
                <input v-model="paymentMethod" type="radio" value="paypal" />
                <span>PayPal</span>
              </label>
              <label class="payment-option">
                <input v-model="paymentMethod" type="radio" value="transfer" />
                <span>Transferencia Bancaria</span>
              </label>
            </div>
          </div>

          <div v-if="paymentMethod === 'card'" class="card-details">
            <div class="form-group">
              <label>Número de Tarjeta:</label>
              <input
                v-model="cardDetails.cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
              />
            </div>
            <div class="form-group">
              <label>Nombre del Titular:</label>
              <input
                v-model="cardDetails.cardName"
                type="text"
                placeholder="Juan Pérez"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Vencimiento (MM/YY):</label>
                <input
                  v-model="cardDetails.expiry"
                  type="text"
                  placeholder="12/25"
                  maxlength="5"
                />
              </div>
              <div class="form-group">
                <label>CVV:</label>
                <input
                  v-model="cardDetails.cvv"
                  type="text"
                  placeholder="123"
                  maxlength="3"
                />
              </div>
            </div>
          </div>

          <div class="billing-details">
            <h3>Dirección de Facturación</h3>
            <div class="form-group">
              <label>Dirección:</label>
              <input v-model="billingAddress.address" type="text" placeholder="Calle Principal 123" />
            </div>
            <div class="form-group">
              <label>Ciudad:</label>
              <input v-model="billingAddress.city" type="text" placeholder="Madrid" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Código Postal:</label>
                <input v-model="billingAddress.zip" type="text" placeholder="28001" />
              </div>
              <div class="form-group">
                <label>País:</label>
                <input v-model="billingAddress.country" type="text" placeholder="España" />
              </div>
            </div>
          </div>

          <button @click="proceedToPayment" class="btn-primary" :disabled="isProcessing">
            {{ isProcessing ? 'Procesando Pago...' : 'Completar Compra' }}
          </button>
        </div>

        <div v-else class="payment-success">
          <div class="success-icon">✓</div>
          <h3>¡Pago Exitoso!</h3>
          <p>Tu orden ha sido procesada correctamente</p>
          <div class="order-confirmation">
            <p><strong>Número de Orden:</strong> {{ orderNumber }}</p>
            <p><strong>Cantidad:</strong> {{ cartStore.items.length }} producto(s)</p>
            <p><strong>Total:</strong> ${{ cartStore.total.toFixed(2) }}</p>
            <p><strong>Método:</strong> {{ paymentMethodLabel }}</p>
          </div>
          <p class="confirmation-message">
            Se ha enviado un correo de confirmación a {{ userStore.user?.email }}
          </p>
          <RouterLink to="/dashboard" class="btn-primary">Ver Mi Dashboard</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/user'
import { ShoppingCart } from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const isProcessing = ref(false)
const paymentProcessed = ref(false)
const orderNumber = ref('')
const paymentMethod = ref('card')
const paymentMethodLabel = computed(() => {
  const labels = { card: 'Tarjeta de Crédito', paypal: 'PayPal', transfer: 'Transferencia Bancaria' }
  return labels[paymentMethod.value]
})

const cardDetails = ref({
  cardNumber: '',
  cardName: '',
  expiry: '',
  cvv: ''
})

const billingAddress = ref({
  address: '',
  city: '',
  zip: '',
  country: 'España'
})

function increaseQuantity(itemId) {
  const item = cartStore.items.find(i => i.id === itemId)
  if (item) {
    cartStore.updateQuantity(itemId, item.quantity + 1)
  }
}

function decreaseQuantity(itemId) {
  const item = cartStore.items.find(i => i.id === itemId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(itemId, item.quantity - 1)
  }
}

async function proceedToPayment() {
  if (cartStore.items.length === 0) {
    alert('El carrito está vacío')
    return
  }

  if (paymentMethod.value === 'card') {
    if (!cardDetails.value.cardNumber || !cardDetails.value.cardName || !cardDetails.value.expiry || !cardDetails.value.cvv) {
      alert('Por favor completa todos los datos de la tarjeta')
      return
    }
  }

  if (!billingAddress.value.address || !billingAddress.value.city || !billingAddress.value.zip) {
    alert('Por favor completa la dirección de facturación')
    return
  }

  try {
    isProcessing.value = true

    await new Promise(resolve => setTimeout(resolve, 2000))

    const order = {
      items: cartStore.items.map(item => ({
        ...item,
        quantity: item.quantity
      })),
      subtotal: cartStore.subtotal,
      tax: cartStore.tax,
      total: cartStore.total,
      paymentMethod: paymentMethodLabel.value,
      billingAddress: billingAddress.value,
      status: 'completed'
    }

    const savedOrder = userStore.addOrder(order)
    orderNumber.value = savedOrder.id

    cartStore.clearCart()
    paymentProcessed.value = true
  } catch (error) {
    alert('Error procesando el pago: ' + error.message)
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-container h1 {
  text-align: center;
  color: var(--color-primary);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-icon {
  color: var(--color-accent);
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.cart-summary,
.payment-section {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-sm);
}

h2 {
  color: var(--color-text);
  margin-top: 0;
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 10px;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
}

.empty-cart p {
  font-size: 1.2em;
  color: var(--color-text-light);
  margin-bottom: 20px;
}

.cart-items {
  margin-bottom: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px;
  gap: 15px;
  align-items: center;
  padding: 15px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  margin-bottom: 15px;
  background: var(--color-bg-light);
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details h3 {
  margin: 0 0 5px 0;
  color: var(--color-text);
}

.item-category {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9em;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 5px;
}

.qty-btn {
  background: var(--color-accent);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.qty-btn:hover {
  background: #2f6fb4;
}

.item-quantity input {
  width: 40px;
  text-align: center;
  border: 1px solid var(--color-border);
  padding: 5px;
  border-radius: 6px;
}

.item-price {
  text-align: right;
}

.item-price p {
  margin: 0;
  font-weight: 700;
  color: var(--color-accent);
}

.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  margin-top: 5px;
}

.btn-remove:hover {
  opacity: 0.7;
}

.order-totals {
  background: var(--color-bg-light);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: var(--color-text-light);
}

.total-row.grand-total {
  border-top: 2px solid var(--color-border);
  padding-top: 10px;
  margin-top: 10px;
  font-size: 1.2em;
  font-weight: 700;
  color: var(--color-text);
}

.cart-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
  font-weight: 600;
  display: block;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-bg-light);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: #e9edf5;
}

.payment-form {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-text-light);
  font-weight: 600;
}

input[type="text"],
input[type="email"],
input[type="number"] {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(77, 184, 255, 0.12);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  background: var(--color-bg-light);
  border-color: var(--color-accent);
}

.payment-option input {
  cursor: pointer;
}

.card-details,
.billing-details {
  background: var(--color-bg-light);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.billing-details h3 {
  margin-top: 0;
  color: var(--color-text);
}

.payment-success {
  text-align: center;
  padding: 40px 20px;
  animation: slideIn 0.3s ease-out;
}

.success-icon {
  font-size: 4em;
  color: var(--success-color);
  margin-bottom: 20px;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.payment-success h3 {
  color: var(--success-color);
  margin: 20px 0;
}

.order-confirmation {
  background: var(--color-bg-light);
  border-left: 4px solid var(--color-accent);
  padding: 20px;
  text-align: left;
  margin: 20px 0;
  border-radius: 6px;
}

.order-confirmation p {
  margin: 8px 0;
  color: var(--color-text-light);
}

.confirmation-message {
  color: var(--color-text-light);
  font-size: 0.95em;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 60px 1fr;
  }

  .item-quantity,
  .item-price {
    grid-column: 1 / -1;
  }

  .cart-actions {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

