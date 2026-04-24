<template>
  <div class="checkout-container">
    <h1><ShoppingCart class="title-icon" size="22" /> Finalizar Pedido</h1>

    <div class="checkout-grid">
      <section class="cart-summary">
        <h2>Resumen del Pedido</h2>

        <div v-if="!requestSubmitted && cartStore.items.length === 0" class="empty-cart">
          <p>No hay productos listos para enviar</p>
          <RouterLink to="/products" class="btn-primary">Continuar Comprando</RouterLink>
        </div>

        <div v-else-if="!requestSubmitted">
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
              <span>Por coordinar</span>
            </div>
            <div class="total-row">
              <span>IGV:</span>
              <span>Incluido en el precio</span>
            </div>
            <div class="total-row grand-total">
              <span>Total estimado:</span>
              <span>${{ cartStore.total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="cart-actions">
            <button @click="cartStore.clearCart()" class="btn-secondary">Vaciar Carrito</button>
            <RouterLink to="/products" class="btn-secondary">Continuar Comprando</RouterLink>
            <button @click="submitOrderRequest" class="btn-primary" :disabled="isProcessing">
              {{ isProcessing ? 'Enviando...' : 'Enviar Pedido' }}
            </button>
          </div>
        </div>

        <div v-else-if="completedOrder" class="completed-cart">
          <div class="completed-order-header">
            <p class="completed-order-label">Pedido recibido</p>
            <strong>#{{ completedOrder.id }}</strong>
          </div>

          <div class="completed-items">
            <div v-for="item in completedOrder.items" :key="item.id" class="completed-item">
              <span>{{ item.nombre }} x{{ item.quantity }}</span>
              <strong>${{ (item.precio * item.quantity).toFixed(2) }}</strong>
            </div>
          </div>

          <div class="order-totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${{ completedOrder.subtotal.toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>Envío:</span>
              <span>Por coordinar</span>
            </div>
            <div class="total-row">
              <span>IGV:</span>
              <span>{{ orderTaxLabel(completedOrder) }}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total estimado:</span>
              <span>${{ completedOrder.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="cartStore.items.length > 0 || requestSubmitted" class="payment-section">
        <h2>{{ requestSubmitted ? 'Pedido Confirmado' : 'Coordinación del Pedido' }}</h2>

        <div v-if="!requestSubmitted" class="payment-form">
          <div class="info-banner">
            No hacemos cobros automáticos desde la web. Envias tu pedido y luego coordinamos pago y entrega contigo.
          </div>

          <div class="form-group">
            <label>Forma de pago preferida:</label>
            <div class="payment-methods">
              <label class="payment-option">
                <input v-model="paymentMethod" type="radio" value="transfer" />
                <span>Transferencia / Depósito</span>
              </label>
              <label class="payment-option">
                <input v-model="paymentMethod" type="radio" value="yape" />
                <span>Yape / Plin</span>
              </label>
              <label class="payment-option">
                <input v-model="paymentMethod" type="radio" value="coordinar" />
                <span>Coordinar con asesor</span>
              </label>
            </div>
          </div>

          <div class="payment-method-help">
            {{ paymentMethodGuidance }}
          </div>

          <div v-if="paymentMethod !== 'coordinar'" class="payment-proof">
            <label class="checkbox-option">
              <input v-model="paymentAlreadySent" type="checkbox" />
              <span>Ya realice el pago y quiero dejar mi referencia para validacion.</span>
            </label>

            <div v-if="requiresPaymentReview" class="payment-proof-fields">
              <div class="form-group">
                <label>Referencia o numero de operacion:</label>
                <input
                  v-model="paymentReference"
                  type="text"
                  placeholder="Ej: YP-483920 o numero de deposito"
                />
              </div>

              <div class="form-group">
                <label>Notas del pago:</label>
                <textarea
                  v-model="paymentNotes"
                  rows="3"
                  placeholder="Banco, hora aproximada o comentario para ubicar la operacion"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="billing-details">
            <h3>Datos para entrega o contacto</h3>
            <div class="form-group">
              <label>Teléfono de contacto:</label>
              <input v-model="contactPhone" type="text" placeholder="Ej: 978 418 809" />
            </div>
            <div class="form-group">
              <label>Dirección:</label>
              <input v-model="billingAddress.address" type="text" placeholder="Ej: Av. Principal 123" />
            </div>
            <div class="form-group">
              <label>Ciudad:</label>
              <input v-model="billingAddress.city" type="text" placeholder="Ej: Lima" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Código Postal:</label>
                <input v-model="billingAddress.zip" type="text" placeholder="Ej: 15001" />
              </div>
              <div class="form-group">
                <label>País:</label>
                <input v-model="billingAddress.country" type="text" placeholder="Perú" />
              </div>
            </div>
          </div>

          <button @click="submitOrderRequest" class="btn-primary" :disabled="isProcessing">
            {{ isProcessing ? 'Enviando Pedido...' : 'Enviar Pedido' }}
          </button>
        </div>

        <div v-else class="payment-success">
          <div class="success-icon">✓</div>
          <h3>¡Pedido Recibido!</h3>
          <p>No se realizo ningun cobro automatico. Nuestro equipo revisara tu solicitud y te contactara para confirmar pago y entrega.</p>
          <div class="order-confirmation">
            <p><strong>Número de solicitud:</strong> {{ completedOrder?.id }}</p>
            <p><strong>Productos:</strong> {{ completedOrder?.items.length }} producto(s)</p>
            <p><strong>Total estimado:</strong> ${{ completedOrder?.total.toFixed(2) }}</p>
            <p><strong>Forma de pago preferida:</strong> {{ completedOrder?.paymentMethod }}</p>
            <p><strong>Estado inicial:</strong> {{ getOrderStatusLabel(completedOrder?.status) }}</p>
            <p v-if="completedOrder?.billingAddress?.paymentReference">
              <strong>Referencia enviada:</strong> {{ completedOrder.billingAddress.paymentReference }}
            </p>
          </div>
          <p class="confirmation-message">
            {{ getOrderStatusDescription(completedOrder?.status) }}
          </p>
          <p class="confirmation-message">
            Te contactaremos al correo {{ completedOrder?.userEmail || userStore.user?.email }} para continuar con el pedido.
          </p>
          <RouterLink to="/dashboard" class="btn-primary">Ver Mi Dashboard</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'
import { ShoppingCart } from 'lucide-vue-next'
import { pixelTracking } from '@/services/pixelTracking'
import { getOrderStatusDescription, getOrderStatusLabel } from '@/utils/orderStatus'

const cartStore = useCartStore()
const userStore = useUserStore()
const uiStore = useUiStore()

const isProcessing = ref(false)
const requestSubmitted = ref(false)
const completedOrder = ref(null)
const paymentMethod = ref('transfer')
const paymentAlreadySent = ref(false)
const paymentReference = ref('')
const paymentNotes = ref('')
const contactPhone = ref('')
const billingAddress = ref({
  address: '',
  city: '',
  zip: '',
  country: 'Perú'
})

const paymentMethodLabel = computed(() => {
  const labels = {
    transfer: 'Transferencia / Depósito',
    yape: 'Yape / Plin',
    coordinar: 'Coordinar con asesor'
  }

  return labels[paymentMethod.value]
})

const paymentMethodGuidance = computed(() => {
  const messages = {
    transfer: 'Puedes enviar el pedido ahora y luego compartir tu deposito o transferencia. Si ya pagaste, deja la referencia en este formulario.',
    yape: 'Si ya realizaste el pago por Yape o Plin, deja la referencia para validarla. Si aun no, envia el pedido y te contactamos.',
    coordinar: 'Un asesor revisara el pedido contigo para definir metodo de pago, stock y entrega.'
  }

  return messages[paymentMethod.value]
})

const requiresPaymentReview = computed(() => {
  return paymentMethod.value !== 'coordinar' && paymentAlreadySent.value
})

function increaseQuantity(itemId) {
  const item = cartStore.items.find((entry) => entry.id === itemId)

  if (item) {
    cartStore.updateQuantity(itemId, item.quantity + 1)
  }
}

function decreaseQuantity(itemId) {
  const item = cartStore.items.find((entry) => entry.id === itemId)

  if (item && item.quantity > 1) {
    cartStore.updateQuantity(itemId, item.quantity - 1)
  }
}

function orderTaxLabel(order) {
  const tax = Number(order?.tax ?? 0)
  return tax > 0 ? `$${tax.toFixed(2)}` : 'Incluido en el precio'
}

watch(paymentMethod, (nextMethod) => {
  if (nextMethod === 'coordinar') {
    paymentAlreadySent.value = false
    paymentReference.value = ''
    paymentNotes.value = ''
  }
})

async function submitOrderRequest() {
  if (cartStore.items.length === 0) {
    uiStore.warning('El carrito está vacío.')
    return
  }

  if (!contactPhone.value || contactPhone.value.replace(/\D/g, '').length < 7) {
    uiStore.warning('Ingresa un teléfono de contacto válido.')
    return
  }

  if (!billingAddress.value.address || !billingAddress.value.city || !billingAddress.value.zip) {
    uiStore.warning('Completa los datos de entrega o contacto.')
    return
  }

  if (requiresPaymentReview.value && paymentReference.value.trim().length < 4) {
    uiStore.warning('Ingresa la referencia o numero de operacion para validar el pago.')
    return
  }

  try {
    isProcessing.value = true

    const order = {
      items: cartStore.items.map((item) => ({
        ...item,
        quantity: item.quantity
      })),
      subtotal: cartStore.subtotal,
      tax: cartStore.tax,
      total: cartStore.total,
      paymentMethod: paymentMethodLabel.value,
      billingAddress: {
        ...billingAddress.value,
        phone: contactPhone.value.trim(),
        paymentReference: paymentReference.value.trim(),
        paymentNotes: paymentNotes.value.trim(),
        paymentReportedAt: requiresPaymentReview.value ? new Date().toISOString() : null
      },
      userEmail: userStore.user?.email || '',
      status: requiresPaymentReview.value ? 'payment_review' : 'pending'
    }

    const savedOrder = await userStore.addOrder(order)

    if (!savedOrder) {
      throw new Error('No se pudo guardar la orden')
    }

    completedOrder.value = savedOrder
    cartStore.clearCart()
    requestSubmitted.value = true
    pixelTracking.trackLead('pedido_web', {
      value: order.total,
      currency: 'PEN'
    })
    uiStore.success('Pedido enviado correctamente.')
  } catch (error) {
    uiStore.error(`Error enviando el pedido: ${error.message}`)
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  if (cartStore.items.length > 0) {
    pixelTracking.trackInitiateCheckout(cartStore.items, cartStore.total)
  }

  contactPhone.value = userStore.user?.phone || ''
})
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

.completed-cart {
  display: grid;
  gap: 16px;
}

.completed-order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 10px;
  background: var(--color-bg-light);
  border: 1px solid var(--color-border);
}

.completed-order-label {
  margin: 0;
  color: var(--color-text-light);
  font-weight: 600;
}

.completed-items {
  display: grid;
  gap: 10px;
}

.completed-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--color-bg-light);
  color: var(--color-text);
}

.payment-form {
  animation: slideIn 0.3s ease-out;
}

.info-banner {
  margin-bottom: 20px;
  padding: 14px 16px;
  border-radius: 10px;
  background: rgba(77, 184, 255, 0.12);
  border: 1px solid rgba(77, 184, 255, 0.18);
  color: var(--color-text);
  line-height: 1.6;
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
input[type="number"],
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1em;
  font-family: inherit;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
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

.payment-method-help,
.payment-proof {
  margin-bottom: 20px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--color-bg-light);
  border: 1px solid var(--color-border);
  color: var(--color-text-light);
  line-height: 1.6;
}

.checkbox-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkbox-option input {
  margin-top: 4px;
}

.payment-proof-fields {
  margin-top: 16px;
}

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

  .cart-actions,
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
