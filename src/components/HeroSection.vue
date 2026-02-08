<template>
  <section class="hero-section">
    <div class="hero-container">
      <!-- Contenido principal -->
      <div class="hero-content">
        <div class="content-wrapper">
          <!-- Título principal H1 - Optimizado para SEO con palabra clave principal -->
          <h1 class="hero-title">
            Soluciones Informáticas <span class="highlight">Integrales en Perú</span>
          </h1>

          <!-- Subtítulo con descripción de servicios - Contiene palabras clave secundarias -->
          <p class="hero-subtitle">
            Reparación de computadoras, venta de equipos nuevos y asesoría técnica profesional. 
            Servicio garantizado con precios competitivos. Diagnosticamos, reparamos y vendemos en Perú.
          </p>

          <!-- Características clave con palabras clave SEO -->
          <div class="key-features">
            <div class="feature">
              <Check class="feature-icon" size="18" />
              <span class="feature-text">Reparación profesional de computadoras</span>
            </div>
            <div class="feature">
              <Check class="feature-icon" size="18" />
              <span class="feature-text">Garantía 6 meses en reparaciones</span>
            </div>
            <div class="feature">
              <Check class="feature-icon" size="18" />
              <span class="feature-text">Precios competitivos en Lima</span>
            </div>
          </div>

          <!-- Llamadas a la acción -->
          <div class="cta-buttons">
            <button
              class="cta-tertiary"
              @click="goToProducts"
              aria-label="Ver catálogo de productos"
            >
              <ShoppingCart class="cta-icon" size="18" />
              Ver Productos
            </button>
            <button class="cta-secondary" 
              @click="openWhatsApp"
              aria-label="Contactar por WhatsApp con nuestro equipo técnico disponible 24/7"
            >
              <MessageCircle class="cta-icon" size="18" />
              Contactar por WhatsApp
            </button>
          </div>

          <!-- Información de confianza -->
          <div class="trust-badges">
            <div class="badge">
              <strong>+15 años</strong>
              <span>de experiencia</span>
            </div>
            <div class="badge">
              <strong>Servicio técnico</strong>
              <span>profesional certificado</span>
            </div>
            <div class="badge">
              <strong>Entrega rápida</strong>
              <span>a todo Perú</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Elemento visual derecho - Producto aleatorio -->
      <div class="hero-visual">
        <div class="visual-placeholder">
          <!-- Mostrar producto aleatorio o íconos por defecto -->
          <div v-if="loadingProducts" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando productos...</p>
          </div>
          <div v-else-if="currentProduct" class="featured-product" @click="addProductToCart">
            <div class="product-display">
              <img :src="currentProduct.imagen_url" :alt="currentProduct.nombre" class="product-image-featured" />
              <div class="product-overlay">
                <div class="product-details">
                  <span class="product-category">{{ currentProduct.categoria }}</span>
                  <h3 class="product-name-featured">{{ currentProduct.nombre }}</h3>
                  <p class="product-price">${{ currentProduct.precio.toFixed(2) }}</p>
                  <button class="add-to-cart-btn" @click.stop="addProductToCart">
                    Añadir al Carrito
                  </button>
                </div>
              </div>
              <span class="featured-badge">⭐ DESTACADO</span>
            </div>
          </div>
          <div v-else class="icon-grid">
            <div class="icon-item">
              <Monitor size="48" stroke-width="1.5" class="modern-icon" />
            </div>
            <div class="icon-item">
              <Zap size="48" stroke-width="1.5" class="modern-icon" />
            </div>
            <div class="icon-item">
              <Shield size="48" stroke-width="1.5" class="modern-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Onda decorativa inferior -->
    <div class="wave-decoration"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Monitor, Zap, Shield, Check, ShoppingCart, MessageCircle } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import { googleSheetsAPI } from '@/services/googleSheetsAPI'

const router = useRouter()
const cartStore = useCartStore()
const products = ref([])
const currentProduct = ref(null)
const productInterval = ref(null)
const loadingProducts = ref(true)


const goToProducts = () => {
  router.push('/products')
}

const loadProducts = async () => {
  try {
    loadingProducts.value = true
    products.value = await googleSheetsAPI.getProducts()
    if (products.value.length > 0) {
      selectRandomProduct()
    }
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loadingProducts.value = false
  }
}

const selectRandomProduct = () => {
  if (products.value.length === 0) return
  const randomIndex = Math.floor(Math.random() * products.value.length)
  currentProduct.value = products.value[randomIndex]
}

const addProductToCart = () => {
  if (currentProduct.value) {
    // Agregar al carrito
    cartStore.addItem({
      id: currentProduct.value.id,
      nombre: currentProduct.value.nombre,
      precio: currentProduct.value.precio,
      imagen_url: currentProduct.value.imagen_url,
      categoria: currentProduct.value.categoria,
      descripcion: currentProduct.value.descripcion,
      stock: currentProduct.value.stock
    })
    
    // Mostrar notificación
    alert(`Producto añadido al carrito: ${currentProduct.value.nombre}`)
    
    // Redireccionar a productos
    router.push('/productos')
  }
}

