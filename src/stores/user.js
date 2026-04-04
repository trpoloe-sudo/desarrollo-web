import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '@/services/authApi'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const allUsers = ref([])
  const isRestoring = ref(false)
  const isLoggedIn = computed(() => Boolean(user.value))

  function normalizeUser(userData) {
    if (!userData) {
      return null
    }

    return {
      ...userData,
      orders: Array.isArray(userData.orders) ? userData.orders : []
    }
  }

  function setCurrentUser(nextUser) {
    user.value = normalizeUser(nextUser)
    return user.value
  }

  function clearSession() {
    user.value = null
    allUsers.value = []
  }

  function syncUpdatedUser(updatedUser) {
    const normalizedUser = normalizeUser(updatedUser)

    if (!normalizedUser) {
      return null
    }

    if (user.value?.email === normalizedUser.email) {
      setCurrentUser(normalizedUser)
    }

    if (allUsers.value.some(existingUser => existingUser.email === normalizedUser.email)) {
      allUsers.value = allUsers.value.map(existingUser => {
        return existingUser.email === normalizedUser.email ? normalizedUser : existingUser
      })
    } else {
      allUsers.value = [...allUsers.value, normalizedUser]
    }

    return normalizedUser
  }

  async function login(email, password) {
    if (!email || !password) {
      throw new Error('Email y contrasena son requeridos')
    }

    const session = await authApi.login({
      email: email.trim(),
      password
    })

    return setCurrentUser(session?.user ?? session)
  }

  async function loginWithGoogle(email, name, picture = null) {
    if (!email || !name) {
      throw new Error('Email y nombre son requeridos para Google Sign-In')
    }

    const session = await authApi.loginWithGoogle({
      email: email.trim(),
      name: name.trim(),
      picture
    })

    return setCurrentUser(session?.user ?? session)
  }

  async function register(email, password, name) {
    if (!email || !password || !name) {
      throw new Error('Todos los campos son requeridos')
    }

    const session = await authApi.register({
      email: email.trim(),
      password,
      name: name.trim()
    })

    return setCurrentUser(session?.user ?? session)
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      clearSession()
    }
  }

  async function restoreSession() {
    if (isRestoring.value) {
      return false
    }

    isRestoring.value = true

    try {
      const restoredUser = await authApi.getSession()
      setCurrentUser(restoredUser?.user ?? restoredUser)
      return true
    } catch (error) {
      console.error('Error restoring session:', error)
      clearSession()
      return false
    } finally {
      isRestoring.value = false
    }
  }

  async function addOrder(order) {
    if (!isLoggedIn.value) {
      throw new Error('Debes iniciar sesion para continuar')
    }

    const createdOrder = await authApi.addOrder(order)

    if (createdOrder?.user) {
      setCurrentUser(createdOrder.user)
    }

    return createdOrder?.order || null
  }

  async function fetchAllUsers() {
    const users = await authApi.listUsers()
    allUsers.value = Array.isArray(users) ? users.map(normalizeUser) : []
    return allUsers.value
  }

  function getAllUsers() {
    return allUsers.value
  }

  async function updateUserRole(email, role) {
    const updatedUser = await authApi.updateUserRole(email, role)
    return syncUpdatedUser(updatedUser)
  }

  async function updateOrderStatus(orderId, status) {
    const updatedOrder = await authApi.updateOrderStatus(orderId, status)

    if (updatedOrder?.user) {
      syncUpdatedUser(updatedOrder.user)
    }

    return updatedOrder?.order || null
  }

  function getOrders() {
    return user.value?.orders || []
  }

  return {
    user,
    isLoggedIn,
    allUsers,
    isRestoring,
    login,
    loginWithGoogle,
    register,
    logout,
    restoreSession,
    addOrder,
    fetchAllUsers,
    getOrders,
    getAllUsers,
    updateUserRole,
    updateOrderStatus
  }
})
