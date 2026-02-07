import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => user.value !== null)
  const token = ref(localStorage.getItem('authToken') || null)

  function login(email, password) {
    // Validación básica
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos')
    }

    // Simular autenticación (en producción usar un backend real)
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
      orders: [],
      provider: 'email'
    }

    // Generar token simulado
    const newToken = btoa(JSON.stringify(userData) + Date.now())
    
    user.value = userData
    token.value = newToken
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('userData', JSON.stringify(userData))

    return userData
  }

  function loginWithGoogle(email, name, picture = null) {
    // Validación básica
    if (!email || !name) {
      throw new Error('Email y nombre son requeridos para Google Sign-In')
    }

    // Crear datos de usuario desde Google
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      picture,
      createdAt: new Date().toISOString(),
      orders: [],
      provider: 'google'
    }

    // Generar token simulado
    const newToken = btoa(JSON.stringify(userData) + Date.now())
    
    user.value = userData
    token.value = newToken
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('userData', JSON.stringify(userData))

    return userData
  }

  function register(email, password, name) {
    if (!email || !password || !name) {
      throw new Error('Todos los campos son requeridos')
    }

    // Simular registro
    return login(email, password)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }

  function restoreSession() {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('userData')

    if (savedToken && savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        token.value = savedToken
        return true
      } catch (error) {
        console.error('Error restoring session:', error)
        logout()
        return false
      }
    }
    return false
  }

  function addOrder(order) {
    if (user.value) {
      user.value.orders = user.value.orders || []
      user.value.orders.push({
        ...order,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('userData', JSON.stringify(user.value))
      return user.value.orders[user.value.orders.length - 1]
    }
  }

  function getOrders() {
    return user.value?.orders || []
  }

  return {
    user,
    isLoggedIn,
    token,
    login,
    loginWithGoogle,
    register,
    logout,
    restoreSession,
    addOrder,
    getOrders
  }
})
