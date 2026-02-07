# 🧪 TESTING - Producto Aleatorio en Hero

## ✅ Testing Checklist

### 📊 Visual

#### Carga Inicial
- [ ] Página carga sin errores
- [ ] Spinner de carga aparece
- [ ] Mensaje "Cargando productos..." visible
- [ ] Después de 2-3 segundos, producto aparece

#### Visualización del Producto
- [ ] Imagen del producto es clara y visible
- [ ] Nombre del producto es legible
- [ ] Categoría es visible (arriba a la izquierda)
- [ ] Precio es visible y formateado (ej: $99.99)
- [ ] Badge "⭐ DESTACADO" en esquina superior derecha
- [ ] Badge tiene animación pulse (palpita)

#### Layout
- [ ] Producto ocupa el área 400x400px
- [ ] Imagen rellena completamente el espacio
- [ ] No hay distorsión de imagen

### 🎬 Animaciones

#### Rotación Cada 10 Segundos
- [ ] Producto cambia cada 10 segundos
- [ ] Cambio es suave (no abrupto)
- [ ] Cada producto es diferente
- [ ] Notificación visual clara del cambio

#### Hover
- [ ] Imagen se amplía ligeramente (scale 1.1)
- [ ] Overlay oscuro aparece
- [ ] Botón "🛒 Añadir al Carrito" aparece
- [ ] Categoría se ve en overlay
- [ ] Nombre se ve en overlay
- [ ] Precio se ve en overlay

#### Click/Agregar
- [ ] Botón es clickeable
- [ ] Cursor cambia a pointer en hover
- [ ] Botón tiene efecto visual en click
- [ ] Transición suave

### 🛒 Funcionalidad de Carrito

#### Agregar al Carrito
- [ ] Click en botón "Agregar"
- [ ] Notificación aparece: "✅ [Nombre] añadido al carrito"
- [ ] Carrito se actualiza (si hay contador)
- [ ] Página redirecciona a `/productos`

#### Verificación en Carrito
- [ ] Producto aparece en vista de carrito
- [ ] Cantidad es 1
- [ ] Nombre correcto
- [ ] Precio correcto
- [ ] Imagen correcta

### 🔄 Rotación

#### Cambio Automático
- [ ] Cronómetro: Producto A visible a 0:00
- [ ] Cronómetro: Producto B visible a 0:10
- [ ] Cronómetro: Producto C visible a 0:20
- [ ] Patrón continúa

#### Productos Diferentes
- [ ] Cada producto es diferente del anterior
- [ ] Hay variedad de categorías
- [ ] Hay variedad de precios

### 📱 Responsive

#### Desktop (1920x1080)
- [ ] Producto lado a lado con contenido
- [ ] Layout simétrico
- [ ] Tamaño 400x400px

#### Tablet (768px)
- [ ] Producto sigue siendo visible
- [ ] Proporciones correctas
- [ ] Touch target grande (fácil de tocar)

#### Mobile (480px)
- [ ] Producto apilado vertical
- [ ] 100% ancho disponible
- [ ] Botón clickeable
- [ ] Overlay legible

### ⚡ Performance

#### Carga
- [ ] Primera carga < 3 segundos
- [ ] Productos cargan desde Google Sheets
- [ ] Sin freezes o lag
- [ ] Transiciones suaves 60fps

#### Memoria
- [ ] Intervalo se limpia al cambiar página
- [ ] No hay memory leaks
- [ ] DevTools Console sin errores
- [ ] DevTools sin warnings

### 🌐 Navegación

#### Redirección a Productos
- [ ] Click en producto → redirecciona a `/productos`
- [ ] URL cambia a `/productos`
- [ ] Página de productos carga correctamente
- [ ] Producto está en carrito

#### Volver a Home
- [ ] Usuario puede volver a home
- [ ] Carrito mantiene el producto
- [ ] Nuevo producto está rotando

### ⚠️ Edge Cases

#### Sin Productos
- [ ] Si no hay productos, muestra iconos por defecto
- [ ] No hay error en consola
- [ ] Página sigue siendo visible

#### Producto Sin Imagen
- [ ] Si producto no tiene imagen_url
- [ ] Muestra imagen placeholder o default
- [ ] No rompe el layout

#### Stock = 0
- [ ] Si producto está agotado
- [ ] ¿Debería mostrar "Agotado"?
- [ ] ¿Debería permitir agregar al carrito?
- [ ] (Considerar lógica de negocio)

### 🔐 Accesibilidad

#### Keyboard
- [ ] Tab navega al producto
- [ ] Enter/Space activa el botón
- [ ] No hay trampa de teclado

#### Screen Reader
- [ ] Nombre del producto se lee
- [ ] Precio se lee
- [ ] Botón tiene aria-label descriptivo
- [ ] Categoría se enuncia

#### Contraste
- [ ] Texto blanco sobre overlay oscuro
- [ ] Ratio contraste > 4.5:1
- [ ] Badge rojo legible

### 🔗 Integración

