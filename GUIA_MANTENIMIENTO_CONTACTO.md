# 🔧 Guía de Mantenimiento y Operación - Sección de Contacto

## 📋 Document Control

**Versión:** 1.0  
**Fecha:** 24 de Enero, 2026  
**Propósito:** Guía operativa de mantenimiento y soporte

---

## 1. DESCRIPCIÓN GENERAL

**Componente:** `src/components/ContactSection.vue`  
**Propósito:** Capturar leads y solicitudes de cotización  
**Usuarios:** Clientes que necesitan contactar a ZTarTech  
**Criticidad:** ALTA (genera 70%+ de leads)

---

## 2. ACCESO Y PERMISOS

### 2.1 Quién puede modificar

| Rol | Acceso | Permisos |
|-----|--------|----------|
| Desarrollador Frontend | `src/components/` | Modificar código, CSS, form fields |
| Product Manager | Documentación | Revisar cambios, aprobar mejoras |
| Admin | Dashboard admin | Ver leads, responder contactos |
| DevOps | Deployment | Push a producción |

### 2.2 Control de cambios

```
1. Cambio en rama: feature/contacto-mejora
2. Review por 1 persona
3. Merge a develop
4. QA testing
5. Deploy a staging
6. Pruebas en vivo
7. Merge a main
8. Deploy a producción
```

---

## 3. OPERACIÓN DIARIA

### 3.1 Checklist Mañana

Al iniciar el día (9:00 AM):

```
☐ Revisar emails de formulario contacto
☐ Revisar WhatsApp mensajes
☐ Revisar voicemails (si hay)
☐ Revisar leads en CRM
☐ Actualizar estado de leads en seguimiento

Tiempo estimado: 15 minutos
```

### 3.2 Proceso de Respuesta

**Lead por Formulario:**

```
Recibe: Formulario completado
Acción: 5 minutos máximo
└─ Revisar datos (nombre, teléfono, asunto)
└─ Si empresa (B2B): +20 prioridad
└─ Si recovery/urgente: +30 prioridad
└─ Llamar o WhatsApp inmediatamente
└─ Si no responde: Email + mensaje automático

Respuesta esperada: <2 horas
```

**Lead por Llamada Directa:**

```
Recibe: Llamada directa
Acción: Inmediato
└─ Contestar teléfono
└─ Escuchar problema (1-2 min)
└─ Hacer preguntas aclaratorias (2-3 min)
└─ Dar presupuesto aproximado
└─ Agendar visita/envío
└─ Enviar confirmación por WhatsApp/email

Conversión: 60-70%
```

**Lead por WhatsApp:**

```
Recibe: Mensaje en WhatsApp
Acción: 30 minutos máximo
└─ Enviar respuesta automática inicial
└─ Revisar mensaje (2 min)
└─ Responder pregunta (2-3 min)
└─ Ofrecer opciones
└─ Conseguir dirección/detalles
└─ Agendar si es reparación
└─ Enviar cotización si es venta

Conversión: 40-50%
```

---

## 4. GESTIÓN DE LEADS

### 4.1 Lead Scoring (Después de integración backend)

```
Base: 0 puntos

FACTOR: Tipo de solicitud
├─ Reparación:        +10 (regular)
├─ Venta:             +15 (mejor)
├─ Recovery:          +20 (urgente)
├─ Diagnóstico:       +5  (exploratorio)
└─ Otro:              +0

FACTOR: Información completa
├─ Empresa (B2B):     +20 (cualificado)
├─ Teléfono+email:    +5
├─ Mensaje detallado: +10
└─ Privacidad acepta: +5

FACTOR: Tiempo de respuesta
├─ <30 min:           +20 (caliente)
├─ <2 horas:          +10
├─ <24 horas:         +5
└─ >24 horas:         -10

Clasificación:
├─ 50+ puntos: 🔥 HOT    → Contactar inmediato
├─ 30-49:     ⚡ WARM    → Contactar hoy
├─ 10-29:     🔵 COLD    → Contactar esta semana
└─ <10:       ❓ SPAM    → Verificar legitimidad
```