onMounted(() => {
  // Cargar productos
  loadProducts()
  
  // Cambiar producto cada 10 segundos
  productInterval.value = setInterval(() => {
    selectRandomProduct()
  }, 10000)
})

onUnmounted(() => {
  // Limpiar intervalo cuando se desmonta el componente
  if (productInterval.value) {
    clearInterval(productInterval.value)
  }
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: #ffffff;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.content-wrapper {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.highlight {
  color: var(--color-accent);
  display: block;
  margin-top: 8px;
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.8;
  color: #ffffff;
  opacity: 0.93;
  margin-bottom: 32px;
  max-width: 550px;
  font-weight: 400;
}

/* Características clave */
.key-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #f0f0f0;
  transition: all 0.3s ease;
}

.feature:hover {
  transform: translateX(8px);
}

.feature-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.feature-text {
  font-weight: 500;
}

/* Botones CTA */
.cta-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.cta-secondary {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  min-height: 48px;
}

.cta-tertiary {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  min-height: 48px;
  color: white;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(15, 28, 46, 0.2);
}

.cta-tertiary:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15, 28, 46, 0.3);
}

.cta-secondary {
  background: transparent;
  color: white;
  border: 2px solid var(--color-accent);
  box-shadow: 0 4px 12px rgba(77, 184, 255, 0.2);
}

.cta-secondary:hover {
  background: rgba(77, 184, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(77, 184, 255, 0.3);
}

.cta-icon {
  color: currentColor;
}

/* Insignias de confianza */
.trust-badges {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.badge {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge strong {
  font-size: 16px;
  color: var(--color-accent);
  font-weight: 700;
}

.badge span {
  font-size: 13px;
  color: #d0d0d0;
  font-weight: 400;
}

/* Visual right side */
.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.visual-placeholder {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  background: rgba(77, 184, 255, 0.08);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(77, 184, 255, 0.2);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(77, 184, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* Estado de carga */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  height: 100%;
  color: var(--color-accent);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(77, 184, 255, 0.2);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 14px;
  color: var(--color-accent);
}

/* Producto destacado */
.featured-product {
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.featured-product:hover {
  transform: scale(1.05);
}

.product-display {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
}

.product-image-featured {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-product:hover .product-image-featured {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.featured-product:hover .product-overlay {
  opacity: 1;
}

.product-details {
  text-align: center;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-category {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-name-featured {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.3;
}

.product-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-accent);
  margin: 0;
}

.add-to-cart-btn {
  padding: 12px 24px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(77, 184, 255, 0.3);
}

.add-to-cart-btn:hover {
  background: #2f6fb4;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(77, 184, 255, 0.4);
}

.add-to-cart-btn:active {
  transform: translateY(0);
}

.featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff6b6b;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 107, 107, 0);
  }
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 80%;
  height: 80%;
}

.icon-item {
  font-size: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(77, 184, 255, 0.1);
  border: 1px solid rgba(77, 184, 255, 0.2);
  transition: all 0.3s ease;
  aspect-ratio: 1;
  color: var(--color-accent);
}

.icon-item:hover {
  transform: scale(1.1);
  background: rgba(77, 184, 255, 0.15);
  border-color: rgba(77, 184, 255, 0.4);
}

.modern-icon {
  width: 48px;
  height: 48px;
  color: currentColor;
}

.visual-placeholder svg {
  width: 70%;
  height: 70%;
  color: var(--color-accent);
}

/* Decoración de onda */
.wave-decoration {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 80px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,30 Q300,60 600,30 T1200,30 L1200,120 L0,120 Z" fill="white" opacity="0.1"></path></svg>') repeat-x;
  background-size: 600px 100%;
  animation: wave 15s linear infinite;
  z-index: 1;
}

@keyframes wave {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 600px 0;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-section {
    padding: 40px 20px;
    min-height: auto;
  }

  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 16px;
    margin-bottom: 24px;
  }

  .key-features {
    margin-bottom: 32px;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 12px;
  }
  .cta-secondary {
    width: 100%;
    justify-content: center;
    padding: 18px 36px;
    min-height: 54px;
    font-size: 16px;
  }

  .trust-badges {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 24px;
  }

  .hero-visual {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 30px 16px;
  }

  .hero-title {
    font-size: 32px;
    line-height: 1.3;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: 15px;
    line-height: 1.7;
  }

  .feature {
    font-size: 15px;
  }
  .cta-secondary {
    padding: 16px 28px;
    font-size: 16px;
    min-height: 50px;
  }
}
</style>





