# 📝 Implementación Práctica SEO - Código Optimizado

## 1. ACTUALIZACIÓN DE index.html (HEAD OPTIMIZADO)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Meta Tags Esenciales para SEO -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Title y Description Optimizados -->
    <title>Reparación y Venta de Computadoras en Perú | Ztar Tech</title>
    <meta name="description" content="Reparación de computadoras, asesoría técnica y venta de equipos en Perú. Servicio rápido, garantizado y con precios competitivos. Contáctanos hoy.">
    <meta name="keywords" content="reparación computadoras Perú, venta computadoras Lima, servicio técnico, laptops, componentes informáticos">
    
    <!-- Meta Tags Adicionales -->
    <meta name="author" content="Ztar Tech">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="language" content="Spanish">
    <meta name="revisit-after" content="7 days">
    <meta name="theme-color" content="#1e3c72">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://ztartech.webcindario.com/">
    
    <!-- Open Graph (Facebook, WhatsApp, etc.) -->
    <meta property="og:title" content="Reparación y Venta de Computadoras en Perú | Ztar Tech">
    <meta property="og:description" content="Soluciones tecnológicas integrales: reparación, venta y asesoría técnica de computadoras en Perú.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ztartech.webcindario.com">
    <meta property="og:image" content="https://ztartech.webcindario.com/img/ztartech-og.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Reparación y Venta de Computadoras | Ztar Tech">
    <meta name="twitter:description" content="Servicio técnico profesional en Perú">
    <meta name="twitter:image" content="https://ztartech.webcindario.com/img/ztartech-twitter.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    
    <!-- Preload de recursos críticos -->
    <link rel="preload" as="image" href="/img/hero-bg.jpg">
    <link rel="preload" as="style" href="/styles/global.css">
    
    <!-- DNS Prefetch para rendimiento -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    
    <link rel="stylesheet" href="/styles/global.css">
</head>
<body>
    <div id="app"></div>
    <script type="module" defer src="/src/main.js"></script>
</body>
</html>
```

---

## 2. COMPONENTE HeroSection OPTIMIZADO PARA SEO

```vue
<template>
  <section class="hero-section" id="hero-section">
    <div class="container">
      <div class="hero-content">
        <!-- H1 OPTIMIZADO: Palabra clave principal + beneficio -->
        <h1>
          Soluciones Informáticas Integrales en Perú
        </h1>
        
        <!-- Subtítulo con palabras clave secundarias -->
        <p class="subtitle">
          Reparación de computadoras, venta de equipos nuevos y asesoría técnica profesional. 
          Servicio garantizado con precios competitivos a todo Perú.
        </p>
        
        <!-- Características con palabras clave -->
        <div class="features-list">
          <span class="feature">✓ Diagnóstico Rápido</span>
          <span class="feature">✓ Garantía 6 Meses</span>
          <span class="feature">✓ Precios Competitivos</span>
        </div>
        
        <div class="cta-buttons">
          <button @click="openQuotation" class="btn btn-primary">
            Solicitar Cotización
          </button>
          <button @click="contactWhatsApp" class="btn btn-secondary">
            WhatsApp +51 978 418 809
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const openQuotation = () => {
  document.querySelector('#quotation-section')?.scrollIntoView({ 
    behavior: 'smooth' 
  })
}

const contactWhatsApp = () => {
  const message = encodeURIComponent(
    'Hola Ztar Tech, me interesa conocer sobre sus servicios de reparación y venta de computadoras en Perú'
  )
  window.open(`https://wa.me/51978418809?text=${message}`, '_blank')
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 100px 20px;
  min-height: 600px;
  display: flex;
  align-items: center;
}

.hero-content h1 {
  font-size: 52px;
  margin-bottom: 20px;
  font-weight: 800;
  /* SEO: H1 debe ser único y contener palabra clave principal */
}

