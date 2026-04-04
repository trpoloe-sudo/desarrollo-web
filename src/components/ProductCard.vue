<template>
  <article class="product-card">
    <div class="card-shell">
      <RouterLink :to="productHref" class="card-link" :aria-label="`Ver detalle de ${product.nombre}`">
        <div class="image-stage">
          <div class="image-orbit image-orbit--left"></div>
          <div class="image-orbit image-orbit--right"></div>

          <span class="category-badge">{{ categoryLabel }}</span>

          <button
            type="button"
            @click.prevent="toggleFavorite"
            :class="['favorite-btn', { active: isFavorite }]"
            :aria-label="isFavorite ? `Quitar ${product.nombre} de favoritos` : `Agregar ${product.nombre} a favoritos`"
          >
            <Heart :fill="isFavorite ? 'currentColor' : 'none'" size="18" />
          </button>

          <img :src="product.imagen_url" :alt="product.nombre" class="product-image" />
        </div>

        <div class="product-info">
          <div class="copy-block">
            <h3 class="product-name">{{ product.nombre }}</h3>
            <p class="product-summary">{{ summaryText }}</p>
          </div>

          <div class="meta-row">
            <span class="meta-chip">Ficha tecnica</span>
            <span class="meta-chip meta-chip--accent">{{ stockMeta.caption }}</span>
          </div>

          <div class="pricing-panel">
            <div class="price-stack">
              <span class="price-kicker">Precio</span>
              <p class="price">
                <span class="currency">$</span>
                <span class="amount">{{ formattedPrice }}</span>
              </p>
            </div>

            <div :class="['stock-chip', `stock-chip--${stockMeta.tone}`]">
              <span class="stock-dot"></span>
              {{ stockMeta.label }}
            </div>
          </div>

          <div class="trust-strip" aria-label="Beneficios del producto">
            <span class="trust-item">
              <ShieldCheck size="14" />
              Garantia
            </span>
            <span class="trust-item">
              <Truck size="14" />
              Envio coordinado
            </span>
          </div>
        </div>
      </RouterLink>

      <div class="card-actions">
        <RouterLink :to="productHref" class="detail-btn">
          <span>Ver detalle</span>
          <ArrowUpRight size="15" />
        </RouterLink>

        <button
          v-if="product.stock > 0"
          type="button"
          @click="addToCart"
          class="add-btn"
        >
          <ShoppingCart size="16" />
          <span>Agregar al carrito</span>
        </button>

        <button v-else type="button" disabled class="add-btn add-btn--disabled">
          <Ban size="16" />
          <span>Agotado</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowUpRight, Ban, Heart, ShieldCheck, ShoppingCart, Truck } from 'lucide-vue-next'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])
const favoritesStore = useFavoritesStore()

const productHref = computed(() => `/product/${props.product.id}`)
const isFavorite = computed(() => favoritesStore.isFavorite(props.product.id))
const categoryLabel = computed(() => String(props.product.categoria || 'General').trim().toUpperCase())
const formattedPrice = computed(() => Number(props.product.precio || 0).toFixed(2))
const summaryText = computed(() => {
  const preferredCopy = [props.product.especificaciones, props.product.descripcion]
    .map(value => String(value || '').replace(/\s+/g, ' ').trim())
    .find(Boolean)

  return preferredCopy || 'Detalle tecnico disponible para este producto.'
})

const stockMeta = computed(() => {
  const quantity = Math.max(0, Number(props.product.stock || 0))

  if (quantity === 0) {
    return {
      label: 'Agotado',
      caption: 'Sin unidades disponibles',
      tone: 'danger'
    }
  }

  if (quantity <= 5) {
    return {
      label: 'Pocas unidades',
      caption: `${quantity} unidad${quantity === 1 ? '' : 'es'} restantes`,
      tone: 'warning'
    }
  }

  return {
    label: 'Disponible',
    caption: `${quantity} unidades en stock`,
    tone: 'success'
  }
})

const addToCart = () => {
  emit('add-to-cart', props.product)
}

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.product.id)
}
</script>

