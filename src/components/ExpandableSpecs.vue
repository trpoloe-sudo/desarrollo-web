<template>
  <div class="expandable-specs">
    <div class="specs-header">
      <h3>Especificaciones Técnicas</h3>
    </div>

    <div class="specs-content">
      <p
        :class="['specs-text', { expanded: isExpanded, collapsed: !isExpanded }]"
        ref="specsElement"
      >
        {{ specs || 'No hay especificaciones disponibles' }}
      </p>

      <button
        v-if="shouldShowButton"
        @click="toggleExpand"
        class="expand-btn"
      >
        {{ isExpanded ? '▲ Menos' : '...Más' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  specs: {
    type: String,
    default: ''
  }
})

const isExpanded = ref(false)
const shouldShowButton = ref(false)
const specsElement = ref(null)
const maxLines = 2

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

onMounted(async () => {
  await nextTick()

  if (specsElement.value) {
    const fullHeight = specsElement.value.scrollHeight
    const lineHeight = parseFloat(window.getComputedStyle(specsElement.value).lineHeight)
    const visibleHeight = (lineHeight * maxLines) + 4
    shouldShowButton.value = fullHeight > visibleHeight
  }
})
</script>

<style scoped>
.expandable-specs {
  margin: 0;
}

.specs-header {
  margin: 0 0 12px 0;
}

.specs-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--color-primary);
  font-weight: 600;
}

.specs-content {
  position: relative;
}

.specs-text {
  margin: 0;
  color: var(--color-text-light);
  line-height: 1.6;
  word-break: break-word;
  transition: max-height 0.4s ease, opacity 0.4s ease;
  font-size: 14px;
}

.specs-text.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: calc(2 * 1.6em);
  position: relative;
  padding-bottom: 8px;
}

.specs-text.collapsed::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%);
  pointer-events: none;
}

.specs-text.expanded {
  display: block;
  max-height: none;
  overflow: visible;
}

.specs-text.expanded::after {
  display: none;
}

.expand-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.3s ease, transform 0.2s ease;
  display: inline-block;
  margin-top: 8px;
  user-select: none;
}

.expand-btn:hover {
  color: var(--color-secondary);
  transform: translateX(2px);
}

.expand-btn:active {
  transform: translateX(2px) scale(0.98);
}
</style>