#### Google Sheets API
- [ ] Carga productos correctamente
- [ ] Maneja errores de conexión
- [ ] Reintentos si falla

#### Cart Store (Pinia)
- [ ] Producto se agrega correctamente
- [ ] Cantidad es 1 (o incrementa)
- [ ] Total del carrito se actualiza
- [ ] Persiste en store

#### Vue Router
- [ ] Redirección es instantánea
- [ ] Ruta `/productos` existe
- [ ] Historial del navegador funciona

---

## 🧪 Testing Manual

### Test 1: Carga Básica (3 min)
```
1. Abre http://localhost:5174
2. Espera a que cargue el hero
3. Verifica que producto aparezca
4. Espera 10 segundos
5. Verifica que cambie
```

### Test 2: Interacción (5 min)
```
1. Hover sobre producto
2. Verifica overlay y botón
3. Click en "Agregar al Carrito"
4. Espera notificación
5. Espera redirección a /productos
6. Verifica producto en carrito
```

### Test 3: Múltiples Ciclos (5 min)
```
1. Vuelve a home
2. Espera a que rote otro producto (10 seg)
3. Click nuevamente
4. Verifica que segundo producto está en carrito
5. Repite una vez más
```

### Test 4: Mobile (5 min)
```
1. Abre DevTools (F12)
2. Toggle Device (Ctrl+Shift+M)
3. Selecciona iPhone 12 o similar
4. Interactúa con producto
5. Verifica layout y funcionalidad
```

### Test 5: Performance (3 min)
```
1. Abre DevTools → Performance
2. Inicia grabación
3. Espera 30 segundos (3 rotaciones)
4. Detiene grabación
5. Verifica que sea suave (60fps)
```

---

## 🔍 Debugging

### Ver Productos Cargados
```javascript
// En Console (F12 → Console)
console.log(currentProduct)
// Debería mostrar el objeto del producto
```

### Ver Intervalo Activo
```javascript
// En Console
console.log('Interval ID:', productInterval.value)
// Debería mostrar un número positivo
```

### Ver Store de Carrito
```javascript
// En Console
console.log(cartStore.items)
// Debería mostrar array con productos agregados
```

### Forzar Cambio de Producto
```javascript
// En Console (si tienes acceso)
selectRandomProduct()
// Debería cambiar al siguiente producto
```

---

## 📋 Casos de Prueba

### CP-001: Carga Inicial
| Paso | Acción | Esperado | Status |
|------|--------|----------|--------|
| 1 | Abrir http://localhost:5174 | Spinner aparece | [ ] |
| 2 | Esperar 2-3s | Producto aparece | [ ] |
| 3 | Verificar imagen | Imagen visible | [ ] |
| 4 | Verificar nombre | Nombre legible | [ ] |

### CP-002: Rotación
| Paso | Acción | Esperado | Status |
|------|--------|----------|--------|
| 1 | Iniciar cronómetro a 0:00 | Producto A visible | [ ] |
| 2 | Esperar a 0:10 | Producto B visible | [ ] |
| 3 | Verificar diferencia | A ≠ B | [ ] |
| 4 | Esperar a 0:20 | Producto C visible | [ ] |

### CP-003: Agregación al Carrito
| Paso | Acción | Esperado | Status |
|------|--------|----------|--------|
| 1 | Hover sobre producto | Overlay aparece | [ ] |
| 2 | Click botón "Agregar" | Notificación ✅ | [ ] |
| 3 | Esperar redirección | En /productos | [ ] |
| 4 | Verificar carrito | Producto presente | [ ] |

### CP-004: Múltiples Agregaciones
| Paso | Acción | Esperado | Status |
|------|--------|----------|--------|
| 1 | Volver a home | Hero sigue funcionando | [ ] |
| 2 | Esperar nuevo producto | Cambia después 10s | [ ] |
| 3 | Click "Agregar" nuevamente | Segundo producto en carrito | [ ] |
| 4 | Verificar carrito | Ambos productos presentes | [ ] |

---

## 🎯 Criterios de Aceptación

### Funcional
- ✅ Productos cargan desde Google Sheets
- ✅ Producto cambia cada 10 segundos
- ✅ Click agrega al carrito
- ✅ Redirecciona a /productos
- ✅ Notificación muestra nombre correcto

### Visual
- ✅ Imagen clara y proporcional
- ✅ Información legible
- ✅ Badge con animación
- ✅ Hover effect visible
- ✅ Responsive en todos los dispositivos

### Performance
- ✅ Carga inicial < 3s
- ✅ Rotación suave 60fps
- ✅ Sin memory leaks
- ✅ Console sin errores

### Compatibilidad
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

---

## ✅ Checklist Final

- [ ] Todos los test cases pasan
- [ ] Visual verificado en desktop, tablet, mobile
- [ ] Performance satisfactorio
- [ ] Console sin errores ni warnings
- [ ] Integración con carrito funciona
- [ ] Redirección a productos funciona
- [ ] Listo para producción

---

**Testing Date**: [Fecha]  
**Tester**: [Nombre]  
**Result**: [ ] PASS [ ] FAIL

