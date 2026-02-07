<template>
  <div id="app" class="app">
    <Header />
    <NavBar />
    <main class="main-content">
      <RouterView />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'

// Inyectar Schema Markup JSON-LD en el head
onMounted(() => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ztar Tech",
    "description": "Servicio técnico, reparación y venta de computadoras en Perú",
    "url": "https://ztartech.webcindario.com",
    "image": "https://ztartech.webcindario.com/img/ztartech-logo.png",
    "telephone": "+51978418809",
    "email": "cotizaciones@ztartech.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PE",
      "addressLocality": "Lima",
      "addressRegion": "Lima"
    },
    "areaServed": "PE",
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "45"
    },
    "service": [
      {
        "@type": "Service",
        "name": "Reparación de Computadoras",
        "description": "Servicio técnico profesional de reparación de computadoras, laptops y equipos corporativos en Perú"
      },
      {
        "@type": "Service",
        "name": "Venta de Equipos Informáticos",
        "description": "Venta de computadoras nuevas, laptops y componentes de marcas reconocidas"
      },
      {
        "@type": "Service",
        "name": "Asesoría Técnica",
        "description": "Consultoría profesional en selección de equipos y optimización de sistemas"
      }
    ]
  }

  // Crear elemento script y agregarlo al head
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schemaMarkup)
  document.head.appendChild(script)
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--light-color);
}

.main-content {
  flex: 1;
  padding: 20px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style>
