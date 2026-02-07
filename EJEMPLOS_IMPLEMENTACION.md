# 🎁 Secciones de Productos - Ejemplos de Implementación

## 📝 Resumen de Cambios

Se han creado **secciones detalladas completas** para cada producto con:
- ✅ Componente `ProductDetails.vue` - Muestra detalles completos
- ✅ Página `ProductDetail.vue` - Página envolvente con contexto
- ✅ Actualizaciones de navegación - Rutas y links
- ✅ Integración con stores - Carrito y favoritos

---

## 🎨 Estructura Visual

```
PÁGINA DE PRODUCTOS (/products)
        │
        ├─ Tarjeta Producto 1  ──┐
        ├─ Tarjeta Producto 2  ──┤
        ├─ Tarjeta Producto 3  ──┤ (clickeables)
        └─ Tarjeta Producto N  ──┘
                                   │
                                   ↓
                           /product/:id
                                   │
                        ┌──────────┴──────────┐
                        │                     │
                   ProductDetails        Related Products
                    + Reviews                & Reviews
```

---

## 💻 Ejemplos de Código

### 1. Usando ProductDetails en tu componente

```vue
<template>
  <ProductDetails 
    :product="miProducto"
    @add-to-cart="manejarAñadirCarrito"
    @toggle-favorite="manejarFavorito"
  />
</template>

<script setup>
import ProductDetails from '@/components/ProductDetails.vue'

const miProducto = {
  id: 1,
  nombre: 'Intel Core i7-13700K',
  categoria: 'Procesadores',
  descripcion: 'Procesador de alta performance',
  precio: 450.00,
  stock: 15,
  especificaciones: '13ª gen, 16 núcleos, 24 threads',
  imagen_url: 'https://via.placeholder.com/300x300'
}
</script>
```

### 2. Navegación a detalles del producto

```vue
<!-- Opción 1: Desde ProductCard (automático) -->
<RouterLink :to="`/product/${product.id}`">
  <ProductCard :product="product" />
</RouterLink>

<!-- Opción 2: Botón personalizado -->
<router-link :to="`/product/1`">
  Ver detalles del producto
</router-link>

<!-- Opción 3: Programática -->
<button @click="$router.push(`/product/${id}`)">
  Ver más
</button>
```

### 3. Obtener detalles del producto en la página

```javascript
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Obtener el ID del producto de la URL
const productId = computed(() => {
  return parseInt(route.params.id)
})

// Buscar el producto en la lista
const product = computed(() => {
  return products.value.find(p => p.id === productId.value)
})
```

### 4. Manejo del carrito con cantidad

```javascript
const handleAddToCart = (data) => {
  // data = { product: {...}, quantity: 3 }
  
  for (let i = 0; i < data.quantity; i++) {
    cartStore.addItem(data.product)
  }
  
  alert(`✅ ${data.product.nombre} (x${data.quantity}) añadido`)
}
```

### 5. Productos relacionados

```javascript
const relatedProducts = computed(() => {
  if (!product.value) return []
  
  return products.value
    .filter(p => 
      p.categoria === product.value.categoria &&  // Misma categoría
      p.id !== product.value.id                    // No el mismo
    )
    .slice(0, 4)  // Máximo 4 productos
})
```

---

## 🔌 Integración con Stores

### CartStore

```javascript
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()

// Añadir múltiples items al carrito
for (let i = 0; i < quantity.value; i++) {
  cartStore.addItem(product.value)
}
```

### FavoritesStore

```javascript
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()

// Toggle favorito
favoritesStore.toggleFavorite(productId)

// Verificar si es favorito
const isFavorite = favoritesStore.isFavorite(productId)
```

---

## 📊 Estructura de Datos

### Producto Completo

```javascript
{
  // Campos obligatorios
  id: 1,
  nombre: "Intel Core i7-13700K",
  categoria: "Procesadores",
  descripcion: "Procesador de alta performance para gaming y productividad",
  precio: 450,
  stock: 15,
  imagen_url: "https://via.placeholder.com/300x300?text=Intel+i7",
  especificaciones: "13ª generación, 16 núcleos, 24 threads",
  
  // Campos opcionales que puedes agregar
  // descuento: 10,
  // marca: "Intel",
  // modelo: "i7-13700K",
  // color: "Negro",
  // peso: "150g"
}
```

---

## 🎯 Flujo de Navegación

