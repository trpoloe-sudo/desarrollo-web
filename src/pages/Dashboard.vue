<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>📊 Mi Dashboard</h1>
      <p>Bienvenido, {{ userStore.user?.name || userStore.user?.email.split('@')[0] }}</p>
    </div>

    <div class="dashboard-grid">
      <section class="dashboard-section user-info">
        <h2>👤 Mi Información</h2>
        <div class="info-card">
          <p><strong>Email:</strong> {{ userStore.user?.email }}</p>
          <p><strong>Miembro desde:</strong> {{ formatDate(userStore.user?.createdAt) }}</p>
          <button @click="logout" class="btn-logout">Cerrar Sesión</button>
        </div>
      </section>

      <section class="dashboard-section stats">
        <h2>📈 Estadísticas</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Órdenes</h3>
            <p class="stat-value">{{ userStore.getOrders().length }}</p>
          </div>
          <div class="stat-card">
            <h3>Total Gastado</h3>
            <p class="stat-value">${{ totalSpent.toFixed(2) }}</p>
          </div>
          <div class="stat-card">
            <h3>Favoritos</h3>
            <p class="stat-value">{{ favoritesStore.count }}</p>
          </div>
        </div>
      </section>
    </div>

    <section class="dashboard-section orders">
      <h2>📦 Historial de Compras</h2>

      <div v-if="userStore.getOrders().length === 0" class="empty-state">
        <p>Aún no has realizado ninguna compra</p>
        <RouterLink to="/products" class="btn-primary">Explorar Productos</RouterLink>
      </div>

      <div v-else class="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID de Orden</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in userStore.getOrders()" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>${{ order.total.toFixed(2) }}</td>
              <td>
                <span class="status" :class="order.status">{{ order.status }}</span>
              </td>
              <td>
                <button @click="toggleOrderDetails(order.id)" class="btn-details">
                  Ver Detalles
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="expandedOrderId" class="order-details">
          <h3>Detalles de la Orden #{{ expandedOrderId }}</h3>
          <div v-for="order in userStore.getOrders()" :key="order.id">
            <div v-if="order.id === expandedOrderId">
              <div class="items-list">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <div class="item-info">
                    <h4>{{ item.nombre }}</h4>
                    <p>Cantidad: {{ item.quantity }} x ${{ item.precio }}</p>
                  </div>
                  <div class="item-total">
                    ${{ (item.precio * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>
              <div class="order-summary">
                <p><strong>Subtotal:</strong> ${{ order.subtotal.toFixed(2) }}</p>
                <p><strong>IGV (18%):</strong> ${{ order.tax.toFixed(2) }}</p>
                <p><strong>Total:</strong> ${{ order.total.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'

const router = useRouter()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()
const expandedOrderId = ref(null)

const totalSpent = computed(() => {
  return userStore.getOrders().reduce((total, order) => total + order.total, 0)
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function toggleOrderDetails(orderId) {
  expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId
}

function logout() {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

.dashboard-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
}

.dashboard-header p {
  margin: 0;
  font-size: 1.2em;
  opacity: 0.9;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-section {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-sm);
}

.dashboard-section h2 {
  margin-top: 0;
  color: var(--color-text);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 10px;
}

.info-card {
  background: var(--color-bg-light);
  padding: 15px;
  border-radius: 8px;
}

.info-card p {
  margin: 10px 0;
  color: var(--color-text-light);
}

.btn-logout {
  margin-top: 20px;
  background: var(--danger-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-card {
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 0.95em;
  opacity: 0.9;
}

.stat-value {
  margin: 0;
  font-size: 2em;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state p {
  font-size: 1.2em;
  color: var(--color-text-light);
  margin-bottom: 20px;
}

.btn-primary {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 6px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.orders-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

th {
  background: var(--color-bg-light);
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 2px solid var(--color-border);
}

td {
  padding: 12px;
  border-bottom: 1px solid var(--color-border);
}

tr:hover {
  background: var(--color-bg-light);
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
}

.status.completed {
  background: #d4edda;
  color: #155724;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.btn-details {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-details:hover {
  background: #2f6fb4;
}

.order-details {
  background: var(--color-bg-light);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.order-details h3 {
  margin-top: 0;
  color: var(--color-text);
}

.items-list {
  background: var(--surface-color);
  border-radius: 8px;
  margin-bottom: 15px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--color-border);
}

.order-item:last-child {
  border-bottom: none;
}

.item-info h4 {
  margin: 0 0 5px 0;
  color: var(--color-text);
}

.item-info p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9em;
}

.item-total {
  font-weight: bold;
  color: var(--color-accent);
  font-size: 1.1em;
}

.order-summary {
  background: var(--surface-color);
  padding: 15px;
  border-radius: 8px;
  text-align: right;
}

.order-summary p {
  margin: 8px 0;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header h1 {
    font-size: 1.8em;
  }

  table {
    font-size: 0.9em;
  }

  th, td {
    padding: 8px;
  }
}
</style>
