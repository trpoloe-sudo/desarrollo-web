<template>
  <div class="products">
    <div class="container">
      <section class="catalog-toolbar" aria-label="Filtros del catalogo">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar productos..."
          class="search-input"
          aria-label="Buscar productos"
        >
        <select v-model="selectedCategory" class="filter-select">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </section>

      <div v-if="loading" class="status-card loading">
        <p>Cargando productos...</p>
      </div>

      <div v-else-if="filteredProducts.length > 0" class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>

      <div v-else class="status-card no-products">
        <p>No se encontraron productos con los filtros actuales.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { googleSheetsAPI } from '../services/googleSheetsAPI'
import { useCartStore } from '../stores/cartStore'
import { useUiStore } from '@/stores/ui'
import { pixelTracking } from '../services/pixelTracking'

const cartStore = useCartStore()
const uiStore = useUiStore()
const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const isCompactMobile = ref(false)

const updateCompactMobile = () => {
  isCompactMobile.value = window.innerWidth <= 768
}

const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.categoria))
  return Array.from(cats).sort()
})

const filteredProducts = computed(() => {
  let filtered = products.value

  if (!isCompactMobile.value && selectedCategory.value) {
    filtered = filtered.filter(p => p.categoria === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      String(p.nombre || '').toLowerCase().includes(query) ||
      String(p.descripcion || '').toLowerCase().includes(query) ||
      String(p.especificaciones || '').toLowerCase().includes(query) ||
      String(p.categoria || '').toLowerCase().includes(query)
    )
  }

  return filtered
})

const handleAddToCart = (product) => {
  cartStore.addItem(product)
  pixelTracking.trackAddToCart(product)
  showCartNotification(product.nombre)
}

function showCartNotification(productName) {
  uiStore.success(`Producto añadido al carrito: ${productName}`)
}

watch(() => searchQuery.value, (newQuery) => {
  if (newQuery && newQuery.length > 2) {
    pixelTracking.trackSearch(newQuery)
  }
})

watch(() => selectedCategory.value, (newCategory) => {
  if (newCategory && !isCompactMobile.value) {
    pixelTracking.trackViewCategory(newCategory)
  }
})

onMounted(async () => {
  updateCompactMobile()
  window.addEventListener('resize', updateCompactMobile)

  try {
    products.value = await googleSheetsAPI.getProducts()
    pixelTracking.trackPageView('Productos')
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCompactMobile)
})
</script>

<style scoped>
.products {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(77, 184, 255, 0.14), transparent 26%),
    radial-gradient(circle at top right, rgba(30, 60, 114, 0.12), transparent 24%),
    linear-gradient(180deg, #f5f8fd 0%, #eef4fb 100%);
  padding: 44px 20px 64px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.catalog-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(240px, 0.75fr);
  gap: 14px;
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid rgba(77, 184, 255, 0.14);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 40px rgba(12, 28, 52, 0.08);
  backdrop-filter: blur(12px);
}

.search-input,
.filter-select {
  min-height: 56px;
  padding: 14px 18px;
  border: 1px solid rgba(77, 184, 255, 0.18);
  border-radius: 16px;
  font-size: 0.98rem;
  background: rgba(248, 251, 255, 0.96);
  color: #17365f;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.search-input::placeholder {
  color: #8394a8;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: rgba(77, 184, 255, 0.5);
  box-shadow:
    0 0 0 4px rgba(77, 184, 255, 0.12),
    0 12px 24px rgba(77, 184, 255, 0.08);
}

.status-card {
  position: relative;
  text-align: center;
  padding: 40px 24px;
  border: 1px solid rgba(77, 184, 255, 0.14);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 40px rgba(12, 28, 52, 0.08);
  backdrop-filter: blur(12px);
  color: var(--color-text-light);
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .products {
    padding: 30px 14px 46px;
  }

  .catalog-toolbar,
  .status-card {
    border-radius: 20px;
  }

  .catalog-toolbar {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .search-input {
    width: 100%;
  }

  .filter-select {
    display: none;
  }

  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
}

@media (max-width: 480px) {
  .products {
    padding: 18px 10px 34px;
  }

  .catalog-toolbar,
  .status-card {
    border-radius: 18px;
  }

  .catalog-toolbar {
    margin-bottom: 16px;
    padding: 10px;
    gap: 0;
  }

  .search-input {
    min-height: 44px;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 0.92rem;
  }

  .status-card {
    padding: 28px 16px;
    font-size: 0.95rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>