---

## 5. MANTENIMIENTO TÉCNICO

### 5.1 Monitoreo Diario

```
Actividad                          Responsable  Frecuencia
─────────────────────────────────────────────────────────
Revisar errores de form            Dev          Cada 2h
Revisar performance Lighthouse     Dev          1x diario
Validar links (tel, email, wa)     QA           1x diario
Revisar Google Analytics           PM           1x diario
Revisar CRM para fallos de API     Admin        1x diario
```

### 5.2 Tareas Semanales

```
Tarea                              Responsable  Duración
─────────────────────────────────────────────────────────
Revisar leads no respondidos       Sales        30 min
Optimizar copia si baja conv       PM           1h
Revisar Google Sheets              Admin        15 min
Validar emails se envían           Dev          15 min
A/B test de CTA (si hay)           PM           2h
```

### 5.3 Tareas Mensuales

```
Tarea                              Responsable  Duración
─────────────────────────────────────────────────────────
Análisis de conversión            PM           2h
Reporte de leads (origen, calidad) Admin        1h
Mejoras detectadas/feedback        Dev          2h
Performance review                Dev          1h
Capacitación equipo ventas        Sales        1h
```

---

## 6. TROUBLESHOOTING OPERATIVO

### 6.1 "El formulario no envía"

**Síntomas:**
- Usuario completa form
- Click en botón
- No pasa nada (o error)

**Diagnóstico:**

```javascript
// Paso 1: Revisar console browser
F12 → Console → ¿Hay errores?
  Si sí → Leer mensaje de error
  Si no → Paso 2

// Paso 2: Revisar red
F12 → Network → Recargar
  ¿POST a /api/contact/submit?
  Si no → Endpoint no implementado
  Si sí → Revisar response (paso 3)

// Paso 3: Revisar response
Status: 201? 200? → Éxito
Status: 400? → Error validación (revisar mensaje)
Status: 500? → Error servidor (contactar backend dev)
Status: sin respuesta → Timeout/CORS (revisar env)
```

**Soluciones comunes:**

```
Error: "Cannot POST /api/contact/submit"
→ Backend endpoint no existe
→ Acción: Crear endpoint en servidor

Error: "CORS error"
→ API_URL mal configurada en .env
→ Acción: Verificar VITE_API_URL

Error: "Validation failed"
→ Algún campo no pasa validación backend
→ Acción: Revisar errores en respuesta

Error: "Network timeout"
→ API muy lenta o caída
→ Acción: Verificar status API
```

---

### 6.2 "Los emails de confirmación no llegan"

**Causa probable:**
- Email service no configurado
- Credenciales Gmail incorrectas
- Rate limit de Gmail

**Solución:**

```javascript
// En backend: googleAuth.js o emailService.js

// Verificar credenciales
const EMAIL_USER = process.env.EMAIL_USER      // ¿Existe?
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD  // ¿Es app password?
const SMTP_SERVICE = 'gmail'                   // ¿Correcto?

// Test: Enviar email de prueba
const testEmail = async () => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: 'test@gmail.com',
      subject: 'Test',
      text: 'Funciona'
    })
    console.log('✅ Email enviado')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}
```

---

### 6.3 "Formulario muy lento en móvil"

**Causa probable:**
- Bundle size grande
- CSS sin optimizar
- JavaScript sin minify

**Solución:**

```bash
# Analizar tamaño
npm run build
# Revisar dist/ folder

# Optimizar
- Lazy load imágenes
- Minify CSS
- Tree-shake código no usado
- Cache headers

# Verificar Lighthouse
npm run build
lighthouse http://localhost:5174/
# Target: Performance > 90
```

---

## 7. CAMBIOS COMUNES Y CÓMO HACERLOS

### 7.1 Cambiar teléfono de contacto

**Ubicaciones:**

