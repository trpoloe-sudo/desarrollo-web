# Instrucciones de Uso - Tech Distributor

## Flujo de Usuario

### 1. Página de Inicio (Home)
- Bienvenida a la tienda
- Características principales
- Categorías de productos
- Botón para explorar productos

### 2. Página de Productos
- **Buscar**: Ingresa el nombre del producto
- **Filtrar**: Selecciona una categoría
- **Ver detalles**: Cada tarjeta muestra:
  - Imagen del producto
  - Nombre y descripción
  - Especificaciones técnicas
  - Precio y stock disponible
  - Botón "Añadir al carrito"

### 3. Agregar al Carrito
- Haz clic en "🛒 Añadir" en cualquier producto
- Se confirmará con un mensaje de alerta
- El número de items aparecerá en la badge del carrito en la barra de navegación

### 4. Página del Carrito
- Visualiza todos los items añadidos
- Ajusta cantidades con los botones +/-
- Elimina items con el botón 🗑️
- Visualiza:
  - Subtotal
  - Envío (Gratis)
  - IVA (21% calculado automáticamente)
  - **Total a pagar**
- Botones:
  - **Proceder al Pago**: Para finalizar la compra (aún no integrado)
  - **Vaciar Carrito**: Elimina todos los items
  - **Continuar Comprando**: Vuelve a la lista de productos

## Características de Búsqueda y Filtro

### Búsqueda
Busca en:
- Nombre del producto
- Descripción
- Categoría

Ejemplo: Escribe "Intel" para encontrar procesadores Intel

### Filtro por Categoría
- Selecciona una categoría del dropdown
- Combina con búsqueda para resultados más específicos

## Información Técnica

### Datos Sincronizados
Los productos se cargan desde tu Google Sheet automáticamente:
1. La app solicita los datos a Google Sheets API
2. Si hay error, muestra productos de ejemplo
3. Los datos se actualizan cada vez que recargas la página

### Estado del Carrito
- Se mantiene en memoria durante la sesión
- Si recargas la página, se pierde el carrito
- (Puedes agregar persistencia en localStorage en el futuro)

### Cálculos
- **Precio Final**: Subtotal × 1.21 (IVA 21%)
- **Stock**: Se resta automáticamente (la UI, no la BD)
- **Cantidad**: Se puede ajustar libremente

## Problemas Comunes

### No veo productos
1. Abre la consola (F12)
2. Mira la pestaña "Console" para errores
3. Verifica que tu SHEET_ID y API_KEY sean correctos
4. Asegúrate que Google Sheets API esté habilitada

### El carrito no guarda cambios
1. Verifica que JavaScript esté habilitado
2. Intenta recargar la página
3. Usa un navegador moderno (Chrome, Firefox, Edge, Safari)

### Las imágenes no cargan
1. Verifica las URLs en tu Google Sheet
2. Asegúrate que sean URLs públicas
3. Intenta con imágenes placeholder: `https://via.placeholder.com/300x300?text=ProductName`

### El cálculo del IVA es incorrecto
El IVA se calcula como: **Subtotal × 0.21**

Para cambiar el porcentaje de IVA, edita `src/pages/Cart.vue` y busca:
```javascript
(cartStore.getTotal() * 0.21).toFixed(2)  // 21% de IVA
```

## Navegación

- **Inicio**: Vuelve a la página principal
- **Productos**: Explora el catálogo completo
- **Carrito**: Visualiza y gestiona tus items

Los enlaces están siempre disponibles en la barra de navegación.

## Responsividad

La aplicación se adapta automáticamente:
- **Desktop**: Grid de 4 columnas de productos
- **Tablet**: Grid de 2-3 columnas
- **Mobile**: 1 columna (lista vertical)

El carrito también se adapta en mobile.

## Funcionalidades Futuras Sugeridas

Una vez que tengas la aplicación funcionando, puedes agregar:

1. **Persistencia del Carrito**: Guardar en localStorage
2. **Pasarela de Pago**: Integrar Stripe, PayPal, etc.
3. **Autenticación**: Sistema de usuarios y login
4. **Historial de Pedidos**: Ver pedidos anteriores
5. **Wishlist**: Guardar favoritos
6. **Reseñas**: Comentarios de clientes
7. **Descuentos**: Códigos promocionales
8. **Notificaciones**: Email de confirmación
9. **Panel de Admin**: Gestionar productos sin editar Google Sheet
10. **Integración con Redes Sociales**: Compartir productos

## Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Previsualizar el build
npm run preview
```

## Técnica para Usuarios Avanzados

### Acceder a la Consola del Navegador
1. Presiona `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña "Console"
3. Puedes ejecutar comandos JavaScript

### Inspeccionar Elementos
1. Presiona `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña "Elements" o "Inspector"
3. Puedes editar HTML y CSS para ver cambios en tiempo real

### Ver Red de Solicitudes
1. Presiona `F12`
2. Ve a la pestaña "Network"
3. Recarga la página
4. Verás las solicitudes a Google Sheets API

## Soporte y Documentación

- **README.md**: Información general del proyecto
- **INSTALACION.md**: Instrucciones de instalación
- **GOOGLE_SHEETS_SETUP.md**: Configuración de Google Sheets
- **PERSONALIZACION.md**: Cómo personalizar la app
- **USO.md**: Este archivo

## Próximas Opciones de Desarrollo

### Opción 1: Agregar Autenticación
```javascript
// Usuarios con cuentas y historial
```

### Opción 2: Integración de Pagos
```javascript
// Stripe, PayPal, o tu pasarela preferida
```

### Opción 3: Análisis
```javascript
// Google Analytics para ver comportamiento
```

### Opción 4: SEO
```javascript
// Meta tags dinámicos para mejor posicionamiento
```

¡Disfruta usando tu tienda online!
