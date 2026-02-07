# 📚 Casos de Uso y Ejemplos - Sección de Contacto

## 📋 Document Control

**Versión:** 1.0  
**Fecha:** 24 de Enero, 2026  
**Propósito:** Guía práctica de uso y configuración

---

## 1. CASOS DE USO PRINCIPALES

### 1.1 Usuario: Cliente B2C (Reparación)

**Perfil:**
- Persona: Juan Pérez, 35 años, empresario
- Problema: Laptop no enciende
- Motivación: Reparar rápido, presupuesto accesible
- Urgencia: Alta (trabajo crítico)

**Journey:**

```
1. Llega a sitio web
   ↓
2. Ve badge: "🏆 Servicio Técnico de Confianza"
   ↓
3. Revisa contacto directo: ☎️ +51 978 418 809
   ↓
4. Lee credentials: "+15 años, 500+ clientes"
   ↓
5. Opción A: Llama directo
   ↓
   Resultado: Contacto inmediato, venta cerrada
```

**Data esperada en form (si elige form):**
```javascript
{
  name: "Juan Pérez García",
  phone: "978418809",
  company: "",  // Vacío (B2C)
  subject: "reparacion",
  message: "Laptop Lenovo ThinkPad no enciende. Hace un ruido pero no prende pantalla. Es urgente porque uso para trabajo",
  privacy: true
}
```

**Tiempo esperado:** 30 segundos

---

### 1.2 Usuario: Cliente B2B (Venta Equipos)

**Perfil:**
- Persona: María Rodríguez, 42 años, gerente de IT
- Problema: Necesita comprar 10 laptops para oficina
- Motivación: Buen precio, servicio postventa
- Urgencia: Media (requiere presupuesto)

**Journey:**

```
1. Llega desde búsqueda: "Venta de laptops Perú"
   ↓
2. Completa formulario detallado:
   - Nombre: María Rodríguez
   - Empresa: Consultores ABC SAC
   - Asunto: 💻 Compra de equipo nuevo
   - Mensaje: Necesito cotización de 10 laptops i7, 16GB RAM, SSD...
   ↓
3. Sistema identifica como B2B (company field lleno)
   ↓
4. Lead score: +20 puntos (vs +10 para B2C)
   ↓
5. Admin recibe email:
   "Nueva solicitud B2B - Venta de 10 equipos"
   ↓
6. Respuesta rápida con opciones de financiamiento
```

**Data esperada:**
```javascript
{
  name: "María Rodríguez López",
  phone: "999888777",
  company: "Consultores ABC SAC",  // ← Diferenciador B2B
  subject: "venta",
  message: "Requiero cotización para compra de 10 laptops para oficina. Especificaciones mínimas: i7, 16GB RAM, SSD 512GB. Necesito presupuesto con opciones de pago a 30 días",
  privacy: true
}
```

**Tiempo esperado:** 120 segundos

---

### 1.3 Usuario: Cliente de Diagnóstico

**Perfil:**
- Persona: Carlos, 28 años, diseñador gráfico
- Problema: Computadora "lenta"
- Motivación: No sabe qué le pasa exactamente
- Urgencia: Media

**Journey:**

```
1. Accede a sección contacto
   ↓
2. Ve opciones de asunto:
   🔧 Reparación
   🔍 Diagnóstico técnico  ← Selecciona esta
   💻 Compra de equipo nuevo
   ...
   ↓
3. Completa form:
   - Asunto: "diagnostico"
   - Mensaje: "Mi PC está muy lenta. Abre programas lentamente, videos se ven cortados. No sé qué le falta"
   ↓
4. Recibe respuesta:
   "Haremos diagnóstico gratuito, luego presupuesto"
   ↓
5. Cliente: Satisfecho, se decide fácilmente
```

**Data esperada:**
```javascript
{
  name: "Carlos Mendez",
  phone: "977666555",
  company: "",
  subject: "diagnostico",
  message: "Mi computadora está muy lenta. Abre programas lentamente, los videos se ven cortados. No sé qué le hace falta. ¿Hacen diagnóstico?",
  privacy: true
}
```

---

### 1.4 Usuario: Recovery de Datos

**Perfil:**
- Persona: Francisca, 45 años, contador
- Problema: Perdió datos críticos (accidente)
- Motivación: Recuperar información urgentemente
- Urgencia: CRÍTICA (datos empresariales)

**Journey:**

