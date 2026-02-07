import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref([])

  // Cargar desde localStorage
  function initFavorites() {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      favoriteIds.value = JSON.parse(saved)
    }
  }

  function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favoriteIds.value))
  }

  function toggleFavorite(productId) {
    const index = favoriteIds.value.indexOf(productId)
    if (index > -1) {
      favoriteIds.value.splice(index, 1)
    } else {
      favoriteIds.value.push(productId)
    }
    saveFavorites()
  }

  function addFavorite(productId) {
    if (!favoriteIds.value.includes(productId)) {
      favoriteIds.value.push(productId)
      saveFavorites()
    }
  }

  function removeFavorite(productId) {
    const index = favoriteIds.value.indexOf(productId)
    if (index > -1) {
      favoriteIds.value.splice(index, 1)
      saveFavorites()
    }
  }

  function isFavorite(productId) {
    return favoriteIds.value.includes(productId)
  }

  const count = computed(() => favoriteIds.value.length)

  return {
    favoriteIds,
    count,
    initFavorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite
  }
})
