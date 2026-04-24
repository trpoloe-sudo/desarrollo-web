<template>
  <section class="product-details">
    <div class="details-container">
      <div class="media-column">
        <div class="gallery-card">
          <div class="gallery-surface">
            <div class="gallery-halo gallery-halo--primary"></div>
            <div class="gallery-halo gallery-halo--secondary"></div>

            <div class="gallery-topbar">
              <span class="category-pill">{{ categoryLabel }}</span>
              <button
                type="button"
                :class="['favorite-fab', { active: isFavorite }]"
                :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
                @click="toggleFavorite"
              >
                <Heart :fill="isFavorite ? 'currentColor' : 'none'" size="18" />
              </button>
            </div>

            <div class="image-stage">
              <img :src="selectedImage" :alt="product.nombre" class="main-image" />
            </div>

            <div class="gallery-footer">
              <span class="gallery-note">Imagen referencial</span>
              <span :class="['gallery-note', 'gallery-note--accent', `gallery-note--${availabilityMeta.tone}`]">
                {{ availabilityMeta.caption }}
              </span>
            </div>
          </div>

          <div v-if="galleryImages.length > 1" class="thumb-row">
            <button
              v-for="(image, index) in galleryImages"
              :key="`${image}-${index}`"
              type="button"
              :class="['thumb-btn', { active: image === selectedImage }]"
              :aria-label="`Vista ${index + 1}`"
              @click="selectedImage = image"
            >
              <img :src="image" :alt="`Vista ${index + 1} de ${product.nombre}`" />
            </button>
          </div>
        </div>

        <div class="benefits-grid">
          <article
            v-for="benefit in serviceBenefits"
            :key="benefit.key"
            class="benefit-card"
          >
            <component :is="benefit.icon" class="benefit-icon" size="18" />
            <div>
              <p class="benefit-title">{{ benefit.title }}</p>
              <p class="benefit-copy">{{ benefit.copy }}</p>
            </div>
          </article>
        </div>
      </div>

      <div class="details-column">
        <div class="headline-card">
          <div class="headline-top">
            <div class="meta-chip-row">
              <span class="meta-chip">{{ categoryLabel }}</span>
              <span class="meta-chip meta-chip--soft">Código {{ productCode }}</span>
            </div>
            <div class="rating-pill">
              <Star class="rating-icon" size="16" />
              <span>4.9</span>
              <small>125 reseñas</small>
            </div>
          </div>

          <h1 class="product-title">{{ product.nombre }}</h1>

          <p class="support-copy">
            Venta, asesoría y seguimiento con el equipo de ZtarTech para ayudarte a validar
            compatibilidad, stock y despacho antes de comprar.
          </p>

          <div class="description-card">
            <h2>Resumen del producto</h2>
            <ExpandableText :text="product.descripcion" :maxLines="4" />
          </div>

          <div v-if="featureHighlights.length > 0" class="highlight-grid">
            <article
              v-for="(highlight, index) in featureHighlights"
              :key="`${product.id}-highlight-${index}`"
              class="highlight-card"
            >
              <BadgeCheck class="highlight-icon" size="16" />
              <span>{{ highlight }}</span>
            </article>
          </div>
        </div>

        <div class="purchase-card">
          <div class="purchase-top">
            <div class="price-stack">
              <span class="price-kicker">Precio final</span>
              <p class="price-line">
                <span class="currency">$</span>
                <span class="amount">{{ formattedPrice }}</span>
              </p>
              <p class="price-note">IGV incluido. No se agregan cargos extra en el carrito.</p>
            </div>

            <div :class="['availability-box', `availability-box--${availabilityMeta.tone}`]">
              <span class="availability-label">{{ availabilityMeta.label }}</span>
              <strong>{{ availabilityMeta.short }}</strong>
            </div>
          </div>

          <div class="service-strip">
            <span class="service-pill">
              <Sparkles size="14" />
              Compra asistida
            </span>
            <span class="service-pill">
              <PackageCheck size="14" />
              Stock verificado
            </span>
            <span class="service-pill">
              <ShieldCheck size="14" />
              Soporte postventa
            </span>
          </div>

          <div class="purchase-actions">
            <div class="quantity-card">
              <span class="quantity-label">Cantidad</span>
              <div class="quantity-selector">
                <button type="button" @click="decrementQuantity" :disabled="quantity <= 1">-</button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="maxQuantity"
                >
                <button type="button" @click="incrementQuantity" :disabled="quantity >= maxQuantity">+</button>
              </div>
            </div>

            <button
              v-if="product.stock > 0"
              type="button"
              class="add-to-cart-btn"
              @click="addToCart"
            >
              <ShoppingCart size="18" />
              <span>Añadir al carrito</span>
            </button>
            <button v-else type="button" class="add-to-cart-btn add-to-cart-btn--disabled" disabled>
              <span>Agotado</span>
            </button>

            <button
              type="button"
              :class="['favorite-action', { active: isFavorite }]"
              @click="toggleFavorite"
            >
              <Heart size="18" :fill="isFavorite ? 'currentColor' : 'none'" />
              <span>{{ isFavorite ? 'Guardado en favoritos' : 'Guardar en favoritos' }}</span>
            </button>
          </div>
        </div>

        <div class="spec-card">
          <ExpandableSpecs :specs="product.especificaciones" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  BadgeCheck,
  Heart,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  RotateCcw,
  CreditCard,
  Truck
} from 'lucide-vue-next'
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cartStore'
import ExpandableSpecs from './ExpandableSpecs.vue'
import ExpandableText from './ExpandableText.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart', 'toggle-favorite'])
const quantity = ref(1)
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const selectedImage = ref(props.product.imagen_url)

