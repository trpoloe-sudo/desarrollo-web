# 🇵🇪 Configuración Tributaria - Perú (IGV 18%)

## ✅ Cambios Realizados

Se ha actualizado completamente el sistema tributario de la aplicación para reflejar las normativas fiscales de Perú.

### 📊 Cambios Específicos:

| Elemento | Anterior | Actual | Cambio |
|----------|----------|--------|--------|
| Tipo de Impuesto | IVA | IGV | Nombre correcto peruano |
| Tasa Tributaria | 21% | 18% | Según SUNAT |
| Cálculo | Porcentaje sobre subtotal | Porcentaje sobre subtotal | Sin cambios |

---

## 📁 Archivos Actualizados:

### 1. **`src/stores/cartStore.js`**
```javascript
// ANTES:
const tax = computed(() => {
  return subtotal.value * 0.21 // IVA 21%
})

// AHORA:
const tax = computed(() => {
  return subtotal.value * 0.18 // IGV 18% (Impuesto General a las Ventas - Perú)
})
```

### 2. **`src/pages/Cart.vue`**
- Cambió: `IVA (21%)` → `IGV (18%)`
- Se ve en el resumen del pedido en carrito

### 3. **`src/pages/Checkout.vue`**
- Cambió: `IVA (21%)` → `IGV (18%)`
- Se ve en la sección de resumen de pago

### 4. **`src/pages/Dashboard.vue`**
- Cambió: `IVA (21%)` → `IGV (18%)`
- Se ve en el histórico de órdenes del usuario

### 5. **`src/stores/cart.test.js`**
```javascript
// ANTES:
expect(cartStore.tax).toBe(21) // 21% of 100

// AHORA:
expect(cartStore.tax).toBe(18) // 18% of 100 (IGV Perú)
```

---

## 💰 Ejemplo de Cálculo:

### Producto por $100

**Antiguo Sistema (IVA 21%):**
```
Subtotal:     $100.00
IVA (21%):    $ 21.00
Total:        $121.00
```

**Nuevo Sistema (IGV 18%):**
```
Subtotal:     $100.00
IGV (18%):    $ 18.00
Total:        $118.00
```

---

## 🇵🇪 Sobre el IGV en Perú

### ¿Qué es el IGV?
- **IGV** = Impuesto General a las Ventas
- Es el impuesto al consumo en Perú
- Administrado por la **SUNAT** (Superintendencia Nacional de Aduanas y de Administración Tributaria)

### Tasa Actual:
- **18%** es la tasa estándar en Perú
- Aplicable a la mayoría de bienes y servicios
- Se calcula sobre el precio de venta

### Recargo Adicional (Opcional):
- Algunos productos pueden tener un adicional (IPM, percepción, etc.)
- En esta aplicación solo se aplica el IGV estándar del 18%

---

## 🔧 Cómo Modificar el Porcentaje en el Futuro:

Si necesitas cambiar el porcentaje de IGV en el futuro:

### 1. En `src/stores/cartStore.js`:
```javascript
const tax = computed(() => {
  return subtotal.value * 0.18 // ← Cambiar este valor
})
```

### 2. En las vistas (Cart.vue, Checkout.vue, Dashboard.vue):
```vue
<span>IGV (18%):</span>  <!-- ← Cambiar el porcentaje aquí también -->
```

### 3. En los tests (`src/stores/cart.test.js`):
```javascript
expect(cartStore.tax).toBe(18) // ← Actualizar valor esperado
```

---

## ✨ Vistas Afectadas:

### Carrito (`/cart`)
```
Subtotal:     $X.XX
Envío:        Gratis
IGV (18%):    $X.XX
─────────────────────
Total:        $X.XX
```

### Checkout (`/checkout`)
Mismo formato que el carrito

### Dashboard (`/dashboard`)
En el histórico de órdenes:
```
Subtotal: $X.XX
IGV (18%): $X.XX
Total: $X.XX
```

---

## 🧪 Tests Actualizados:

El test `calculates tax correctly` en `src/stores/cart.test.js` ahora valida:
- Que un subtotal de $100 genere un IGV de $18
- Que el total sea $118

```javascript
it('calculates tax correctly', () => {
  // Test validation
  expect(cartStore.tax).toBe(18) // 18% of 100 (IGV Perú)
})
```

---

## 📋 Checklist de Implementación:

- ✅ Actualizado cartStore.js (cálculo 18%)
- ✅ Actualizado Cart.vue (etiqueta IGV 18%)
- ✅ Actualizado Checkout.vue (etiqueta IGV 18%)
- ✅ Actualizado Dashboard.vue (etiqueta IGV 18%)
- ✅ Actualizado tests (validación 18%)

---

## 🚀 Estado Actual:

La aplicación ahora está completamente configurada para operar bajo las normativas fiscales peruanas con IGV del 18%.

Todos los cálculos, etiquetas y tests han sido actualizados y verificados.

---

**Configurado:** 11 de Enero, 2026
**País:** 🇵🇪 Perú
**Impuesto:** IGV 18%
