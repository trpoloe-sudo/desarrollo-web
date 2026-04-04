import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/services/authApi'

vi.mock('@/services/authApi', () => ({
  authApi: {
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    register: vi.fn(),
    getSession: vi.fn(),
    logout: vi.fn(),
    addOrder: vi.fn(),
    listUsers: vi.fn(),
    updateUserRole: vi.fn(),
    updateOrderStatus: vi.fn()
  }
}))

const baseUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  picture: null,
  role: 'customer',
  createdAt: '2026-04-03T00:00:00.000Z',
  orders: [],
  provider: 'email'
}

const createSession = (user = baseUser) => ({
  user
})

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with no logged in user', () => {
    const userStore = useUserStore()
    expect(userStore.isLoggedIn).toBe(false)
    expect(userStore.user).toBeNull()
  })

  it('logs in user successfully', async () => {
    const userStore = useUserStore()
    authApi.login.mockResolvedValue(createSession())

    const user = await userStore.login('test@example.com', 'password123')

    expect(userStore.isLoggedIn).toBe(true)
    expect(user.email).toBe('test@example.com')
    expect(userStore.user.email).toBe('test@example.com')
  })

  it('throws error on invalid login input', async () => {
    const userStore = useUserStore()

    await expect(userStore.login('', 'password')).rejects.toThrow('Email y contrasena son requeridos')
  })

  it('registers user successfully', async () => {
    const userStore = useUserStore()
    authApi.register.mockResolvedValue(createSession({
      ...baseUser,
      email: 'new@example.com',
      name: 'John Doe'
    }))

    const user = await userStore.register('new@example.com', 'pass123', 'John Doe')

    expect(userStore.isLoggedIn).toBe(true)
    expect(user.email).toBe('new@example.com')
    expect(user.name).toBe('John Doe')
  })

  it('logs in with Google successfully', async () => {
    const userStore = useUserStore()
    authApi.loginWithGoogle.mockResolvedValue(createSession({
      ...baseUser,
      provider: 'google',
      picture: 'https://example.com/photo.png'
    }))

    const user = await userStore.loginWithGoogle({
      credential: 'google-id-token'
    })

    expect(authApi.loginWithGoogle).toHaveBeenCalledWith({
      credential: 'google-id-token'
    })
    expect(user.provider).toBe('google')
    expect(user.picture).toBe('https://example.com/photo.png')
  })

  it('throws error when Google does not return a credential', async () => {
    const userStore = useUserStore()

    await expect(userStore.loginWithGoogle({})).rejects.toThrow('Google no devolvio una credencial valida')
  })

  it('logs out user and clears in-memory session state', async () => {
    const userStore = useUserStore()
    authApi.login.mockResolvedValue(createSession())
    authApi.logout.mockResolvedValue({ ok: true })

    await userStore.login('test@example.com', 'password123')
    await userStore.logout()

    expect(userStore.isLoggedIn).toBe(false)
    expect(userStore.user).toBeNull()
  })

  it('restores session from backend cookie state', async () => {
    const userStore = useUserStore()
    authApi.getSession.mockResolvedValue(baseUser)

    const restored = await userStore.restoreSession()

    expect(restored).toBe(true)
    expect(userStore.isLoggedIn).toBe(true)
    expect(userStore.user.email).toBe('test@example.com')
  })

  it('adds order to user', async () => {
    const userStore = useUserStore()
    authApi.login.mockResolvedValue(createSession())
    authApi.addOrder.mockResolvedValue({
      order: {
        id: 'order-1',
        items: [],
        total: 100,
        status: 'completed'
      },
      user: {
        ...baseUser,
        orders: [
          {
            id: 'order-1',
            items: [],
            total: 100,
            status: 'completed'
          }
        ]
      }
    })

    await userStore.login('test@example.com', 'password123')
    await userStore.addOrder({
      items: [],
      total: 100,
      status: 'completed'
    })

    expect(userStore.getOrders().length).toBe(1)
  })

  it('loads admin users from backend', async () => {
    const userStore = useUserStore()
    authApi.listUsers.mockResolvedValue([
      baseUser,
      {
        ...baseUser,
        id: 'user-2',
        email: 'admin@example.com',
        role: 'admin'
      }
    ])

    const users = await userStore.fetchAllUsers()

    expect(users).toHaveLength(2)
    expect(userStore.getAllUsers()[1].role).toBe('admin')
  })

  it('updates order status in session and admin lists', async () => {
    const userStore = useUserStore()
    const pendingOrder = {
      id: 'order-1',
      items: [],
      total: 100,
      status: 'pending'
    }

    authApi.login.mockResolvedValue(createSession({
      ...baseUser,
      role: 'admin',
      orders: [pendingOrder]
    }))
    authApi.updateOrderStatus.mockResolvedValue({
      order: {
        ...pendingOrder,
        status: 'cancelled'
      },
      user: {
        ...baseUser,
        orders: [
          {
            ...pendingOrder,
            status: 'cancelled'
          }
        ]
      }
    })

    await userStore.login('test@example.com', 'password123')
    userStore.allUsers = [{
      ...baseUser,
      orders: [pendingOrder]
    }]

    const updatedOrder = await userStore.updateOrderStatus('order-1', 'cancelled')

    expect(updatedOrder.status).toBe('cancelled')
    expect(userStore.getOrders()[0].status).toBe('cancelled')
  })

  it('updates a user role in session and admin lists', async () => {
    const userStore = useUserStore()
    authApi.login.mockResolvedValue(createSession())
    authApi.updateUserRole.mockResolvedValue({
      ...baseUser,
      role: 'admin'
    })

    await userStore.login('test@example.com', 'password123')
    userStore.allUsers = [{ ...baseUser }]

    const updatedUser = await userStore.updateUserRole('test@example.com', 'admin')

    expect(updatedUser.role).toBe('admin')
    expect(userStore.user.role).toBe('admin')
    expect(userStore.getAllUsers()[0].role).toBe('admin')
  })
})