<script>
export default {
  name: 'ProductCard'
}
</script>

<style scoped>
.product-card {
  height: 100%;
}

.card-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 22px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 255, 0.98) 100%);
  border: 1px solid rgba(77, 184, 255, 0.14);
  box-shadow:
    0 16px 36px rgba(12, 28, 52, 0.08),
    0 3px 10px rgba(12, 28, 52, 0.06);
  transition:
    transform 0.32s ease,
    box-shadow 0.32s ease,
    border-color 0.32s ease;
}

.card-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(77, 184, 255, 0.5), rgba(30, 60, 114, 0), rgba(77, 184, 255, 0.35));
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card-shell:hover {
  transform: translateY(-10px);
  border-color: rgba(77, 184, 255, 0.25);
  box-shadow:
    0 24px 46px rgba(12, 28, 52, 0.14),
    0 6px 18px rgba(12, 28, 52, 0.08);
}

.card-shell:hover::before {
  opacity: 1;
}

.card-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  color: inherit;
  text-decoration: none;
}

.image-stage {
  position: relative;
  min-height: 250px;
  padding: 18px 18px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(77, 184, 255, 0.2), transparent 44%),
    radial-gradient(circle at bottom right, rgba(30, 60, 114, 0.12), transparent 36%),
    linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%);
}

.image-stage::after {
  content: '';
  position: absolute;
  inset: auto 20px 18px;
  height: 14px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(12, 28, 52, 0.18) 0%, rgba(12, 28, 52, 0.04) 62%, transparent 80%);
  filter: blur(8px);
  transform: scaleX(0.86);
}

.image-orbit {
  position: absolute;
  border-radius: 999px;
  filter: blur(1px);
  opacity: 0.75;
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.image-orbit--left {
  width: 140px;
  height: 140px;
  top: 18px;
  left: -26px;
  background: radial-gradient(circle, rgba(77, 184, 255, 0.25) 0%, rgba(77, 184, 255, 0) 74%);
}

.image-orbit--right {
  width: 180px;
  height: 180px;
  right: -50px;
  bottom: -18px;
  background: radial-gradient(circle, rgba(30, 60, 114, 0.16) 0%, rgba(30, 60, 114, 0) 74%);
}

.card-shell:hover .image-orbit--left {
  transform: translate(10px, -8px) scale(1.05);
}

.card-shell:hover .image-orbit--right {
  transform: translate(-8px, 10px) scale(1.05);
}

.product-image {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 248px;
  max-height: 228px;
  object-fit: contain;
  filter: drop-shadow(0 20px 26px rgba(15, 29, 50, 0.16));
  transition: transform 0.35s ease, filter 0.35s ease;
}

.card-shell:hover .product-image {
  transform: scale(1.05);
  filter: drop-shadow(0 24px 30px rgba(15, 29, 50, 0.2));
}

.category-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  max-width: calc(100% - 72px);
  padding: 8px 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #153970 0%, #2a5298 100%);
  color: white;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  box-shadow: 0 10px 20px rgba(21, 57, 112, 0.24);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  color: var(--color-accent);
  box-shadow: 0 10px 24px rgba(16, 37, 63, 0.14);
  backdrop-filter: blur(10px);
}

.favorite-btn:hover {
  transform: translateY(-2px) scale(1.04);
  background: rgba(255, 255, 255, 0.96);
}

.favorite-btn.active {
  color: #f06595;
}

.product-info {
  padding: 18px 18px 8px;
  display: grid;
  gap: 14px;
}

.copy-block {
  display: grid;
  gap: 10px;
}

