# 📊 CONFIGURACIÓN DE PIXELS DE SEGUIMIENTO

## ✅ Pixels Implementados

Se han agregado 4 pixels de seguimiento principales:

1. **Facebook Pixel** - Meta (conversiones, audiencias personalizadas)
2. **Google Analytics** - Análisis de usuarios y comportamiento
3. **Google Ads Conversion Tracking** - Seguimiento de conversiones en Google
4. **TikTok Pixel** - Seguimiento para TikTok Ads

---

## 🔧 CONFIGURACIÓN

### 1. Facebook Pixel

**Archivo:** `index.html`

**Pasos de configuración:**

1. Abre Facebook Business Manager
2. Ve a **Eventos > Pixels**
3. Copia tu **Pixel ID**
4. En `index.html`, reemplaza:
   ```html
   fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');
   ```
   Por:
   ```html
   fbq('init', '123456789');  <!-- Tu Pixel ID -->
   ```

**Eventos que rastreamos:**
- ✅ PageView - Vista de página
- ✅ ViewContent - Vista de producto
- ✅ AddToCart - Añadir al carrito
- ✅ RemoveFromCart - Remover del carrito
- ✅ ViewCart - Ver carrito
- ✅ InitiateCheckout - Iniciar checkout
- ✅ AddPaymentInfo - Información de pago
- ✅ Purchase - Compra completada
- ✅ Search - Búsqueda
- ✅ Login - Inicio de sesión
- ✅ CompleteRegistration - Registro completado

---

### 2. Google Analytics 4

**Archivo:** `index.html`

**Pasos de configuración:**

1. Abre **Google Analytics**
2. Ve a **Admin > Propiedades**
3. Copia tu **Measurement ID** (empieza con G-)
4. En `index.html`, reemplaza AMBAS ubicaciones de:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
   gtag('config', 'YOUR_GA_ID');
   ```
   Por:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   gtag('config', 'G-XXXXXXXXXX');  <!-- Tu ID -->
   ```

**Eventos que rastreamos:**
- ✅ page_view - Vista de página
- ✅ view_item - Vista de producto
- ✅ add_to_cart - Añadir al carrito
- ✅ remove_from_cart - Remover del carrito
- ✅ view_cart - Ver carrito
- ✅ begin_checkout - Iniciar checkout
- ✅ add_payment_info - Información de pago
- ✅ purchase - Compra completada
- ✅ search - Búsqueda
- ✅ view_item_list - Vista de categoría
- ✅ login - Inicio de sesión
- ✅ sign_up - Registro completado

---

### 3. Google Ads Conversion Tracking

**Archivo:** `index.html`

**Pasos de configuración:**

1. Abre **Google Ads**
2. Ve a **Herramientas > Conversiones**
3. Copia tu **Google Ads ID** (formato: AW-XXXXXXXXXX)
4. En `index.html`, reemplaza:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=AW-YOUR_GOOGLE_ADS_ID"></script>
   gtag('config', 'AW-YOUR_GOOGLE_ADS_ID');
   ```
   Por:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=AW-123456789"></script>
   gtag('config', 'AW-123456789');  <!-- Tu ID -->
   ```

5. **Para conversiones de compra**, reemplaza en `pixelTracking.js`:
   ```javascript
   // Línea aproximada 212
   'send_to': `AW-YOUR_GOOGLE_ADS_ID/YOUR_CONVERSION_ID/YOUR_CONVERSION_LABEL`
   ```
   Por:
   ```javascript
   'send_to': `AW-123456789/ABC123/def456`
   ```

**Obtener Conversion ID y Label:**
1. Ve a **Google Ads > Conversiones**
2. Haz clic en la conversión de compra
3. Copia el **Conversion ID** y **Conversion Label**

---

### 4. TikTok Pixel

**Archivo:** `index.html`

**Pasos de configuración:**

