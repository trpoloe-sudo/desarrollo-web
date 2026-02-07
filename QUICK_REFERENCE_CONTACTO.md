# 🚀 Quick Reference - Editar Sección de Contacto

## ⚡ Guía Rápida para Futuros Cambios

**Archivo Principal:** `src/components/ContactSection.vue` (1040 líneas)

---

## 🎨 Colores - Dónde Editarlos

### Variables CSS (líneas 380-395)
```css
:root {
  --color-primary: #1e3c72;
  --color-secondary: #2a5298;
  --color-accent: #4db8ff;
  --color-border: #e0e0e0;
  --color-text: #333;
  --color-text-light: #666;
}
```

### Cambiar Colores Principales
```diff
// Cambiar azul a otro color:
--color-primary: #1e3c72  → #TU_COLOR
--color-secondary: #2a5298 → #TU_COLOR
```

### Colores Específicos (Hardcoded)
```css
Línea ~570: Gradiente Morado Disponibilidad
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

Línea ~880: Verde WhatsApp
  border-color: #25d366;
  background: #25d366;

Línea ~905: Amarillo Éxito
  color: #ffeb3b;
```

---

## 📝 Textos - Dónde Cambiarlos

### Encabezado (líneas 5-7)
```html
<h2 class="section-title">Ponte en Contacto Ahora</h2>
<p class="section-subtitle">Respuesta rápida en menos de 2 horas laborales</p>
```

### Contacto Directo (líneas 15-23)
```html
<div class="direct-contact">
  <h4>📞 Contacto Directo</h4>
  <a href="tel:+51978418809">☎️ +51 978 418 809</a>
  <a href="mailto:cotizaciones@ztartech.com">📧 cotizaciones@ztartech.com</a>
</div>
```

### Disponibilidad (líneas 25-32)
```html
<div class="availability-box">
  <div class="availability-icon">🕐</div>
  <div class="availability-content">
    <h4>Disponibilidad</h4>
    <p><strong>Lunes a Viernes:</strong> 9:00 AM - 6:00 PM</p>
    <p><strong>Sábados:</strong> 10:00 AM - 3:00 PM</p>
    <p class="availability-note">💬 WhatsApp 24/7</p>
  </div>
</div>
```

### Ventajas (líneas 45-64)
```html
<div class="advantages">
  <div class="advantage-item">
    <span class="advantage-icon">⚡</span>
    <h5>Respuesta Rápida</h5>
    <p>Menos de 2 horas laborales</p>
  </div>
  <!-- Repetir para otras ventajas -->
</div>
```

### Campos del Formulario (líneas 80-155)
```html
<!-- Nombre -->
<div class="form-group">
  <label class="form-label">NOMBRE</label>
  <input type="text" v-model="form.name" ... />
</div>

<!-- Teléfono -->
<div class="form-group">
  <label class="form-label">TELÉFONO</label>
  <input type="tel" v-model="form.phone" ... />
</div>

<!-- Asunto (Select) -->
<div class="form-group">
  <label class="form-label">ASUNTO</label>
  <select v-model="form.subject">
    <option>Cotización</option>
    <option>Soporte Técnico</option>
    <option>Reparación</option>
    <option>Otro</option>
  </select>
</div>

<!-- Mensaje -->
<div class="form-group">
  <label class="form-label">MENSAJE</label>
  <textarea v-model="form.message" ...></textarea>
</div>

<!-- Privacidad -->
<div class="form-group checkbox">
  <input type="checkbox" v-model="form.privacy" />
  <label>Acepto la política de privacidad</label>
</div>
```

### Botones Alternativos (líneas 193-204)
```html
<div class="alternative-actions">
  <div class="alternative-buttons">
    <button @click="openWhatsApp" class="alt-button whatsapp">
      <span class="alt-icon">💬</span>
      WhatsApp
    </button>
    <button @click="callDirect" class="alt-button phone">
      <span class="alt-icon">☎️</span>
      Teléfono
    </button>
  </div>
</div>
```

---

## 🔧 Funciones JavaScript - Modificarlas

