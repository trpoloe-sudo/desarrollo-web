<template>
  <div class="product-details">
    <div class="details-container">
      <div class="details-image-section">
        <div class="image-frame">
          <div class="image-glow"></div>
          <div class="main-image">
            <img :src="selectedImage" :alt="product.nombre" />
          </div>
        </div>
        <div class="thumbs">
          <button
            v-for="(image, index) in galleryImages"
            :key="`${image}-${index}`"
            :class="['thumb', { active: image === selectedImage }]"
            @click="selectedImage = image"
            type="button"
            aria-label="Cambiar imagen"
          >
            <img :src="image" :alt="`Vista ${index + 1}`" />
          </button>
        </div>
        <div class="image-meta">
          <span class="meta-chip">Imagen referencial</span>
          <span class="meta-chip accent">Alta disponibilidad</span>
        </div>
      </div>

      <div class="details-info-section">
        <div class="top-row">
          <div class="category-tag">{{ product.categoria }}</div>
          <div class="rating-section">
            <div class="stars">★★★★★</div>
            <span class="rating-text">(125 opiniones)</span>
          </div>
        </div>

        <h1 class="product-title">{{ product.nombre }}</h1>

        <div class="product-description-section">
          <ExpandableText :text="product.descripcion" :maxLines="3" />
        </div>

        <div class="price-card">
          <div class="price">
            <span class="currency">$</span>
            <span class="amount">{{ product.precio.toFixed(2) }}</span>
          </div>
          <div class="stock-info" :class="{ 'in-stock': product.stock > 0, 'out-of-stock': product.stock === 0 }">
            {{ product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado' }}
          </div>
          <div class="delivery-note">Envío express disponible</div>
        </div>

        <div class="specs-section">
          <ExpandableSpecs :specs="product.especificaciones" />
        </div>

        <div class="actions">
          <div class="quantity-selector">
            <button @click="decrementQuantity" :disabled="quantity <= 1">-</button>
            <input v-model.number="quantity" type="number" min="1" :max="product.stock">
            <button @click="incrementQuantity" :disabled="quantity >= product.stock">+</button>
          </div>
          <button
            v-if="product.stock > 0"
            @click="addToCart"
            class="add-to-cart-btn"
          >
            Añadir al carrito
          </button>
          <button v-else disabled class="add-to-cart-btn disabled">
            Agotado
          </button>
          <button
            @click="toggleFavorite"
            :class="['favorite-btn', { active: isFavorite }]"
          >
            <Heart class="favorite-icon" size="18" />
            {{ isFavorite ? 'En Favoritos' : 'Añadir a Favoritos' }}
          </button>
        </div>

        <div class="tech-grid">
          <div class="tech-card">
            <Truck class="tech-icon" size="18" />
            <div>
              <p class="tech-title">Envío Gratis</p>
              <p class="tech-text">Desde $50 en Lima Metropolitana</p>
            </div>
          </div>
          <div class="tech-card">
            <RotateCcw class="tech-icon" size="18" />
            <div>
              <p class="tech-title">Devolución</p>
              <p class="tech-text">30 días sin costo</p>
            </div>
          </div>
          <div class="tech-card">
            <ShieldCheck class="tech-icon" size="18" />
            <div>
              <p class="tech-title">Garantía</p>
              <p class="tech-text">1 año con soporte</p>
            </div>
          </div>
          <div class="tech-card">
            <CreditCard class="tech-icon" size="18" />
            <div>
              <p class="tech-title">Pago Seguro</p>
              <p class="tech-text">Protección avanzada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { CreditCard, Heart, RotateCcw, ShieldCheck, Truck } from 'lucide-vue-next'
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
const galleryImages = computed(() => {
  const list = Array.isArray(props.product.imagenes) ? props.product.imagenes : []
  const main = props.product.imagen_url ? [props.product.imagen_url] : []
  const merged = [...main, ...list].filter(Boolean)
  return Array.from(new Set(merged))
})

watch(
  () => props.product.imagen_url,
  (newImage) => {
    selectedImage.value = newImage
  }
)

const incrementQuantity = () => {
  if (quantity.value < props.product.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(props.product)
  }
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
  background: linear-gradient(180deg, rgba(16, 37, 63, 0.06) 0%, rgba(16, 37, 63, 0.02) 100%);
  padding: 50px 20px;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 18px;
  animation: panelEnter 0.6s ease-out;
}

.details-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

.details-image-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 14px;
}

.image-frame {
  position: relative;
  width: 100%;
  border-radius: 18px;
  padding: 26px;
  background: rgba(15, 28, 46, 0.6);
  border: 1px solid rgba(77, 184, 255, 0.2);
  box-shadow: 0 30px 70px rgba(9, 20, 36, 0.35);
  overflow: hidden;
  animation: floatIn 0.8s ease-out;
}

.image-glow {
  position: absolute;
  inset: -30%;
  background: radial-gradient(circle, rgba(77, 184, 255, 0.35) 0%, rgba(12, 25, 45, 0) 60%);
  opacity: 0.75;
  z-index: 0;
}

.main-image img {
  position: relative;
  z-index: 1;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.45));
  transition: transform 0.35s ease;
}