const isFavorite = computed(() => favoritesStore.isFavorite(props.product.id))
const categoryLabel = computed(() => String(props.product.categoria || 'General').trim().toUpperCase())
const formattedPrice = computed(() => Number(props.product.precio || 0).toFixed(2))
const maxQuantity = computed(() => Math.max(1, Number(props.product.stock || 0)))
const productCode = computed(() => {
  const parsedId = Number(props.product.id)
  if (Number.isFinite(parsedId)) {
    return `ZT-${String(parsedId).padStart(4, '0')}`
  }

  return `ZT-${String(props.product.id || 'SKU').toUpperCase()}`
})

const galleryImages = computed(() => {
  const list = Array.isArray(props.product.imagenes) ? props.product.imagenes : []
  const main = props.product.imagen_url ? [props.product.imagen_url] : []
  const merged = [...main, ...list].filter(Boolean)
  return Array.from(new Set(merged))
})

const availabilityMeta = computed(() => {
  const stock = Math.max(0, Number(props.product.stock || 0))

  if (stock === 0) {
    return {
      tone: 'danger',
      label: 'Agotado',
      short: 'Sin stock',
      caption: 'Podemos ayudarte a buscar una alternativa.'
    }
  }

  if (stock <= 5) {
    return {
      tone: 'warning',
      label: 'Últimas unidades',
      short: `${stock} disponible${stock === 1 ? '' : 's'}`,
      caption: 'Stock limitado con confirmación rápida.'
    }
  }

  return {
    tone: 'success',
    label: 'Disponible',
    short: `${stock} unidades`,
    caption: 'Listo para coordinar despacho.'
  }
})

const serviceBenefits = computed(() => [
  {
    key: 'shipping',
    icon: Truck,
    title: 'Entrega coordinada',
    copy: 'Despacho sujeto a stock y validación de cobertura.'
  },
  {
    key: 'returns',
    icon: RotateCcw,
    title: 'Compra acompañada',
    copy: 'Te orientamos antes de cerrar la compra si tienes dudas.'
  },
  {
    key: 'warranty',
    icon: ShieldCheck,
    title: 'Garantía y soporte',
    copy: 'Atención postventa para seguimiento y consultas.'
  },
  {
    key: 'payment',
    icon: CreditCard,
    title: 'Pago seguro',
    copy: 'Coordinación por canales oficiales de la tienda.'
  }
])

const normalizeHighlight = (value) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/^[•\-–\s:]+/, '')
    .trim()

const extractHighlights = (value) =>
  String(value || '')
    .split(/\r?\n|•|▪|●|;(?=\s*[A-Za-zÁÉÍÓÚÑ0-9])/)
    .map(normalizeHighlight)
    .filter((line) => line.length >= 14)

