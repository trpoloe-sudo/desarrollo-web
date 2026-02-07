# 🔌 Guía de Integración Backend - Contacto Optimizado

## 📋 Document Control

**Versión:** 1.0
**Fecha:** 24 de Enero, 2026
**Estado:** Ready for Implementation
**Prioridad:** Alta

---

## 1. ENDPOINT REQUERIDO

### 1.1 POST /api/contact/submit

**Descripción:** Recibe y procesa solicitudes de contacto/cotización

**URL:** `https://tuapi.com/api/contact/submit`
**Método:** POST
**Headers:** 
```
Content-Type: application/json
Authorization: Bearer {API_KEY}
```

---

## 2. REQUEST PAYLOAD

### 2.1 Estructura Completa

```json
{
  "name": "Juan Pérez García",
  "phone": "978418809",
  "company": "ABC Computers",
  "subject": "reparacion",
  "message": "Mi laptop no enciende, hace un ruido extraño",
  "privacy": true,
  "source": "contact_form",
  "timestamp": "2026-01-24T10:30:45.123Z",
  "userAgent": "Mozilla/5.0...",
  "language": "es-PE"
}
```

### 2.2 Campos Detallados

| Campo | Tipo | Requerido | Validación | Ejemplo |
|-------|------|-----------|-----------|---------|
| name | string | ✅ Sí | 3-100 chars | "Juan Pérez" |
| phone | string | ✅ Sí | 9+ dígitos | "978418809" |
| company | string | ❌ No | 0-100 chars | "ABC Computers" |
| subject | string | ✅ Sí | Enum (ver abajo) | "reparacion" |
| message | string | ✅ Sí | 10-1000 chars | "Laptop lenta..." |
| privacy | boolean | ✅ Sí | true requerido | true |
| source | string | ✅ Sí | "contact_form" | "contact_form" |
| timestamp | ISO 8601 | ✅ Sí | RFC 3339 | "2026-01-24T..." |
| userAgent | string | ❌ No | Max 500 chars | "Mozilla..." |
| language | string | ❌ No | IETF tag | "es-PE" |

### 2.3 Valores Válidos para "subject"

```javascript
const VALID_SUBJECTS = {
  'reparacion': '🔧 Reparación de computadora/laptop',
  'diagnostico': '🔍 Diagnóstico técnico',
  'venta': '💻 Compra de equipo nuevo',
  'actualizacion': '⬆️ Actualización/Upgrade',
  'mantenimiento': '🧹 Limpieza y mantenimiento',
  'recovery': '💾 Recuperación de datos',
  'otro': '❓ Otra consulta'
}
```

---

## 3. RESPONSE ESPERADA

### 3.1 Success (201 Created)

```json
{
  "success": true,
  "message": "Cotización recibida correctamente",
  "data": {
    "ticketId": "TKT-2026-001234",
    "leadId": "LEAD-9876543",
    "receivedAt": "2026-01-24T10:30:46.000Z",
    "estimatedResponse": "2026-01-24T12:30:46.000Z",
    "status": "pending"
  }
}
```

### 3.2 Validation Error (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["Mínimo 3 caracteres"],
    "phone": ["Teléfono inválido"],
    "message": ["Mínimo 10 caracteres"]
  }
}
```

### 3.3 Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Error al procesar solicitud",
  "error": "Internal server error"
}
```

---

## 4. IMPLEMENTACIÓN EN FRONTEND

### 4.1 Configuración de API

Crear archivo: `src/services/contactAPI.js`

```javascript
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.ztartech.pe'
const API_KEY = import.meta.env.VITE_API_KEY

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  },
  timeout: 10000
})

export const submitContact = async (formData) => {
  try {
    const payload = {
      ...formData,
      source: 'contact_form',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language || 'es-PE'
    }

    const response = await apiClient.post('/api/contact/submit', payload)
    return response.data
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors
      }
    } else if (error.request) {
      // Request made but no response
      throw {
        status: 0,
        message: 'No hay conexión con el servidor'
      }
    } else {
      // Error in request setup
      throw {
        status: -1,
        message: 'Error al enviar la solicitud'
      }
    }
  }
}
```

### 4.2 Integración en Component

