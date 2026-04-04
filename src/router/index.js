import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Products from '@/pages/Products.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Cart from '@/pages/Cart.vue'
import Auth from '@/pages/Auth.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Admin from '@/pages/Admin.vue'
import Checkout from '@/pages/Checkout.vue'
import { useUserStore } from '@/stores/user'

export const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/productos', redirect: '/products' },
  { path: '/product/:id', component: ProductDetail },
  { path: '/producto/:id', redirect: (to) => `/product/${to.params.id}` },
  { path: '/cart', component: Cart },
  { path: '/auth', component: Auth },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  }
]

export function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  }

  if (to.hash) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const element = document.querySelector(to.hash)

        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          resolve({ left: 0, top: element.offsetTop })
          return
        }

        resolve({ left: 0, top: 0 })
      }, 100)
    })
  }

  return { top: 0 }
}

export function createAppRouter({ history = createWebHistory() } = {}) {
  const router = createRouter({
    history,
    routes,
    scrollBehavior
  })

  router.beforeEach((to) => {
    const userStore = useUserStore()

    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      return '/auth'
    }

    if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') {
      return '/dashboard'
    }

    return true
  })

  return router
}