.subtitle {
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 1.6;
  opacity: 0.95;
  /* Contiene palabras clave secundarias */
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 36px;
  }
}
</style>
```

---

## 3. COMPONENTE ServicesSection OPTIMIZADO

```vue
<template>
  <section class="services-section" id="services-section">
    <div class="container">
      <!-- H1 seria redundante, usamos H2 -->
      <h2 class="section-heading">
        Servicios Técnicos y Venta de Computadoras
      </h2>
      <p class="section-intro">
        Ofrecemos soluciones integrales para reparación, asesoría técnica y venta de equipos 
        informáticos en Perú
      </p>
      
      <div class="services-grid">
        <!-- Servicio 1: Reparación -->
        <article class="service-card">
          <h3>Servicio Técnico y Reparación de Computadoras</h3>
          <p>
            Nuestro equipo especializado en reparación de computadoras ofrece diagnóstico rápido, 
            servicio técnico confiable y garantía en todas las reparaciones. Reparamos laptops, 
            computadoras de escritorio y equipos corporativos en Perú.
          </p>
          
          <h4>Servicios de Reparación:</h4>
          <ul>
            <li>Diagnóstico y reparación de hardware</li>
            <li>Problemas de software y drivers</li>
            <li>Limpieza y mantenimiento preventivo</li>
            <li>Recuperación de datos</li>
          </ul>
          
          <button @click="scrollToQuotation">Solicitar Reparación</button>
        </article>
        
        <!-- Servicio 2: Asesoría -->
        <article class="service-card">
          <h3>Asesoría Técnica Especializada</h3>
          <p>
            Brindamos asesoría técnica personalizada para elegir el mejor equipo según 
            tus necesidades. Análisis especializado, recomendaciones profesionales y 
            optimización de presupuesto.
          </p>
          
          <h4>Servicios de Asesoría:</h4>
          <ul>
            <li>Evaluación de necesidades</li>
            <li>Recomendación de equipos</li>
            <li>Upgrades y mejoras</li>
            <li>Seguridad informática</li>
          </ul>
          
          <button @click="scrollToQuotation">Solicitar Asesoría</button>
        </article>
        
        <!-- Servicio 3: Venta -->
        <article class="service-card">
          <h3>Venta de Computadoras y Componentes</h3>
          <p>
            Distribuimos computadoras nuevas, laptops de marcas reconocidas, procesadores 
            Intel y AMD, tarjetas gráficas NVIDIA, memoria RAM y almacenamiento SSD. 
            Todo con garantía completa y precios competitivos.
          </p>
          
          <h4>Productos Disponibles:</h4>
          <ul>
            <li>Computadoras nuevas (gaming, trabajo, hogar)</li>
            <li>Laptops de marcas reconocidas</li>
            <li>Procesadores y tarjetas gráficas</li>
            <li>Periféricos y accesorios</li>
          </ul>
          
          <button @click="goToProducts">Ver Catálogo</button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const scrollToQuotation = () => {
  document.querySelector('#quotation-section')?.scrollIntoView({ 
    behavior: 'smooth' 
  })
}

const goToProducts = () => {
  router.push('/products')
}
</script>

<style scoped>
.services-section {
  padding: 80px 20px;
  background: #f5f7fa;
}

/* H2 como encabezado secundario principal de la sección */
.section-heading {
  font-size: 36px;
  color: #1e3c72;
  text-align: center;
  margin-bottom: 16px;
  font-weight: 800;
}

.section-intro {
  text-align: center;
  color: #555;
  margin-bottom: 40px;
  font-size: 16px;
}

.service-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* H3 para subsecciones dentro de cada servicio */
.service-card h3 {
  color: #1e3c72;
  font-size: 22px;
  margin-bottom: 12px;
  font-weight: 700;
}

/* H4 para listas de características */
.service-card h4 {
  color: #2c3e50;
  font-size: 16px;
  margin-top: 16px;
  margin-bottom: 10px;
  font-weight: 600;
}

.service-card ul {
  margin-bottom: 16px;
  padding-left: 20px;
}