```
1. Busca: "Recuperación de datos Perú urgente"
   ↓
2. Ve en sección contacto:
   💾 Recuperación de datos  ← Opción perfecta
   ↓
3. Acceso directo WhatsApp: 📱 +51 978 418 809
   ↓
4. Mensaje inmediato:
   "Hola, perdí datos en disco duro. ¿Pueden recuperar? Es urgente"
   ↓
5. Respuesta en 10 minutos:
   "Claro, trae el disco. Hacemos análisis gratuito"
   ↓
6. Datos recuperados, cliente agradecido
```

**Data si usa form:**
```javascript
{
  name: "Francisca Morales",
  phone: "987654321",
  company: "Contabilidad Integral",
  subject: "recovery",
  message: "Necesito recuperar datos de un disco duro que dejó de funcionar. Contiene información crítica de la empresa. ¿Pueden ayudar? ¿Cuánto cuesta?",
  privacy: true
}
```

---

## 2. VARIACIONES POR DISPOSITIVO

### 2.1 Desktop (1920x1080)

**Vista completa:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🏆 Servicio Técnico de Confianza    (arriba derecha) │
│                                                         │
│  SOLICITA TU COTIZACIÓN HOY                            │
│  Expertos en reparación | Respuesta <2 horas          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  INFO (35%)            │           FORM (65%)          │
│                        │                               │
│  📞 Contacto Inmediato │  👤 Nombre Completo *        │
│                        │  📱 Teléfono *                │
│  ☎️ +51 978 418 809    │  🏢 Empresa (Opcional)       │
│  📱 +51 978 418 809    │  🎯 ¿Qué necesitas? *        │
│  📧 cotizaciones@...   │  💬 Describe problema *      │
│                        │                               │
│  ✅ Experiencia        │  ☐ Aceptar privacidad *     │
│                        │                               │
│  ⭐ +15 años           │  [🚀 Solicitar Cotización]  │
│  🔧 Certificados       │                               │
│  💼 500+ clientes      │                               │
│  🛡️ Garantía           │                               │
│                        │                               │
└─────────────────────────────────────────────────────────┘
```

**Experiencia:**
- Dos columnas claras
- Contacto directo visible a la izquierda
- Form a la derecha
- Poco scroll necesario

---

### 2.2 Tablet (768px)

**Vista adaptada:**

```
┌──────────────────────────┐
│  🏆 Confianza           │
│  SOLICITA COTIZACIÓN    │
│  Respuesta <2 horas    │
│                        │
├──────────────────────────┤
│  📞 CONTACTO DIRECTO    │
│  ☎️ +51 978 418 809     │
│  📱 +51 978 418 809     │
│  📧 cotizaciones@...    │
│                        │
├──────────────────────────┤
│  ✅ EXPERIENCIA        │
│  ⭐ +15 años           │
│  🔧 Certificados       │
│  💼 500+ clientes      │
│  🛡️ Garantía           │
│                        │
├──────────────────────────┤
│  👤 FORMULARIO          │
│  Nombre *               │
│  Teléfono *             │
│  Empresa (opt)          │
│  ¿Qué necesitas? *      │
│  Mensaje *              │
│  [Aceptar privacidad]   │
│  [Solicitar...]         │
│                        │
└──────────────────────────┘
```

**Experiencia:**
- Una columna
- Contacto primero (call-to-action)
- Form después
- Más scroll (normal en mobile)

---

### 2.3 Mobile (320px)

**Vista optimizada:**

```
┌──────────────────────┐
│ 🏆 Servicio        │
│ Técnico Confianza  │
│                    │
│ SOLICITA Hoggi     │
│ <2 horas respuesta │
│                    │
├──────────────────────┤
│ 📞 LLAMAR AHORA    │
│ ☎️ +51 978 418 809 │
│                    │
│ 📱 WHATSAPP 24/7   │
│ 📱 +51 978 418 809 │
│                    │
│ 📧 EMAIL           │
│ info@ztartech.com  │
│                    │
├──────────────────────┤
│ ✅ +15 años        │
│ ✅ Certificados    │
│ ✅ 500+ clientes   │
│ ✅ Garantía        │
│                    │
├──────────────────────┤
│ 👤 Tu Nombre *     │
│ [______________]   │
│                    │
│ 📱 Teléfono *      │
│ [______________]   │
│                    │
│ 🎯 Necesitas? *    │
│ [▼ Selecciona]     │
│                    │
│ 💬 Problema *      │
│ [______________]   │
│ [______________]   │
│                    │
│ ☐ Aceptar policy   │
│                    │
│ [🚀 SOLICITAR]     │
│                    │
└──────────────────────┘
```

**Experiencia:**
- Botones grandes (48-56px)
- Font 16px (sin zoom iOS)
- Fácil de navegar
- Directo al acción

---

## 3. FLUJOS DE CONVERSIÓN

### 3.1 Flujo: Llamada Directa (Más rápido)

```
Usuario llega
    ↓
