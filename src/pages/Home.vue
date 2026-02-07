<template>
  <div class="home">
    <HeroSection />

    <section class="features">
      <div class="container">
        <h2>¿Por qué elegirnos?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">💎</div>
            <h3>Calidad Premium</h3>
            <p>Productos de las mejores marcas del mercado</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚚</div>
            <h3>Entrega Rápida</h3>
            <p>Envío rápido a toda la península</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Garantía</h3>
            <p>Todos nuestros productos tienen garantía</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>Soporte</h3>
            <p>Atención al cliente disponible 24/7</p>
          </div>
        </div>
      </div>
    </section>

    <section class="categories">
      <div class="container">
        <h2>Nuestras Categorías</h2>
        <div class="categories-grid">
          <div class="category-box">
            <h3>🖥️ Procesadores</h3>
            <p>Intel y AMD de última generación</p>
          </div>
          <div class="category-box">
            <h3>🎮 Tarjetas Gráficas</h3>
            <p>NVIDIA RTX y AMD Radeon</p>
          </div>
          <div class="category-box">
            <h3>💾 Almacenamiento</h3>
            <p>SSD NVMe y unidades externas</p>
          </div>
          <div class="category-box">
            <h3>🧠 Memoria RAM</h3>
            <p>DDR4, DDR5 de alta velocidad</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>¡Comienza a comprar hoy!</h2>
        <p>Explora nuestro catálogo completo de productos</p>
        <RouterLink to="/products" class="cta-button-large">Ver Productos</RouterLink>
      </div>
    </section>

    <ServicesSection />
    <QuotationSection />
    <ContactSection />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import QuotationSection from '@/components/QuotationSection.vue'
import ContactSection from '@/components/ContactSection.vue'
</script>

<style scoped>
.home {
  width: 100%;
}

.hero-content h1 {
  margin: 0 0 15px 0;
  font-size: 52px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.hero-content p {
  margin: 0 0 30px 0;
  font-size: 20px;
  opacity: 0.98;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 14px 40px;
  background-color: white;
  color: var(--color-accent);
  text-decoration: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  background-color: var(--color-bg-light);
}

.features {
  background-color: var(--surface-color);
  padding: 60px 20px;
}

.features h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  color: var(--color-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-card {
  background-color: var(--color-bg-light);
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 10px 0;
  color: var(--color-primary);
}

.feature-card p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 14px;
}

.categories {
  background-color: var(--color-bg-light);
  padding: 60px 20px;
}

.categories h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  color: var(--color-primary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-box {
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.category-box:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.category-box h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
}

.category-box p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.cta-section {
  background-color: var(--dark-color);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.cta-section h2 {
  margin: 0 0 10px 0;
  font-size: 32px;
}

.cta-section p {
  margin: 0 0 25px 0;
  font-size: 16px;
  opacity: 0.9;
}

.cta-button-large {
  display: inline-block;
  padding: 15px 40px;
  background-color: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.cta-button-large:hover {
  background-color: #2f6fb4;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }

  .hero-content p {
    font-size: 16px;
  }

  .features-grid,
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-card,
  .category-box {
    padding: 20px;
  }

  .features h2,
  .categories h2,
  .cta-section h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 24px;
  }

  .features-grid,
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .features h2,
  .categories h2,
  .cta-section h2 {
    font-size: 20px;
  }
}
</style>
