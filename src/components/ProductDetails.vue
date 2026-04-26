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
              <ProductImage
                :src="product.imagen_url"
                :alt="product.nombre"
                loading="eager"
                class="product-image-display"
              />
            </div>

            <div class="gallery-footer">
              <span class="gallery-note">Vista referencial</span>
              <span :class="['gallery-note', 'gallery-note--accent', `gallery-note--${availabilityMeta.tone}`]">
                {{ availabilityMeta.caption }}
              </span>
            </div>
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
            <ExpandableText :text="product.descripcion" :maxLines="3" />
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
          <div class="buy-header">
            <div class="meta-chip-row">
              <span class="meta-chip">{{ categoryLabel }}</span>
              <span class="meta-chip meta-chip--soft">Codigo {{ productCode }}</span>
            </div>
            <div class="rating-pill">
              <Star class="rating-icon" size="16" />
              <span>4.9</span>
              <small>125 reseñas</small>
            </div>
          </div>

          <h1 class="product-title product-title--purchase">{{ product.nombre }}</h1>

          <p class="support-copy support-copy--compact">
            Venta, asesoria y seguimiento para validar compatibilidad, stock y despacho antes de comprar.
          </p>

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
import ProductImage from './ProductImage.vue'

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
  grid-template-columns: minmax(360px, 0.9fr) minmax(420px, 1.1fr);
  gap: 18px;
  align-items: start;
}

.media-column,
.details-column {
  display: grid;
  gap: 14px;
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
  padding: 12px;
}

.gallery-surface {
  position: relative;
  min-height: 430px;
  border-radius: 20px;
  padding: 14px;
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
  min-height: 30px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
}

.category-pill {
  background: linear-gradient(135deg, #153970 0%, #2a5298 100%);
  color: white;
  box-shadow: 0 14px 26px rgba(21, 57, 112, 0.22);
}

.favorite-fab {
  width: 40px;
  height: 40px;
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
  min-height: 315px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 12px;
}

.image-stage::after {
  content: '';
  position: absolute;
  inset: auto 14% 18px;
  height: 16px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(14, 33, 58, 0.18) 0%, rgba(14, 33, 58, 0.04) 66%, transparent 82%);
  filter: blur(10px);
}

.product-image-display {
  position: relative;
  z-index: 1;
  width: min(70%, 300px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 28px;
  background:
    radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.9), transparent 38%),
    linear-gradient(150deg, rgba(255, 255, 255, 0.82), rgba(77, 184, 255, 0.14));
  border: 1px solid rgba(77, 184, 255, 0.16);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.74),
    0 20px 36px rgba(12, 28, 52, 0.12);
  filter: drop-shadow(0 18px 24px rgba(15, 29, 50, 0.16));
  transition: transform 0.35s ease, filter 0.35s ease, box-shadow 0.35s ease;
}

.product-image-display :deep(.remote-image) {
  padding: 10px;
}

.gallery-card:hover .product-image-display {
  transform: scale(1.04);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 32px 56px rgba(12, 28, 52, 0.18);
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

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.benefit-card {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  padding: 12px;
  border-radius: 16px;
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
  font-size: 0.84rem;
}

.benefit-copy {
  margin: 3px 0 0;
  color: #68809a;
  font-size: 0.75rem;
  line-height: 1.35;
}

.details-column {
  align-content: start;
}

.details-column .purchase-card {
  order: 1;
}

.details-column .headline-card {
  order: 2;
}

.details-column .spec-card {
  order: 3;
}

.headline-card,
.purchase-card,
.spec-card {
  padding: 18px;
}

.headline-top,
.headline-card > .product-title,
.headline-card > .support-copy {
  display: none;
}

.buy-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.meta-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
  gap: 6px;
  min-height: 34px;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(77, 184, 255, 0.14);
  color: #1a6faa;
  font-weight: 800;
  white-space: nowrap;
}

.rating-pill small {
  color: #4c7ca3;
  font-size: 0.72rem;
  font-weight: 700;
}

.rating-icon {
  fill: currentColor;
}

.product-title {
  margin: 12px 0 8px;
  color: #0f2a4f;
  font-size: clamp(1.65rem, 2.25vw, 2.45rem);
  line-height: 1.04;
  font-weight: 900;
  letter-spacing: 0;
}