```
INICIO
  │
  ├─→ Página Principal (Home)
  │
  ├─→ Productos (/products)
  │    │
  │    └─→ Ver todos los productos
  │        │
  │        ├─→ Filtrar por categoría
  │        ├─→ Buscar por nombre
  │        │
  │        └─→ Haz clic en producto
  │            │
  │            ↓
  │        Detalles (/product/:id)
  │            │
  │            ├─→ Ver especificaciones
  │            ├─→ Seleccionar cantidad
  │            ├─→ Añadir al carrito
  │            ├─→ Añadir a favoritos
  │            ├─→ Ver productos relacionados
  │            └─→ Leer reseñas
  │
  └─→ Carrito (/cart)
      └─→ Checkout (/checkout)
```

---

## 🎨 Personalización de Estilos

### Cambiar colores principales

```css
/* En ProductDetails.vue */
.category-tag {
  background-color: #667eea;  /* Cambiar este color */
}

.add-to-cart-btn {
  background: #667eea;  /* Cambiar este color */
}
```

### Cambiar tamaños

```css
.product-title {
  font-size: 32px;  /* Cambiar tamaño */
}

.amount {
  font-size: 36px;  /* Cambiar tamaño del precio */
}
```

### Cambiar puntos de quiebre responsive

```css
/* Mobile (por defecto < 480px) */
/* Tablet (768px) */
/* Desktop (1200px) */

@media (max-width: 768px) {
  /* Cambiar breakpoint aquí */
}
```

---

## 🧪 Testing (Ejemplos)

### Verificar que la página carga

```javascript
describe('ProductDetail.vue', () => {
  it('debería cargar los detalles del producto', () => {
    // Renderizar página
    // Verificar que aparece el nombre del producto
    expect(wrapper.text()).toContain('Intel Core i7-13700K')
  })
  
  it('debería mostrar productos relacionados', () => {
    // Verificar que se muestran productos de la misma categoría
    expect(relatedProducts.length).toBeGreaterThan(0)
  })
})
```

---

## 📋 Checklist de Implementación

- [x] Crear componente `ProductDetails.vue`
- [x] Crear página `ProductDetail.vue`
- [x] Actualizar `ProductCard.vue` para navegación
- [x] Agregar rutas en `main.js`
- [x] Integración con `cartStore`
- [x] Integración con `favoritesStore`
- [x] Estilos responsive
- [x] Sección de productos relacionados
- [x] Sección de reseñas
- [ ] Conectar reseñas a base de datos (opcional)
- [ ] Agregar galería de imágenes (opcional)
- [ ] Videos de producto (opcional)

---

## 🚀 Cómo Ejecutar

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd "Desarrollo web"

# 2. Instala dependencias (si no lo has hecho)
npm install

# 3. Inicia el servidor de desarrollo
npm run dev

# 4. Abre en tu navegador
http://localhost:5173

# 5. Navega a productos
http://localhost:5173/products

# 6. Haz clic en un producto para ver detalles
http://localhost:5173/product/1
```

---

## 💡 Tips y Trucos

### Pasar parámetros en la URL
```javascript
// Ruta dinámicas
/product/1     → Producto con ID 1
/product/123   → Producto con ID 123

// Acceder en el componente
const id = route.params.id
```

### Mantener estado al navegar
```javascript
// Los datos de carrito y favoritos se guardan en localStorage
// Se recuperan automáticamente al refrescar la página
```

### Validar que existe el producto
```javascript
<div v-if="product" class="content">
  <!-- Mostrar detalles -->
</div>
<div v-else class="not-found">
  <p>Producto no encontrado</p>
</div>
```

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica que los archivos están en las rutas correctas
2. Asegúrate de que los imports son correctos
3. Revisa la consola del navegador (F12) para errores
4. Verifica que los datos del producto tengan los campos necesarios
5. Recarga la página (Ctrl + Shift + R)

---

## 📦 Archivos Creados/Modificados

```
Desarrollo web/
├── src/
│   ├── components/
│   │   ├── ProductDetails.vue          ✨ NUEVO
│   │   └── ProductCard.vue             ✏️ MODIFICADO
│   ├── pages/
│   │   └── ProductDetail.vue           ✨ NUEVO
│   └── main.js                         ✏️ MODIFICADO
├── SECCION_DETALLES_PRODUCTOS.md       ✨ NUEVO
├── GUIA_DETALLES_PRODUCTOS.md          ✨ NUEVO
└── EJEMPLOS_IMPLEMENTACION.md          ✨ NUEVO (este archivo)
```

---

**¡Listo! Ahora tienes secciones completas de detalles para cada producto.** 🎉