```vue
// 1. Componente
<a href="tel:+51978418809">+51 978 418 809</a>
// → Cambiar a nuevo número en ambos lugares

// 2. CSS (para styling)
.phone-method { /* color: yellow */ }

// 3. Servicio API
const openWhatsApp = () => {
  const phoneNumber = '51978418809'  // ← Actualizar aquí
  // ...
}

// 4. Documentación
GUIA_DETALLES_PRODUCTOS.md
CASOS_USO_CONTACTO.md
// → Buscar y reemplazar número antiguo

// 5. Backend (si existe)
const ADMIN_PHONE = '+51978418809'  // ← Actualizar
```

---

### 7.2 Agregar nueva opción de "Asunto"

**Paso a paso:**

```vue
<!-- Paso 1: Template -->
<option value="nuevo_asunto">📌 Nueva Opción</option>

<!-- Paso 2: Actualizar validación -->
const VALID_SUBJECTS = {
  'reparacion': '🔧 Reparación',
  // ... otros
  'nuevo_asunto': '📌 Nueva Opción'  // ← Agregar aquí
}

// Paso 3: Backend validation.js
const validSubjects = ['reparacion', ..., 'nuevo_asunto']

// Paso 4: Documentación
INTEGRACION_BACKEND_CONTACTO.md
CASOS_USO_CONTACTO.md
// → Actualizar lista de opciones
```

---

### 7.3 Cambiar color del badge

**Ubicación:** CSS línea ~440

```css
.badge-pre-header {
  background: linear-gradient(
    135deg,
    #25d366 0%,      // ← Verde WhatsApp
    #128c7e 100%     // ← Verde oscuro
  );
  
  /* Nuevos colores si cambias: */
  /* #1e3c72 → #2a5298 (azul) */
  /* #28a745 → #20c997 (verde bootstrap) */
}
```

---

### 7.4 Cambiar CTA button text

**Ubicaciones:**

```vue
<!-- Botón principal -->
<button class="submit-button">
  🚀 Solicitar Cotización Ahora
  <!-- Cambiar aquí -->
</button>

<!-- Estados de carga -->
<span v-if="!isSubmitting">
  🚀 Solicitar Cotización Ahora
</span>
<span v-else>
  ✓ Enviando solicitud...
  <!-- Y aquí también -->
</span>
```

---

## 8. DEPLOYMENT

### 8.1 Pre-deployment Checklist

```
Antes de hacer deploy:

☐ Tests pasan (npm run test)
☐ No hay errores de console
☐ Lighthouse score > 90
☐ Responsive testeado (mobile, tablet, desktop)
☐ Links funcionan (tel, mailto, whatsapp)
☐ Emails funcional
☐ API conectada correctamente
☐ Variables de entorno configuradas
☐ Performance aceptable
☐ Accesibilidad WCAG AA
```

### 8.2 Deployment Steps

```bash
# 1. Commit changes
git add .
git commit -m "feat: mejorar contacto (descripción)"
git push origin feature/mejora

# 2. Create pull request
# → GitHub UI → Crear PR → Add description

# 3. Review y approval
# Esperar review, hacer cambios si pide

# 4. Merge a develop
git checkout develop
git pull origin develop
git merge --no-ff feature/mejora

# 5. Build y test
npm run build
npm run test

# 6. Merge a main (producción)
git checkout main
git pull origin main
git merge --no-ff develop

# 7. Create release tag
git tag -a v2.1 -m "Release: Contact section v2.0"
git push origin main --tags

# 8. Deploy (automático con CI/CD)
# GitHub Actions / GitLab CI dispara automáticamente
# Esperar a que termine

# 9. Verificar en producción
curl https://ztartech.pe
# ¿Cargan cambios? ✅
# ¿Funciona form? ✅
```

---

## 9. MONITOREO Y ALERTAS

### 9.1 Metrices Críticas

```
Métrica                      Target    Alerta
────────────────────────────────────────────────
Form error rate             <1%       >2%
API response time           <500ms    >2s
Form completion rate        >30%      <20%
Mobile conversion           >3%       <1%
Email delivery              >95%      <90%
```