```javascript
import { submitContact } from '@/services/contactAPI.js'

const handleSubmit = async () => {
  // Validaciones previas
  validateField('name')
  validateField('phone')
  validateField('subject')
  validateField('message')
  validateField('privacy')
  
  if (Object.values(errors).some(e => e)) return
  
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const response = await submitContact({
      name: form.name,
      phone: form.phone,
      company: form.company,
      subject: form.subject,
      message: form.message,
      privacy: form.privacy
    })
    
    if (response.success) {
      successMessage.value = `✅ Cotización recibida (${response.data.ticketId}). Te contactaremos en menos de 2 horas`
      
      // Reset form
      form.name = ''
      form.phone = ''
      form.company = ''
      form.subject = ''
      form.message = ''
      form.privacy = false
      
      // Log for analytics
      trackEvent('contact_form_submitted', {
        ticketId: response.data.ticketId,
        subject: form.subject,
        hasCompany: !!form.company
      })
    }
  } catch (error) {
    if (error.errors) {
      // Validation errors
      Object.assign(errors, error.errors)
    } else {
      errorMessage.value = error.message || 'Error al enviar la solicitud'
    }
    
    // Log error
    console.error('Contact form error:', error)
  } finally {
    isSubmitting.value = false
    
    // Clear success message after 5 seconds
    if (successMessage.value) {
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    }
  }
}
```

### 4.3 Variables de Entorno

Archivo: `.env.local`

```env
VITE_API_URL=https://api.ztartech.pe
VITE_API_KEY=tu_clave_api_aqui
```

---

## 5. BACKEND NODEJS EXPRESS

### 5.1 Estructura Básica

```javascript
// routes/contact.js
import express from 'express'
import { submitContact } from '../controllers/contactController.js'
import { validateContactForm } from '../middleware/validation.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/submit', authenticate, validateContactForm, submitContact)

export default router
```

### 5.2 Controlador

```javascript
// controllers/contactController.js
import Contact from '../models/Contact.js'
import Lead from '../models/Lead.js'
import { sendContactConfirmation } from '../services/emailService.js'
import { createGoogleSheetRow } from '../services/googleSheetsService.js'

export const submitContact = async (req, res) => {
  try {
    const { name, phone, company, subject, message, privacy, timestamp } = req.body

    // 1. Guardar en base de datos
    const contact = new Contact({
      name,
      phone,
      company: company || null,
      subject,
      message,
      privacy,
      userAgent: req.body.userAgent,
      ipAddress: req.ip,
      createdAt: new Date(timestamp)
    })

    const savedContact = await contact.save()

    // 2. Crear lead
    const lead = new Lead({
      contactId: savedContact._id,
      name,
      phone,
      email: null, // Si no tenemos email
      company,
      subject,
      status: 'pending',
      source: 'contact_form',
      score: company ? 20 : 10, // B2B scores higher
      createdAt: new Date(timestamp)
    })

    const savedLead = await lead.save()

    // 3. Enviar email de confirmación
    await sendContactConfirmation({
      name,
      email: null, // Usar email si está disponible
      phone,
      ticketId: savedContact._id,
      subject
    })

    // 4. Guardar en Google Sheets (opcional)
    try {
      await createGoogleSheetRow({
        timestamp,
        name,
        phone,
        company,
        subject,
        message
      })
    } catch (sheetsError) {
      console.error('Google Sheets error:', sheetsError)
      // No bloquear si falla Google Sheets
    }

    // 5. Responder al cliente
    res.status(201).json({
      success: true,
      message: 'Cotización recibida correctamente',
      data: {
        ticketId: savedContact._id,
        leadId: savedLead._id,
        receivedAt: savedContact.createdAt,
        estimatedResponse: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
        status: 'pending'
      }
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud',
      error: error.message
    })
  }
}
```

### 5.3 Validación

```javascript
// middleware/validation.js
export const validateContactForm = (req, res, next) => {
  const errors = {}
  const { name, phone, subject, message, privacy } = req.body

  // Validar nombre
  if (!name || name.trim().length < 3) {
    errors.name = ['Mínimo 3 caracteres']
  }
  if (name && name.length > 100) {
    errors.name = ['Máximo 100 caracteres']
  }

  // Validar teléfono
  const phoneDigits = phone?.replace(/\D/g, '') || ''
  if (!phoneDigits || phoneDigits.length < 9) {
    errors.phone = ['Teléfono inválido']
  }

  // Validar subject
  const validSubjects = ['reparacion', 'diagnostico', 'venta', 'actualizacion', 'mantenimiento', 'recovery', 'otro']
  if (!subject || !validSubjects.includes(subject)) {
    errors.subject = ['Selecciona una opción válida']
  }

  // Validar mensaje
  if (!message || message.trim().length < 10) {
    errors.message = ['Mínimo 10 caracteres']
  }
  if (message && message.length > 1000) {
    errors.message = ['Máximo 1000 caracteres']
  }

  // Validar privacidad
  if (!privacy) {
    errors.privacy = ['Debes aceptar la política de privacidad']
  }

  // Si hay errores, retornar
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}
```

