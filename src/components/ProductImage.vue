<template>
  <div class="product-image-frame" :class="{ 'is-loaded': isLoaded, 'is-retrying': isRetrying }">
    <img :src="fallbackSrc" alt="" class="fallback-image" aria-hidden="true">
    <span v-if="isRetrying" class="loading-ring" aria-hidden="true"></span>
    <img
      :src="displaySrc"
      :alt="alt"
      class="remote-image"
      :loading="loading"
      decoding="async"
      @load="handleLoad"
      @error="handleError"
    >
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { BRAND_LOGO_URL } from '@/config/assets'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  fallbackSrc: {
    type: String,
    default: BRAND_LOGO_URL
  },
  loading: {
    type: String,
    default: 'lazy'
  }
})

const isLoaded = ref(false)
const retryAttempt = ref(0)
let retryTimer = null

const normalizedSrc = computed(() => {
  const requestedSrc = String(props.src || '').trim()
  return requestedSrc || props.fallbackSrc
})

const retryableSrc = computed(() => {
  const src = normalizedSrc.value

  if (!src || src === props.fallbackSrc) {
    return false
  }

  return !/^(data|blob):/i.test(src)
})

const isRetrying = computed(() => retryableSrc.value && !isLoaded.value)

const displaySrc = computed(() => {
  if (!retryAttempt.value || !retryableSrc.value) {
    return normalizedSrc.value
  }

  return withRetryParam(normalizedSrc.value, retryAttempt.value)
})

function withRetryParam(src, attempt) {
  const retryValue = `${attempt}-${Date.now()}`

  try {
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost'
    const parsedUrl = new URL(src, baseUrl)
    parsedUrl.searchParams.set('zt_img_retry', retryValue)

    if (src.startsWith('/') && !src.startsWith('//')) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
    }

    return parsedUrl.href
  } catch {
    const separator = src.includes('?') ? '&' : '?'
    return `${src}${separator}zt_img_retry=${retryValue}`
  }
}

function stopRetryTimer() {
  if (retryTimer) {
    window.clearInterval(retryTimer)
    retryTimer = null
  }
}

function syncRetryTimer() {
  stopRetryTimer()

  if (!isRetrying.value || typeof window === 'undefined') {
    return
  }

  retryTimer = window.setInterval(() => {
    retryAttempt.value += 1
  }, 1000)
}

function handleLoad() {
  isLoaded.value = true
  stopRetryTimer()
}

function handleError() {
  isLoaded.value = false
}

watch(
  normalizedSrc,
  () => {
    isLoaded.value = false
    retryAttempt.value = 0
    syncRetryTimer()
  },
  { immediate: true }
)

watch(isRetrying, syncRetryTimer)

onBeforeUnmount(stopRetryTimer)
</script>

<style scoped>
.product-image-frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.fallback-image,
.remote-image {
  grid-area: 1 / 1;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fallback-image {
  width: 58%;
  height: 58%;
  opacity: 0.4;
  filter: saturate(0.85);
  transition: opacity 0.2s ease;
}

.remote-image {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.is-loaded .remote-image {
  opacity: 1;
}

.is-loaded .fallback-image {
  opacity: 0;
}

.loading-ring {
  grid-area: 1 / 1;
  width: 38px;
  height: 38px;
  border: 3px solid rgba(77, 184, 255, 0.18);
  border-top-color: rgba(77, 184, 255, 0.72);
  border-radius: 999px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
