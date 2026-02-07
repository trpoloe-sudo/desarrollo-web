# 📋 Guía de Uso - Secciones Detalladas de Productos

## ✨ Cambios Realizados

Se han creado **secciones detalladas para cada producto** que permite a los usuarios ver información completa y realizar compras de manera más informada.

---

## 🎯 Nuevas Funcionalidades

### 1. Página de Detalles del Producto

**URL:** `/product/:id` o `/producto/:id`

#### Contenido de la página:

```
┌─────────────────────────────────────────┐
│  Breadcrumb: Productos > Nombre Producto │
├─────────────────────────────────────────┤
│                                         │
│  [Imagen Grande] │  Detalles Completos  │
│                  │  - Nombre            │
│                  │  - Descripción       │
│                  │  - Especificaciones  │
│                  │  - Precio            │
│                  │  - Stock             │
│                  │  - Rating            │
│                  │                      │
│                  │  Selector Cantidad   │
│                  │  [Añadir al carrito] │
│                  │  [Añadir Favoritos]  │
│                  │                      │
│                  │  Info Envío/Garantía │
│                  │                      │
├─────────────────────────────────────────┤
│  Productos Relacionados (hasta 4)        │
├─────────────────────────────────────────┤
│  Reseñas de Clientes (3 ejemplos)        │
└─────────────────────────────────────────┘
```

---

## 🔗 Rutas de Navegación

### Acceso a Detalles del Producto

**Método 1: Desde la tarjeta de producto**
```
Página de Productos (/products)
         ↓
  Haz clic en tarjeta
         ↓
  Página de detalles (/product/id)
```

**Método 2: Desde URL directa**
```
http://tu-dominio.com/product/1
http://tu-dominio.com/producto/1  (alias en español)
```

---

## 🎨 Características del Componente ProductDetails

### Imagen del Producto
- Imagen ampliada en alta resolución
- Fondo gris para mejor visualización
- Responsive: se ajusta al tamaño de pantalla

### Información del Producto
```
┌─ Categoría (etiqueta azul)
├─ Nombre del producto (título grande)
├─ Rating (⭐⭐⭐⭐⭐ - 125 opiniones)
├─ Descripción
├─ Precio ($XXX.XX en rojo destacado)
├─ Stock disponible (verde si hay, rojo si agotado)
├─ Especificaciones técnicas
└─ Acciones
   ├─ Selector de cantidad
   ├─ Botón Añadir al carrito
   └─ Botón Añadir a Favoritos
```

### Información Adicional Mostrada
- 🚚 Envío gratis a partir de $50
- ↩️ Devolución gratuita en 30 días
- 🛡️ Garantía de 1 año
- 💳 Pago seguro garantizado

---

## 📊 Estructura de Datos de Producto

El sistema espera productos con la siguiente estructura:

```javascript
{
  id: 1,                          // ID único
  nombre: "Nombre del Producto",  // Nombre visible
  categoria: "Categoría",         // Categoría del producto
  descripcion: "Descripción...",  // Descripción corta
  especificaciones: "Specs...",   // Detalles técnicos
  precio: 99.99,                  // Precio numérico
  stock: 15,                      // Cantidad disponible
  imagen_url: "https://..."       // URL de imagen
}
```

---

## 🛒 Funcionalidades de Compra

### Selector de Cantidad
```
[-] [Cantidad] [+]
 ↓                 ↓
Decrementa        Incrementa
si > 1            si < stock
```

- **Botón -**: Reduce cantidad (deshabilitado si cantidad = 1)
- **Input**: Permite escribir cantidad directamente
- **Botón +**: Aumenta cantidad (deshabilitado si cantidad = stock)

### Añadir al Carrito
```
[🛒 Añadir al carrito]
         ↓
Agrega items según cantidad seleccionada
         ↓
Muestra confirmación
         ↓
Resetea cantidad a 1
```

### Favoritos
```
[🤍 Añadir a Favoritos]    →    [❤️ En Favoritos]
         ↓
Persiste en localStorage
         ↓
Se sincroniza en toda la app
```

---

## 🔄 Productos Relacionados

Se muestran hasta **4 productos relacionados** basados en:
- ✅ Misma categoría
- ✅ Diferente del producto actual
- ✅ En formato de tarjeta (ProductCard)
- ✅ Con links a sus detalles

---

## 💬 Sección de Reseñas

Muestra **3 reseñas de ejemplo** con:
- Nombre del revisor
- Fecha de revisión (ej: "Hace 2 semanas")
- Calificación en estrellas
- Texto de la opinión

**Nota:** Las reseñas son ejemplos. Para usar datos reales, conectar a base de datos.

---

## 📱 Responsive Design

### Desktop (1200px+)
- Imagen y detalles en 2 columnas
- Productos relacionados en grid 4 columnas
- Reseñas en grid 3 columnas

### Tablet (768px - 1199px)
- Mantiene 2 columnas en detalles
- Productos relacionados en grid 3 columnas
- Reseñas en grid 2 columnas

### Mobile (< 768px)
- Stack vertical (imagen arriba, detalles abajo)
- Productos relacionados en grid 2 columnas
- Reseñas en stack vertical
- Acciones ocupan ancho completo

---

## 🔧 Configuración

### Cambiar el ID del producto en URL
```vue
<!-- Automático según parámetro de ruta -->
{{ route.params.id }}  → ID del producto

<!-- Generar link manualmente -->
<RouterLink :to="`/product/${producto.id}`">
  Ver detalles
</RouterLink>
```

### Modificar cantidad máxima de productos relacionados
```javascript
// En ProductDetail.vue
relatedProducts.slice(0, 4)  // Cambiar 4 por otro número
```

### Agregar más reseñas
```vue
<!-- Duplicar este bloque en la sección reviews-container -->
<div class="review-item">
  <div class="review-header">
    <div class="reviewer-info">
      <span class="reviewer-name">Nombre</span>
      <span class="review-date">Fecha</span>
    </div>
    <div class="review-rating">⭐⭐⭐⭐⭐</div>
  </div>
  <p class="review-text">Texto de opinión</p>
</div>
```

---

## 🐛 Troubleshooting

### Problema: Página de detalles no carga
**Solución:** Verificar que las rutas estén configuradas en `main.js`

### Problema: Imagen no se ve
**Solución:** Verificar que `product.imagen_url` sea una URL válida

### Problema: Botones no funcionan
**Solución:** Verificar que `cartStore` y `favoritesStore` estén inicializados en `main.js`

### Problema: Stock muestra incorrectamente
**Solución:** Verificar que `product.stock` sea un número entero

---

## 📚 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/components/ProductDetails.vue` | ✨ **NUEVO** |
| `src/pages/ProductDetail.vue` | ✨ **NUEVO** |
| `src/components/ProductCard.vue` | ✏️ Mejorado (clickeable) |
| `src/main.js` | ✏️ Rutas añadidas |

---

## 🎯 Próximos Pasos Opcionales

- [ ] Conectar reseñas a base de datos dinámica
- [ ] Agregar galería de imágenes múltiples
- [ ] Implementar sistema de preguntas y respuestas
- [ ] Agregar variantes de producto (colores, tamaños)
- [ ] Video de producto
- [ ] Integración de calificaciones dinámicas
- [ ] Comentarios en tiempo real
