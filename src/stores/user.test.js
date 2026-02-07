import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '@/stores/user'
import { setActivePinia, createPinia } from 'pinia'

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with no logged in user', () => {
    const userStore = useUserStore()
    expect(userStore.isLoggedIn).toBe(false)
    expect(userStore.user).toBeNull()
  })

  it('logs in user successfully', () => {
    const userStore = useUserStore()
    const user = userStore.login('test@example.com', 'password123')
    
    expect(userStore.isLoggedIn).toBe(true)
    expect(user.email).toBe('test@example.com')
    expect(userStore.token).toBeTruthy()
  })

  it('throws error on invalid login', () => {
    const userStore = useUserStore()
    
    expect(() => {
      userStore.login('', 'password')
    }).toThrow('Email y contraseña son requeridos')
  })

  it('registers user successfully', () => {
    const userStore = useUserStore()
    const user = userStore.register('new@example.com', 'pass123', 'John Doe')
    
    expect(userStore.isLoggedIn).toBe(true)
    expect(user.email).toBe('new@example.com')
    expect(user.name).toBe('John Doe')
  })

  it('logs out user', () => {
    const userStore = useUserStore()
    userStore.login('test@example.com', 'password123')
    expect(userStore.isLoggedIn).toBe(true)
    
    userStore.logout()
    expect(userStore.isLoggedIn).toBe(false)
    expect(userStore.user).toBeNull()
  })

  it('persists session in localStorage', () => {
    const userStore = useUserStore()
    userStore.login('test@example.com', 'password123')
    
    expect(localStorage.getItem('authToken')).toBeTruthy()
    expect(localStorage.getItem('userData')).toBeTruthy()
  })

  it('restores session from localStorage', () => {
    const userStore1 = useUserStore()
    userStore1.login('test@example.com', 'password123')
    
    // Create new store instance
    const userStore2 = useUserStore()
    const restored = userStore2.restoreSession()
    
    expect(restored).toBe(true)
    expect(userStore2.isLoggedIn).toBe(true)
  })

  it('adds order to user', () => {
    const userStore = useUserStore()
    userStore.login('test@example.com', 'password123')
    
    const order = {
      items: [],
      total: 100,
      status: 'completed'
    }
    
    userStore.addOrder(order)
    expect(userStore.getOrders().length).toBe(1)
  })
})