.support-copy {
  margin: 0;
  color: #59718d;
  font-size: 0.9rem;
  line-height: 1.45;
}

.support-copy--compact {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description-card {
  padding: 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(20, 53, 102, 0.04) 0%, rgba(77, 184, 255, 0.08) 100%);
  border: 1px solid rgba(77, 184, 255, 0.12);
}

.description-card h2 {
  margin: 0 0 8px;
  color: #17365f;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.highlight-card {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 14px;
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
  font-size: 0.82rem;
  line-height: 1.35;
}

.purchase-card {
  background:
    radial-gradient(circle at top right, rgba(77, 184, 255, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(18, 57, 105, 0.04) 0%, rgba(77, 184, 255, 0.12) 100%);
  border-color: rgba(77, 184, 255, 0.28);
}

.purchase-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-top: 14px;
}

.price-stack {
  display: grid;
  gap: 4px;
}

.price-kicker {
  color: #56708e;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}

.price-line {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--danger-color);
}

.currency {
  font-size: 1rem;
  font-weight: 900;
}

.amount {
  font-size: clamp(2.25rem, 4.2vw, 3.25rem);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: 0;
}

.price-note {
  margin: 0;
  color: #58718e;
  font-size: 0.8rem;
  line-height: 1.35;
}

.availability-box {
  display: grid;
  gap: 4px;
  min-width: 138px;
  padding: 10px 12px;
  border-radius: 14px;
  text-align: right;
}

.availability-label {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}

.availability-box strong {
  font-size: 0.92rem;
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
  gap: 8px;
  margin-top: 12px;
}

.service-pill {
  background: rgba(255, 255, 255, 0.8);
  color: #375271;
  border: 1px solid rgba(77, 184, 255, 0.14);
}

.purchase-actions {
  display: grid;
  grid-template-columns: minmax(118px, 0.62fr) minmax(190px, 1.38fr);
  gap: 10px;
  margin-top: 12px;
}

.quantity-card {
  display: grid;
  gap: 8px;
  padding: 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(77, 184, 255, 0.12);
}

.quantity-label {
  color: #5b728d;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}

.quantity-selector {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 36px;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(77, 184, 255, 0.18);
}

.quantity-selector button,
.quantity-selector input {
  height: 38px;
  border: none;
  background: white;
}

.quantity-selector button {
  color: #215189;
  font-size: 1rem;
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
  font-size: 0.92rem;
  font-weight: 800;
}

.quantity-selector input:focus {
  outline: none;
}

.add-to-cart-btn,
.favorite-action {
  min-height: 50px;
  padding: 0 16px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.95rem;
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
  margin-bottom: 8px;
}

.spec-card :deep(.specs-header h3) {
  color: #17365f;
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.description-card :deep(.text-content),
.spec-card :deep(.specs-text) {
  color: #5a728e;
  font-size: 0.86rem;
  line-height: 1.5;
}

.description-card :deep(.text-content.collapsed::after),
.spec-card :deep(.specs-text.collapsed::after) {
  background: linear-gradient(to bottom, rgba(247, 250, 255, 0) 0%, rgba(247, 250, 255, 0.85) 68%, rgba(247, 250, 255, 1) 100%);
}

.description-card :deep(.expand-btn),
.spec-card :deep(.expand-btn) {
  margin-top: 8px;
  font-size: 0.76rem;
  font-weight: 800;
}

@media (max-width: 1080px) {
  .details-container {
    grid-template-columns: 1fr;
  }

  .gallery-surface {
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .gallery-card,
  .headline-card,
  .purchase-card,
  .spec-card {
    border-radius: 20px;
  }

  .gallery-surface {
    min-height: 360px;
    border-radius: 18px;
  }

  .image-stage {
    min-height: 270px;
  }

  .benefits-grid,
  .highlight-grid,
  .purchase-actions {
    grid-template-columns: 1fr;
  }

  .purchase-top,
  .buy-header {
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
    padding: 12px;
  }

  .gallery-surface {
    min-height: 280px;
    padding: 12px;
  }

  .image-stage {
    min-height: 210px;
    padding: 12px 8px;
  }

  .product-image-display {
    width: min(76%, 210px);
    border-radius: 22px;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .amount {
    font-size: 2.1rem;
  }
}
</style>
