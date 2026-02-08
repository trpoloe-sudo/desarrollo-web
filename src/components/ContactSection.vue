<template>
  <section class="contact-section" id="contact">
    <div class="contact-container">
      <div class="contact-wrapper">
        <div class="form-wrapper">
          <form @submit.prevent="handleSubmit" class="contact-form" novalidate>
            <div class="form-group">
              <label for="name" class="form-label"><User size="16" /> Nombre Completo *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                placeholder="Ej: Juan Pérez"
                required
                @blur="validateField('name')"
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label"><Phone size="16" /> Teléfono / WhatsApp *</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="Ej: 978 418 809"
                required
                @blur="validateField('phone')"
              />
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label for="company" class="form-label"><Building2 size="16" /> Empresa (Opcional)</label>
              <input
                id="company"
                v-model="form.company"
                type="text"
                class="form-input"
                placeholder="Ej: ABC Computers"
              />
            </div>

            <div class="form-group">
              <label for="subject" class="form-label"><Target size="16" /> ¿Qué necesitas? *</label>
              <select
                id="subject"
                v-model="form.subject"
                class="form-input form-select"
                required
                @change="validateField('subject')"
              >
                <option value="">-- Selecciona una opción --</option>
                <option value="reparacion">Reparación de computadora/laptop</option>
                <option value="diagnostico">Diagnóstico técnico</option>
                <option value="venta">Compra de equipo nuevo</option>
                <option value="actualizacion">Actualización/Upgrade</option>
                <option value="mantenimiento">Limpieza y mantenimiento</option>
                <option value="recovery">Recuperación de datos</option>
                <option value="otro">Otra consulta</option>
              </select>
              <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
            </div>

            <div class="form-group">
              <label for="message" class="form-label"><MessageSquare size="16" /> Describe tu problema *</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-textarea"
                placeholder="Ej: Laptop lenta, no enciende, pantalla rota, etc."
                rows="4"
                required
                @blur="validateField('message')"
              ></textarea>
              <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
              <small class="form-hint">Incluye detalles para una respuesta más precisa.</small>
            </div>

            <div class="form-group checkbox">
              <input
                id="privacy"
                v-model="form.privacy"
                type="checkbox"
                class="form-checkbox"
                required
                @change="validateField('privacy')"
              />
              <label for="privacy" class="checkbox-label">
                Autorizo el contacto y acepto la política de privacidad
              </label>
              <span v-if="errors.privacy" class="error-message">{{ errors.privacy }}</span>
            </div>

            <button
              type="submit"
              class="submit-button"
              :disabled="isSubmitting"
              :class="{ 'loading': isSubmitting }"
            >
              <span v-if="!isSubmitting" class="submit-text">
                <Send class="submit-icon" size="16" />
                Enviar Consulta
              </span>
              <span v-else class="submit-text">
                <span class="submit-loader"></span>
                Enviando solicitud...
              </span>
            </button>

            <transition name="fade">
              <div v-if="successMessage" class="success-message">
                {{ successMessage }}
              </div>
            </transition>

            <div class="contact-divider">
              O contacta directamente
            </div>

            <div class="alternative-actions">
              <div class="alternative-buttons">
                <button
                  type="button"
                  class="alt-button whatsapp"
                  @click="openWhatsApp"
                  title="Chatea por WhatsApp"
                >
                  <MessageCircle class="alt-icon" size="16" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  class="alt-button phone"
                  @click="callDirect"
                  title="Llama ahora"
                >
                  <Phone class="alt-icon" size="16" />
                  Llamar
                </button>
              </div>
            </div>
          </form>

          <div class="response-badge">
            <Clock class="badge-icon" size="14" />
            <span class="badge-text">Respuesta en menos de 2 horas</span>
          </div>
        </div>

        <div class="contact-info">
          <div class="credentials-box">
            <h4>Experiencia Comprobada</h4>
            <ul class="credentials-list">
              <li><Star class="credential-icon" size="18" /> +15 años reparando equipos</li>
              <li><CheckCircle class="credential-icon" size="18" /> Técnicos certificados</li>
              <li><Users class="credential-icon" size="18" /> 500+ clientes satisfechos</li>
              <li><ShieldCheck class="credential-icon" size="18" /> Garantía en todas las reparaciones</li>
            </ul>
          </div>

          <div class="availability-box">

            <div class="availability-content">
              <h4>Disponibilidad</h4>
              <p><strong>Lunes a Viernes:</strong> 9:00 AM - 6:00 PM</p>
              <p><strong>Sábados:</strong> 10:00 AM - 3:00 PM</p>
              <p class="availability-note"><MessageCircle size="16" /> WhatsApp 24/7</p>
            </div>
          </div>

          <div class="advantages">
            <div class="advantage-item">
              <Zap class="advantage-icon" size="22" />
              <div class="advantage-text">
                <h4>Respuesta Rápida</h4>
                <p>Menos de 2 horas laborales</p>
              </div>
            </div>

            <div class="advantage-item">
              <UserCheck class="advantage-icon" size="22" />
              <div class="advantage-text">
                <h4>Expertos Certificados</h4>
                <p>+15 años de experiencia</p>
              </div>
            </div>

            <div class="advantage-item">
              <Phone class="advantage-icon" size="22" />
              <div class="advantage-text">
                <h4>Múltiples Canales</h4>
                <p>WhatsApp, teléfono, email</p>
              </div>
            </div>

            <div class="advantage-item">
              <Shield class="advantage-icon" size="22" />
              <div class="advantage-text">
                <h4>Garantía Asegurada</h4>
                <p>6 meses en reparaciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  Building2,
  CheckCircle,
  Clock,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  Shield,
  ShieldCheck,
  Star,
  Target,
  User,
  UserCheck,
  Users,
  Zap
} from 'lucide-vue-next'

