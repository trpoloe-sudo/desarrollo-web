# Vista Previa del Componente de Login

## 📱 Cómo se ve en la aplicación:

```
╔═══════════════════════════════════════╗
║                                       ║
║         Iniciar Sesión               ║
║                                       ║
║    ┌─────────────────────────────┐   ║
║    │  🔐  Continuar con Google   │   ║
║    └─────────────────────────────┘   ║
║                                       ║
║        o continúa con email           ║
║                                       ║
║    ┌─────────────────────────────┐   ║
║    │ Email:                      │   ║
║    │ [tu@email.com________]      │   ║
║    └─────────────────────────────┘   ║
║                                       ║
║    ┌─────────────────────────────┐   ║
║    │ Contraseña:                 │   ║
║    │ [••••••••________]          │   ║
║    └─────────────────────────────┘   ║
║                                       ║
║    ┌─────────────────────────────┐   ║
║    │   Iniciar Sesión            │   ║
║    └─────────────────────────────┘   ║
║                                       ║
║    ¿No tienes cuenta? Regístrate     ║
║                                       ║
╚═══════════════════════════════════════╝
```

## 🎨 Estilos Aplicados:

### Botón de Google
- Fondo blanco con borde gris
- Ícono de candado + texto
- Efecto hover: borde azul, fondo gris
- Animación de elevación al pasar el mouse
- Estado deshabilitado cuando carga

### Divider
- Línea gris horizontal
- Texto "o continúa con email" centrado
- Ancho 100%, responsivo

### Formulario
- Inputs estilizados con border gris
- Focus: border azul, shadow sutil
- Validación en tiempo real

### Botón Principal
- Gradiente púrpura/azul
- Hover: elevación + sombra
- Disabled: opacidad baja
- Transición suave 0.2s

---

## 🔄 Estados del Componente:

### Estado 1: Inicial
```
[🔐 Continuar con Google]  ← Esperando click
o continúa con email
[Email field]
[Password field]
[Iniciar Sesión button]
```

### Estado 2: Cargando Google
```
[🔐 Cargando...] ← Deshabilitado, animado
```

### Estado 3: Pop-up de Google
```
┌──────────────────────────┐
│  Google Login Window      │
│                          │
│ Email: [____]            │
│ [Sign in with Google]    │
└──────────────────────────┘
```

### Estado 4: Success
```
✅ Sesión iniciada con Google
[Redirigiendo a home...]
```

---

## 🎯 Interactividad:

| Elemento | Acción | Resultado |
|----------|--------|-----------|
| Botón Google | Click | Abre prompt de Google |
| Input Email | Focus | Border azul + shadow |
| Input Password | Focus | Border azul + shadow |
| Botón Iniciar | Hover | Elevación + sombra |
| Toggle Register | Click | Cambia a modo registro |

---

## 📱 Responsive Design:

### Desktop (>1024px)
- Todos los elementos visibles
- Ancho máximo 400px centrado
- Fuentes normales

### Tablet (768px - 1024px)
- Layout igual
- Ligera reducción de fuentes
- Padding ajustado

### Mobile (<768px)
- Card más pequeña
- Fuentes reducidas
- Touch-friendly buttons
- Padding adaptado

---

## 🌈 Colores Utilizados:

```css
/* Fondos */
Background: #fff (blanco)
Container BG: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Botones */
Google Button Border: #ddd (gris)
Google Button Hover: #667eea (azul)
Primary Button: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Texto */
Título: #333 (gris oscuro)
Labels: #555 (gris)
Links: #667eea (azul)

/* Estados */
Error: #fee (fondo), #c33 (texto)
Focus: #667eea (azul)
Divider: #999 (gris claro)
```

---

## ✨ Animaciones:

### Slide-in (entrada del componente)
```css
from: opacity 0, transform translateY(20px)
to: opacity 1, transform translateY(0)
duration: 0.3s
```

### Button Hover
```css
transform: translateY(-2px)
box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4)
duration: 0.2s
```

### Input Focus
```css
border-color: #667eea
box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1)
```

---

## 🔊 Mensajes de Usuario:

### Success
```
✅ Sesión iniciada con Google
Redirigiendo...
```

### Error
```
❌ Google Client ID no configurado en .env
Por favor usa el login tradicional.
```

### Loading
```
[🔐 Cargando...]
```

---

## 📊 Estructura HTML:

```html
<div class="auth-container">
  <div class="auth-card">
    <h2>Iniciar Sesión</h2>
    
    <div class="google-login-section">
      <button class="btn-google">
        <span class="google-icon">🔐</span>
        Continuar con Google
      </button>
      <p class="divider">o continúa con email</p>
    </div>
    
    <form>
      <!-- Email field -->
      <!-- Password field -->
      <!-- Submit button -->
    </form>
    
    <p class="toggle-auth">
      ¿No tienes cuenta?
      <button class="link-btn">Regístrate</button>
    </p>
  </div>
</div>

<div id="google-button-container"></div>
```

---

**Última actualización:** 11 de Enero, 2025