Ve badge + contacto
    ↓
Toca: ☎️ +51 978 418 809
    ↓
Se abre app de teléfono
    ↓
Habla directamente con vendedor
    ↓
Cotiza al instante
    ↓
Cierra venta
    ↓
✅ CONVERSIÓN INMEDIATA
```

**Tiempo total:** 2-5 minutos  
**Tasa conversión:** 60-70%  
**Motivo:** Contacto directo, sin fricción

---

### 3.2 Flujo: WhatsApp (Flexible)

```
Usuario llega
    ↓
Ve: 📱 WhatsApp +51 978 418 809
    ↓
Abre WhatsApp (si tiene app)
    ↓
Manda primer mensaje
    ↓
Respuesta automática:
"Hola Juan, gracias por contactar.
¿En qué podemos ayudarte?"
    ↓
Conversación fluida
    ↓
Coordina visita/envío
    ↓
✅ CONVERSIÓN
```

**Tiempo total:** 10-30 minutos  
**Tasa conversión:** 40-50%  
**Motivo:** Flexible, sin esperar llamada

---

### 3.3 Flujo: Formulario (Lead Nurturing)

```
Usuario llega
    ↓
Revisa contacto directo
    ↓
Prefiere no llamar (introvertido, ocupado)
    ↓
Completa formulario:
- Nombre
- Teléfono
- Empresa (B2B)
- Tipo de solicitud
- Descripción detallada
    ↓
Admin recibe:
- Correo con datos
- Google Sheet actualizada
- Lead en CRM
    ↓
Admin contacta en <2 horas:
- Vía teléfono si es urgente
- Vía email si es menos urgente
- Propuesta personalizada
    ↓
Seguimiento:
Day 1: Contacto inicial
Day 3: Follow-up si no responde
Day 7: Oferta final
    ↓
✅ CONVERSIÓN (o ❌ pérdida de lead)
```

**Tiempo total:** 2-7 días  
**Tasa conversión:** 20-40%  
**Motivo:** Lead qualification, conversaciones personalizadas

---

## 4. EJEMPLOS DE MENSAJES

### 4.1 Mensaje de Whatsapp Automático (Bot)

```
Usuario: "Hola, tengo una laptop rota"

Bot automático:
"👋 Hola! Gracias por contactar a ZTarTech.

Nos complace ayudarte con tu laptop. 
Nuestro equipo técnico está disponible ahora.

¿Cuál es el problema exacto?
- No enciende
- Pantalla rota
- Muy lenta
- Se calienta
- Otro

🚀 Respuesta garantizada en <30 min"

Usuario: "No enciende"

Bot:
"😟 Entiendo. ¿Hace ruido al intentar encender?

En ZTarTech reparamos este tipo de problemas.
- Diagnóstico gratuito
- Reparación con garantía
- Entrega en 24-48 horas

¿Puedes traerla hoy? ☎️ Llama o espera a nuestro técnico"
```

---

### 4.2 Email de Confirmación (Plantilla)

```
Subject: ✅ Cotización Recibida - Ticket #TKT-2026-001234

Hola Juan,

Gracias por contactar a ZTarTech. Hemos recibido tu solicitud 
de cotización.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DETALLES DE TU SOLICITUD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ticket ID:      TKT-2026-001234
Nombre:         Juan Pérez García
Teléfono:       978 418 809
Tipo:           🔧 Reparación
Recibido:       24 Enero, 2026 - 10:30 AM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ PRÓXIMOS PASOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nuestro equipo técnico revisará tu solicitud y te contactará
en menos de 2 horas mediante:

1. Llamada al 978 418 809
2. WhatsApp a tu número
3. Email (si lo prefieres)

Te enviaremos:
✓ Diagnóstico inicial
✓ Cotización detallada
✓ Opciones de pago
✓ Garantía

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 ¿ES URGENTE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Llama ya: ☎️ +51 978 418 809
WhatsApp:  📱 +51 978 418 809

Gracias por confiar en ZTarTech,
El equipo técnico
```

---

## 5. CONFIGURACIÓN POR TIPO DE NEGOCIO

### 5.1 Reparaciones (Actual - ZTarTech)

**Configuración:**
```javascript
SUBJECTS = [
  'reparacion',      // 🔧 Principal
  'diagnostico',     // 🔍
  'mantenimiento',   // 🧹
  'recovery',        // 💾
  'actualizacion',   // ⬆️
  'venta',           // 💻
  'otro'             // ❓
]

