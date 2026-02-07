# 🎯 GUÍA PASO A PASO - Implementación Hero Section

## PASO 1: Verificar archivo HeroSection.vue ✓

El archivo ya está creado en:
```
src/components/HeroSection.vue
```

Este archivo contiene:
- HTML de la hero section
- Vue script con funciones de botones
- CSS responsive completo

---

## PASO 2: Abrir Home.vue

Archivo a editar: `src/pages/Home.vue`

Abre el archivo y localiza la sección `<template>`.

---

## PASO 3: Importar HeroSection

**Cambiar esto:**
```javascript
<script setup>
import { RouterLink } from 'vue-router'
import portadaImage from '@/img/PortadaB.jpg'
</script>
```

**Por esto:**
```javascript
<script setup>
import { RouterLink } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
</script>
```

---

## PASO 4: Reemplazar sección hero

En el `<template>`, busca:
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

**Reemplaza toda esa sección con:**
```vue
<HeroSection />
```

---

## PASO 5: Limpiar estilos (Opcional)

En Home.vue, en la sección `<style scoped>`, elimina estos estilos:
- `.hero`
- `.hero-overlay`
- `.hero-content`

Ya que están incluidos en HeroSection.vue.

---

## PASO 6: Configurar WhatsApp (IMPORTANTE ⚠️)

Abre: `src/components/HeroSection.vue`

Busca esta línea (alrededor de línea 57):
```javascript
const phoneNumber = '51XXXXXXXXX' // Reemplazar con número real
```

**Cambiala por el número real de Ztar Tech:**
```javascript
const phoneNumber = '51987654321' // Ejemplo: +51 987 654 321
```

El formato debe ser:
- Sin espacios
- Sin guiones
- Sin paréntesis
- 12 dígitos (código país + número)

---

## PASO 7: Probar en navegador

1. Guarda los cambios (`Ctrl + S`)
2. Abre el navegador en `http://localhost:5173/`
3. Deberías ver el nuevo hero section con:
   - Fondo azul gradiente
   - Título "Soluciones Informáticas Integrales"
   - Dos botones
   - Insignias de confianza

---

## PASO 8: Probar CTAs

### Botón "Solicitar Cotización"
- Click debe desplazarte hacia sección de contacto
- Si no existe, crear una o modificar función

### Botón "Contactar por WhatsApp"
- Click debe abrir WhatsApp con mensaje predefinido
- Verificar que el número está correcto

---

## PASO 9: Probar Responsiveness

Abre Developer Tools (`F12`) y:

### Tablet (768px)
- Press: `Ctrl + Shift + M`
- Verifica que el layout es correcto

### Móvil (375px)
- Selecciona iPhone SE en device toolbar
- Verifica que texto y botones son legibles
- Verifica que botones son full-width

### Móvil Pequeño (280px)
- Selecciona custom size: 280x600
- Verifica que no hay overflow

---

## PASO 10: Ajustes Finales (Opcional)

### Cambiar texto
Edita strings en `HeroSection.vue` (template)

### Cambiar colores
Edita variables en `<style scoped>`:
```css
.hero-section {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  /* Cambia estos colores */
}

.highlight {
  color: #4db8ff;
  /* Cambia este color de destaque */
}
```

### Cambiar iconos
Reemplaza emojis por otros Unicode:
```html
<span class="cta-icon">📋</span>  ← Cambia emoji
```

---

## TROUBLESHOOTING

### ❌ Problema: Hero section no aparece
**Solución:**
1. Verifica que `HeroSection.vue` está en `src/components/`
2. Verifica que está importado en `Home.vue`
3. Verifica que `<HeroSection />` está en el template
4. Recarga la página (F5)

### ❌ Problema: Estilos no se aplican
**Solución:**
1. Limpia cache del navegador (Ctrl + Shift + Delete)
2. Reconstruye el proyecto: `npm run dev`
3. Verifica que no hay conflictos CSS

### ❌ Problema: WhatsApp no abre
**Solución:**
1. Verifica número en formato correcto (51 + 9 dígitos)
2. Prueba directamente: `https://wa.me/51987654321`
3. Verifica que tienes WhatsApp instalado

### ❌ Problema: Botón "Solicitar Cotización" no funciona
**Solución:**
1. Verifica que existe sección con clase `contact-section`
2. Si no existe, crea una o cambia el scroll a otra sección
3. Edita función `openQuotation()` en `HeroSection.vue`

### ❌ Problema: Se ve cortado en móvil
**Solución:**
1. Verifica viewport en index.html
2. Limpia cache y recarga
3. Prueba en otro navegador

---

## VERSIÓN ALTERNATIVA: HTML Standalone

Si prefieres ver la demo sin Vue:

Abre: `HERO_SECTION_STANDALONE.html`

Este archivo contiene la versión pura HTML/CSS que puedes:
- Abrir directamente en navegador
- Usar como referencia visual
- Modificar sin necesidad de Vue

---

## LISTA DE VERIFICACIÓN FINAL

```
[ ] HeroSection.vue está en src/components/
[ ] Home.vue importa HeroSection
[ ] Home.vue contiene <HeroSection />
[ ] Número de WhatsApp está configurado
[ ] Página carga sin errores (F12 → Console)
[ ] Hero section aparece visualmente
[ ] Botones son clickeables
[ ] Responsive en móvil
[ ] Textos son correctos
[ ] Colores son correctos
[ ] Animaciones funcionan
[ ] Links no están rotos
```

---

## ESTIMADO DE TIEMPO

- Paso 1: 1 minuto (verificación)
- Paso 2-3: 2 minutos (edición)
- Paso 4-5: 3 minutos (reemplazo)
- Paso 6: 5 minutos (configuración)
- Paso 7-9: 10 minutos (testing)
- Paso 10: Opcional (personalización)

**Total: ~20 minutos**

---

## AYUDA ADICIONAL

Si necesitas más detalles:

- **Documentación técnica**: [HERO_SECTION_ZTARTECH.md](./HERO_SECTION_ZTARTECH.md)
- **Guía de integración**: [INTEGRACION_HERO_SECTION.md](./INTEGRACION_HERO_SECTION.md)
- **Variantes de texto**: [VARIANTES_HERO_SECTION.md](./VARIANTES_HERO_SECTION.md)
- **Demo HTML**: [HERO_SECTION_STANDALONE.html](./HERO_SECTION_STANDALONE.html)

---

## SOPORTE

¿Algo no funciona?

1. Verifica la consola (F12 → Console) para errores
2. Comprueba que todos los archivos están en el lugar correcto
3. Asegúrate de que guardaste los cambios (Ctrl + S)
4. Intenta recarga dura del navegador (Ctrl + Shift + R)

---

**¡Listo! Tu hero section está completa y lista para usar.** 🚀

