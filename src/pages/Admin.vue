<template>
  <div class="admin-container">
    <h1><ShieldCheck class="title-icon" size="22" /> Panel de Administración</h1>

    <div class="admin-tabs">
      <button
        v-for="tab in ['products', 'orders', 'users']"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tabLabels[tab] }}
      </button>
    </div>

    <section v-if="activeTab === 'products'" class="admin-section">
      <h2><Package class="title-icon" size="18" /> Gestión de Productos</h2>

      <div class="catalog-status" :class="`catalog-status--${catalogStatus.source}`">
        <div class="catalog-status-copy">
          <strong>Origen del catálogo:</strong> {{ getCatalogSourceLabel(catalogStatus.source) }}
          <p v-if="catalogStatus.warning" class="catalog-warning">{{ catalogStatus.warning }}</p>
        </div>
        <button
          v-if="catalogStatus.source === 'managed'"
          class="btn-secondary"
          :disabled="savingProducts"
          @click="restoreRemoteCatalog"
        >
          Restaurar catálogo remoto
        </button>
      </div>

      <div class="admin-form">
        <h3>{{ editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto' }}</h3>

        <div class="form-grid">
          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="productForm.nombre" type="text" placeholder="Nombre del producto" />
          </div>
          <div class="form-group">
            <label>Categoría:</label>
            <input v-model="productForm.categoria" type="text" placeholder="Ej: Procesadores" />
          </div>
          <div class="form-group">
            <label>Precio:</label>
            <input v-model.number="productForm.precio" type="number" placeholder="0.00" />
          </div>
          <div class="form-group">
            <label>Stock:</label>
            <input v-model.number="productForm.stock" type="number" placeholder="0" />
          </div>
        </div>

        <div class="form-group">
          <label>Descripción:</label>
          <textarea v-model="productForm.descripcion" placeholder="Descripción del producto"></textarea>
        </div>

        <div class="form-group">
          <label>Especificaciones:</label>
          <input v-model="productForm.especificaciones" type="text" placeholder="Ej: 13ª gen, 16 núcleos" />
        </div>

        <div class="form-group">
          <label>URL de Imagen:</label>
          <input v-model="productForm.imagen_url" type="text" placeholder="https://..." />
        </div>

        <div class="form-actions">
          <button @click="saveProduct" class="btn-primary" :disabled="savingProducts">{{ savingProducts ? 'Guardando...' : `${editingProduct ? 'Actualizar' : 'Agregar'} Producto` }}</button>
          <button v-if="editingProduct" @click="cancelEdit" class="btn-secondary">Cancelar</button>
        </div>
      </div>

      <div class="products-list">
        <h3>Productos Actuales ({{ products.length }})</h3>
        <div v-if="loadingProducts" class="empty-state">
          Cargando productos...
        </div>
        <div v-else-if="products.length === 0" class="empty-state">
          No hay productos aún
        </div>
        <table v-else>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.nombre }}</td>
              <td>{{ product.categoria }}</td>
              <td>${{ product.precio }}</td>
              <td>{{ product.stock }}</td>
              <td class="actions">
                <button @click="editProduct(product)" class="btn-edit" :disabled="savingProducts">Editar</button>
                <button @click="deleteProduct(product.id)" class="btn-delete" :disabled="savingProducts">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="activeTab === 'orders'" class="admin-section">
      <h2><ClipboardList class="title-icon" size="18" /> Gestión de Órdenes</h2>

      <div v-if="allOrders.length === 0" class="empty-state">
        No hay órdenes aún
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in allOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.userEmail }}</td>
            <td>${{ order.total.toFixed(2) }}</td>
            <td>
              <select @change="updateOrderStatus(order.id, $event.target.value)" :value="order.status">
                <option value="pending">Pendiente</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <button @click="viewOrderDetails(order)" class="btn-details">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-if="activeTab === 'users'" class="admin-section">
      <h2><Users class="title-icon" size="18" /> Gestión de Usuarios</h2>

      <div v-if="users.length === 0" class="empty-state">
        No hay usuarios registrados aún
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Órdenes</th>
            <th>Total Gastado</th>
            <th>Registrado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.email }}</td>
            <td>{{ user.name }}</td>
            <td>{{ getRoleLabel(user.role) }}</td>
            <td>{{ user.orders?.length || 0 }}</td>
            <td>${{ getTotalUserSpent(user).toFixed(2) }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td class="actions">
              <button @click="viewUserDetails(user)" class="btn-details">Ver</button>
              <button
                @click="toggleUserRole(user)"
                :class="user.role === 'admin' ? 'btn-secondary' : 'btn-edit'"
              >
                {{ user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <button class="modal-close" @click="closeModal">×</button>
        <div class="modal-content">
          <h3 class="modal-title">{{ modalData.title }}</h3>

          <div v-if="modalData.details.length" class="modal-details">
            <div
              v-for="detail in modalData.details"
              :key="detail.label"
              class="modal-detail-row"
            >
              <span class="modal-detail-label">{{ detail.label }}</span>
              <strong class="modal-detail-value">{{ detail.value }}</strong>
            </div>
          </div>

          <div v-if="modalData.items.length" class="modal-items">
            <h4>Productos</h4>
            <div
              v-for="item in modalData.items"
              :key="`${item.id}-${item.nombre}`"
              class="modal-item-row"
            >
              <span>{{ item.nombre }} x{{ item.quantity }}</span>
              <strong>${{ formatCurrency(item.precio * item.quantity) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'
import { googleSheetsAPI } from '@/services/googleSheetsAPI'
import { ClipboardList, Package, ShieldCheck, Users } from 'lucide-vue-next'

const userStore = useUserStore()
const uiStore = useUiStore()
const activeTab = ref('products')
const showModal = ref(false)
const editingProduct = ref(null)
const loadingProducts = ref(true)
const savingProducts = ref(false)
const catalogStatus = ref({
  source: 'unknown',
  warning: null
})
const modalData = ref({
  title: '',
  details: [],
  items: []
})

const products = ref([])

const productForm = ref({
  nombre: '',
  categoria: '',
  descripcion: '',
  precio: null,
  stock: null,
  especificaciones: '',
  imagen_url: ''
})

const tabLabels = {
  products: 'Productos',
  orders: 'Órdenes',
  users: 'Usuarios'
}

const users = computed(() => {
  return [...userStore.getAllUsers()].sort((firstUser, secondUser) => {
    return new Date(secondUser.createdAt || 0) - new Date(firstUser.createdAt || 0)
  })
})

const allOrders = computed(() => {
  return users.value
    .flatMap(user => (user.orders || []).map(order => ({
      ...order,
      userEmail: user.email,
      userName: user.name
    })))
    .sort((firstOrder, secondOrder) => {
      return new Date(secondOrder.createdAt || 0) - new Date(firstOrder.createdAt || 0)
    })
})

function applyCatalogSnapshot(snapshot) {
  products.value = snapshot?.items || []
  catalogStatus.value = {
    source: snapshot?.source || 'unknown',
    warning: snapshot?.warning || null
  }
}

async function saveProduct() {
  if (!productForm.value.nombre || !productForm.value.precio) {
    uiStore.warning('Completa al menos el nombre y el precio del producto.')
    return
  }

  const nextProduct = {
    id: editingProduct.value?.id ?? Date.now(),
    nombre: productForm.value.nombre.trim(),
    categoria: productForm.value.categoria.trim(),
    descripcion: productForm.value.descripcion.trim(),
    precio: Number(productForm.value.precio),
    stock: Number(productForm.value.stock || 0),
    especificaciones: productForm.value.especificaciones.trim(),
    imagen_url: productForm.value.imagen_url.trim() || 'https://via.placeholder.com/300x300?text=Producto'
  }

  const nextProducts = editingProduct.value
    ? products.value.map(product => product.id === editingProduct.value.id ? nextProduct : product)
    : [...products.value, nextProduct]

  try {
    savingProducts.value = true
    const snapshot = await googleSheetsAPI.saveManagedProducts(nextProducts)
    applyCatalogSnapshot(snapshot)
    editingProduct.value = null
    resetProductForm()
    uiStore.success('Producto guardado exitosamente.')
  } catch (error) {
    uiStore.error(error.message || 'No se pudo guardar el producto.')
  } finally {
    savingProducts.value = false
  }
}

function editProduct(product) {
  editingProduct.value = product
  productForm.value = { ...product }
}

async function deleteProduct(id) {
  const confirmed = await uiStore.confirm({
    title: 'Eliminar producto',
    message: 'Esta acción quitará el producto del catálogo administrado. ¿Deseas continuar?',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    danger: true
  })

  if (!confirmed) {
    return
  }

  try {
    savingProducts.value = true
    const snapshot = await googleSheetsAPI.saveManagedProducts(products.value.filter(product => product.id !== id))
    applyCatalogSnapshot(snapshot)
    uiStore.success('Producto eliminado del catálogo.')
  } catch (error) {
    uiStore.error(error.message || 'No se pudo eliminar el producto.')
  } finally {
    savingProducts.value = false
  }
}

function cancelEdit() {
  editingProduct.value = null
  resetProductForm()
}

function resetProductForm() {
  productForm.value = {
    nombre: '',
    categoria: '',
    descripcion: '',
    precio: null,
    stock: null,
    especificaciones: '',
    imagen_url: ''
  }
}

async function restoreRemoteCatalog() {
  const confirmed = await uiStore.confirm({
    title: 'Restaurar catálogo remoto',
    message: 'Se eliminará el catálogo administrado y se volverá a usar la fuente remota o el respaldo del servidor.',
    confirmText: 'Restaurar',
    cancelText: 'Cancelar',
    danger: true
  })

  if (!confirmed) {
    return
  }

  try {
    savingProducts.value = true
    const snapshot = await googleSheetsAPI.clearManagedProducts()
    applyCatalogSnapshot(snapshot)
    editingProduct.value = null
    resetProductForm()
    uiStore.info('Se restauró la fuente remota del catálogo.')
  } catch (error) {
    uiStore.error(error.message || 'No se pudo restaurar el catálogo remoto.')
  } finally {
    savingProducts.value = false
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    const updatedOrder = await userStore.updateOrderStatus(orderId, status)

    if (!updatedOrder) {
      uiStore.error('No se pudo actualizar el estado de la orden.')
      return
    }

    uiStore.success(`Estado actualizado a ${getOrderStatusLabel(status)}.`)
  } catch (error) {
    uiStore.error(error.message || 'No se pudo actualizar el estado de la orden.')
  }
}

function viewOrderDetails(order) {
  modalData.value = {
    title: `Detalles de la Orden #${order.id}`,
    details: [
      { label: 'Cliente', value: order.userName || order.userEmail || 'Sin usuario' },
      { label: 'Correo', value: order.userEmail || 'No disponible' },
      { label: 'Total', value: `$${formatCurrency(order.total)}` },
      { label: 'Estado', value: getOrderStatusLabel(order.status) },
      { label: 'Pago', value: order.paymentMethod || 'No disponible' },
      { label: 'Fecha', value: formatDate(order.createdAt) },
      { label: 'Dirección', value: formatBillingAddress(order.billingAddress) }
    ],
    items: order.items || []
  }
  showModal.value = true
}

function viewUserDetails(user) {
  const totalSpent = getTotalUserSpent(user)
  modalData.value = {
    title: 'Detalles del Usuario',
    details: [
      { label: 'Nombre', value: user.name || 'Sin nombre' },
      { label: 'Email', value: user.email || 'Sin correo' },
      { label: 'Proveedor', value: user.provider || 'email' },
      { label: 'Rol', value: getRoleLabel(user.role) },
      { label: 'Registrado', value: formatDate(user.createdAt) },
      { label: 'Órdenes', value: String(user.orders?.length || 0) },
      { label: 'Total gastado', value: `$${formatCurrency(totalSpent)}` }
    ],
    items: []
  }
  showModal.value = true
}

function getTotalUserSpent(user) {
  return user.orders?.reduce((total, order) => total + order.total, 0) || 0
}

async function toggleUserRole(selectedUser) {
  const nextRole = selectedUser.role === 'admin' ? 'customer' : 'admin'

  try {
    const updatedUser = await userStore.updateUserRole(selectedUser.email, nextRole)

    if (!updatedUser) {
      uiStore.error('No se pudo actualizar el rol del usuario.')
      return
    }

    if (showModal.value && modalData.value.details.some(detail => detail.label === 'Email' && detail.value === selectedUser.email)) {
      viewUserDetails(updatedUser)
    }

    uiStore.success(`Rol actualizado a ${getRoleLabel(nextRole)}.`)
  } catch (error) {
    uiStore.error(error.message || 'No se pudo actualizar el rol del usuario.')
  }
}

function formatCurrency(value) {
  return Number(value || 0).toFixed(2)
}

function formatDate(dateString) {
  if (!dateString) {
    return 'No disponible'
  }

  return new Date(dateString).toLocaleDateString('es-ES')
}

function formatBillingAddress(address) {
  if (!address) {
    return 'No registrada'
  }

  return [address.address, address.city, address.zip, address.country]
    .filter(Boolean)
    .join(', ') || 'No registrada'
}

function getOrderStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    completed: 'Completada',
    cancelled: 'Cancelada'
  }

  return labels[status] || status || 'Sin estado'
}

function getRoleLabel(role) {
  const labels = {
    admin: 'Administrador',
    customer: 'Cliente'
  }

  return labels[role] || role || 'Cliente'
}

function getCatalogSourceLabel(source) {
  const labels = {
    managed: 'Catálogo administrado desde el panel',
    google_sheets: 'Google Sheets',
    fallback: 'Respaldo del servidor',
    legacy: 'Respuesta heredada',
    unknown: 'No disponible'
  }

  return labels[source] || source || 'No disponible'
}

function closeModal() {
  showModal.value = false
  modalData.value = {
    title: '',
    details: [],
    items: []
  }
}

async function loadProducts() {
  try {
    loadingProducts.value = true
    const snapshot = await googleSheetsAPI.getCatalogSnapshot()
    applyCatalogSnapshot(snapshot)
  } catch (error) {
    console.error('Error loading admin products:', error)
    applyCatalogSnapshot({ items: [], source: 'unknown', warning: error.message })
  } finally {
    loadingProducts.value = false
  }
}

onMounted(() => {
  loadProducts()
  userStore.fetchAllUsers().catch((error) => {
    console.error('Error loading admin users:', error)
    uiStore.error(error.message || 'No se pudieron cargar los usuarios.')
  })
})
</script>

<style scoped>
.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.admin-container h1 {
  text-align: center;
  color: var(--color-text);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.admin-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid var(--color-border);
}

.tab-btn {
  padding: 12px 20px;
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: var(--color-text);
}

.tab-btn.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.admin-section {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-sm);
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

.admin-section h2 {
  margin-top: 0;
  color: var(--color-text);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  color: var(--color-accent);
}

.admin-form {
  background: var(--color-bg-light);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.catalog-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-light);
}

.catalog-status--managed {
  border-color: rgba(77, 184, 255, 0.35);
}

.catalog-status--google_sheets {
  border-color: rgba(46, 204, 113, 0.35);
}

.catalog-status--fallback {
  border-color: rgba(241, 196, 15, 0.45);
}

.catalog-status-copy {
  display: grid;
  gap: 6px;
  color: var(--color-text);
}

.catalog-warning {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.95em;
}

.admin-form h3 {
  color: var(--color-text);
  margin-top: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--color-text-light);
  font-weight: 600;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(77, 184, 255, 0.12);
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn-primary,
.btn-secondary,
.btn-edit,
.btn-delete,
.btn-details {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-edit:disabled,
.btn-delete:disabled,
.btn-details:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: var(--color-bg-light);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: #e9edf5;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: var(--danger-color);
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.btn-details {
  background: var(--color-accent);
  color: white;
}

.btn-details:hover {
  background: #2f6fb4;
}

.products-list {
  margin-top: 30px;
}

.products-list h3 {
  color: var(--color-text);
  margin-bottom: 15px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-light);
  background: var(--color-bg-light);
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
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

.actions {
  display: flex;
  gap: 5px;
}

select {
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 2em;
  cursor: pointer;
  color: var(--color-text-light);
}

.modal-close:hover {
  color: var(--color-text);
}

.modal-content {
  color: var(--color-text-light);
}

.modal-title {
  margin: 0 0 18px;
  color: var(--color-text);
}

.modal-details {
  display: grid;
  gap: 10px;
}

.modal-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--color-bg-light);
}

.modal-detail-label {
  color: var(--color-text-light);
}

.modal-detail-value {
  color: var(--color-text);
  text-align: right;
}

.modal-items {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.modal-items h4 {
  margin: 0;
  color: var(--color-text);
}

.modal-item-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--color-bg-light);
  color: var(--color-text);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .admin-tabs {
    flex-wrap: wrap;
  }

  .catalog-status {
    flex-direction: column;
    align-items: flex-start;
  }

  table {
    font-size: 0.9em;
  }

  th, td {
    padding: 8px;
  }

  .actions {
    flex-direction: column;
  }

  .modal {
    width: 95%;
  }

  .modal-detail-row,
  .modal-item-row {
    flex-direction: column;
  }

  .modal-detail-value {
    text-align: left;
  }
}
</style>

