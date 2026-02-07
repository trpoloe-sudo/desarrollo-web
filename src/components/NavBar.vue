<template>
  <nav class="navbar" role="navigation" aria-label="Navegación principal">
    <div class="container">
      <!-- Botón hamburguesa para móvil -->
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

      <!-- Nombre de la marca -->
      <RouterLink to="/" class="logo">ZTartech</RouterLink>

      <!-- Menú de navegación -->
      <ul 
        v-show="!isMobile || mobileMenuOpen" 
        class="nav-list" 
        id="nav-menu"
        @keydown.escape="closeMobileMenu"
      >
        <li><RouterLink to="/" class="nav-link" @click="closeMobileMenu">Inicio</RouterLink></li>
        <li><RouterLink to="/products" class="nav-link" @click="closeMobileMenu">Productos</RouterLink></li>
        <li class="cart-link">
          <RouterLink to="/cart" class="nav-link cart-badge" aria-label="Ir al carrito" @click="closeMobileMenu">
            <ShoppingCart size="20" />
            Carrito
            <span v-if="cartStore.itemCount > 0" class="badge" aria-label="Tienes 1 producto en el carrito">{{ cartStore.itemCount }}</span>
          </RouterLink>
        </li>
        <li class="favorites-link">
          <RouterLink to="/products" class="nav-link favorites-badge" aria-label="Ver favoritos" @click="closeMobileMenu">
            <Heart size="20" />
            Favoritos
            <span v-if="favoritesStore.count > 0" class="badge" aria-label="Tienes 1 favorito">{{ favoritesStore.count }}</span>
          </RouterLink>
        </li>
        <li v-if="!userStore.isLoggedIn" class="auth-link">
          <RouterLink to="/auth" class="nav-link" @click="closeMobileMenu">Iniciar Sesión</RouterLink>
        </li>
        <li v-else class="user-menu">
          <div class="user-dropdown" @click.outside="closeDropdown" @keydown.escape="closeDropdown">
            <button 
              @click="toggleDropdown" 
              class="user-btn"
              :aria-expanded="dropdownOpen"
              aria-haspopup="menu"
              aria-label="Menú de usuario"
            >
              <img v-if="userStore.user?.picture" :src="userStore.user.picture" :alt="userStore.user.name" class="user-avatar">
              <User v-else size="20" />
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
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favorites'
import { useUserStore } from '../stores/user'

const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const userStore = useUserStore()
const showMenu = ref(false)

function logout() {
  userStore.logout()
  showMenu.value = false
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background-color: var(--primary-color);
  padding: 0;
  box-shadow: var(--box-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0;
  flex-wrap: wrap;
}

.nav-list li {
  flex: 1;
  min-width: 120px;
}

.nav-link {
  display: block;
  color: white;
  text-decoration: none;
  padding: 15px 20px;
  transition: background-color 0.3s ease;
  text-align: center;
  position: relative;
}

.nav-link:hover {
  background-color: var(--secondary-color);
}

.nav-link.router-link-active {
  background-color: var(--accent-color);
  color: #0b1c2c;
  font-weight: 700;
}

.cart-link,
.favorites-link {
  position: relative;
}

.cart-badge,
.favorites-badge {
  position: relative;
}

.badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: var(--danger-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  font-weight: bold;
}

.user-menu {
  position: relative;
}

.user-dropdown {
  position: relative;
}

.user-btn {
  display: block;
  width: 100%;
  color: white;
  background: none;
  border: none;
  padding: 15px 20px;
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
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  min-width: 200px;
  box-shadow: var(--shadow-sm);
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
  color: var(--color-text);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--color-bg-light);
}

.dropdown-item.logout {
  color: var(--danger-color);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .nav-list li {
    flex: 0 0 50%;
  }

  .nav-link {
    padding: 12px 10px;
    font-size: 0.9em;
  }
}
</style>