### 5.4 Modelo Mongoose

```javascript
// models/Contact.js
import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    default: null,
    maxlength: 100
  },
  subject: {
    type: String,
    required: true,
    enum: ['reparacion', 'diagnostico', 'venta', 'actualizacion', 'mantenimiento', 'recovery', 'otro']
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  privacy: {
    type: Boolean,
    required: true
  },
  userAgent: String,
  ipAddress: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'converted', 'rejected'],
    default: 'pending'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Índices para búsqueda rápida
contactSchema.index({ phone: 1 })
contactSchema.index({ createdAt: -1 })
contactSchema.index({ subject: 1 })

export default mongoose.model('Contact', contactSchema)
```

---

## 6. ENVÍO DE EMAILS

### 6.1 Email de Confirmación

```javascript
// services/emailService.js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export const sendContactConfirmation = async ({ name, email, phone, ticketId, subject }) => {
  const mailOptions = {
    from: 'cotizaciones@ztartech.com',
    to: email || 'cotizaciones@ztartech.com', // Mandar a cliente si tenemos email
    subject: `Cotización Recibida - Ticket #${ticketId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #1e3c72;">✅ Hemos recibido tu solicitud</h2>
        <p>Hola ${name},</p>
        
        <p>Gracias por contactarnos. Hemos recibido tu solicitud de cotización.</p>
        
        <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Número de Ticket:</strong> ${ticketId}</p>
          <p><strong>Teléfono registrado:</strong> ${phone}</p>
          <p><strong>Tipo de solicitud:</strong> ${subject}</p>
        </div>
        
        <p><strong>¿Cuál es el siguiente paso?</strong></p>
        <ul>
          <li>Nuestro equipo técnico revisará tu solicitud</li>
          <li>Te contactaremos en menos de 2 horas</li>
          <li>Te enviaremos una cotización detallada</li>
        </ul>
        
        <p style="color: #666; font-size: 14px; border-top: 1px solid #ddd; padding-top: 20px;">
          Si tienes una urgencia, puedes llamarnos: +51 978 418 809<br>
          O escríbenos por WhatsApp: wa.me/51978418809
        </p>
      </div>
    `
  }

  return transporter.sendMail(mailOptions)
}

export const sendAdminNotification = async ({ name, phone, company, subject, message, ticketId }) => {
  const mailOptions = {
    from: 'noreply@ztartech.com',
    to: 'cotizaciones@ztartech.com',
    subject: `Nueva Cotización - ${subject.toUpperCase()}`,
    html: `
      <h2>Nueva Solicitud de Contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Teléfono:</strong> ${phone}</p>
      <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
    `
  }

  return transporter.sendMail(mailOptions)
}
```

---

## 7. TESTING

### 7.1 Prueba con cURL

```bash
curl -X POST http://localhost:3000/api/contact/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_api_key" \
  -d '{
    "name": "Juan Pérez",
    "phone": "978418809",
    "company": "ABC Computers",
    "subject": "reparacion",
    "message": "Mi laptop no enciende, hace un ruido extraño cuando intento encenderla",
    "privacy": true
  }'
```

### 7.2 Prueba con Postman

Importar en Postman:

```json
{
  "info": {
    "name": "ZTarTech Contact API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Submit Contact Form",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/contact/submit",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{api_key}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Test User\", \"phone\": \"978418809\", \"subject\": \"reparacion\", \"message\": \"Laptop broken\", \"privacy\": true}"
        }
      }
    }
  ]
}
```

---

## 8. CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear endpoint POST /api/contact/submit
- [ ] Implementar validación de campos
- [ ] Crear modelo Contact en MongoDB
- [ ] Crear modelo Lead
- [ ] Configurar envío de emails
- [ ] Implementar Google Sheets integration
- [ ] Crear servicio contactAPI.js en frontend
- [ ] Integrar handleSubmit en componente
- [ ] Configurar variables de entorno
- [ ] Testing con cURL/Postman
- [ ] Testing en navegador real
- [ ] Monitoreo de errores
- [ ] Documentación de API
- [ ] Deployment a producción

---

**Status:** Ready for Implementation
**Priority:** High
**Estimated Development Time:** 6-8 hours
