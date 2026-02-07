<template>
  <div class="expandable-text">
    <p
      :class="['text-content', { expanded: isExpanded, collapsed: !isExpanded }]"
      ref="textElement"
    >
      {{ text || 'Sin descripción' }}
    </p>

    <button
      v-if="shouldShowButton"
      @click="toggleExpand"
      class="expand-btn"
    >
      {{ isExpanded ? '▲ Menos' : '...Más' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  maxLines: {
    type: Number,
    default: 2
  }
})

const isExpanded = ref(false)
const shouldShowButton = ref(false)
const textElement = ref(null)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

onMounted(async () => {
  await nextTick()

  if (textElement.value) {
    const fullHeight = textElement.value.scrollHeight
    const lineHeight = parseFloat(window.getComputedStyle(textElement.value).lineHeight)
    const visibleHeight = (lineHeight * props.maxLines) + 4
    shouldShowButton.value = fullHeight > visibleHeight
  }
})
</script>

<style scoped>
.expandable-text {
  margin: 0;
}

.text-content {
  margin: 0;
  color: var(--color-text-light);
  line-height: 1.6;
  word-break: break-word;
  transition: max-height 0.4s ease, opacity 0.4s ease;
  font-size: 14px;
}

.text-content.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: v-bind('maxLines');
  line-clamp: v-bind('maxLines');
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: calc(v-bind('maxLines') * 1.6em);
  position: relative;
  padding-bottom: 8px;
}

.text-content.collapsed::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%);
  pointer-events: none;
}

.text-content.expanded {
  display: block;
  max-height: none;
  overflow: visible;
}

.text-content.expanded::after {
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
