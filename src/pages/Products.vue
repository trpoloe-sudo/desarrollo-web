<template>
  <div class="products">
    <div class="container">
      <h1>Nuestros Productos</h1>

      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar productos..."
          class="search-input"
        >
        <select v-model="selectedCategory" class="filter-select">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="loading">
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

      <div v-else class="no-products">
        <p>No se encontraron productos.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { googleSheetsAPI } from '../services/googleSheetsAPI'
import { useCartStore } from '../stores/cartStore'
import { pixelTracking } from '../services/pixelTracking'

const cartStore = useCartStore()
const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')

const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.categoria))
  return Array.from(cats).sort()
})

const filteredProducts = computed(() => {
  let filtered = products.value

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.categoria === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion.toLowerCase().includes(query) ||
      p.categoria.toLowerCase().includes(query)
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
  alert(`✅ ${productName} añadido al carrito`)
}

watch(() => searchQuery.value, (newQuery) => {
  if (newQuery && newQuery.length > 2) {
    pixelTracking.trackSearch(newQuery)
  }
})

watch(() => selectedCategory.value, (newCategory) => {
  if (newCategory) {
    pixelTracking.trackViewCategory(newCategory)
  }
})

onMounted(async () => {
  try {
    products.value = await googleSheetsAPI.getProducts()
    pixelTracking.trackPageView('Productos')
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.products {
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

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 10px 15px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  flex: 1;
  min-width: 200px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(77, 184, 255, 0.12);
}

.loading,
.no-products {
  text-align: center;
  padding: 40px;
  color: var(--color-text-light);
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .search-input,
  .filter-select {
    min-width: unset;
    width: 100%;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }

  h1 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
