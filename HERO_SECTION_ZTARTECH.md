# Hero Section - Ztar Tech
## Soluciones Informáticas Integrales

### Descripción General
Componente hero section profesional y de alto impacto para Ztar Tech, especializado en venta y reparación de computadoras en Perú.

---

## Características Incluidas

### 1. **Título Principal Potente**
```
Soluciones Informáticas Integrales
```
- Transmite profesionalismo y amplitud de servicios
- Palabra clave "Integrales" destacada en azul para énfasis
- Diseño moderno y técnico

### 2. **Subtítulo Descriptivo**
```
Venta de computadoras de última generación y servicio técnico especializado 
en reparación y mantenimiento. Brindamos soluciones confiables respaldadas 
por profesionales certificados.
```
- Explica claramente los dos servicios principales: venta y reparación
- Transmite confianza y profesionalismo
- Menciona certificaciones y especialización
- Español neutro, profesional

### 3. **Características Clave Visuales**
Tres puntos destacados para reforzar la propuesta de valor:
- ✓ Venta de equipos nuevos y de calidad
- ✓ Reparación técnica especializada
- ✓ Garantía en todos nuestros servicios

### 4. **Llamadas a la Acción (CTAs)**

#### a) **Botón Primario: "Solicitar Cotización"**
- Color destacado (azul claro)
- Acción: Desplaza hacia sección de contacto o formulario
- Emoticono: 📋 (relevante para documentación/cotización)

#### b) **Botón Secundario: "Contactar por WhatsApp"**
- Borde transparente, fondo sutil
- Acción: Abre WhatsApp con mensaje predefinido
- Emoticono: 💬 (comunicación directa)

### 5. **Insignias de Confianza (Trust Badges)**
```
+15 años de experiencia
Servicio técnico profesional certificado
Entrega rápida a todo Perú
```
- Refuerzan credibilidad y experiencia
- Tres puntos clave de diferenciación
- Diseño minimalista y profesional

---

## Paleta de Colores

| Elemento | Color | Hex | Uso |
|----------|-------|-----|-----|
| Fondo Principal | Azul Gradiente | #1e3c72 → #2a5298 | Fondo profesional |
| Acentos Primarios | Azul Claro | #4db8ff | CTAs y destaque |
| Texto Principal | Blanco | #ffffff | Títulos |
| Texto Secundario | Gris Claro | #e0e0e0 | Subtítulos |
| Texto Terciario | Gris Pálido | #b8b8b8 | Información complementaria |

---

## Estructura HTML/Vue

```vue
<HeroSection />
```

El componente es completamente autónomo e incluye:
- Animaciones suaves (fadeInUp, float, wave)
- Responsiveness para móvil, tablet y escritorio
- Eventos clickables en botones
- SVG iconográfico integrado

---

## Implementación

### 1. **Integración en Home.vue**

Reemplazar la sección hero existente o añadir arriba:

```vue
<template>
  <div class="home">
    <HeroSection />
    <!-- resto del contenido -->
  </div>
</template>

<script setup>
import HeroSection from '@/components/HeroSection.vue'
</script>
```

### 2. **Configuración de WhatsApp**

En `HeroSection.vue`, línea donde dice:
```javascript
const phoneNumber = '51XXXXXXXXX' // Reemplazar con número real
```

Cambiar a número real de Ztar Tech (formato internacional):
```javascript
const phoneNumber = '51987654321' // Ejemplo: +51 987 654 321
```

### 3. **Sección de Contacto**

Para que el botón "Solicitar Cotización" funcione correctamente, asegurarse de tener una sección con clase `contact-section`:

```vue
<section class="contact-section">
  <!-- Formulario de contacto -->
</section>
```

---

## Características Técnicas

### Animaciones Incluidas
- **fadeInUp**: Contenido se desliza hacia arriba al cargar
- **float**: Elemento visual flota suavemente
- **wave**: Onda decorativa inferior se mueve continuamente

### Responsive Breakpoints
- **Desktop**: 1200px+ (dos columnas)
- **Tablet**: 769px - 1199px (dos columnas, spacing reducido)
- **Mobile**: 480px - 768px (una columna)
- **Móvil Pequeño**: < 480px (optimizado para pantalla reducida)

### Optimizaciones
- Backdrop filters para efecto moderno
- Box shadows sutiles para profundidad
- Transiciones smooth (0.3s) en interacciones
- SVG integrado (no requiere assets externos)
- Fuentes nativas del navegador (sin descargas)

---

## Mensajes Predefinidos

### Mensaje WhatsApp Automático
```
Hola, me interesa solicitar información sobre sus servicios de venta 
y reparación de computadoras.
```

Personalizable modificando la variable `message` en la función `openWhatsApp()`.

---

## Copiar/Pegar Directo

### Título
**Soluciones Informáticas Integrales**

### Subtítulo
**Venta de computadoras de última generación y servicio técnico especializado en reparación y mantenimiento. Brindamos soluciones confiables respaldadas por profesionales certificados.**

### CTA 1
**Solicitar Cotización** (📋)

### CTA 2
**Contactar por WhatsApp** (💬)

### Características
1. Venta de equipos nuevos y de calidad
2. Reparación técnica especializada
3. Garantía en todos nuestros servicios

### Insignias
1. **+15 años** de experiencia
2. **Servicio técnico** profesional certificado
3. **Entrega rápida** a todo Perú

---

## Notas de Marca

- El tono es **profesional y técnico**, no casual
- Se enfatiza **experiencia, garantía y especialización**
- El idioma es **español neutro**, sin regionalismos
- Los colores azules transmiten **confianza y tecnología**
- El diseño es **moderno pero corporativo**, no minimalista extremo

---

## Próximos Pasos

1. ✅ Componente creado: `HeroSection.vue`
2. ⏳ Integrar en `Home.vue`
3. ⏳ Configurar número de WhatsApp real
4. ⏳ Crear/vincular sección de contacto
5. ⏳ Probar responsiveness en dispositivos reales
6. ⏳ Ajustar colores si es necesario según brand guidelines