const featureHighlights = computed(() => {
  const mergedHighlights = [
    ...extractHighlights(props.product.especificaciones),
    ...extractHighlights(props.product.descripcion)
  ]

  return Array.from(new Set(mergedHighlights)).slice(0, 4)
})

watch(
  () => props.product.id,
  () => {
    selectedImage.value = props.product.imagen_url
    quantity.value = 1
  }
)

watch(quantity, (nextValue) => {
  const numericValue = Math.trunc(Number(nextValue) || 1)
  const clampedValue = Math.min(Math.max(numericValue, 1), maxQuantity.value)

  if (numericValue !== clampedValue) {
    quantity.value = clampedValue
  }
})

const incrementQuantity = () => {
  quantity.value = Math.min(quantity.value + 1, maxQuantity.value)
}

const decrementQuantity = () => {
  quantity.value = Math.max(quantity.value - 1, 1)
}

const addToCart = () => {
  cartStore.addItem(props.product, quantity.value)
  emit('add-to-cart', { product: props.product, quantity: quantity.value })
  quantity.value = 1
}

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.product.id)
  emit('toggle-favorite', props.product.id)
}
</script>

<style scoped>
.product-details {
  position: relative;
}

.details-container {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  gap: 28px;
  align-items: start;
}

.media-column,
.details-column {
  display: grid;
  gap: 20px;
}

.gallery-card,
.headline-card,
.purchase-card,
.spec-card {
  position: relative;
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 249, 255, 0.96) 100%);
  border: 1px solid rgba(77, 184, 255, 0.14);
  box-shadow:
    0 24px 52px rgba(12, 28, 52, 0.1),
    0 8px 24px rgba(12, 28, 52, 0.05);
}

.gallery-card,
.headline-card,
.purchase-card,
.spec-card,
.benefit-card {
  overflow: hidden;
}

.gallery-card {
  padding: 18px;
}

.gallery-surface {
  position: relative;
  min-height: 560px;
  border-radius: 24px;
  padding: 18px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(84, 184, 251, 0.28), transparent 34%),
    radial-gradient(circle at bottom right, rgba(18, 57, 105, 0.18), transparent 34%),
    linear-gradient(180deg, #f7fbff 0%, #eef5fd 100%);
  border: 1px solid rgba(77, 184, 255, 0.12);
}

.gallery-halo {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  opacity: 0.9;
}

.gallery-halo--primary {
  width: 210px;
  height: 210px;
  top: -52px;
  right: -56px;
  background: radial-gradient(circle, rgba(84, 184, 251, 0.34) 0%, rgba(84, 184, 251, 0) 72%);
}

.gallery-halo--secondary {
  width: 220px;
  height: 220px;
  left: -72px;
  bottom: -88px;
  background: radial-gradient(circle, rgba(18, 57, 105, 0.2) 0%, rgba(18, 57, 105, 0) 70%);
}

.gallery-topbar,
.gallery-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.gallery-footer {
  flex-wrap: wrap;
}

.category-pill,
.gallery-note,
.meta-chip,
.service-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.category-pill {
  background: linear-gradient(135deg, #153970 0%, #2a5298 100%);
  color: white;
  box-shadow: 0 14px 26px rgba(21, 57, 112, 0.22);
}

.favorite-fab {
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-accent);
  box-shadow: 0 14px 28px rgba(12, 28, 52, 0.14);
  backdrop-filter: blur(10px);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.favorite-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(12, 28, 52, 0.18);
}

.favorite-fab.active {
  color: #f06595;
}

.image-stage {
  position: relative;
  z-index: 1;
  min-height: 430px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 18px;
}

.image-stage::after {
  content: '';
  position: absolute;
  inset: auto 14% 26px;
  height: 22px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(14, 33, 58, 0.18) 0%, rgba(14, 33, 58, 0.04) 66%, transparent 82%);
  filter: blur(10px);
}

.main-image {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  max-height: 400px;
  object-fit: contain;
  filter: drop-shadow(0 26px 34px rgba(15, 29, 50, 0.18));
  transition: transform 0.35s ease, filter 0.35s ease;
}

.gallery-card:hover .main-image {
  transform: scale(1.04);
  filter: drop-shadow(0 30px 40px rgba(15, 29, 50, 0.22));
}

