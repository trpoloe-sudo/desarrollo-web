# 🎨 ARQUITECTURA - Secciones Detalladas de Productos

## 📐 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                          APLICACIÓN                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      App.vue                              │  │
│  │  (Router principal)                                       │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                           │
│       ┌─────────────┼─────────────┐                            │
│       │             │             │                            │
│       ↓             ↓             ↓                            │
│  ┌─────────┐  ┌──────────┐  ┌─────────────────┐              │
│  │ Home.vue│  │Products. │  │ ProductDetail.  │              │
│  │         │  │   vue    │  │   vue (NUEVO)   │              │
│  │ /       │  │ /products│  │ /product/:id    │              │
│  └─────────┘  │ /product │  └────────┬────────┘              │
│               │  os      │           │                        │
│               └──────┬───┘           │                        │
│                      │               │                        │
│        ┌─────────────┴───────────────┴──────────┐            │
│        │                                         │            │
│        │      RouterLink hacia ProductDetail     │            │
│        │      (al hacer clic en producto)       │            │
│        │                                         │            │
│        └─────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Estructura de ProductDetail.vue

```
ProductDetail.vue (/product/:id)
│
├─ Breadcrumb
│  └─ Productos > Nombre del Producto
│
├─ Loading State (si está cargando)
│
├─ ProductDetails.vue (NUEVO COMPONENTE)
│  │
│  ├─ Sección de Imagen
│  │  └─ [Imagen ampliada]
│  │
│  └─ Sección de Información
│     ├─ Categoría (etiqueta)
│     ├─ Nombre del producto
│     ├─ Rating (⭐)
│     ├─ Descripción
│     ├─ Precio
│     ├─ Stock
│     ├─ Especificaciones
│     ├─ Selector de Cantidad
│     │  ├─ Botón -
│     │  ├─ Input número
│     │  └─ Botón +
│     ├─ Botón Añadir Carrito
│     ├─ Botón Favoritos
│     └─ Info Adicional
│        ├─ Envío gratis
│        ├─ Devolución
│        ├─ Garantía
│        └─ Pago seguro
│
├─ Productos Relacionados (sección nueva)
│  │
│  └─ Grid de ProductCard
│     ├─ [ProductCard 1]
│     ├─ [ProductCard 2]
│     ├─ [ProductCard 3]
│     └─ [ProductCard 4]
│
└─ Reseñas de Clientes (sección nueva)
   │
   └─ Grid de Reviews
      ├─ [Review 1 - Juan García]
      ├─ [Review 2 - María López]
      └─ [Review 3 - Carlos Rodríguez]
```

---

## 🔄 Flujo de Datos

```
googleSheetsAPI
    │
    ↓
getProducts() → Obtiene lista de productos
    │
    ├─→ ProductDetail.vue (onMounted)
    │   │
    │   ├─→ products.value = [...]
    │   │
    │   ├─→ product (computed) = busca por ID
    │   │
    │   ├─→ relatedProducts (computed)
    │   │   └─ Filtra por categoría
    │   │
    │   ├─→ ProductDetails
    │   │   ├─ Muestra info
    │   │   ├─ Emit: add-to-cart
    │   │   └─ Emit: toggle-favorite
    │   │
    │   ├─→ ProductCard[] (relacionados)
    │   │   └─ Navegable a otro /product/:id
    │   │
    │   └─→ Reviews (estáticas)
    │
    └─→ ProductCard (en Products.vue)
        └─ Navegable a ProductDetail
```

---

## 🎯 Estados de Componente

```
ProductDetail.vue Estados:

┌──────────────┐
│   MOUNTED    │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   LOADING    │  ← loading = true
│ "Cargando... │     Mostrar spinner
└──────┬───────┘
       │
       ↓ (productos cargados)
┌──────────────────────┐
│ LOADED + PRODUCT OK  │  ← product existe
│ Mostrar detalles     │     loading = false
└──────┬───────────────┘
       │
       └─→ ProductDetails ✅
       └─→ RelatedProducts ✅
       └─→ Reviews ✅

       ↓
┌──────────────────────┐
│ LOADED + NO PRODUCT  │  ← product = undefined
│ Mostrar "No existe"  │     loading = false
└──────┬───────────────┘
       │
       └─→ "Producto no encontrado" ✅
           [Botón volver a productos]
```

---

## 💾 Integración con Stores

```
ProductDetails.vue
    │
    ├─→ cartStore
    │   │
    │   └─ addItem(product) × quantity
    │      └─ Persistencia en localStorage
    │
    └─→ favoritesStore
        │
        └─ toggleFavorite(id)
           └─ Persistencia en localStorage
```

