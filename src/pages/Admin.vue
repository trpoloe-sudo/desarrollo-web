<template>
  <div class="admin-container">
    <h1>⚙️ Panel de Administración</h1>

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
      <h2>📦 Gestión de Productos</h2>

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
          <button @click="saveProduct" class="btn-primary">{{ editingProduct ? 'Actualizar' : 'Agregar' }} Producto</button>
          <button v-if="editingProduct" @click="cancelEdit" class="btn-secondary">Cancelar</button>
        </div>
      </div>

      <div class="products-list">
        <h3>Productos Actuales ({{ products.length }})</h3>
        <div v-if="products.length === 0" class="empty-state">
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
                <button @click="editProduct(product)" class="btn-edit">✏️ Editar</button>
                <button @click="deleteProduct(product.id)" class="btn-delete">🗑️ Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="activeTab === 'orders'" class="admin-section">
      <h2>📋 Gestión de Órdenes</h2>

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
      <h2>👥 Gestión de Usuarios</h2>

      <div v-if="users.length === 0" class="empty-state">
        No hay usuarios registrados aún
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
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
            <td>{{ user.orders?.length || 0 }}</td>
            <td>${{ getTotalUserSpent(user).toFixed(2) }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button @click="viewUserDetails(user)" class="btn-details">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <button class="modal-close" @click="showModal = false">×</button>
        <div v-html="modalContent" class="modal-content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const activeTab = ref('products')
const showModal = ref(false)
const modalContent = ref('')
const editingProduct = ref(null)

const products = ref([
  {
    id: '1',
    nombre: 'Intel Core i7',
    categoria: 'Procesadores',
    descripcion: 'Procesador de alto rendimiento',
    precio: 450,
    stock: 15,
    especificaciones: '13ª gen, 16 núcleos',
    imagen_url: 'https://via.placeholder.com/200'
  },
  {
    id: '2',
    nombre: 'RTX 4090',
    categoria: 'Tarjetas Gráficas',
    descripcion: 'GPU profesional',
    precio: 1800,
    stock: 5,
    especificaciones: '24GB GDDR6X',
    imagen_url: 'https://via.placeholder.com/200'
  }
])

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
  products: '📦 Productos',
  orders: '📋 Órdenes',
  users: '👥 Usuarios'
}

const allOrders = computed(() => {
  const orders = []
  return orders
})

const users = computed(() => {
  return []
})

function saveProduct() {
  if (!productForm.value.nombre || !productForm.value.precio) {
    alert('Por favor completa los campos requeridos')
    return
  }

  if (editingProduct.value) {
    const index = products.value.findIndex(p => p.id === editingProduct.value.id)
    if (index > -1) {
      products.value[index] = {
        ...editingProduct.value,
        ...productForm.value
      }
    }
    editingProduct.value = null
  } else {
    products.value.push({
      id: Date.now().toString(),
      ...productForm.value
    })
  }

  resetProductForm()
  alert('Producto guardado exitosamente')
}

function editProduct(product) {
  editingProduct.value = product
  productForm.value = { ...product }
}

function deleteProduct(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    products.value = products.value.filter(p => p.id !== id)
    alert('Producto eliminado')
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

function updateOrderStatus(orderId, status) {
  alert(`Estado de la orden ${orderId} actualizado a: ${status}`)
}

function viewOrderDetails(order) {
  modalContent.value = `
    <h3>Detalles de la Orden #${order.id}</h3>
    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    <p><strong>Estado:</strong> ${order.status}</p>
  `
  showModal.value = true
}

function viewUserDetails(user) {
  const totalSpent = getTotalUserSpent(user)
  modalContent.value = `
    <h3>Detalles del Usuario</h3>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Nombre:</strong> ${user.name}</p>
    <p><strong>Total Gastado:</strong> $${totalSpent.toFixed(2)}</p>
    <p><strong>Órdenes:</strong> ${user.orders?.length || 0}</p>
  `
  showModal.value = true
}

function getTotalUserSpent(user) {
  return user.orders?.reduce((total, order) => total + order.total, 0) || 0
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES')
}
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
}

.admin-form {
  background: var(--color-bg-light);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
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

.modal-content p {
  margin: 10px 0;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .admin-tabs {
    flex-wrap: wrap;
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
}
</style>