.product-name {
  margin: 0;
  min-height: calc(1.24em * 2);
  color: #143566;
  font-size: 1.18rem;
  line-height: 1.24;
  font-weight: 800;
  letter-spacing: -0.03em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-summary {
  margin: 0;
  min-height: calc(1.5em * 2);
  color: var(--color-text-light);
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(16, 37, 63, 0.06);
  color: #31455f;
  font-size: 0.77rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.meta-chip--accent {
  background: rgba(77, 184, 255, 0.14);
  color: #1a6faa;
}

.pricing-panel {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 14px 12px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(20, 53, 102, 0.04) 0%, rgba(77, 184, 255, 0.09) 100%);
  border: 1px solid rgba(77, 184, 255, 0.14);
}

.price-stack {
  display: grid;
  gap: 4px;
}

.price-kicker {
  color: #56708e;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.price {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 2px;
  color: var(--danger-color);
}

.currency {
  font-size: 1.02rem;
  font-weight: 800;
  opacity: 0.9;
}

.amount {
  font-size: 2rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.stock-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 800;
  white-space: nowrap;
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 18%, transparent);
}

.stock-chip--success {
  background: rgba(39, 174, 96, 0.12);
  color: #1f9d58;
}

.stock-chip--warning {
  background: rgba(243, 156, 18, 0.14);
  color: #b87905;
}

.stock-chip--danger {
  background: rgba(231, 76, 60, 0.12);
  color: #cf4638;
}

.trust-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 30px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(16, 37, 63, 0.05);
  color: #48617d;
  font-size: 0.78rem;
  font-weight: 700;
}

.card-actions {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 10px;
  padding: 0 18px 18px;
}

.detail-btn,
.add-btn {
  min-height: 50px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

.detail-btn {
  border: 1px solid rgba(77, 184, 255, 0.2);
  background: rgba(255, 255, 255, 0.94);
  color: #20467e;
  text-decoration: none;
}

.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(16, 37, 63, 0.1);
  border-color: rgba(77, 184, 255, 0.32);
}

.add-btn {
  border: none;
  background: linear-gradient(135deg, #47aef6 0%, #2e7fd0 100%);
  color: white;
  box-shadow: 0 14px 24px rgba(71, 174, 246, 0.26);
}

.add-btn:hover:not(.add-btn--disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 28px rgba(71, 174, 246, 0.34);
  background: linear-gradient(135deg, #54b8fb 0%, #2571bf 100%);
}

.add-btn--disabled {
  background: linear-gradient(135deg, #c4ccd7 0%, #aab5c2 100%);
  color: #eef2f6;
  box-shadow: none;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .image-stage {
    min-height: 230px;
  }

  .product-name {
    font-size: 1.05rem;
  }

  .amount {
    font-size: 1.72rem;
  }

  .card-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .card-shell {
    border-radius: 18px;
  }

  .image-stage {
    min-height: 150px;
    padding: 12px 12px 4px;
  }

  .image-stage::after {
    inset: auto 14px 12px;
    height: 10px;
  }

  .product-image {
    max-width: 132px;
    max-height: 124px;
  }

  .category-badge {
    top: 10px;
    left: 10px;
    max-width: calc(100% - 54px);
    padding: 5px 8px;
    font-size: 9px;
  }

  .favorite-btn {
    top: 10px;
    right: 10px;
    width: 34px;
    height: 34px;
  }

  .product-info {
    padding: 12px 12px 6px;
    gap: 10px;
  }

  .copy-block {
    gap: 6px;
  }

  .product-name {
    min-height: calc(1.18em * 2);
    font-size: 0.94rem;
    line-height: 1.18;
  }

  .product-summary {
    min-height: 0;
    font-size: 0.78rem;
    line-height: 1.4;
  }

  .meta-row,
  .trust-strip {
    display: none;
  }

  .pricing-panel {
    align-items: flex-start;
    gap: 8px;
    padding: 10px;
    border-radius: 14px;
    flex-direction: column;
  }

  .price-kicker {
    font-size: 0.63rem;
  }

  .amount {
    font-size: 1.42rem;
  }

  .stock-chip {
    padding: 7px 9px;
    font-size: 0.72rem;
  }

  .card-actions {
    padding: 0 12px 12px;
    gap: 8px;
  }

  .detail-btn,
  .add-btn {
    min-height: 42px;
    padding: 0 10px;
    font-size: 0.8rem;
    gap: 6px;
    border-radius: 12px;
  }
}
</style>