---

## 🗂️ Estructura de Carpetas

```
Desarrollo web/
│
├─ src/
│  │
│  ├─ components/
│  │  ├─ Auth.vue
│  │  ├─ Footer.vue
│  │  ├─ Header.vue
│  │  ├─ NavBar.vue
│  │  ├─ ProductCard.vue         ✏️ MODIFICADO
│  │  └─ ProductDetails.vue      ✨ NUEVO
│  │
│  ├─ pages/
│  │  ├─ Admin.vue
│  │  ├─ Auth.vue
│  │  ├─ Cart.vue
│  │  ├─ Checkout.vue
│  │  ├─ Dashboard.vue
│  │  ├─ Home.vue
│  │  ├─ Products.vue
│  │  └─ ProductDetail.vue       ✨ NUEVO
│  │
│  ├─ stores/
│  │  ├─ cart.js
│  │  ├─ cartStore.js
│  │  ├─ favorites.js
│  │  ├─ user.js
│  │  └─ ... (test files)
│  │
│  ├─ services/
│  │  └─ googleSheetsAPI.js
│  │
│  ├─ styles/
│  │  └─ global.css
│  │
│  ├─ App.vue
│  └─ main.js                    ✏️ MODIFICADO
│
├─ SECCION_DETALLES_PRODUCTOS.md  ✨ NUEVO
├─ GUIA_DETALLES_PRODUCTOS.md     ✨ NUEVO
├─ EJEMPLOS_IMPLEMENTACION.md     ✨ NUEVO
├─ RESUMEN_SECCIONES_PRODUCTOS.md ✨ NUEVO
├─ CHECKLIST_SECCIONES_PRODUCTOS.md ✨ NUEVO
└─ ... (otros archivos)
```

---

## 🔌 Ruteo

```
main.js - Configuración de Rutas:

                        ┌─────────────────┐
                        │  createRouter   │
                        └────────┬────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ↓                ↓                ↓
            Home.vue         Products.vue    ProductDetail.vue ✨ NUEVO
            (/​)            (/products)      (/product/:id)
                           (/productos)     (/producto/:id)
```

---

## 🎨 Estilos y Responsive

```
Breakpoints:

Desktop (1200px+)
├─ Details: 2 columnas [Imagen | Info]
├─ Related: 4 columnas
└─ Reviews: 3 columnas

Tablet (768px - 1199px)
├─ Details: 2 columnas [Imagen | Info]
├─ Related: 3 columnas
└─ Reviews: 2 columnas

Mobile (<768px)
├─ Details: Stack vertical
├─ Related: 1-2 columnas
└─ Reviews: 1 columna
   └─ Botones: 100% ancho
```

---

## 📊 Flujo de Usuario

```
USUARIO ENTRA EN LA APP
    │
    ↓
Home.vue (/)
    │
    ├─ Botón "Ver Productos"
    │
    ↓
Products.vue (/products)
    │
    ├─ Filtros
    ├─ Búsqueda
    ├─ Grid de ProductCard[]
    │  │
    │  ├─ Favorito (❤️)
    │  ├─ Añadir Carrito
    │  │
    │  └─ CLIC EN TARJETA
    │     │
    │     ↓
    │  ProductDetail.vue (/product/:id)
    │     │
    │     ├─ Breadcrumb
    │     ├─ ProductDetails
    │     │  ├─ Ver imagen ampliada
    │     │  ├─ Leer detalles
    │     │  ├─ Seleccionar cantidad
    │     │  ├─ Añadir carrito
    │     │  └─ Favoritos
    │     │
    │     ├─ Productos Relacionados
    │     │  └─ Clic lleva a otro /product/:id
    │     │
    │     └─ Reseñas
    │        └─ Leer opiniones
    │
    └─ Ir al Carrito (/cart)
       └─ Checkout (/checkout)
```

---

## 🔄 Ciclo de Vida

