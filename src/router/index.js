import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { buildCanonicalUrl, setSeoMeta } from '@/services/seo'

const Home = () => import('@/pages/Home.vue')
const Products = () => import('@/pages/Products.vue')
const ProductDetail = () => import('@/pages/ProductDetail.vue')
const Cart = () => import('@/pages/Cart.vue')
const Auth = () => import('@/pages/Auth.vue')
const Dashboard = () => import('@/pages/Dashboard.vue')
const Admin = () => import('@/pages/Admin.vue')
const Checkout = () => import('@/pages/Checkout.vue')

export const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      seo: {
        title: 'Servicio técnico y venta de computadoras en Perú',
        description: 'Reparación, diagnóstico y venta de computadoras en Perú con atención rápida y soporte real.'
      }
    }
  },
  {
    path: '/products',
    component: Products,
    meta: {
      seo: {
        title: 'Catálogo de computadoras, partes y accesorios',
        description: 'Explora computadoras, laptops, componentes y accesorios con stock visible y asesoría previa a la compra.'
      }
    }
  },
  { path: '/productos', redirect: '/products' },
  {
    path: '/product/:id',
    component: ProductDetail,
    meta: {
      seo: {
        title: 'Detalle de producto',
        description: 'Revisa precio, stock, especificaciones y productos relacionados antes de solicitar tu pedido.'
      }
    }
  },
  { path: '/producto/:id', redirect: (to) => `/product/${to.params.id}` },
  {
    path: '/cart',
    component: Cart,
    meta: {
      noindex: true,
      seo: {
        title: 'Carrito de compras',
        description: 'Revisa el resumen de tu pedido antes de enviarlo.'
      }
    }
  },
  {
    path: '/auth',
    component: Auth,
    meta: {
      noindex: true,
      seo: {
        title: 'Acceso de clientes',
        description: 'Inicia sesión o crea tu cuenta para gestionar pedidos y seguimiento.'
      }
    }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      noindex: true,
      seo: {
        title: 'Dashboard de cliente',
        description: 'Consulta tus pedidos y el estado de tus solicitudes.'
      }
    }
  },
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      noindex: true,
      seo: {
        title: 'Panel de administración',
        description: 'Gestión interna de catálogo, pedidos, usuarios y contactos.'
      }
    }
  },
  {
    path: '/checkout',
    component: Checkout,
    meta: {
      requiresAuth: true,
      noindex: true,
      seo: {
        title: 'Finalizar pedido',
        description: 'Envía tu pedido y coordina el método de pago con un asesor.'
      }
    }
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

export function createAppRouter({ history = createWebHashHistory() } = {}) {
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

  router.afterEach((to) => {
    const routeSeo = to.meta?.seo || {}

    setSeoMeta({
      title: routeSeo.title,
      description: routeSeo.description,
      noindex: Boolean(to.meta?.noindex),
      canonical: buildCanonicalUrl(to.fullPath.split('#')[0] || '/')
    })
  })

  return router
}