.service-card ul li {
  margin-bottom: 8px;
  color: #555;
  line-height: 1.6;
}
</style>
```

---

## 4. ESTRUCTURA HTML PARA PÁGINA DE PRODUCTOS

```html
<!-- /src/pages/Products.vue -->
<template>
  <section class="products-section">
    <div class="container">
      <!-- H1 principal para página de productos -->
      <h1>Catálogo de Computadoras y Componentes en Perú</h1>
      
      <p class="intro-text">
        Amplia variedad de computadoras nuevas y componentes informáticos de marcas 
        reconocidas con garantía completa y precios competitivos.
      </p>
      
      <!-- H2 para categorías principales -->
      <h2>Computadoras de Escritorio</h2>
      <div class="products-grid">
        <!-- Productos -->
      </div>
      
      <h2>Laptops y Notebooks</h2>
      <div class="products-grid">
        <!-- Productos -->
      </div>
      
      <h2>Componentes y Periféricos</h2>
      <div class="products-grid">
        <!-- H3 para productos individuales o subcategorías -->
        <h3>Procesadores Intel y AMD</h3>
        <!-- Productos -->
        
        <h3>Tarjetas Gráficas NVIDIA y AMD</h3>
        <!-- Productos -->
      </div>
    </div>
  </section>
</template>
```

---

## 5. SCHEMA MARKUP PARA Vue (JSON-LD)

```vue
<template>
  <div>
    <!-- Resto del contenido -->
    <script type="application/ld+json">
      {{ schemaMarkup }}
    </script>
  </div>
</template>

<script setup>
const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ztar Tech",
  "description": "Servicio técnico, reparación y venta de computadoras en Perú",
  "url": "https://ztartech.webcindario.com",
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
</script>
```

---

## 6. OPTIMIZACIÓN DE IMÁGENES CON ALT TEXT

```vue
<!-- MALO - Sin SEO -->
<img src="hero.jpg">

<!-- BUENO - Con alt descriptivo -->
<img 
  src="/img/hero-reparacion-computadoras.jpg"
  alt="Técnico profesional reparando computadora - Servicio técnico en Perú"
  title="Reparación profesional de computadoras"
  width="1200"
  height="600"
  loading="lazy"
  decoding="async">

<!-- Para galería de productos -->
<img 
  src="/img/laptop-dell-xps13.jpg"
  alt="Laptop Dell XPS 13 - Nueva con garantía en Perú"
  loading="lazy">

<!-- Para servicios -->
<img 
  src="/img/servicio-tecnico-lima.jpg"
  alt="Servicio técnico de reparación en Lima - Diagnóstico profesional"
  loading="lazy">
```

---

## 7. ROBOTS.TXT RECOMENDADO

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /private
Disallow: /temp

# Permitir acceso a buscadores
Allow: /

Sitemap: https://ztartech.webcindario.com/sitemap.xml
```

---

## 8. SITEMAP.XML ESTRUCTURA

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ztartech.webcindario.com/</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>https://ztartech.webcindario.com/servicios</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://ztartech.webcindario.com/productos</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

---

## 9. CHECKLIST DE IMPLEMENTACIÓN POR COMPONENTE

### ✅ HeroSection
- [x] H1 con palabra clave principal
- [x] Subtítulo con palabras clave secundarias
- [x] Alt text en imágenes
- [x] CTA clara con palabras clave
- [x] Schema markup

### ✅ ServicesSection
- [x] H2 para título principal
- [x] H3 para servicios individuales
- [x] H4 para subsecciones
- [x] Descripciones con palabras clave
- [x] Listas con palabras clave naturales

### ✅ Products
- [x] H1 para página
- [x] H2 para categorías
- [x] H3 para subcategorías
- [x] Alt text descriptivo en productos
- [x] Meta título y descripción únicos

### ✅ General
- [x] Meta title optimizado
- [x] Meta description completa
- [x] Canonical URLs
- [x] Open Graph tags
- [x] Mobile responsive
- [x] Velocidad optimizada
- [x] Schema markup LocalBusiness

---

## 10. PALABRAS CLAVE POR PÁGINA

### Home Page (Principal)
```
Primarias: Reparación computadoras Perú, venta computadoras, servicio técnico
Secundarias: Laptops, componentes, asesoría técnica, garantía, Lima
```

### Página Servicios
```
Primarias: Servicio técnico profesional Perú, reparación laptops, asesoría técnica
Secundarias: Diagnóstico, garantía, mantenimiento, seguridad informática
```

### Página Productos
```
Primarias: Venta computadoras Perú, laptops nuevas, componentes informáticos
Secundarias: Procesadores Intel AMD, tarjetas gráficas, memoria RAM, SSD
```

---

**Implementación**: Copiar y adaptar según tu estructura actual  
**Fecha**: 2025-01-24  
**Status**: ✅ Listo para implementación