### 9.2 Configurar alertas

```javascript
// En servicio de monitoreo (ej: Sentry, DataDog)
monitor('contact_form_error_rate', value, {
  threshold: { warning: 1, critical: 2 }
})

monitor('contact_form_completion', value, {
  threshold: { warning: 20, critical: 10 }
})

monitor('api_response_time', value, {
  threshold: { warning: 1000, critical: 2000 }
})
```

---

## 10. FAQ OPERATIVO

### P: ¿Qué pasa si el servidor de API cae?

**R:** El formulario mostrará error. Usuario verá:
```
"Error al enviar la solicitud. 
Por favor intenta de nuevo o llama a +51 978 418 809"
```
**Acción:** Admin llama a usuario que intenta completar form

---

### P: ¿Cómo recupero datos de un form que falló?

**R:** Si el backend guardó los datos antes de fallar:
```javascript
// En base de datos MongoDB
db.contacts.find({ status: 'failed' })

// Procesar manualmente o reintentar envío
```

---

### P: ¿Cuál es la tasa de conversión esperada?

**R:** 
- Por llamada directa: 60-70%
- Por WhatsApp: 40-50%
- Por formulario: 20-40%
- Promedio: 35-50%

---

### P: ¿Debo responder al mismo day?

**R:** Sí, promesa es <2 horas.
- Ideal: <30 minutos
- Aceptable: <2 horas
- Evitar: >2 horas

---

### P: ¿Cómo sé si alguien envió un formulario?

**R:** Recibirás:
1. Email en bandeja (si está configurado)
2. Notificación en CRM (si está integrado)
3. Fila en Google Sheets (si está conectado)

---

## 11. CONTACTOS DE SOPORTE

### Escalamiento de Problemas

```
Nivel 1: Soporte operativo (Sales/Support)
├─ Problema: No responde cliente
├─ Acción: Reintentar contacto
├─ Tiempo: Inmediato

Nivel 2: Soporte técnico (Frontend Dev)
├─ Problema: Formulario no funciona
├─ Acción: Debug JavaScript/CSS
├─ Tiempo: 1 hora

Nivel 3: Backend / DevOps
├─ Problema: API no responde
├─ Acción: Debug servidor/base de datos
├─ Tiempo: 2-4 horas

Nivel 4: Escalación gerencial
├─ Problema: Pérdida crítica de leads
├─ Acción: Reunión urgente, hotfix
├─ Tiempo: Inmediato
```

---

## 12. DOCUMENTACIÓN RELACIONADA

**Técnica:**
- `ESPECIFICACIONES_TECNICAS_2026.md` - Detalles técnicos
- `INTEGRACION_BACKEND_CONTACTO.md` - Backend setup

**Operativa:**
- `CASOS_USO_CONTACTO.md` - Ejemplos reales
- `MEJORES_PRACTICAS_CONVERSION.md` - Optimización

**Ejecutiva:**
- `RESUMEN_CONTACTO_2026.md` - Overview general
- `MEJORAS_CONTACTO_2026.md` - Changelog

---

## 13. VERSION HISTORY

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 2.0 | 2026-01-24 | Restauración contacto directo, credentials box, optimización |
| 1.9 | 2025-11-15 | Mejora de mobile responsiveness |
| 1.5 | 2025-06-01 | Integración Google Sheets |
| 1.0 | 2025-01-24 | Release inicial |

---

## 14. MAINTENANCE SCHEDULE

```
Diario:      Revisar emails, WhatsApp, errores
Semanal:     Revisar leads, performance, links
Mensual:     Análisis completo, mejoras
Trimestral:  Strategy review, testing exhaustivo
Anual:       Redesign consideration, tech stack review
```

---

**Status:** ✅ OPERATIVO  
**Última actualización:** 24 Enero 2026  
**Próxima revisión:** 24 Febrero 2026
