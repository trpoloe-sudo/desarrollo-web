<template>
  <div class="product-detail-page">
    <div class="ambient-orb ambient-orb--left"></div>
    <div class="ambient-orb ambient-orb--right"></div>

    <div class="page-shell">
      <nav class="breadcrumb" aria-label="Ruta del producto">
        <RouterLink to="/products" class="breadcrumb-back">
          <ArrowLeft size="16" />
          <span>Volver al catálogo</span>
        </RouterLink>
        <span class="breadcrumb-divider">/</span>
        <span class="breadcrumb-current">{{ breadcrumbLabel }}</span>
      </nav>

      <div v-if="loading" class="status-panel loading-panel">
        <p>Cargando detalles del producto...</p>
      </div>

      <div v-else-if="product" class="content">
        <section class="intro-band">
          <div class="intro-copy">
            <span class="intro-kicker">{{ product.categoria }}</span>
            <h2>Ficha completa para comprar con más claridad</h2>
            <p>
              {{ introText }}
            </p>
          </div>

          <div class="intro-metrics">
            <article
              v-for="metric in introMetrics"
              :key="metric.label"
              class="metric-card"
            >
              <component :is="metric.icon" class="metric-icon" size="18" />
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </article>
          </div>
        </section>

        <ProductDetails :product="product" @add-to-cart="handleAddToCart" />

        <section class="reviews-lounge">
          <div class="section-heading">
            <div>
              <span class="section-kicker">Experiencia de compra</span>
              <h2>Opiniones y señales de confianza</h2>
              <p>Una vista rápida del tipo de experiencia que buscamos entregar en cada venta.</p>
            </div>
          </div>

          <div class="reviews-grid">
            <div class="reviews-summary-card">
              <div class="score-block">
                <span class="score-label">Valoración media</span>
                <strong class="score-value">4.9</strong>
                <p>Basado en 125 compras verificadas con atención previa y seguimiento.</p>
              </div>

              <div class="rating-bars">
                <div
                  v-for="bar in reviewBreakdown"
                  :key="bar.label"
                  class="rating-bar-row"
                >
                  <span>{{ bar.label }}</span>
                  <div class="rating-bar-track">
                    <div class="rating-bar-fill" :style="{ width: `${bar.value}%` }"></div>
                  </div>
                  <strong>{{ bar.value }}%</strong>
                </div>
              </div>

              <div class="trust-points">
                <span class="trust-pill">Compra verificada</span>
                <span class="trust-pill">Stock confirmado</span>
                <span class="trust-pill">Soporte de tienda</span>
              </div>
            </div>

            <div class="review-cards">
              <article
                v-for="review in customerReviews"
                :key="review.name"
                class="review-card"
              >
                <div class="review-card-top">
                  <div>
                    <p class="reviewer-name">{{ review.name }}</p>
                    <span class="reviewer-role">{{ review.role }}</span>
                  </div>
                  <span class="review-date">{{ review.date }}</span>
                </div>
                <div class="review-stars">{{ review.rating }}</div>
                <h3>{{ review.title }}</h3>
                <p>{{ review.text }}</p>
              </article>
            </div>
          </div>
        </section>

        <section v-if="relatedProducts.length > 0" class="related-products-section">
          <div class="section-heading">
            <div>
              <span class="section-kicker">Sigue explorando</span>
              <h2>{{ relatedHeadline }}</h2>
              <p>Productos del mismo universo para comparar o complementar tu compra.</p>
            </div>
            <RouterLink to="/products" class="section-link">Ver catálogo completo</RouterLink>
          </div>

          <div class="related-products-grid">
            <ProductCard
              v-for="relProduct in relatedProducts"
              :key="relProduct.id"
              :product="relProduct"
              @add-to-cart="handleAddToCart"
            />
          </div>
        </section>
      </div>

      <div v-else class="status-panel not-found-panel">
        <p>Producto no encontrado.</p>
        <RouterLink to="/products" class="back-btn">Volver a productos</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, BadgeCheck, Boxes, ShieldCheck } from 'lucide-vue-next'
import ProductDetails from '../components/ProductDetails.vue'
import ProductCard from '../components/ProductCard.vue'
import { googleSheetsAPI } from '../services/googleSheetsAPI'
import { useCartStore } from '../stores/cartStore'
import { useUiStore } from '@/stores/ui'
import { pixelTracking } from '../services/pixelTracking'

const route = useRoute()
const cartStore = useCartStore()
const uiStore = useUiStore()

const products = ref([])
const loading = ref(true)

const product = computed(() => {
  return products.value.find((item) => String(item.id) === String(route.params.id))
})

const breadcrumbLabel = computed(() => product.value?.nombre || 'Cargando detalle')

