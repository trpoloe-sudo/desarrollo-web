<template>
  <nav class="navbar" role="navigation" aria-label="Navegación principal">
    <div class="container nav-shell">
      <div class="brand">
        <RouterLink to="/" class="brand-link">
          <img :src="logoImage" alt="Ztar Tech" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-title">Ztar Tech</span>
            <span class="brand-subtitle">Venta y reparación de computadoras</span>
          </div>
        </RouterLink>
      </div>

      <button 
        v-if="isMobile" 
        class="hamburger-btn" 
        @click="toggleMobileMenu"
        :aria-expanded="mobileMenuOpen"
        aria-controls="nav-menu"
        aria-label="Abrir menú de navegación"
      >
        <svg v-if="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <ul 
        v-show="!isMobile || mobileMenuOpen" 
        class="nav-list" 
        id="nav-menu"
        @keydown.escape="closeMobileMenu"
      >
        <li><RouterLink to="/" class="nav-link" @click="closeMobileMenu">Inicio</RouterLink></li>
        <li><RouterLink to="/products" class="nav-link" @click="closeMobileMenu">Productos</RouterLink></li>
        <li><RouterLink to="/products" class="nav-link" @click="closeMobileMenu">Destacados</RouterLink></li>
        <li><RouterLink to="/" class="nav-link" @click="closeMobileMenu">Nosotros</RouterLink></li>
        <li><RouterLink to="/" class="nav-link" @click="closeMobileMenu">Ubicación</RouterLink></li>
        <li><RouterLink to="/#contact" class="nav-link" @click="closeMobileMenu">Contacto</RouterLink></li>
        <li v-if="!userStore.isLoggedIn" class="auth-link">
          <RouterLink to="/auth" class="nav-link" @click="closeMobileMenu">Iniciar Sesión</RouterLink>
        </li>
        <li v-else class="user-menu">
          <div class="user-dropdown">
            <button 
              @click="toggleDropdown" 
              class="user-btn"
              :aria-expanded="dropdownOpen"
              aria-haspopup="menu"
              aria-label="Menú de usuario"
            >
              <img v-if="userStore.user?.picture" :src="userStore.user.picture" :alt="userStore.user.name" class="user-avatar">
              <User v-else size="18" />
              {{ userStore.user?.name || userStore.user?.email.split('@')[0] }}
            </button>
            <div 
              v-show="dropdownOpen" 
              class="dropdown-menu"
              role="menu"
            >
              <RouterLink to="/dashboard" class="dropdown-item" role="menuitem" @click="closeDropdown">
                <LayoutDashboard size="18" />
                Mi Dashboard
              </RouterLink>
              <RouterLink 
                v-if="isAdmin" 
                to="/admin" 
                class="dropdown-item" 
                role="menuitem" 
                @click="closeDropdown"
              >
                <Settings size="18" />
                Administración
              </RouterLink>
              <button @click="logout" class="dropdown-item logout" role="menuitem">
                <LogOut size="18" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </li>
      </ul>

      <RouterLink to="/cart" class="cart-pill" aria-label="Ir al carrito">
        <ShoppingCart size="18" />
        <span>Carrito</span>
        <span class="pill-count">{{ cartStore.itemCount }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favorites'
import { useUserStore } from '../stores/user'
import { ShoppingCart, Heart, User, LayoutDashboard, Settings, LogOut } from 'lucide-vue-next'
import logoImage from '@/img/brand-logo.svg'

const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const userStore = useUserStore()

const isMobile = ref(false)
const mobileMenuOpen = ref(false)
const dropdownOpen = ref(false)
const isAdmin = computed(() => userStore.user?.role === 'admin')

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    mobileMenuOpen.value = false
  }
}

const handleDocumentClick = (event) => {
  const target = event.target
  if (!(target instanceof Element)) return
  if (!target.closest('.user-dropdown')) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  document.removeEventListener('click', handleDocumentClick)
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

function logout() {
  userStore.logout()
  closeDropdown()
  closeMobileMenu()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(180deg, #0b1c2f 0%, #112f4d 100%);
  padding: 10px 0;
  box-shadow: 0 14px 32px rgba(6, 16, 32, 0.55);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(90, 170, 240, 0.22);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.nav-shell {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
}

.brand-logo {
  width: 76px;
  height: 76px;
  object-fit: contain;
  border-radius: 14px;
  background: rgba(77, 184, 255, 0.12);
  padding: 6px;
  box-shadow: 0 10px 22px rgba(10, 28, 54, 0.55);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-title {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.3px;
}

.brand-subtitle {
  font-size: 12px;
  color: rgba(214, 233, 255, 0.7);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-list li {
  flex: 0 0 auto;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  color: rgba(221, 236, 255, 0.9);
  text-decoration: none;
  padding: 8px 6px;
  transition: color 0.2s ease;
  text-align: center;
  font-size: 14px;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link.router-link-active {
  color: #ffffff;
  font-weight: 700;
}

.cart-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  background: rgba(12, 36, 62, 0.85);
  border: 1px solid rgba(96, 174, 240, 0.35);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cart-pill:hover {
  background: rgba(22, 58, 92, 0.95);
  transform: translateY(-1px);
}

.pill-count {
  background: #e8f2ff;
  color: #0b1c2f;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 700;
  min-width: 18px;
  text-align: center;
}

.user-menu {
  position: relative;
}

.user-dropdown {
  position: relative;
}

.user-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(221, 236, 255, 0.9);
  background: none;
  border: none;
  padding: 6px 0;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease;
  font-size: 1em;
}

.user-btn:hover {
  background-color: var(--secondary-color);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #0c1f35;
  border: 1px solid rgba(96, 174, 240, 0.3);
  border-radius: 10px;
  min-width: 200px;
  box-shadow: 0 12px 28px rgba(6, 16, 32, 0.5);
  z-index: 200;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 20px;
  text-align: left;
  color: rgba(232, 242, 255, 0.95);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: rgba(96, 174, 240, 0.18);
}

.dropdown-item.logout {
  color: #ff9aa3;
  border-top: 1px solid rgba(96, 174, 240, 0.2);
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 999px;
}

@media (max-width: 768px) {
  .nav-shell {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "brand hamburger"
      "menu menu"
      "cart cart";
  }

  .brand {
    grid-area: brand;
  }

  .hamburger-btn {
    grid-area: hamburger;
    justify-self: end;
  }

  .nav-list {
    grid-area: menu;
    justify-content: flex-start;
    gap: 12px;
    padding-top: 12px;
  }

  .cart-pill {
    grid-area: cart;
    justify-self: start;
  }

  .brand-logo {
    width: 60px;
    height: 60px;
  }
}
</style>

