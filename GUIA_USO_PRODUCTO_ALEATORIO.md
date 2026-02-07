# 📖 GUÍA DE USO - Producto Aleatorio en Hero

## 🚀 Inicio Rápido (2 minutos)

### 1. Verificar que funciona
```bash
npm run dev
# http://localhost:5174
```

### 2. Ver el resultado
- Abre navegador en http://localhost:5174
- Deberías ver un producto grande en el hero
- Cada 10 segundos, cambia a otro

### 3. Probar agregar
- Hover sobre el producto
- Click en "🛒 Agregar al Carrito"
- ✅ Debe redireccionarte a /productos con el producto en carrito

---

## 🎯 Qué Hace Cada Parte

### 📦 Cargar Productos
```javascript
const loadProducts = async () => {
  products.value = await googleSheetsAPI.getProducts()
  selectRandomProduct()
}
```
**Cuándo**: Al montar el componente (onMounted)  
**Qué hace**: Obtiene TODOS los productos desde Google Sheets

### 🎲 Seleccionar Aleatorio
```javascript
const selectRandomProduct = () => {
  const randomIndex = Math.floor(Math.random() * products.value.length)
  currentProduct.value = products.value[randomIndex]
}
```
**Cuándo**: Al cargar + cada 10 segundos  
**Qué hace**: Elige un producto al azar

### 🛒 Agregar al Carrito
```javascript
const addProductToCart = () => {
  cartStore.addItem({...})
  alert(`✅ ${currentProduct.value.nombre} añadido al carrito`)
  router.push('/productos')
}
```
**Cuándo**: Usuario hace click en botón  
**Qué hace**: Agrega a carrito + notifica + redirecciona

### ⏱️ Rotar Cada 10 Segundos
```javascript
productInterval.value = setInterval(() => {
  selectRandomProduct()
}, 10000)
```
**Cuándo**: Al montar el componente  
**Qué hace**: Cambia producto automáticamente cada 10 segundos

### 🧹 Limpiar
```javascript
onUnmounted(() => {
  clearInterval(productInterval.value)
})
```
**Cuándo**: Al desmontar (navegar a otra página)  
**Qué hace**: Limpia el intervalo (muy importante!)

---

## 🎨 Cómo Personalizar

### Cambiar Tiempo de Rotación

**Actual**: 10 segundos (10,000 ms)

Encuentra esta línea:
```javascript
}, 10000)
```

**Cambios comunes**:
```javascript
// 5 segundos
}, 5000)

// 15 segundos
}, 15000)

// 30 segundos
}, 30000)

// 1 minuto
}, 60000)
```

### Mostrar Solo una Categoría

Reemplaza `selectRandomProduct`:

```javascript
const selectRandomProduct = () => {
  if (products.value.length === 0) return
  
  // Filtrar por categoría
  const filtered = products.value.filter(p => 
    p.categoria === 'Laptops'  // ← CAMBIAR AQUÍ
  )
  
  if (filtered.length === 0) return
  
  const randomIndex = Math.floor(Math.random() * filtered.length)
  currentProduct.value = filtered[randomIndex]
}
```

**Opciones de categoría**:
- Laptops
- Computadoras
- Accesorios
- (O la que uses)

### Mostrar Solo Productos con Stock

Reemplaza `selectRandomProduct`:

```javascript
const selectRandomProduct = () => {
  const available = products.value.filter(p => p.stock > 0)
  if (available.length === 0) return
  
  const randomIndex = Math.floor(Math.random() * available.length)
  currentProduct.value = available[randomIndex]
}
```

### Mostrar Productos Más Vendidos

Si tienes campo `ventas`:

```javascript
const selectRandomProduct = () => {
  // Ordenar por ventas (descendente)
  const sorted = [...products.value].sort((a, b) => b.ventas - a.ventas)
  
  // Tomar top 10
  const topProducts = sorted.slice(0, 10)
  
  const randomIndex = Math.floor(Math.random() * topProducts.length)
  currentProduct.value = topProducts[randomIndex]
}
```

### Cambiar Número de WhatsApp

Si quieres que haga click en WhatsApp:

```javascript
const addProductToCart = () => {
  // ... código existing
  
  // Agregar línea para WhatsApp
  const phoneNumber = '51978418809'
  const message = `Me interesa: ${currentProduct.value.nombre}`
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}
```

---

## 🎯 Casos de Uso

### Caso 1: Vitrinas
Quieres mostrar un producto destacado diferente cada vez que entra usuario.

**Configuración**:
- Intervalo: 10 segundos (default)
- Filtro: Ninguno (todos los productos)
- Acción: Agregar a carrito

### Caso 2: Promociones
Quieres rotar solo productos en oferta.

**Configuración**:
```javascript
const filtered = products.value.filter(p => 
  p.descuento > 0  // Si tienes campo descuento
)
```

### Caso 3: Categoría Específica
Quieres mostrar solo laptops.

**Configuración**:
```javascript
p.categoria === 'Laptops'
```

### Caso 4: Rotación Rápida
Quieres cambio cada 5 segundos para más dinamismo.

**Configuración**:
```javascript
}, 5000)
```

---

## 🔍 Debugging

### Ver Console