```
ProductDetail.vue Ciclo:

1. MOUNTED
   └─ Llamar googleSheetsAPI.getProducts()
      ├─ loading = true
      └─ Obtener lista de productos

2. LOADING
   └─ Mostrar spinner
   └─ Esperar respuesta

3. DATOS RECIBIDOS
   ├─ products.value = [...]
   ├─ loading = false
   ├─ Computar product (por ID)
   └─ Computar relatedProducts (por categoría)

4. RENDER
   ├─ Si product existe → Mostrar detalles
   └─ Si no existe → Mostrar "no encontrado"

5. INTERACCIÓN
   ├─ Usuario selecciona cantidad
   ├─ Usuario hace clic en "Añadir carrito"
   │  └─ Emit: add-to-cart
   │     └─ cartStore.addItem()
   │        └─ Guardar en localStorage
   ├─ Usuario hace clic en "Favoritos"
   │  └─ Emit: toggle-favorite
   │     └─ favoritesStore.toggle()
   │        └─ Guardar en localStorage
   └─ Usuario hace clic en producto relacionado
      └─ RouterLink → /product/otro-id
```

---

## 🧪 Props y Events

### ProductDetails.vue

```
Props:
├─ product (Object)
│  ├─ id: number
│  ├─ nombre: string
│  ├─ categoria: string
│  ├─ descripcion: string
│  ├─ precio: number
│  ├─ stock: number
│  ├─ imagen_url: string
│  └─ especificaciones: string
│
Events:
├─ add-to-cart { product, quantity }
└─ toggle-favorite productId
```

### ProductDetail.vue

```
Computed:
├─ product → Busca en products.value por ID
└─ relatedProducts → Filtra por categoría

Events (received):
├─ add-to-cart (de ProductDetails y ProductCard)
│  └─ Mostrar alert
└─ add-to-cart (de ProductCard)
   └─ Mostrar alert
```

---

## 🎯 Casos de Uso

### Caso 1: Navegar a Detalles
```
1. Usuario está en /products
2. Usuario hace clic en ProductCard
3. ProductCard tiene RouterLink a /product/1
4. ProductDetail.vue carga
5. Se obtienen datos del producto
6. Se muestran detalles
```

### Caso 2: Seleccionar Cantidad
```
1. Usuario ven detalles
2. Usuario ve selector de cantidad
3. Usuario hace clic en +/- o escribe número
4. Cantidad se valida (1 ≤ qty ≤ stock)
5. Texto se actualiza
```

### Caso 3: Añadir al Carrito
```
1. Usuario selecciona cantidad (ej: 3)
2. Usuario hace clic "Añadir Carrito"
3. Se ejecuta addToCart()
4. Loop: agrega item 3 veces a cartStore
5. Se guarda en localStorage
6. Se resetea cantidad a 1
7. Se muestra confirmación
```

### Caso 4: Ver Relacionados
```
1. Usuario está viendo producto ID 1
2. Se calcula relatedProducts
3. Filtra: categoría = "Procesadores" AND id ≠ 1
4. Se obtienen máximo 4
5. Se muestran como ProductCard
6. Clickear → /product/otro-id
7. ProductDetail recarga con nuevo producto
```

---

## 📦 Versión y Compatibilidad

```
ProductDetails.vue
├─ Vue 3.x ✅
├─ Vue Router 4.x ✅
├─ Pinia ✅
└─ CSS Modules ✅

ProductDetail.vue
├─ Vue 3.x ✅
├─ Vue Router 4.x ✅
├─ Pinia ✅
└─ Axios (googleSheetsAPI) ✅
```

---

## 📈 Performance

```
Optimizaciones:

✅ Computed properties (caching)
✅ RouterLink (lazy loading)
✅ CSS Modules (scoped styles)
✅ Lazy loading de imágenes (opcional)
✅ LocalStorage (sin llamadas API repetidas)
✅ Unsubscribe automático (onUnmounted)
```

---

## 🔐 Seguridad

```
Consideraciones:

✅ Validación de ID en URL
✅ Manejo seguro de localStorage
✅ Props validados con type checking
✅ No hay inyección de datos peligrosos
✅ URLs sanitizadas en Router

Nota: Para producción, agregar:
□ Validación en backend
□ Rate limiting
□ XSS prevention
□ CSRF tokens
```

---

## 📞 Debugging

```
DevTools:
├─ Vue DevTools
│  ├─ Inspeccionar componentes
│  ├─ Ver computed properties
│  ├─ Ver events
│  └─ Time travel debugging
│
├─ Browser DevTools
│  ├─ Network (llamadas API)
│  ├─ Console (errores)
│  ├─ Application > LocalStorage
│  │  └─ Ver cartStore, favoritesStore
│  │
│  └─ Elements
│     └─ Inspeccionar DOM
│
└─ VS Code
   ├─ Breakpoints
   ├─ Debug console
   └─ Watch expressions
```

---

**Actualizado: 6 de Enero de 2026**
**Versión: 1.0.0**