.gallery-note {
  background: rgba(16, 37, 63, 0.06);
  color: #50657f;
}

.gallery-note--accent {
  letter-spacing: 0;
}

.gallery-note--success {
  background: rgba(39, 174, 96, 0.12);
  color: #1f9d58;
}

.gallery-note--warning {
  background: rgba(243, 156, 18, 0.16);
  color: #b87905;
}

.gallery-note--danger {
  background: rgba(231, 76, 60, 0.12);
  color: #cf4638;
}

.thumb-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.thumb-btn {
  width: 76px;
  height: 76px;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid rgba(77, 184, 255, 0.2);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 24px rgba(12, 28, 52, 0.08);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.thumb-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(77, 184, 255, 0.4);
  box-shadow: 0 16px 28px rgba(12, 28, 52, 0.1);
}

.thumb-btn.active {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(77, 184, 255, 0.16);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.benefit-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 18px 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(77, 184, 255, 0.12);
  box-shadow: 0 16px 30px rgba(12, 28, 52, 0.08);
}

.benefit-icon {
  flex-shrink: 0;
  color: var(--color-accent);
}

.benefit-title {
  margin: 0;
  color: #17365f;
  font-weight: 800;
  font-size: 0.95rem;
}

.benefit-copy {
  margin: 6px 0 0;
  color: #68809a;
  font-size: 0.84rem;
  line-height: 1.55;
}

.details-column {
  align-content: start;
}

.headline-card,
.purchase-card,
.spec-card {
  padding: 24px;
}

.headline-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.meta-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.meta-chip {
  background: rgba(16, 37, 63, 0.06);
  color: #31455f;
}

.meta-chip--soft {
  color: #56708e;
}

.rating-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(77, 184, 255, 0.14);
  color: #1a6faa;
  font-weight: 800;
  white-space: nowrap;
}

.rating-pill small {
  color: #4c7ca3;
  font-size: 0.76rem;
  font-weight: 700;
}

.rating-icon {
  fill: currentColor;
}

.product-title {
  margin: 18px 0 10px;
  color: #0f2a4f;
  font-size: clamp(2rem, 3vw, 3.2rem);
  line-height: 1.12;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.support-copy {
  margin: 0;
  color: #59718d;
  font-size: 1rem;
  line-height: 1.7;
}

.description-card {
  margin-top: 22px;
  padding: 18px 18px 14px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(20, 53, 102, 0.04) 0%, rgba(77, 184, 255, 0.08) 100%);
  border: 1px solid rgba(77, 184, 255, 0.12);
}