.image-frame:hover .main-image img {
  transform: scale(1.04);
}

.thumbs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.thumb {
  width: 68px;
  height: 68px;
  border-radius: 12px;
  border: 1px solid rgba(77, 184, 255, 0.2);
  background: rgba(255, 255, 255, 0.9);
  padding: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.thumb:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: rgba(77, 184, 255, 0.4);
}

.thumb.active {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(77, 184, 255, 0.2);
}

.details-info-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.category-tag {
  display: inline-block;
  background: rgba(77, 184, 255, 0.15);
  color: var(--color-accent);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
  border: 1px solid rgba(77, 184, 255, 0.35);
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.product-title {
  margin: 0;
  font-size: 36px;
  color: #0f1b2d;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-transform: none;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  font-size: 18px;
  letter-spacing: 2px;
  color: var(--color-accent);
}

.rating-text {
  color: var(--color-text-light);
  font-size: 14px;
}

.product-description-section {
  margin: 20px 0;
  padding: 0;
}

.price-section {
  padding: 0;
  background: transparent;
  border-radius: 0;
  display: block;
  box-shadow: none;
}

.price-card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(16, 37, 63, 0.08), rgba(77, 184, 255, 0.08));
  border: 1px solid rgba(77, 184, 255, 0.2);
  border-radius: 14px;
  padding: 18px 20px;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.currency {
  font-size: 20px;
  color: var(--danger-color);
  font-weight: 700;
}

.amount {
  font-size: 36px;
  color: var(--danger-color);
  font-weight: 800;
}

.stock-info {
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
}

.stock-info.in-stock {
  background: #d4edda;
  color: #155724;
}

.stock-info.out-of-stock {
  background: #f8d7da;
  color: #721c24;
}

.specs-section {
  margin: 0;
}

.actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.quantity-selector {
  display: flex;
  border: 1px solid rgba(77, 184, 255, 0.25);
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
}

.quantity-selector button {
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s ease;
}

.quantity-selector button:hover:not(:disabled) {
  background: var(--color-bg-light);
}

.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-selector input {
  width: 60px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}

.quantity-selector input:focus {
  outline: none;
}

.add-to-cart-btn {
  flex: 1;
  min-width: 200px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.add-to-cart-btn:hover:not(.disabled) {
  background: #2f6fb4;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.add-to-cart-btn.disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.favorite-btn {
  padding: 12px 20px;
  background: white;
  border: 2px solid rgba(77, 184, 255, 0.3);
  color: #2f6fb4;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.favorite-btn:hover {
  background: var(--color-bg-light);
}

.favorite-btn.active {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.image-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-chip {
  background: rgba(15, 28, 46, 0.08);
  color: var(--color-text-light);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.meta-chip.accent {
  background: rgba(77, 184, 255, 0.15);
  color: var(--color-accent);
}

.delivery-note {
  font-size: 12px;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.tech-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 14px;
  border: 1px solid rgba(77, 184, 255, 0.12);
  box-shadow: var(--shadow-sm);
}

.tech-icon {
  color: var(--color-accent);
}

.tech-title {
  margin: 0;
  font-weight: 700;
  color: var(--color-text);
  font-size: 14px;
}

.tech-text {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-text-light);
}

@keyframes panelEnter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .product-details {
    padding: 28px 16px;
    border-radius: 14px;
  }

  .details-container {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .product-title {
    font-size: 24px;
  }

  .amount {
    font-size: 28px;
  }

  .actions {
    flex-direction: column;
  }

  .quantity-selector,
  .add-to-cart-btn,
  .favorite-btn {
    width: 100%;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .product-details {
    padding: 22px 14px;
  }

  .details-info-section {
    gap: 14px;
  }

  .image-frame {
    padding: 18px;
  }

  .price-card {
    padding: 14px 16px;
  }
}

@media (max-width: 480px) {
  .product-details {
    padding: 20px 15px;
  }

  .product-title {
    font-size: 20px;
  }

  .amount {
    font-size: 24px;
  }

  .price-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>

