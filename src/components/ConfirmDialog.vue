<template>
  <transition name="confirm-fade">
    <div
      v-if="uiStore.confirmation"
      class="confirm-overlay"
      @click="uiStore.resolveConfirmation(false)"
    >
      <div class="confirm-card" @click.stop>
        <h3 class="confirm-title">{{ uiStore.confirmation.title }}</h3>
        <p class="confirm-message">{{ uiStore.confirmation.message }}</p>
        <div class="confirm-actions">
          <button
            type="button"
            class="confirm-cancel"
            @click="uiStore.resolveConfirmation(false)"
          >
            {{ uiStore.confirmation.cancelText }}
          </button>
          <button
            type="button"
            :class="['confirm-accept', { danger: uiStore.confirmation.danger }]"
            @click="uiStore.resolveConfirmation(true)"
          >
            {{ uiStore.confirmation.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const handleKeydown = (event) => {
  if (event.key === 'Escape' && uiStore.confirmation) {
    uiStore.resolveConfirmation(false)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(5, 11, 21, 0.58);
  backdrop-filter: blur(4px);
}

.confirm-card {
  width: min(440px, 100%);
  background: var(--surface-color);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 22px 60px rgba(7, 18, 33, 0.32);
  border: 1px solid rgba(77, 184, 255, 0.18);
}

.confirm-title {
  margin: 0 0 10px;
  color: var(--color-text);
}

.confirm-message {
  margin: 0;
  color: var(--color-text-light);
  line-height: 1.55;
}

.confirm-actions {
  margin-top: 22px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-cancel,
.confirm-accept {
  border: none;
  border-radius: 10px;
  padding: 11px 16px;
  font-weight: 700;
  cursor: pointer;
}

.confirm-cancel {
  background: var(--color-bg-light);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.confirm-accept {
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
}

.confirm-accept.danger {
  background: linear-gradient(135deg, #d74c4c 0%, #b63434 100%);
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .confirm-actions {
    flex-direction: column-reverse;
  }

  .confirm-cancel,
  .confirm-accept {
    width: 100%;
  }
}
</style>