const form = reactive({
  name: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
  privacy: false
})

const errors = reactive({
  name: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
  privacy: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')

const validateField = (fieldName) => {
  switch (fieldName) {
    case 'name':
      if (!form.name.trim()) {
        errors.name = 'El nombre es requerido'
      } else if (form.name.trim().length < 3) {
        errors.name = 'El nombre debe tener al menos 3 caracteres'
      } else {
        errors.name = ''
      }
      break

    case 'phone':
      if (!form.phone.trim()) {
        errors.phone = 'El teléfono es requerido'
      } else if (!/^[\d\s\-\+]+$/.test(form.phone)) {
        errors.phone = 'Ingresa un teléfono válido'
      } else if (form.phone.replace(/\D/g, '').length < 7) {
        errors.phone = 'El teléfono debe tener al menos 7 dígitos'
      } else {
        errors.phone = ''
      }
      break

    case 'subject':
      if (!form.subject) {
        errors.subject = 'Selecciona un tipo de consulta'
      } else {
        errors.subject = ''
      }
      break

    case 'message':
      if (!form.message.trim()) {
        errors.message = 'El mensaje es requerido'
      } else if (form.message.trim().length < 10) {
        errors.message = 'El mensaje debe tener al menos 10 caracteres'
      } else {
        errors.message = ''
      }
      break

    case 'privacy':
      if (!form.privacy) {
        errors.privacy = 'Debes aceptar los términos'
      } else {
        errors.privacy = ''
      }
      break
  }
}

const validateForm = () => {
  validateField('name')
  validateField('phone')
  validateField('subject')
  validateField('message')
  validateField('privacy')

  return !Object.values(errors).some(error => error !== '')
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const subjectLabels = {
      reparacion: 'Reparación de computadora/laptop',
      diagnostico: 'Diagnóstico técnico',
      venta: 'Compra de equipo nuevo',
      actualizacion: 'Actualización/Upgrade',
      mantenimiento: 'Limpieza y mantenimiento',
      recovery: 'Recuperación de datos',
      otro: 'Otra consulta'
    }

    const messageLines = [
      'Hola Ztar Tech, quiero enviar una consulta:',
      '',
      `Nombre: ${form.name}`,
      `Teléfono: ${form.phone}`,
      form.company ? `Empresa: ${form.company}` : null,
      `Motivo: ${subjectLabels[form.subject] || form.subject}`,
      '',
      'Mensaje:',
      form.message
    ].filter(Boolean)

    const message = encodeURIComponent(messageLines.join('\n'))
    const phoneNumber = '51978418809'
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')

    successMessage.value = 'Mensaje preparado en WhatsApp.'

    setTimeout(() => {
      form.name = ''
      form.phone = ''
      form.company = ''
      form.subject = ''
      form.message = ''
      form.privacy = false
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('Error al enviar:', error)
  } finally {
    isSubmitting.value = false
  }
}

const openWhatsApp = () => {
  const phoneNumber = '51978418809'
  const message = encodeURIComponent(
    'Hola, me gustaría contactar para consultar sobre vuestros servicios de reparación y venta de computadoras.'
  )
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}

const callDirect = () => {
  window.location.href = 'tel:+51978418809'
}
</script>

<style scoped>
.contact-section {
  padding: 80px 20px;
  background:
    linear-gradient(135deg, rgba(10, 24, 40, 0.82) 0%, rgba(14, 34, 58, 0.9) 100%),
    url('/img/contact-bg.avif') center/cover no-repeat;
  position: relative;
  overflow: hidden;
}

.contact-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(77, 184, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.contact-wrapper {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 28px;
  align-items: start;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-wrapper {
  order: -1;
}

.advantages {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.advantage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: var(--radius);
  border-top: 3px solid var(--color-accent);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.advantage-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-top-color: var(--color-primary);
}

.advantage-icon {
  color: var(--color-accent);
}

.advantage-text h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 5px 0;
}

.advantage-text p {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin: 0;
}

.credentials-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 24px;
  border-radius: 12px;
  border-left: 5px solid var(--color-primary);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(77, 184, 255, 0.2);
}

.credentials-box h4 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.credentials-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.credentials-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(30, 60, 114, 0.1);
}

.credentials-list li:last-child {
  border-bottom: none;
}

.credential-icon {
  flex-shrink: 0;
  color: var(--color-accent);
}

.availability-box {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
  color: white;
  padding: 30px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  border-left: 5px solid var(--color-accent);
}

.availability-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.availability-content h4 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.availability-content p {
  font-size: 0.95rem;
  margin: 5px 0;
  line-height: 1.5;
}

.availability-note {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-top: 8px !important;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.form-wrapper {
  position: relative;
}

.contact-form {
  background: rgba(255, 255, 255, 0.96);
  padding: 30px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-top: 4px solid var(--color-primary);
  border: 1px solid rgba(77, 184, 255, 0.2);
  backdrop-filter: blur(6px);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-input,
.form-textarea,
.form-checkbox {
  font-family: inherit;
  font-size: 1rem;
  padding: 14px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.3s ease;
  color: var(--color-text);
  background: white;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #999;
  opacity: 0.7;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(30, 60, 114, 0.1);
  transform: translateY(-2px);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231e3c72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;
}

.form-textarea {
  resize: vertical;
  min-height: 90px;
}

.form-hint {
  font-size: 0.8rem;
  color: #999;
  margin-top: 4px;
  display: block;
  font-style: italic;
}

.checkbox {
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-top: 2px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.9rem;
  color: var(--color-text);
  cursor: pointer;
  line-height: 1.5;
}

.error-message {
  font-size: 0.85rem;
  color: var(--color-error);
  font-weight: 500;
}

.submit-button {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
  color: white;
  padding: 18px 40px;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 56px;
  box-shadow: 0 10px 25px rgba(30, 60, 114, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.3s ease;
  z-index: 0;
}

.submit-button:hover:not(:disabled)::before {
  left: 100%;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 14px 35px rgba(30, 60, 114, 0.4);
}

.submit-button:active:not(:disabled) {
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-icon {
  color: currentColor;
}

.submit-loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-message {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  padding: 15px;
  border-radius: var(--radius);
  border-left: 4px solid var(--color-success);
  text-align: center;
  font-weight: 500;
}

.contact-divider {
  text-align: center;
  padding: 20px 0;
  font-size: 0.9rem;
  color: #999;
}

.alternative-actions {
  text-align: center;
  padding: 15px 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
}

.alternative-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.alt-button {
  flex: 1;
  min-width: 140px;
  padding: 14px 24px;
  border: 2px solid var(--color-accent);
  background: white;
  color: var(--color-accent);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: var(--shadow-sm);
}

.alt-button:hover {
  background: var(--color-accent);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.alt-button.whatsapp {
  border-color: #25d366;
  color: #25d366;
}

.alt-button.whatsapp:hover {
  background: #25d366;
  color: white;
  border-color: #25d366;
}

.alt-button.phone {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.alt-button.phone:hover {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.alt-icon {
  color: currentColor;
}

.response-badge {
  position: absolute;
  bottom: -18px;
  left: 30px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(77, 184, 255, 0.3);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 2px solid white;
}

.badge-icon {
  font-size: 1.1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .contact-section {
    padding: 36px 12px;
  }

  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .form-wrapper {
    order: 0;
  }

  .contact-info {
    order: 1;
  }

  .contact-form {
    padding: 16px;
    gap: 12px;
  }

  .response-badge {
    position: relative;
    bottom: auto;
    right: auto;
    margin-top: 10px;
    align-self: center;
    left: auto;
  }

  .credentials-box {
    padding: 14px;
  }

  .credentials-list li {
    padding: 8px 0;
    font-size: 0.9rem;
  }

  .advantage-item {
    padding: 10px;
  }

  .availability-box {
    padding: 12px;
    text-align: center;
  }

  .form-input,
  .form-textarea,
  .form-select {
    font-size: 16px;
  }

  .submit-button {
    padding: 12px 20px;
    min-height: 40px;
    font-size: 0.95rem;
    letter-spacing: 0.4px;
  }

  .alternative-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .form-textarea {
    min-height: 76px;
  }
}

@media (max-width: 480px) {
  .contact-section {
    padding: 40px 15px;
  }

  .contact-form {
  background: rgba(255, 255, 255, 0.96);
  padding: 40px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 22px;
  border-top: 4px solid var(--color-primary);
  border: 1px solid rgba(77, 184, 255, 0.2);
  backdrop-filter: blur(6px);
}

  .alternative-buttons {
    flex-direction: column;
  }
}
</style>