RESPONSE_TIME = '< 2 horas'
PHONE = '+51 978 418 809'
EMAIL = 'cotizaciones@ztartech.com'
```

---

### 5.2 Tienda Online (Ecommerce)

**Variación:**
```javascript
SUBJECTS = [
  'consulta_producto',
  'seguimiento_pedido',
  'cambio_devolucion',
  'factura',
  'otro'
]

RESPONSE_TIME = '< 24 horas'
MESSAGE_PLACEHOLDER = "Ej: ¿Tienes stock del modelo...?"
CTA = "Enviar Consulta"  // Menos urgencia
```

---

### 5.3 Servicios Profesionales (Abogado, Contador)

**Variación:**
```javascript
SUBJECTS = [
  'consulta_inicial',
  'documento_legal',
  'asesoramiento',
  'representación',
  'otro'
]

RESPONSE_TIME = '< 48 horas'
REQUIRE_COMPANY = true  // Más formal
CTA = "Solicitar Asesoría"
CREDENTIALS = [
  'Colegiado #12345',
  '20+ años ejercicio',
  '1000+ clientes',
  'Casos ganados'
]
```

---

## 6. PERSONALIZACIÓN RECOMENDADA

### 6.1 Por Industria

| Industria | Asuntos Clave | Tono | Respuesta |
|-----------|---------------|------|-----------|
| Reparación | Diagnóstico, reparación, urgencia | Técnico, amigable | <2h |
| Ventas | Cotización, especificaciones | Comercial, ágil | <1h |
| Servicios | Consulta, asesoría | Profesional, formal | <24h |
| Ecommerce | Seguimiento, cambios | Amigable, rápido | <4h |

---

### 6.2 Por Estación

**Verano (Enero-Marzo):**
```
CTA: "🏖️ Vacaciones: Servicio Express 24h"
RESPONSE: 24 horas
```

**Año Nuevo (Enero):**
```
BANNER: "🎉 Promoción Inicio de Año"
SUBJECTS_ADD: "Actualización 2026"
```

**Black Friday (Noviembre):**
```
CTA: "🔥 Oferta Limitada - Solicita Ahora"
DISCOUNT_MSG: "15% descuento en reparaciones"
```

---

## 7. TROUBLESHOOTING COMÚN

### 7.1 "El formulario no se envía"

**Causas posibles:**
1. API endpoint no implementado (backend)
2. CORS error
3. Validación falla silenciosamente
4. Timeout (>10s)

**Solución:**
```javascript
// Agrega console.log para debugging
const handleSubmit = async () => {
  console.log('Form data:', form)  // Ver qué se envía
  try {
    const response = await submitContact(form)
    console.log('Response:', response)  // Ver respuesta
  } catch (error) {
    console.error('Error:', error)  // Ver error específico
  }
}
```

---

### 7.2 "No sé cuál asunto elegir"

**Solución:**
```javascript
// Agregar descripción en cada opción
<option value="reparacion">
  🔧 Reparación: Equipo dañado o no funciona
</option>
<option value="diagnostico">
  🔍 Diagnóstico: No sé qué tiene mi equipo
</option>
```

---

### 7.3 "El form no responde en móvil"

**Causa:** Font-size < 16px causa zoom iOS  
**Solución:**
```css
@media (max-width: 768px) {
  .form-input {
    font-size: 16px;  /* ← Crítico */
  }
}
```

---

## 8. MÉTRICAS A MONITOREAR

### 8.1 Dashboard de Rendimiento

```
📊 Forma de Contacto
├─ Llamadas directas:     40%
├─ WhatsApp:              35%
└─ Formulario:            25%

⏱️ Tiempo de Respuesta
├─ Llamadas:              5 min
├─ WhatsApp:              15 min
└─ Formulario:            90 min

💰 Conversión
├─ Llamadas:              70% → Venta
├─ WhatsApp:              45% → Venta
└─ Formulario:            30% → Venta

📱 Por Dispositivo
├─ Desktop:               55% tráfico
├─ Mobile:                40% tráfico
└─ Tablet:                 5% tráfico
```

---

## 9. REFERENCIAS RÁPIDAS

**Colores:**
- Primario: `#1e3c72`
- Secundario: `#2a5298`
- WhatsApp: `#25d366`
- Error: `#dc3545`

**Contacto:**
- ☎️ +51 978 418 809
- 📱 +51 978 418 809
- 📧 cotizaciones@ztartech.com

**Archivos:**
- Componente: `src/components/ContactSection.vue`
- Estilos: Lines 400-1250 en ContactSection.vue

---

**Última actualización:** 24 Enero 2026  
**Versión:** 1.0  
**Status:** ✅ Ready to Use
