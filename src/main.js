import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cartStore'
import { useFavoritesStore } from './stores/favorites'
import { createAppRouter } from './router'
import './styles/global.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  const userStore = useUserStore(pinia)
  const cartStore = useCartStore(pinia)
  const favoritesStore = useFavoritesStore(pinia)
  const router = createAppRouter()

  cartStore.initCart()
  favoritesStore.initFavorites()
  await userStore.restoreSession()

  app.use(router)
  app.mount('#app')
}

bootstrap()
