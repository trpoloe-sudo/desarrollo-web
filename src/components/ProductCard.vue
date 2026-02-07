<template>
  <div class="product-card">
    <RouterLink :to="`/product/${product.id}`" class="card-link">
      <div class="image-container">
        <img :src="product.imagen_url" :alt="product.nombre" class="product-image" />
        <span class="category-badge">{{ product.categoria }}</span>
        <button
          @click.prevent="toggleFavorite"
          :class="['favorite-btn', { active: isFavorite }]"
        >
          {{ isFavorite ? '❤️' : '🤍' }}
        </button>
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.nombre }}</h3>
        <ExpandableText :text="product.descripcion" :maxLines="2" />
        <div class="product-footer">
          <div class="price-stock">
            <p class="price">${{ product.precio.toFixed(2) }}</p>
            <p class="stock" :class="{ 'out-of-stock': product.stock === 0 }">
              {{ product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado' }}
            </p>
          </div>
        </div>
      </div>
    </RouterLink>
    <button
      v-if="product.stock > 0"
      @click="addToCart"
      class="add-btn"
    >
      🛒 Añadir
    </button>
    <button v-else disabled class="add-btn disabled">
      Agotado
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import ExpandableText from './ExpandableText.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.product.id))

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
  background: var(--surface-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-border);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: pointer;
}

.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  background-color: var(--color-bg-light);
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--color-primary);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: white;
}

.favorite-btn.active {
  animation: heartBeat 0.3s ease;
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
}

.price-stock {
  display: flex;
  flex-direction: column;
}

.price {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: var(--danger-color);
}

.stock {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: var(--success-color);
}

.stock.out-of-stock {
  color: var(--danger-color);
}

.add-btn {
  padding: 10px 12px;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  margin: 12px;
  box-shadow: var(--shadow-sm);
}

.add-btn:hover:not(.disabled) {
  background-color: #2f6fb4;
  transform: translateY(-2px);
}

.add-btn.disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-card {
    margin-bottom: 15px;
  }

  .product-name {
    font-size: 14px;
  }
}
</style>
