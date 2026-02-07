import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import Home from './pages/Home.vue'
import Products from './pages/Products.vue'
import ProductDetail from './pages/ProductDetail.vue'
import Cart from './pages/Cart.vue'
import Auth from './pages/Auth.vue'
import Dashboard from './pages/Dashboard.vue'
import Admin from './pages/Admin.vue'
import Checkout from './pages/Checkout.vue'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cartStore'
import { useFavoritesStore } from './stores/favorites'
import './styles/global.css'

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/productos', component: Products },
  { path: '/product/:id', component: ProductDetail },
  { path: '/producto/:id', component: ProductDetail },
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteger rutas
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/auth')
  } else {
    next()
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Restaurar sesión al cargar
const userStore = useUserStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

userStore.restoreSession()
cartStore.initCart()
favoritesStore.initFavorites()

app.mount('#app')
