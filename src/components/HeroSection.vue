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

      <!-- Elemento visual derecho -->
      <div class="hero-visual">
        <div class="visual-placeholder">
          <div class="brand-mark">
            <span class="brand-glow"></span>
            <img src="/brand-logo-transparent.png" alt="Ztar Tech" class="hero-logo" />
          </div>
        </div>
      </div>
    </div>

    <!-- Onda decorativa inferior -->
    <div class="wave-decoration"></div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Check, ShoppingCart, MessageCircle } from 'lucide-vue-next'

const router = useRouter()

const goToProducts = () => {
  router.push('/products')
}

const openWhatsApp = () => {
  const phoneNumber = '51978418809'
  const message = encodeURIComponent(
    'Hola, me gustaría recibir asesoría sobre equipos y servicios de Ztar Tech.'
  )
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}
</script>

<style scoped>
.hero-section {
  background:
    radial-gradient(circle at 78% 32%, rgba(77, 184, 255, 0.32), transparent 28%),
    radial-gradient(circle at 18% 18%, rgba(89, 208, 255, 0.2), transparent 24%),
    linear-gradient(135deg, #081f3a 0%, #103864 46%, #061427 100%);
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
  border: 2px solid #59d0ff;
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
  background: rgba(25, 78, 127, 0.35);
  box-shadow:
    0 0 8px rgba(89, 208, 255, 0.65),
    0 0 18px rgba(89, 208, 255, 0.45),
    0 4px 12px rgba(15, 28, 46, 0.24);
  animation: tadaInvite 2.8s ease-in-out infinite, neonPulse 1.8s ease-in-out infinite alternate;
}

.cta-tertiary:hover {
  background: rgba(35, 105, 166, 0.4);
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 0 12px rgba(89, 208, 255, 0.9),
    0 0 26px rgba(89, 208, 255, 0.65),
    0 8px 18px rgba(15, 28, 46, 0.32);
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

@keyframes tadaInvite {
  0%, 72%, 100% {
    transform: scale(1) rotate(0deg);
  }
  75%, 79%, 83%, 87% {
    transform: scale(1.05) rotate(-3deg);
  }
  77%, 81%, 85% {
    transform: scale(1.05) rotate(3deg);
  }
}

@keyframes neonPulse {
  from {
    border-color: #59d0ff;
  }
  to {
    border-color: #9fe9ff;
  }
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
  background:
    radial-gradient(circle at top left, rgba(89, 208, 255, 0.22), transparent 34%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.14), rgba(77, 184, 255, 0.08));
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

.brand-mark {
  position: relative;
  width: min(72%, 280px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 30px;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.24), transparent 35%),
    linear-gradient(155deg, rgba(255, 255, 255, 0.18), rgba(77, 184, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    0 28px 54px rgba(3, 13, 28, 0.26);
}

.brand-glow {
  position: absolute;
  inset: 16%;
  border-radius: inherit;
  background: rgba(89, 208, 255, 0.18);
  filter: blur(28px);
}

.hero-logo {
  position: relative;
  z-index: 1;
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: drop-shadow(0 20px 28px rgba(0, 0, 0, 0.26));
}

/* Marca visual */
.brand-mark::after {
  content: '';
  position: absolute;
  inset: auto 18% 12%;
  height: 18px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(5, 14, 28, 0.34) 0%, rgba(5, 14, 28, 0.08) 66%, transparent 82%);
  filter: blur(10px);
}

.brand-mark,
.hero-logo {
  transition: transform 0.35s ease, filter 0.35s ease;
}

.visual-placeholder:hover .brand-mark {
  transform: translateY(-4px) scale(1.02);
}

.visual-placeholder:hover .hero-logo {
  filter: drop-shadow(0 24px 32px rgba(0, 0, 0, 0.3));
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





