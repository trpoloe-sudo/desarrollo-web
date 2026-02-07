# Guía de Personalización - Tech Distributor

## Cambiar Nombre de la Empresa

### 1. En el Header
Archivo: `src/components/Header.vue`

Busca:
```vue
<h1>🖥️ Tech Distributor</h1>
<p class="tagline">Distribuidor de Computadoras y Partes</p>
```

Reemplaza con tu nombre y descripción:
```vue
<h1>🖥️ Tu Empresa</h1>
<p class="tagline">Tu descripción aquí</p>
```

### 2. En el Footer
Archivo: `src/components/Footer.vue`

Busca:
```vue
<h3>Tech Distributor</h3>
<p>Distribuidor líder en computadoras y partes de calidad</p>
...
<p>Email: contacto@techdistributor.com</p>
<p>Tel: +34 900 123 456</p>
```

Reemplaza con tus datos:
```vue
<h3>Tu Empresa</h3>
<p>Tu descripción</p>
...
<p>Email: tuemail@ejemplo.com</p>
<p>Tel: +34 123 456 789</p>
```

### 3. En la Página de Inicio
Archivo: `src/pages/Home.vue`

Busca:
```vue
<h1>Bienvenido a Tech Distributor</h1>
```

Reemplaza con:
```vue
<h1>Bienvenido a Tu Empresa</h1>
```

### 4. En el Título de la Página
Archivo: `index.html`

Busca:
```html
<title>Tech Distributor - Computadoras y Partes</title>
```

Reemplaza con:
```html
<title>Tu Empresa - Tu descripción</title>
```

## Cambiar Colores

Los colores principales se usan en múltiples lugares. Aquí están los códigos:

### Colores Actuales
- Primario (Azul): `#667eea`
- Secundario (Púrpura): `#764ba2`
- Texto oscuro: `#2c3e50`
- Fondo claro: `#f5f5f5`
- Acento rojo: `#e74c3c`
- Acento verde: `#27ae60`

### Cómo Cambiarlos

1. **Usando Find and Replace** (Recomendado):
   - Abre VS Code
   - Presiona `Ctrl+H` para abrir Find and Replace
   - Busca: `#667eea`
   - Reemplaza con: `#TUCOLOR`
   - Haz clic en "Replace All"

