<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <transition-group name="toast-transition" tag="div" class="toast-list">
      <article
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        :class="['toast-card', `toast-${toast.type}`]"
      >
        <div class="toast-copy">
          <strong v-if="toast.title" class="toast-title">{{ toast.title }}</strong>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button
          class="toast-close"
          type="button"
          aria-label="Cerrar notificación"
          @click="uiStore.dismissToast(toast.id)"
        >
          ×
        </button>
      </article>
    </transition-group>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 88px;
  right: 18px;
  z-index: 1400;
  pointer-events: none;
}

.toast-list {
  display: grid;
  gap: 12px;
}

.toast-card {
  min-width: min(340px, calc(100vw - 36px));
  max-width: 380px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(7, 18, 33, 0.24);
  border: 1px solid transparent;
  backdrop-filter: blur(14px);
  pointer-events: auto;
}

.toast-copy {
  display: grid;
  gap: 4px;
}

.toast-title {
  font-size: 14px;
}

.toast-message {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
}

.toast-close {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
}

.toast-close:hover {
  opacity: 1;
}

.toast-success {
  background: rgba(232, 247, 237, 0.96);
  border-color: rgba(44, 125, 79, 0.22);
  color: #195b36;
}

.toast-error {
  background: rgba(253, 238, 238, 0.97);
  border-color: rgba(185, 56, 56, 0.24);
  color: #7a1f1f;
}

.toast-warning {
  background: rgba(255, 247, 231, 0.97);
  border-color: rgba(191, 127, 33, 0.24);
  color: #7d4d08;
}

.toast-info {
  background: rgba(236, 244, 255, 0.97);
  border-color: rgba(55, 120, 194, 0.24);
  color: #184b83;
}

.toast-transition-enter-active,
.toast-transition-leave-active {
  transition: all 0.22s ease;
}

.toast-transition-enter-from,
.toast-transition-leave-to {
  opacity: 0;
  transform: translateY(-8px) translateX(12px);
}

@media (max-width: 768px) {
  .toast-stack {
    top: auto;
    right: 10px;
    left: 10px;
    bottom: 14px;
  }

  .toast-card {
    min-width: 0;
    max-width: none;
  }
}
</style>
