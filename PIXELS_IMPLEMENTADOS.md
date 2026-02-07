# 📊 IMPLEMENTACIÓN DE PIXELS DE SEGUIMIENTO

## ✅ LO QUE SE AGREGÓ

### 4 Pixels de Tracking Configurados

1. **Facebook Pixel** (Meta Ads)
2. **Google Analytics 4** (GA4)
3. **Google Ads Conversion Tracking**
4. **TikTok Pixel**

### Archivos Creados/Modificados

**Nuevos:**
- ✅ `src/services/pixelTracking.js` (360+ líneas)
- ✅ `CONFIGURACION_PIXELS.md` (Guía completa)

**Modificados:**
- ✅ `index.html` - Scripts de pixels agregados
- ✅ `src/pages/ProductDetail.vue` - Tracking integrado
- ✅ `src/pages/Products.vue` - Tracking integrado

---

## 🎯 EVENTOS QUE RASTREAMOS

### Implementados Ahora ✅

```
✅ Page View - Vista de página
✅ View Product - Cuando mira detalles de producto
✅ Add To Cart - Cuando añade al carrito
✅ Search - Cuando busca productos
✅ View Category - Cuando filtra por categoría
```

### Listos para Implementar (sin configurar aún)

```
□ View Cart - Ver carrito
□ Initiate Checkout - Comenzar compra
□ Add Payment Info - Información de pago
□ Purchase - Compra completada ⭐ IMPORTANTE
□ Login - Inicio de sesión
□ Sign Up - Registro
□ Add to Wishlist - Añadir a favoritos
□ Remove From Cart - Remover del carrito
```

---

## 🚀 CÓMO USAR

### Paso 1: Obtener tus IDs

**Facebook Pixel:**
1. Facebook Business Manager → Eventos → Pixels
2. Copia tu **Pixel ID**

**Google Analytics:**
1. Google Analytics → Admin → Propiedades
2. Copia tu **Measurement ID** (empieza con G-)

**Google Ads:**
1. Google Ads → Herramientas → Conversiones
2. Copia tu **Google Ads ID** (AW-XXXXXXXXXX)

**TikTok Pixel:**
1. TikTok Business → Assets → Events
2. Copia tu **Pixel ID** (16 dígitos)

### Paso 2: Configurar en `index.html`

Reemplazar en el archivo:

```html
<!-- Facebook -->
fbq('init', 'TU_FACEBOOK_PIXEL_ID');

<!-- Google Analytics -->
gtag('config', 'TU_GA_ID');

<!-- Google Ads -->
gtag('config', 'AW-TU_GOOGLE_ADS_ID');

<!-- TikTok -->
ttq.load('TU_TIKTOK_PIXEL_ID');
```

### Paso 3: Configurar conversiones de Google Ads

En `src/services/pixelTracking.js` línea ~212:

```javascript
'send_to': `AW-TU_ID/TU_CONVERSION_ID/TU_CONVERSION_LABEL`
```

### Paso 4: Verificar que funciona

**Firefox/Chrome:**
1. Instala **Facebook Pixel Helper** (extensión)
2. Abre tu sitio
3. Ejecuta acciones (añadir al carrito, ver producto)
4. Verifica que aparecen en la extensión

**Google Analytics:**
1. Ve a Real Time → Overview
2. Abre tu sitio en otra pestaña
3. Ejecuta acciones
4. Verifica que aparecen eventos

---

## 💻 MÉTODOS DISPONIBLES

### En tus componentes

```javascript
import { pixelTracking } from '@/services/pixelTracking'

// Ver producto
pixelTracking.trackViewProduct(producto)

// Añadir al carrito
pixelTracking.trackAddToCart(producto, cantidad)

// Compra (la más importante)
pixelTracking.trackPurchase(
  orderId,
  cartItems,
  total,
  userEmail // opcional
)

// Búsqueda
pixelTracking.trackSearch(query)

// Categoría
pixelTracking.trackViewCategory(category)

// Login
pixelTracking.trackLogin()

// Registro
pixelTracking.trackSignUp()

// Personalizado
pixelTracking.trackCustomEvent('NombreEvento', { datos })
```

---

## 📊 ESTADOS DE CONFIGURACIÓN

| Pixel | Estado | IDs Necesarios |
|-------|--------|---|
| Facebook | 🟡 Scripts listos | Pixel ID |
| Google Analytics | 🟡 Scripts listos | Measurement ID |
| Google Ads | 🟡 Scripts listos | Google Ads ID + Conversion ID/Label |
| TikTok | 🟡 Scripts listos | Pixel ID |

**🟡 = Necesita IDs configurados en `index.html`**

---

## 🎯 PRÓXIMAS IMPLEMENTACIONES NECESARIAS

Para completar el tracking, necesita implementar en:

### 1. Cart.vue (Ver Carrito)
```javascript
pixelTracking.trackViewCart(cartItems, total)
```

### 2. Checkout.vue (Compra)
```javascript
// Inicio
pixelTracking.trackInitiateCheckout(items, total)

// Al completar (CRÍTICO)
pixelTracking.trackPurchase(orderId, items, total, email)
```

### 3. Auth.vue (Login/Registro)
```javascript
pixelTracking.trackLogin()
pixelTracking.trackSignUp()
```

---

## 🔒 CONSIDERACIONES DE PRIVACIDAD

### ⚠️ IMPORTANTE

Si tienes usuarios en **Europa (GDPR)** o **California (CCPA):**

1. **Implementar cookie banner** - Pedir consentimiento
2. **Cumplir GDPR** - Derecho a ser olvidado
3. **Cumplir CCPA** - Derechos del usuario

### Recomendado

Agregar librería como:
- `@cookiepro/cookiepro`
- `vue-gtag-with-app-router`

---

## 📈 BENEFICIOS

### Facebook
- ✅ Retargeting de usuarios
- ✅ Lookalike audiences
- ✅ Custom conversions
- ✅ Atribución

### Google Analytics
- ✅ Análisis de usuarios
- ✅ Embudos de conversión
- ✅ Comportamiento del sitio
- ✅ Reportes detallados

### Google Ads
- ✅ Atribución de conversiones
- ✅ Smart bidding
- ✅ Remarketing
- ✅ ROI tracking

### TikTok
- ✅ Optimización de campañas
- ✅ Audience building
- ✅ Conversion tracking
- ✅ Creative performance

---

## 📖 DOCUMENTACIÓN

Para más detalles, lee:

👉 [CONFIGURACION_PIXELS.md](CONFIGURACION_PIXELS.md)

Contiene:
- ✅ Instrucciones paso a paso
- ✅ Obtener cada ID
- ✅ Configuración completa
- ✅ Testing y debugging
- ✅ Referencias

---

## 🎉 RESUMEN

```
Pixels instalados: 4 (Facebook, Google Analytics, Google Ads, TikTok)
Eventos implementados: 5 (PageView, ViewProduct, AddToCart, Search, ViewCategory)
Eventos listos para usar: 8+ (Purchase, Login, SignUp, etc)
Tracking service: ✅ Completo (360+ líneas)
Documentación: ✅ Completa (CONFIGURACION_PIXELS.md)

Estado: 🟡 Necesita configurar IDs en index.html

Una vez configures los IDs:
Status: ✅ Listo para rastrear conversiones
```

---

**Implementado:** 6 de Enero de 2026
**Próximo paso:** Configurar los 4 IDs en `index.html`
