import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'
import { useUserStore } from '@/stores/user'

function createSessionUser(role = 'customer') {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role,
    createdAt: '2026-04-03T00:00:00.000Z',
    orders: [],
    provider: 'email'
  }
}

describe('router guards', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('redirects guests away from protected routes', async () => {
    const router = createAppRouter({ history: createMemoryHistory() })

    await router.push('/dashboard')
    await router.isReady()

    expect(router.currentRoute.value.fullPath).toBe('/auth')
  })

  it('redirects non-admin users away from admin', async () => {
    const userStore = useUserStore()
    userStore.user = createSessionUser('customer')

    const router = createAppRouter({ history: createMemoryHistory() })

    await router.push('/admin')
    await router.isReady()

    expect(router.currentRoute.value.fullPath).toBe('/dashboard')
  })

  it('allows admin users into admin routes', async () => {
    const userStore = useUserStore()
    userStore.user = createSessionUser('admin')

    const router = createAppRouter({ history: createMemoryHistory() })

    await router.push('/admin')
    await router.isReady()

    expect(router.currentRoute.value.fullPath).toBe('/admin')
  })

  it('keeps canonical redirects working', async () => {
    const router = createAppRouter({ history: createMemoryHistory() })

    await router.push('/productos')
    await router.isReady()

    expect(router.currentRoute.value.fullPath).toBe('/products')
  })
})