Abre DevTools (F12 → Console) y ejecuta:

```javascript
// Ver productos cargados
console.log('Productos:', products.value)
console.log('Producto actual:', currentProduct.value)

// Ver intervalo
console.log('Interval ID:', productInterval.value)

// Ver carrito
console.log('Carrito:', cartStore.items)
```

### Forzar Cambio

En console:
```javascript
selectRandomProduct()
// Debería cambiar al siguiente producto
```

### Detener Rotación

En console:
```javascript
clearInterval(productInterval.value)
// Se detiene la rotación
```

### Reanudar Rotación

En console:
```javascript
productInterval.value = setInterval(() => {
  selectRandomProduct()
}, 10000)
// Se reanuda la rotación
```

---

## 🐛 Solución de Problemas

### Problema 1: Producto no carga
**Síntoma**: Spinner infinito

**Posibles causas**:
1. Google Sheets API no configurada
2. Sin conexión a internet
3. Timeout de API

**Solución**:
```javascript
// Revisa console (F12)
// Busca errores de googleSheetsAPI
console.error('Error:', error)
```

### Problema 2: Producto no cambia cada 10s
**Síntoma**: Mismo producto siempre

**Posibles causas**:
1. Intervalo no se inició
2. Hay pocas productos (< 2)
3. Consola muestra error

**Solución**:
```javascript
// Verifica que hay múltiples productos
console.log('Total productos:', products.value.length)
// Debe ser > 1
```

### Problema 3: Click no agrega al carrito
**Síntoma**: Notificación no aparece

**Posibles causas**:
1. Button click no dispara
2. cartStore no está inicializado
3. Router no tiene ruta /productos

**Solución**:
```javascript
// Agrupa log en función
const addProductToCart = () => {
  console.log('Clicked!')
  console.log('Product:', currentProduct.value)
  cartStore.addItem({...})
}
```

### Problema 4: No redirecciona a /productos
**Síntoma**: Notificación aparece, pero no se redirige

**Posibles causas**:
1. Ruta `/productos` no existe
2. Router no está importado correctamente

**Solución**:
```javascript
// En router.js, verifica que exista:
{
  path: '/productos',
  component: Products
}
```

### Problema 5: Memory leak (intervalo no se limpia)
**Síntoma**: DevTools muestra timer activo al cambiar de página

**Solución**:
Verifica que haya `onUnmounted`:
```javascript
onUnmounted(() => {
  if (productInterval.value) {
    clearInterval(productInterval.value)
  }
})
```

---

## 📊 Monitoreo

### Métricas a Trackear

1. **Clicks en producto**: ¿Cuántas personas hacen click?
2. **Tasa de conversión**: ¿Cuántos agregan a carrito?
3. **Categorías populares**: ¿Qué productos se clickean más?
4. **Tiempo promedio**: ¿En qué segundo del ciclo hacen click?

### Analytics Code

Si usas Google Analytics:

```javascript
const addProductToCart = () => {
  // Track event
  gtag('event', 'add_to_cart_hero', {
    product_name: currentProduct.value.nombre,
    product_id: currentProduct.value.id,
    product_price: currentProduct.value.precio
  })
  
  // ... resto del código
}
```

---

## ✅ Checklist de Implementación

- [ ] Componente carga sin errores
- [ ] Producto aparece en hero
- [ ] Cambia cada 10 segundos
- [ ] Hover muestra overlay
- [ ] Click agrega a carrito
- [ ] Notificación aparece
- [ ] Redirecciona a /productos
- [ ] Producto está en carrito
- [ ] Vuelves a home, sigue rotando
- [ ] Mobile: funciona correcto
- [ ] Console: sin errores
- [ ] Performance: 60fps suave

---

## 🎓 Aprenderás

Este componente te enseña:

1. **Vue 3 Composition API**
   - ref() y reactive state
   - onMounted y onUnmounted
   - Computed y watchers

2. **Integración con Stores**
   - Pinia (cartStore)
   - Agregar items dinámicamente

3. **Router**
   - Navegación programática
   - router.push()

4. **APIs Externas**
   - Llamadas asincrónicas
   - Manejo de errores
   - Loading states

5. **Animaciones CSS**
   - Transiciones suaves
   - Keyframes personalizados
   - Estados visuales

---

## 📞 Soporte

### Documentos de Ayuda

1. **RESUMEN_PRODUCTO_ALEATORIO.md** - Resumen rápido
2. **PRODUCTO_ALEATORIO_HERO.md** - Guía completa
3. **TESTING_PRODUCTO_ALEATORIO.md** - Testing checklist
4. **Este archivo** - Guía de uso

### Preguntas Frecuentes

**P: ¿Cada usuario ve producto diferente?**  
R: No, es aleatorio pero el mismo para todos en ese momento

**P: ¿Se guarda la rotación?**  
R: No, es aleatoria cada vez que entran

**P: ¿Puedo mostrar "más vendidos"?**  
R: Sí, usa sort() en selectRandomProduct()

**P: ¿Se cuenta en analytics?**  
R: Sí, usa gtag() para trackear

---

**Versión**: 1.0  
**Fecha**: Enero 24, 2026  
**Status**: ✅ Listo para producción