const relatedProducts = computed(() => {
  if (!product.value) return []

  return products.value
    .filter((item) => item.categoria === product.value.categoria && item.id !== product.value.id)
    .slice(0, 4)
})

const relatedHeadline = computed(() => {
  if (!product.value) {
    return 'Productos relacionados'
  }

  return `Más opciones en ${product.value.categoria}`
})

const introText = computed(() => {
  const description = String(product.value?.descripcion || '').trim()

  if (description) {
    return description
  }

  return 'Revisa disponibilidad, especificaciones y beneficios del producto antes de añadirlo al carrito.'
})

const introMetrics = computed(() => {
  if (!product.value) {
    return []
  }

  const stock = Math.max(0, Number(product.value.stock || 0))

  return [
    {
      label: 'Disponibilidad',
      value: stock > 0 ? `${stock} unidades` : 'Agotado',
      icon: Boxes
    },
    {
      label: 'Precio final',
      value: 'IGV incluido',
      icon: BadgeCheck
    },
    {
      label: 'Respaldo',
      value: 'Soporte ZtarTech',
      icon: ShieldCheck
    }
  ]
})

const reviewBreakdown = [
  { label: '5 estrellas', value: 82 },
  { label: '4 estrellas', value: 13 },
  { label: '3 estrellas', value: 4 },
  { label: '2 estrellas', value: 1 }
]

const customerReviews = [
  {
    name: 'Juan García',
    role: 'Compra verificada',
    date: 'Hace 2 semanas',
    rating: '★★★★★',
    title: 'Rendimiento sólido y buena orientación',
    text: 'La ficha ayuda bastante a decidir y la atención previa fue rápida. El producto llegó como esperaba y sin sorpresas.'
  },
  {
    name: 'María López',
    role: 'Cliente recurrente',
    date: 'Hace 1 mes',
    rating: '★★★★☆',
    title: 'Buen producto, información más clara',
    text: 'Me gustó ver precio final, stock y especificaciones en un solo lugar. La compra fue simple y el envío estuvo bien coordinado.'
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Compra verificada',
    date: 'Hace 1 mes',
    rating: '★★★★★',
    title: 'Exactamente lo que necesitaba',
    text: 'Pude comparar mejor gracias a la ficha. El equipo coincidía con la descripción y el soporte respondió mis dudas antes de pagar.'
  }
]

const handleAddToCart = (data) => {
  if (data?.quantity) {
    pixelTracking.trackAddToCart(data.product, data.quantity)
    uiStore.success(`Producto añadido al carrito: ${data.product.nombre} (x${data.quantity})`)
    return
  }

  if (data) {
    cartStore.addItem(data)
    pixelTracking.trackAddToCart(data, 1)
    uiStore.success(`Producto añadido al carrito: ${data.nombre}`)
  }
}

watch(
  () => product.value,
  (nextProduct, previousProduct) => {
    if (!nextProduct) {
      return
    }

    pixelTracking.trackViewProduct(nextProduct)

    if (previousProduct && nextProduct.id !== previousProduct.id) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
)

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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 22px 18px 70px;
  background:
    radial-gradient(circle at top left, rgba(77, 184, 255, 0.18), transparent 22%),
    radial-gradient(circle at top right, rgba(18, 57, 105, 0.12), transparent 24%),
    linear-gradient(180deg, #f5f8fd 0%, #ebf2fb 100%);
}

.ambient-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(4px);
  opacity: 0.55;
  pointer-events: none;
}

.ambient-orb--left {
  width: 320px;
  height: 320px;
  top: 160px;
  left: -120px;
  background: radial-gradient(circle, rgba(77, 184, 255, 0.2) 0%, rgba(77, 184, 255, 0) 72%);
}

.ambient-orb--right {
  width: 340px;
  height: 340px;
  top: 40px;
  right: -120px;
  background: radial-gradient(circle, rgba(18, 57, 105, 0.16) 0%, rgba(18, 57, 105, 0) 72%);
}

.page-shell {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 14px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(77, 184, 255, 0.12);
  box-shadow: 0 18px 36px rgba(12, 28, 52, 0.08);
  backdrop-filter: blur(10px);
}

.breadcrumb-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1d68a2;
  text-decoration: none;
  font-weight: 800;
}

.breadcrumb-divider,
.breadcrumb-current {
  color: #74879c;
}

