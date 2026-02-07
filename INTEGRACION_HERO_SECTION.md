# Guía de Integración - Hero Section en Home.vue

## Opción 1: Reemplazar Hero Existente (Recomendado)

### Paso 1: Actualizar el script de Home.vue
Cambiar de:
```javascript
import portadaImage from '@/img/PortadaB.jpg'
```

A:
```javascript
import HeroSection from '@/components/HeroSection.vue'
```

### Paso 2: Reemplazar la sección hero en el template

**Cambiar esto:**
```vue
<section class="hero" :style="{ backgroundImage: `url(${portadaImage})` }">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1>Bienvenido a ZTAR TECH</h1>
    <p>Tu distribuidor de confianza en computadoras y partes de alta calidad</p>
    <RouterLink to="/products" class="cta-button">Explorar Productos</RouterLink>
  </div>
</section>
```

**Por esto:**
```vue
<HeroSection />
```

### Paso 3: Eliminar estilos CSS relacionados con .hero

En Home.vue, eliminar los estilos para:
- `.hero`
- `.hero-overlay`
- `.hero-content`

Ya que están incluidos en el componente HeroSection.

---

## Opción 2: Mantener Ambas Secciones (Más Impacto Visual)

Si deseas mantener la estructura actual y agregar la nueva hero section:

```vue
<template>
  <div class="home">
    <!-- Nueva Hero Section -->
    <HeroSection />
    
    <!-- Hero original (opcional) -->
    <section class="hero" :style="{ backgroundImage: `url(${portadaImage})` }">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Bienvenido a ZTAR TECH</h1>
        <p>Tu distribuidor de confianza en computadoras y partes de alta calidad</p>
        <RouterLink to="/products" class="cta-button">Explorar Productos</RouterLink>
      </div>
    </section>

    <!-- Resto del contenido -->
    <section class="features">
      ...
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import portadaImage from '@/img/PortadaB.jpg'
</script>
```

---

## Ejemplo Completo Actualizado: Home.vue

```vue
<template>
  <div class="home">
    <!-- Nueva Hero Section Profesional -->
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
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
</script>

<style scoped>
/* Resto de estilos del Home.vue original, pero SIN los estilos de .hero, .hero-overlay, .hero-content */
</style>
```

---

## Configuración de Contacto (Opcional pero Recomendado)

Si deseas que el botón "Solicitar Cotización" funcione completamente, agrega esta sección:

```vue
<section class="contact-section">
  <div class="container">
    <h2>Solicitar Cotización</h2>
    <form @submit.prevent="submitQuote">
      <div class="form-group">
        <label for="name">Nombre completo</label>
        <input v-model="form.name" type="text" id="name" required>
      </div>
      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input v-model="form.email" type="email" id="email" required>
      </div>
      <div class="form-group">
        <label for="phone">Teléfono</label>
        <input v-model="form.phone" type="tel" id="phone" required>
      </div>
      <div class="form-group">
        <label for="service">Servicio requerido</label>
        <select v-model="form.service" id="service" required>
          <option value="">Selecciona un servicio</option>
          <option value="purchase">Compra de equipos</option>
          <option value="repair">Reparación técnica</option>
          <option value="maintenance">Mantenimiento</option>
          <option value="other">Otro</option>
        </select>
      </div>
      <div class="form-group">
        <label for="message">Detalles</label>
        <textarea v-model="form.message" id="message" rows="5"></textarea>
      </div>
      <button type="submit" class="submit-btn">Enviar Cotización</button>
    </form>
  </div>
</section>
```

---

## Checklist de Integración

- [ ] Copiar `HeroSection.vue` a `src/components/`
- [ ] Importar `HeroSection` en `Home.vue`
- [ ] Reemplazar la sección hero existente con `<HeroSection />`
- [ ] Actualizar número de WhatsApp en `HeroSection.vue`
- [ ] Probar en navegador (escritorio)
- [ ] Probar en móvil (responsive)
- [ ] Ajustar colores si es necesario
- [ ] Crear sección de contacto (opcional)
- [ ] Verificar links y CTAs funcionan correctamente

---

## Troubleshooting

### Problema: Los botones no funcionan
**Solución**: Verificar que el número de WhatsApp está configurado correctamente sin espacios ni caracteres especiales.

### Problema: La sección se ve cortada en móvil
**Solución**: El componente incluye responsive design automático. Si persiste, limpiar caché del navegador.

### Problema: Las animaciones se ven lentas
**Solución**: Las animaciones usan CSS nativo, no requieren configuración adicional. Verificar performance del dispositivo.

### Problema: El scroll a contacto no funciona
**Solución**: Asegurar que existe una sección con la clase `contact-section` en el mismo documento.

