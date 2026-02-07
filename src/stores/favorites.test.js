import { describe, it, expect, beforeEach } from 'vitest'
import { useFavoritesStore } from '@/stores/favorites'
import { setActivePinia, createPinia } from 'pinia'

describe('FavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with empty favorites', () => {
    const favoritesStore = useFavoritesStore()
    expect(favoritesStore.favoriteIds).toEqual([])
    expect(favoritesStore.count).toBe(0)
  })

  it('adds favorite', () => {
    const favoritesStore = useFavoritesStore()
    favoritesStore.addFavorite('product1')
    
    expect(favoritesStore.favoriteIds).toContain('product1')
    expect(favoritesStore.count).toBe(1)
  })

  it('removes favorite', () => {
    const favoritesStore = useFavoritesStore()
    favoritesStore.addFavorite('product1')
    favoritesStore.removeFavorite('product1')
    
    expect(favoritesStore.favoriteIds).not.toContain('product1')
    expect(favoritesStore.count).toBe(0)
  })

  it('toggles favorite', () => {
    const favoritesStore = useFavoritesStore()
    
    favoritesStore.toggleFavorite('product1')
    expect(favoritesStore.isFavorite('product1')).toBe(true)
    
    favoritesStore.toggleFavorite('product1')
    expect(favoritesStore.isFavorite('product1')).toBe(false)
  })

  it('persists favorites in localStorage', () => {
    const favoritesStore = useFavoritesStore()
    favoritesStore.addFavorite('product1')
    
    expect(localStorage.getItem('favorites')).toBeTruthy()
  })

  it('restores favorites from localStorage', () => {
    const favoritesStore1 = useFavoritesStore()
    favoritesStore1.addFavorite('product1')
    
    const favoritesStore2 = useFavoritesStore()
    favoritesStore2.initFavorites()
    
    expect(favoritesStore2.isFavorite('product1')).toBe(true)
  })
})