2. **Manualmente** (Alternativa):
   
   **Para cambiar el color primario (#667eea)**:
   - Header.vue
   - NavBar.vue
   - ProductCard.vue
   - Home.vue
   - Products.vue
   - Cart.vue

### Ejemplos de Combinaciones de Colores

**Opción Moderna (Azul)**
```
Primario: #2563eb (Azul vibrante)
Secundario: #1e40af (Azul oscuro)
```

**Opción Profesional (Gris)**
```
Primario: #475569 (Gris pizarra)
Secundario: #334155 (Gris más oscuro)
```

**Opción Energética (Naranja)**
```
Primario: #ea580c (Naranja)
Secundario: #c2410c (Naranja oscuro)
```

**Opción Verde (Eco)**
```
Primario: #059669 (Verde)
Secundario: #047857 (Verde oscuro)
```

## Cambiar Iconos

Los iconos son emojis. Puedes cambiarlos en cualquier componente:

### Ubicaciones de Iconos:
- Header: `🖥️` (en Header.vue)
- Procesadores: `🖥️` (en Home.vue)
- Tarjetas Gráficas: `🎮`
- Almacenamiento: `💾`
- Memoria RAM: `🧠`
- Carrito: `🛒` (en NavBar.vue)
- Envío: `🚚` (en Home.vue)
- Garantía: `🛡️`
- Soporte: `💬`
- Calidad: `💎`
- Eliminar: `🗑️` (en Cart.vue)

### Cambiar un Icono:
Simplemente busca el emoji que quieras cambiar y reemplázalo:

```vue
<!-- Antes -->
<h1>🖥️ Tech Distributor</h1>

<!-- Después -->
<h1>💻 Mi Empresa</h1>
```

## Agregar tu Logo

### 1. Opción: Usar una Imagen
En `src/components/Header.vue`:

```vue
<!-- Antes -->
<h1>🖥️ Tech Distributor</h1>

<!-- Después -->
<img src="/path/to/your/logo.png" alt="Logo" class="logo-image">
```

Luego agrega el CSS:
```css
.logo-image {
  height: 50px;
  width: auto;
  margin-right: 15px;
}
```

### 2. Opción: Usar un SVG
Puedes crear un archivo `logo.svg` en la carpeta `public/` y referenciarlo:

```vue
<img src="/logo.svg" alt="Logo" class="logo-image">
```

## Cambiar Categorías

Las categorías se detectan automáticamente de la Google Sheet, pero puedes:

1. **Añadir nuevas categorías**: Simplemente agrega productos con nuevas categorías en la Google Sheet
2. **Cambiar nombres**: Edita los nombres de las categorías en tu Google Sheet

## Personalizar la Página de Inicio

### Cambiar Título Principal
Archivo: `src/pages/Home.vue`

```vue
<h1>Bienvenido a Tech Distributor</h1>
```

### Cambiar Descripción
```vue
<p>Tu distribuidor de confianza en computadoras y partes de alta calidad</p>
```

### Cambiar Características
Busca la sección `features-grid` y edita:

```vue
<div class="feature-card">
  <div class="feature-icon">💎</div>
  <h3>Calidad Premium</h3>
  <p>Productos de las mejores marcas del mercado</p>
</div>
```

### Cambiar Categorías Mostradas
Busca la sección `categories-grid` y edita:

```vue
<div class="category-box">
  <h3>🖥️ Procesadores</h3>
  <p>Intel y AMD de última generación</p>
</div>
```

## Personalizar Fuentes

Para cambiar la fuente de letra, edita en `index.html`:

```html
<!-- Antes -->
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...
  }
</style>

<!-- Después - Ejemplo con Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

<style>
  body {
    font-family: 'Poppins', sans-serif;
  }
</style>
```

## Personalizar Espaciado

### Ancho Máximo del Contenido
En cualquier componente, busca:
```css
.container {
  max-width: 1200px;
}
```

Cambia 1200px a tu preferencia:
- 900px: Más compacto
- 1200px: Por defecto
- 1400px: Más amplio

### Padding (Espacios internos)
Busca `padding: 40px` en los archivos CSS y cambia el valor.

## Personalizar Bordes Redondeados

Busca `border-radius` en los estilos:
- `border-radius: 4px` - Esquinas muy suaves
- `border-radius: 8px` - Suave (por defecto)
- `border-radius: 12px` - Muy redondeado
- `border-radius: 20px` - Muy pronunciado

## Personalizar Sombras

Busca `box-shadow` para cambiar las sombras de elementos:

```css
/* Sombra suave (por defecto) */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* Sombra más marcada */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

/* Sombra muy suave */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
```

## Cambiar Animaciones

Las transiciones están definidas con `transition`:

```css
/* Cambiar velocidad de animación */
transition: background-color 0.3s ease;  /* 0.3s = 300ms */

/* Cambiar a más rápido */
transition: background-color 0.1s ease;

/* Cambiar a más lento */
transition: background-color 0.5s ease;
```

## Personalizar Botones

Busca `.add-btn` en ProductCard.vue:

```css
.add-btn {
  padding: 8px 12px;        /* Cambia tamaño */
  background-color: #667eea; /* Cambia color */
  border-radius: 4px;        /* Cambia redondez */
  font-weight: bold;         /* Cambia peso de fuente */
}
```

## Personalizar Textos de la Aplicación

Busca los siguientes textos en los archivos Vue para cambiarlos:

### En NavBar
```vue
<RouterLink to="/" class="nav-link">Inicio</RouterLink>
<RouterLink to="/products" class="nav-link">Productos</RouterLink>
<RouterLink to="/cart" class="nav-link cart-badge">🛒 Carrito</RouterLink>
```

### En Cart
```vue
<h2>Resumen del Pedido</h2>
<span>Subtotal:</span>
<button class="checkout-btn">Proceder al Pago</button>
```

## Guardar Cambios

Después de personalizar:

1. **Guardar archivo**: `Ctrl+S`
2. **Ver cambios**: Si estás en `npm run dev`, se actualizan automáticamente
3. **Recargar navegador**: `F5` o `Ctrl+R`

## Ejemplos de Personalización Completa

### Cambiar Esquema de Color Completo

```bash
# 1. Abre Find & Replace (Ctrl+H)
# 2. Busca: #667eea
#    Reemplaza: #2563eb
# 3. Haz clic "Replace All"
# 4. Busca: #764ba2
#    Reemplaza: #1e40af
# 5. Haz clic "Replace All"
```

### Cambiar a Modo Oscuro

Modifica el `index.html`:

```html
<style>
  body {
    background-color: #1a1a1a;
    color: #f5f5f5;
  }
</style>
```

Luego cambia los colores del header y footer a tonos oscuros.

## Deshaciendo Cambios

Si cometiste un error:
1. `Ctrl+Z` para deshacer
2. O reescribe el archivo desde el original

## Próximas Personalizaciones Recomendadas

1. Agregar tu logo
2. Cambiar los colores a los de tu empresa
3. Actualizar información de contacto
4. Cambiar el nombre de la empresa en todo
5. Personalizar los iconos
6. Agregar tus propios productos en Google Sheets

¡Diviértete personalizando tu tienda!