1. Abre **TikTok Business Center**
2. Ve a **Assets > Events**
3. Copia tu **Pixel ID** (16 dígitos)
4. En `index.html`, reemplaza:
   ```javascript
   ttq.load('YOUR_TIKTOK_PIXEL_ID');
   ```
   Por:
   ```javascript
   ttq.load('1234567890123456');  <!-- Tu Pixel ID -->
   ```

**Eventos que rastreamos:**
- ✅ PageView - Vista de página
- ✅ ViewContent - Vista de producto
- ✅ AddToCart - Añadir al carrito
- ✅ Browse - Ver categoría
- ✅ Search - Búsqueda
- ✅ PlaceAnOrder - Compra completada
- ✅ CompleteRegistration - Registro completado

---

## 📝 SERVICIO DE TRACKING

### Ubicación

`src/services/pixelTracking.js`

### Métodos Disponibles

```javascript
import { pixelTracking } from '@/services/pixelTracking'

// Rastrear vista de producto
pixelTracking.trackViewProduct(product)

// Rastrear añadir al carrito
pixelTracking.trackAddToCart(product, quantity)

// Rastrear compra
pixelTracking.trackPurchase(orderId, cartItems, cartTotal, userEmail)

// Rastrear búsqueda
pixelTracking.trackSearch(searchQuery)

// Rastrear vista de categoría
pixelTracking.trackViewCategory(categoryName)

// Rastrear vista de carrito
pixelTracking.trackViewCart(cartItems, total)

// Rastrear inicio de checkout
pixelTracking.trackInitiateCheckout(cartItems, total)

// Rastrear login
pixelTracking.trackLogin()

// Rastrear registro
pixelTracking.trackSignUp()

// Rastrear evento personalizado
pixelTracking.trackCustomEvent('NombreDelEvento', { data })

// Identificar usuario (Custom Audience)
pixelTracking.identifyUser(userId, userData)
```

---

## 🎯 EVENTOS QUE YA ESTÁN RASTREADOS

### Página de Productos (`Products.vue`)
```
✅ Page View - Al cargar
✅ Search - Al buscar productos
✅ View Category - Al filtrar por categoría
✅ Add to Cart - Al añadir al carrito
```

### Página de Detalles del Producto (`ProductDetail.vue`)
```
✅ View Product - Al cargar detalles
✅ Add to Cart - Al añadir al carrito
```

### Próximamente (necesita implementación)
```
□ ViewCart - En página de carrito
□ InitiateCheckout - En checkout
□ Purchase - Cuando compra se completa
□ Login - Cuando hace login
□ SignUp - Cuando se registra
```

---

## 🔐 PRIVACIDAD Y CONSENTIMIENTO

### GDPR (Europea)

Si tienes usuarios europeos, necesitas:

1. **Banner de Consentimiento** - Implementar cookie banner
2. **Consentimiento explícito** - Para rastrear
3. **Derecho a ser olvidado** - Implementar

### CCPA (California)

Si tienes usuarios de California, necesitas:

1. **Aviso de privacidad** - Explicar tracking
2. **Derechos del usuario** - Acceso a datos

### Recomendación

Implementar una librería como:
- `@cookiepro/cookiepro` - Gestión de cookies
- `vue-gtag-with-app-router` - Google Tag Manager

---

## 🧪 TESTING DE PIXELS

### Facebook Pixel

1. Instala la extensión **Facebook Pixel Helper**
2. Abre tu sitio
3. Verifica que el pixel se carga
4. Ejecuta acciones y verifica eventos

### Google Analytics

1. Abre Google Analytics
2. Ve a **Realtime > Overview**
3. Abre tu sitio en otra pestaña
4. Verifica que aparecen eventos en realtime

### TikTok Pixel

1. Abre TikTok Business Center
2. Ve a **Analytics > Web Events**
3. Verifica que aparecen eventos

---

## 📊 CHECKLIST DE IMPLEMENTACIÓN