.description-card h2 {
  margin: 0 0 10px;
  color: #17365f;
  font-size: 0.96rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.highlight-card {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(77, 184, 255, 0.12);
}

.highlight-icon {
  flex-shrink: 0;
  color: var(--color-accent);
  margin-top: 2px;
}

.highlight-card span {
  color: #445a74;
  font-size: 0.92rem;
  line-height: 1.55;
}

.purchase-card {
  background:
    radial-gradient(circle at top right, rgba(77, 184, 255, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(18, 57, 105, 0.04) 0%, rgba(77, 184, 255, 0.12) 100%);
}

.purchase-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.price-stack {
  display: grid;
  gap: 6px;
}

.price-kicker {
  color: #56708e;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.price-line {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--danger-color);
}

.currency {
  font-size: 1.15rem;
  font-weight: 900;
}

.amount {
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: -0.06em;
}

.price-note {
  margin: 0;
  color: #58718e;
  font-size: 0.92rem;
  line-height: 1.55;
}

.availability-box {
  display: grid;
  gap: 6px;
  min-width: 170px;
  padding: 14px 16px;
  border-radius: 18px;
  text-align: right;
}

.availability-label {
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.availability-box strong {
  font-size: 1rem;
  line-height: 1.3;
}

.availability-box--success {
  background: rgba(39, 174, 96, 0.12);
  color: #1f9d58;
}

.availability-box--warning {
  background: rgba(243, 156, 18, 0.16);
  color: #b87905;
}

.availability-box--danger {
  background: rgba(231, 76, 60, 0.12);
  color: #cf4638;
}

.service-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.service-pill {
  background: rgba(255, 255, 255, 0.8);
  color: #375271;
  border: 1px solid rgba(77, 184, 255, 0.14);
}

.purchase-actions {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.22fr);
  gap: 12px;
  margin-top: 20px;
}

.quantity-card {
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(77, 184, 255, 0.12);
}

.quantity-label {
  color: #5b728d;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.quantity-selector {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(77, 184, 255, 0.18);
}

.quantity-selector button,
.quantity-selector input {
  height: 46px;
  border: none;
  background: white;
}

.quantity-selector button {
  color: #215189;
  font-size: 1.2rem;
  font-weight: 900;
  transition: background 0.2s ease;
}

.quantity-selector button:hover:not(:disabled) {
  background: rgba(77, 184, 255, 0.08);
}

.quantity-selector button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.quantity-selector input {
  width: 100%;
  text-align: center;
  color: #143566;
  font-size: 1rem;
  font-weight: 800;
}

.quantity-selector input:focus {
  outline: none;
}

.add-to-cart-btn,
.favorite-action {
  min-height: 58px;
  padding: 0 18px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 900;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.add-to-cart-btn {
  border: none;
  background: linear-gradient(135deg, #47aef6 0%, #2e7fd0 100%);
  color: white;
  box-shadow: 0 18px 34px rgba(71, 174, 246, 0.28);
}

.add-to-cart-btn:hover:not(.add-to-cart-btn--disabled) {
  transform: translateY(-2px);
  box-shadow: 0 22px 38px rgba(71, 174, 246, 0.34);
}

.add-to-cart-btn--disabled {
  background: linear-gradient(135deg, #c4ccd7 0%, #aab5c2 100%);
  box-shadow: none;
  cursor: not-allowed;
}

.favorite-action {
  grid-column: 1 / -1;
  border: 1px solid rgba(77, 184, 255, 0.18);
  background: rgba(255, 255, 255, 0.92);
  color: #20467e;
}

.favorite-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(12, 28, 52, 0.08);
}

.favorite-action.active {
  background: linear-gradient(135deg, rgba(240, 101, 149, 0.12) 0%, rgba(240, 101, 149, 0.2) 100%);
  color: #c94377;
  border-color: rgba(240, 101, 149, 0.26);
}

.spec-card :deep(.specs-header) {
  margin-bottom: 12px;
}

.spec-card :deep(.specs-header h3) {
  color: #17365f;
  font-size: 0.96rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.description-card :deep(.text-content),
.spec-card :deep(.specs-text) {
  color: #5a728e;
  font-size: 0.96rem;
  line-height: 1.75;
}

.description-card :deep(.text-content.collapsed::after),
.spec-card :deep(.specs-text.collapsed::after) {
  background: linear-gradient(to bottom, rgba(247, 250, 255, 0) 0%, rgba(247, 250, 255, 0.85) 68%, rgba(247, 250, 255, 1) 100%);
}

.description-card :deep(.expand-btn),
.spec-card :deep(.expand-btn) {
  margin-top: 10px;
  font-size: 0.82rem;
  font-weight: 800;
}

@media (max-width: 1080px) {
  .details-container {
    grid-template-columns: 1fr;
  }

  .gallery-surface {
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .gallery-card,
  .headline-card,
  .purchase-card,
  .spec-card {
    border-radius: 24px;
  }

  .gallery-surface {
    min-height: 420px;
    border-radius: 22px;
  }

  .image-stage {
    min-height: 320px;
  }

  .benefits-grid,
  .highlight-grid,
  .purchase-actions {
    grid-template-columns: 1fr;
  }

  .purchase-top,
  .headline-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .availability-box {
    width: 100%;
    text-align: left;
  }
}

@media (max-width: 560px) {
  .gallery-card,
  .headline-card,
  .purchase-card,
  .spec-card {
    padding: 16px;
  }

  .gallery-surface {
    min-height: 340px;
    padding: 14px;
  }

  .image-stage {
    min-height: 250px;
    padding: 18px 10px;
  }

  .main-image {
    max-height: 240px;
  }

  .thumb-btn {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }

  .product-title {
    font-size: 1.85rem;
  }

  .amount {
    font-size: 2.4rem;
  }
}
</style>