.breadcrumb-current {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-panel {
  display: grid;
  place-items: center;
  min-height: 280px;
  padding: 30px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(77, 184, 255, 0.14);
  box-shadow: 0 24px 46px rgba(12, 28, 52, 0.08);
  color: #5a728d;
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 22px;
  border-radius: 16px;
  background: linear-gradient(135deg, #47aef6 0%, #2e7fd0 100%);
  color: white;
  text-decoration: none;
  font-weight: 800;
  box-shadow: 0 16px 28px rgba(71, 174, 246, 0.28);
}

.content {
  display: grid;
  gap: 18px;
}

.intro-band,
.reviews-lounge,
.related-products-section {
  padding: 24px;
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 249, 255, 0.96) 100%);
  border: 1px solid rgba(77, 184, 255, 0.14);
  box-shadow:
    0 24px 52px rgba(12, 28, 52, 0.1),
    0 8px 24px rgba(12, 28, 52, 0.05);
}

.intro-band {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 20px;
  align-items: end;
}

.intro-kicker,
.section-kicker {
  display: inline-block;
  margin-bottom: 10px;
  color: #1d68a2;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.intro-copy h2,
.section-heading h2 {
  margin: 0;
  color: #0f2a4f;
  font-size: clamp(1.6rem, 2vw, 2.25rem);
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.intro-copy p,
.section-heading p {
  margin: 12px 0 0;
  color: #5a728d;
  line-height: 1.7;
}

.intro-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  display: grid;
  gap: 6px;
  padding: 16px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(20, 53, 102, 0.04) 0%, rgba(77, 184, 255, 0.09) 100%);
  border: 1px solid rgba(77, 184, 255, 0.12);
}

.metric-icon {
  color: var(--color-accent);
}

.metric-card strong {
  color: #143566;
  font-size: 1rem;
}

.metric-card span {
  color: #617792;
  font-size: 0.84rem;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-end;
  margin-bottom: 22px;
}

.section-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 14px;
  border: 1px solid rgba(77, 184, 255, 0.18);
  color: #20467e;
  text-decoration: none;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.86);
}

.reviews-grid {
  display: grid;
  grid-template-columns: minmax(300px, 0.92fr) minmax(0, 1.08fr);
  gap: 18px;
}

.reviews-summary-card,
.review-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(77, 184, 255, 0.12);
  box-shadow: 0 16px 30px rgba(12, 28, 52, 0.06);
}

.reviews-summary-card {
  padding: 22px;
  display: grid;
  gap: 20px;
}

.score-block {
  display: grid;
  gap: 8px;
}

.score-label {
  color: #5b728d;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.score-value {
  color: #143566;
  font-size: 4rem;
  line-height: 0.95;
  letter-spacing: -0.08em;
}

.score-block p {
  margin: 0;
  color: #5a728d;
  line-height: 1.65;
}

.rating-bars {
  display: grid;
  gap: 12px;
}

.rating-bar-row {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) 44px;
  gap: 10px;
  align-items: center;
  color: #516883;
  font-size: 0.84rem;
  font-weight: 700;
}

.rating-bar-track {
  height: 10px;
  border-radius: 999px;
  background: rgba(16, 37, 63, 0.08);
  overflow: hidden;
}

.rating-bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, #47aef6 0%, #2e7fd0 100%);
}

.trust-points {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.trust-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(77, 184, 255, 0.12);
  color: #1d68a2;
  font-size: 0.8rem;
  font-weight: 800;
}

.review-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.review-card {
  padding: 20px;
}

.review-card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.reviewer-name {
  margin: 0;
  color: #143566;
  font-size: 0.98rem;
  font-weight: 800;
}

.reviewer-role,
.review-date {
  color: #6d8298;
  font-size: 0.8rem;
}

.review-stars {
  margin-top: 16px;
  color: #1d8fdd;
  letter-spacing: 0.18em;
  font-size: 0.94rem;
}

.review-card h3 {
  margin: 14px 0 8px;
  color: #17365f;
  font-size: 1rem;
  line-height: 1.35;
}

.review-card p {
  margin: 0;
  color: #5a728d;
  line-height: 1.7;
  font-size: 0.92rem;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 1080px) {
  .intro-band,
  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .review-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 14px 12px 42px;
  }

  .intro-band,
  .reviews-lounge,
  .related-products-section {
    padding: 18px;
    border-radius: 24px;
  }

  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .intro-metrics {
    grid-template-columns: 1fr;
  }

  .related-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 18px;
  }
}

@media (max-width: 520px) {
  .breadcrumb {
    gap: 8px;
    padding: 12px 14px;
    font-size: 0.9rem;
  }

  .breadcrumb-current {
    max-width: 52vw;
  }

  .intro-band,
  .reviews-lounge,
  .related-products-section,
  .status-panel {
    padding: 16px;
    border-radius: 22px;
  }

  .score-value {
    font-size: 3.2rem;
  }

  .rating-bar-row {
    grid-template-columns: 78px minmax(0, 1fr) 38px;
    font-size: 0.78rem;
  }

  .related-products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