```
Facebook Pixel:
  [ ] Obtener Pixel ID
  [ ] Reemplazar en index.html
  [ ] Instalar Facebook Pixel Helper
  [ ] Verificar que se carga
  [ ] Verificar eventos en Facebook

Google Analytics:
  [ ] Obtener Measurement ID (G-)
  [ ] Reemplazar en index.html
  [ ] Verificar en realtime
  [ ] Crear custom events si necesita
  [ ] Configurar goals/conversiones

Google Ads:
  [ ] Obtener Google Ads ID (AW-)
  [ ] Reemplazar en index.html
  [ ] Obtener Conversion ID y Label
  [ ] Reemplazar en pixelTracking.js
  [ ] Crear audiencias

TikTok Pixel:
  [ ] Obtener Pixel ID
  [ ] Reemplazar en index.html
  [ ] Verificar en Business Center
  [ ] Crear eventos de conversión
  [ ] Configurar audiencias
```

---

## 📱 EVENTOS POR PÁGINA

### Home (Home.vue)
- PageView ✅
- Pending: Implementar si es necesario

### Productos (Products.vue)
- PageView ✅
- Search ✅
- ViewCategory ✅
- AddToCart ✅

### Detalle de Producto (ProductDetail.vue)
- PageView (implícito)
- ViewProduct ✅
- AddToCart ✅

### Carrito (Cart.vue)
- Pending: ViewCart ✅ (necesita implementarse)

### Checkout (Checkout.vue)
- Pending: InitiateCheckout ✅ (necesita implementarse)
- Pending: AddPaymentInfo (necesita implementarse)
- Pending: Purchase ✅ (necesita implementarse)

### Auth (Auth.vue)
- Pending: Login ✅ (necesita implementarse)
- Pending: SignUp ✅ (necesita implementarse)

---

## 🎨 ESTRUCTURA DE DATOS

### Estructura de Producto para Tracking

```javascript
{
  id: 1,
  nombre: "Intel Core i7",
  categoria: "Procesadores",
  precio: 450.00,
  stock: 15,
  imagen_url: "...",
  especificaciones: "..."
}
```

### Estructura de Item en Carrito para Tracking

```javascript
{
  id: 1,
  nombre: "Intel Core i7",
  precio: 450.00,
  quantity: 2
}
```

---

## 💡 TIPS

### 1. Test Mode

En desarrollo, puedes ver los eventos sin que afecten los datos reales:

```javascript
// En pixel Facebook
fbq('init', 'YOUR_FACEBOOK_PIXEL_ID', {
  test_event_code: 'TEST_EVENT_CODE'
});
```

### 2. Debug

Para ver qué se está enviando:

```javascript
// En browser console
// Facebook
fbq.getState()

// Google Analytics
gtag('config', 'YOUR_GA_ID', {
  'debug_mode': true
});
```

### 3. Usuarios Excluir

Para no rastrearte a ti mismo:

```javascript
// En pixel Facebook
fbq('set', 'user_data', {
  'em': '[email_hash]'
});
```

---

## 🚀 PRÓXIMOS PASOS

1. **Configurar los 4 pixels** en `index.html`
2. **Instalar herramientas de testing** (Pixel Helper, etc)
3. **Implementar eventos faltantes** (Cart, Checkout, Auth)
4. **Crear audiencias personalizadas** en cada plataforma
5. **Configurar remarketing** para retargeting
6. **Implementar consentimiento** de cookies (GDPR)
7. **Monitorear datos** en dashboards

---

## 📞 REFERENCIAS

### Facebook
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [Conversion API](https://developers.facebook.com/docs/marketing-api/conversion-api)

### Google Analytics
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Event Reference](https://support.google.com/analytics/answer/9267735)

### Google Ads
- [Conversion Tracking](https://support.google.com/google-ads/answer/3386730)
- [Global Site Tag](https://support.google.com/google-ads/answer/9260734)

### TikTok
- [TikTok Pixel Documentation](https://ads.tiktok.com/help/article/pixel-setup)
- [Event API](https://ads.tiktok.com/help/article/conversion-api)

---

**Implementado:** 6 de Enero de 2026
**Versión:** 1.0.0
**Estado:** ✅ Configuración Completa
