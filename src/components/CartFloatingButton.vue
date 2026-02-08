<template>
  <RouterLink to="/cart" class="cart-float" aria-label="Ir al carrito">
    <ShoppingCart size="22" />
    <span v-if="cartStore.itemCount > 0" class="badge">{{ cartStore.itemCount }}</span>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-float {
  position: fixed;
  bottom: 30px;
  left: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: var(--shadow-lg);
  z-index: 999;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cart-float:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(15, 28, 46, 0.35);
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--danger-color);
  color: white;
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  text-align: center;
}

@media (max-width: 768px) {
  .cart-float {
    width: 52px;
    height: 52px;
    bottom: 20px;
    left: 20px;
  }
}

@media (max-width: 480px) {
  .cart-float {
    width: 48px;
    height: 48px;
    bottom: 15px;
    left: 15px;
  }
}
</style>