### Abrir WhatsApp (línea ~270)
```javascript
openWhatsApp() {
  const phoneNumber = '51978418809'  // CAMBIAR AQUÍ
  const message = encodeURIComponent('Hola, quisiera hacer una consulta sobre tus servicios.')
  window.open(`https://wa.me/${phoneNumber}?text=${message}`)
}
```

### Llamada Directa (línea ~278)
```javascript
callDirect() {
  window.location.href = 'tel:+51978418809'  // CAMBIAR AQUÍ
}
```

### Resetear Formulario (línea ~326)
```javascript
resetForm() {
  this.form = {
    name: '',
    phone: '',
    subject: 'Cotización',
    message: '',
    privacy: false
  }
}
```

### Validación (líneas ~290-320)
```javascript
validateForm() {
  // Cambiar validación aquí según necesidad
  if (this.form.name.length < 3) return 'Nombre muy corto'
  if (this.form.phone.length < 9) return 'Teléfono incompleto'
  if (this.form.message.length < 10) return 'Mensaje muy corto'
  // etc...
}
```

---

## 🎯 Estructura CSS - Principales Clases

### Layout Principal (línea 457)
```css
.contact-section { padding: 80px 20px; }
.contact-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.contact-info { display: flex; flex-direction: column; gap: 20px; }
.form-wrapper { position: relative; }
```

### Elementos Izquierda
```css
.direct-contact { ... }      /* Contacto directo */
.availability-box { ... }    /* Disponibilidad */
.trust-message { ... }       /* Mensaje confianza */
.advantages { ... }          /* Ventajas grid */
.advantage-item { ... }      /* Cada ventaja */
```

### Elementos Derecha
```css
.contact-form { ... }        /* Contenedor formulario */
.form-group { ... }          /* Grupo campo */
.form-label { ... }          /* Etiqueta */
.form-input { ... }          /* Input */
.form-textarea { ... }       /* Textarea */
.submit-button { ... }       /* Botón envío */
.alternative-actions { ... } /* Botones alt */
.response-badge { ... }      /* Badge respuesta */
```

---

## 📱 Responsive Breakpoints (líneas 930-1020)

### Tablet (768px)
```css
@media (max-width: 768px) {
  .contact-wrapper { grid-template-columns: 1fr; }
  .advantages { grid-template-columns: 1fr 1fr; } /* o 1fr si quieres */
  .alternative-buttons { flex-direction: column; }
  /* Padding y font reductions */
}
```

### Mobile (480px)
```css
@media (max-width: 480px) {
  .section-title { font-size: 2rem; }
  .contact-form { padding: 20px; }
  .alternative-buttons { gap: 8px; }
  /* Más reductions */
}
```

---

## 🔍 Buscar y Reemplazar - Comandos Útiles

### Cambiar teléfono en todo el archivo
```
Buscar:   +51978418809
Reemplazar: +51XXXXXXXXX
```

### Cambiar email
```
Buscar:   cotizaciones@ztartech.com
Reemplazar: newemail@domain.com
```

### Cambiar color primario (ALL)
```
Buscar:   #1e3c72
Reemplazar: #NEWCOLOR (en CSS vars)
```

---

## ✅ Validación Después de Cambios

1. **Verifica estilos**
   ```bash
   npm run dev
   # Abre en localhost:5174
   # Inspecciona con DevTools (F12)
   ```

2. **Chequea responsive**
   - Desktop (>1024px) ✅
   - Tablet (768px) ✅
   - Mobile (320px) ✅

3. **Prueba interactividad**
   - Hover en botones
   - Focus en inputs
   - Validación de formulario
   - Links funcionan

4. **No hay errores**
   ```bash
   npm run build
   # Verifica sin errores
   ```

---

## 🐛 Problemas Comunes

### Formulario no valida
```javascript
// Revisar línea ~290
// Editar condiciones en validateForm()
// O en validationErrors computed property
```

### Estilos no se aplican
```css
/* 1. Verificar specificity */
/* 2. Limpiar caché del navegador (Ctrl+Shift+R) */
/* 3. Revisar si hay conflictos con global.css */
```

### Responsivo no funciona
```css
/* 1. Verificar media queries (línea 930) */
/* 2. Cambiar valores de breakpoints si es necesario */
/* 3. Revisar grid-template-columns en media queries */
```

### Colores no cambian
```css
/* 1. Editar :root variables */
/* 2. Hardcoded colors (#667eea, #25d366, etc) */
/* 3. Limpiar caché */
```

---

## 📊 Estadísticas del Archivo

```
Total de líneas: 1040
HTML: ~210 líneas (lines 1-220)
Vue Script: ~150 líneas (lines 230-380)
CSS: ~650 líneas (lines 400-1050)

Clases CSS principales: 30+
Elementos HTML: 50+
Funciones JavaScript: 8
Data properties: 6
```

---

## 📋 Checklist para Cambios Grandes

- [ ] Editar HTML template
- [ ] Editar JavaScript functions
- [ ] Editar CSS styles
- [ ] Editar responsive breakpoints
- [ ] Probar en dev: `npm run dev`
- [ ] Verificar desktop (>1024px)
- [ ] Verificar tablet (768px)
- [ ] Verificar mobile (320px)
- [ ] Probar validación
- [ ] Probar links
- [ ] Revisar colores
- [ ] Limpiar caché (Ctrl+Shift+R)
- [ ] Build: `npm run build`
- [ ] Verificar sin errores
- [ ] Documentar cambios

---

## 🎯 Atajos Útiles en VS Code

```
Ctrl+F       // Buscar texto
Ctrl+H       // Buscar y reemplazar
Ctrl+/       // Comentar línea
Ctrl+D       // Seleccionar palabra
Ctrl+Shift+L // Seleccionar todas las coincidencias
F12          // DevTools en navegador
Ctrl+S       // Guardar
```

---

## 📞 Información Rápida de Contacto

| Campo | Valor | Dónde cambiar |
|-------|-------|---------------|
| Teléfono | +51978418809 | Líneas 20, 275, 278 |
| Email | cotizaciones@ztartech.com | Línea 23 |
| Disponibilidad | L-V 9AM-6PM, S 10AM-3PM | Líneas 27-29 |
| WhatsApp | 51978418809 | Línea 275 |
| Horario mensajes | Menos de 2 horas | Línea 6, 220 |

---

## 🚀 Próximas Mejoras Sugeridas

- [ ] Agregar validación email
- [ ] Agregar CAPTCHA
- [ ] Conectar a API backend
- [ ] Enviar email confirmación
- [ ] Guardar en database
- [ ] Chat en vivo widget
- [ ] Video tutorial embed
- [ ] FAQ section
- [ ] Testimonials carousel
- [ ] Time zone awareness

---

## 📞 Support

**Preguntas sobre:**
- Estructura: Ver líneas 1-220
- Funciones: Ver líneas 230-380
- Estilos: Ver líneas 400-1050
- Responsive: Ver líneas 930-1020

---

**Creado:** 24 de Enero, 2025  
**Componente:** ContactSection.vue  
**Versión:** 1.0
