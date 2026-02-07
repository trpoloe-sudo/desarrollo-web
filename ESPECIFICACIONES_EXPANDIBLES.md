# 📋 Especificaciones Técnicas Expandibles

## ✅ Lo que se implementó:

Las especificaciones técnicas ahora funcionan de la siguiente manera:

### 📱 **En la lista de productos:**
- Las especificaciones **NO se muestran** en las tarjetas de producto
- Solo se ve: nombre, descripción, precio y stock
- Las tarjetas están más limpias y enfocadas

### 🔍 **En la página de detalle del producto:**
- Las especificaciones sí aparecen
- Se limitan a **2 líneas visibles**
- Si hay más contenido, aparece un botón **"...Más"**
- Al hacer clic en **"...Más"**, se expande para mostrar todo
- Al expandir, el botón cambia a **"▲ Menos"** para contraer

---

## 🎯 Comportamiento Visual:

### Estado Contraído (2 líneas):
```
Especificaciones Técnicas
─────────────────────────────
Procesador: Intel Core i7 | RAM: 16GB | 
Almacenamiento: 512GB SSD | Pantalla: 15.6"
...Más
```

### Estado Expandido:
```
Especificaciones Técnicas
─────────────────────────────
Procesador: Intel Core i7 | RAM: 16GB | 
Almacenamiento: 512GB SSD | Pantalla: 15.6"
Gráficos: NVIDIA RTX 3060 | Batería: 60Wh |
Peso: 1.8kg | Color: Gris Espacial |
Garantía: 1 año | Puerto: USB-C
▲ Menos
```

---

## 🛠️ Archivos Modificados:

### ✨ Nuevo Componente:
- **`src/components/ExpandableSpecs.vue`** - Componente reutilizable para especificaciones expandibles

### 📝 Archivos Actualizados:
- **`src/components/ProductDetails.vue`** 
  - Ahora usa el nuevo componente `ExpandableSpecs`
  - Removidos estilos antiguos de especificaciones

- **`src/components/ProductCard.vue`**
  - Removed la línea que mostraba especificaciones
  - Removidos estilos `.product-specs`

---

## 🎨 Estilos del Componente:

### Colores:
- Texto: `#555` (gris oscuro)
- Encabezado: `#2c3e50` (azul gris)
- Botón: `#667eea` (azul) → `#764ba2` (púrpura) al hover

### Transiciones:
- Expansión/contracción: **0.4s ease**
- Hover del botón: **0.3s ease**

### Características:
- Usa `-webkit-line-clamp: 2` para limitar a exactamente 2 líneas
- Gradiente suave al final de las líneas truncadas
- Efecto fade-in/fade-out al expandir

---

## 📚 Cómo usar el componente:

En cualquier lugar donde necesites especificaciones expandibles:

```vue
<ExpandableSpecs :specs="producto.especificaciones" />
```

### Props:
- `specs` (String): El texto de especificaciones a mostrar

### Comportamiento automático:
- Si el contenido cabe en 2 líneas, **no muestra el botón**
- Si el contenido es más largo, **muestra automáticamente el botón**

---

## 🔧 Personalización:

Para cambiar el número de líneas visibles:

**En `ExpandableSpecs.vue`:**
```javascript
const maxLines = 2  // ← Cambiar este valor
```

Para cambiar los estilos, edita la sección `<style scoped>` del componente.

---

## ✨ Características técnicas:

✅ Detección automática de altura necesaria
✅ Transiciones suaves
✅ Gradiente fade-out al truncar
✅ Botón solo aparece cuando es necesario
✅ Responsive en todos los tamaños
✅ Accesible y semántico

---

## 🧪 Prueba:

1. Ve a http://localhost:5173/productos
   - Las tarjetas NO mostrarán especificaciones

2. Haz clic en un producto para abrir `/product/1`
   - Las especificaciones aparecerán con 2 líneas visibles

3. Si el texto es largo, verás el botón "...Más"
   - Haz clic para expandir

---

**Última actualización:** 11 de Enero, 2025
