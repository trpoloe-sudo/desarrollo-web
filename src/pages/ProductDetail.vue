<template>
  <div class="product-detail-page">
    <div class="breadcrumb">
      <RouterLink to="/productos">Productos</RouterLink>
      <span>/</span>
      <span v-if="product">{{ product.nombre }}</span>
      <span v-else>Cargando...</span>
    </div>

    <div v-if="loading" class="loading">
      <p>Cargando detalles del producto...</p>
    </div>

    <div v-else-if="product" class="content">
      <ProductDetails :product="product" @add-to-cart="handleAddToCart" />

      <div v-if="relatedProducts.length > 0" class="related-products-section">
        <h2>Productos Relacionados</h2>
        <div class="related-products-grid">
          <ProductCard
            v-for="relProduct in relatedProducts"
            :key="relProduct.id"
            :product="relProduct"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>

      <div class="reviews-section">
        <h2>Reseñas de Clientes</h2>
        <div class="reviews-container">
          <div class="review-item">
            <div class="review-header">
              <div class="reviewer-info">
                <span class="reviewer-name">Juan García</span>
                <span class="review-date">Hace 2 semanas</span>
              </div>
              <div class="review-rating">★★★★★</div>
            </div>
            <p class="review-text">Excelente producto, llegó en perfecto estado y funciona maravillosamente. Muy recomendado.</p>
          </div>

          <div class="review-item">
            <div class="review-header">
              <div class="reviewer-info">
                <span class="reviewer-name">María López</span>
                <span class="review-date">Hace 1 mes</span>
              </div>
              <div class="review-rating">★★★★</div>
            </div>
            <p class="review-text">Muy buena calidad. El envío fue rápido. Solo le faltan algunos accesorios.</p>
          </div>

          <div class="review-item">
            <div class="review-header">
              <div class="reviewer-info">
                <span class="reviewer-name">Carlos Rodríguez</span>
                <span class="review-date">Hace 1 mes</span>
              </div>
              <div class="review-rating">★★★★★</div>
            </div>
            <p class="review-text">Perfecto. Exactamente lo que esperaba. Recomiendo al 100%.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Producto no encontrado</p>
      <RouterLink to="/productos" class="back-btn">Volver a productos</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import ProductDetails from '../components/ProductDetails.vue'
import ProductCard from '../components/ProductCard.vue'
import { googleSheetsAPI } from '../services/googleSheetsAPI'
import { useCartStore } from '../stores/cartStore'
import { pixelTracking } from '../services/pixelTracking'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const products = ref([])
const loading = ref(true)
const product = computed(() => {
  const id = parseInt(route.params.id)
  return products.value.find(p => p.id === id)
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return products.value
    .filter(p =>
      p.categoria === product.value.categoria &&
      p.id !== product.value.id
    )
    .slice(0, 4)
})

const handleAddToCart = (data) => {
  if (data.quantity) {
    pixelTracking.trackAddToCart(data.product, data.quantity)
    alert(`✅ ${data.product.nombre} (x${data.quantity}) añadido al carrito`)
  } else {
    pixelTracking.trackAddToCart(data.nombre)
    alert(`✅ ${data.nombre} añadido al carrito`)
  }
}

watch(() => product.value, (newProduct) => {
  if (newProduct) {
    pixelTracking.trackViewProduct(newProduct)
  }
})

onMounted(async () => {
  try {
    products.value = await googleSheetsAPI.getProducts()
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-detail-page {
  background: linear-gradient(180deg, #f5f7fb 0%, #eef3fb 100%);
  min-height: 100vh;
  padding: 20px;
}

.breadcrumb {
  max-width: 1200px;
  margin: 0 auto 30px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(6px);
}

.breadcrumb a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: var(--color-secondary);
  text-decoration: underline;
}

.breadcrumb span {
  color: var(--gray-color);
}

.loading,
.not-found {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-light);
  font-size: 18px;
}

.not-found {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.back-btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s ease;
  font-weight: 700;
}

.back-btn:hover {
  background: #2f6fb4;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.related-products-section {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px 20px;
  margin-top: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.related-products-section h2 {
  margin: 0 0 30px 0;
  color: var(--color-primary);
  font-size: 24px;
  text-align: center;
  letter-spacing: 0.3px;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.reviews-section {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px 20px;
  margin-top: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.reviews-section h2 {
  margin: 0 0 30px 0;
  color: var(--color-primary);
  font-size: 24px;
  text-align: center;
  letter-spacing: 0.3px;
}

.reviews-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.review-item {
  background: linear-gradient(135deg, rgba(16, 37, 63, 0.04), rgba(77, 184, 255, 0.06));
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(77, 184, 255, 0.15);
  transition: all 0.3s ease;
}

.review-item:hover {
  box-shadow: var(--shadow-md);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 10px;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewer-name {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 14px;
}

.review-date {
  font-size: 12px;
  color: var(--gray-color);
}

.review-rating {
  font-size: 14px;
  letter-spacing: 2px;
  white-space: nowrap;
  color: var(--color-accent);
}

.review-text {
  margin: 0;
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 14px;
  }

  .related-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .reviews-container {
    grid-template-columns: 1fr;
  }

  .reviews-section,
  .related-products-section {
    padding: 24px 14px;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .product-detail-page {
    padding: 10px;
  }

  .breadcrumb {
    overflow-x: auto;
    white-space: nowrap;
  }

  .related-products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
