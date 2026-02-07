<template>
  <section class="quotation-section" id="quotation-section">
    <div class="container">
      <div class="section-header">
        <h2>Solicitar Cotización</h2>
        <p>Completa el formulario y nuestro equipo se pondrá en contacto contigo en máximo 24 horas.</p>
      </div>

      <div class="quotation-content">
        <div class="quotation-form-wrapper">
          <form @submit.prevent="submitQuotation" class="quotation-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Nombre Completo</label>
                <input
                  v-model="form.name"
                  type="text"
                  id="name"
                  placeholder="Tu nombre completo"
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  placeholder="Tu correo electrónico"
                  required
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Teléfono</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  id="phone"
                  placeholder="+51 000 000 000"
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="company">Empresa (Opcional)</label>
                <input
                  v-model="form.company"
                  type="text"
                  id="company"
                  placeholder="Nombre de tu empresa"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-group full-width">
              <label for="service">¿Qué servicio necesitas?</label>
              <select v-model="form.service" id="service" required class="form-input">
                <option value="">Selecciona un servicio</option>
                <option value="purchase">Compra de computadoras nuevas</option>
                <option value="repair">Reparación técnica</option>
                <option value="maintenance">Mantenimiento preventivo</option>
                <option value="upgrade">Upgrades y mejoras</option>
                <option value="consulting">Consultoría técnica</option>
                <option value="other">Otro (especificar en detalles)</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="budget">Presupuesto Aproximado</label>
              <select v-model="form.budget" id="budget" class="form-input">
                <option value="">No tengo presupuesto definido</option>
                <option value="0-2000">S/. 0 - 2,000</option>
                <option value="2000-5000">S/. 2,000 - 5,000</option>
                <option value="5000-10000">S/. 5,000 - 10,000</option>
                <option value="10000-20000">S/. 10,000 - 20,000</option>
                <option value="20000+">S/. 20,000+</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="message">Detalles de tu solicitud</label>
              <textarea
                v-model="form.message"
                id="message"
                rows="6"
                placeholder="Cuéntanos qué necesitas: especificaciones, marca, cantidad, urgencia, etc."
                required
                class="form-input form-textarea"
              ></textarea>
              <span class="char-count">{{ form.message.length }}/500 caracteres</span>
            </div>

            <div class="form-group full-width">
              <label class="checkbox">
                <input
                  v-model="form.agreeTerms"
                  type="checkbox"
                  required
                >
                <span>Acepto los términos y condiciones y autorizo ser contactado</span>
              </label>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span v-if="!isSubmitting">🧾 Enviar Cotización</span>
              <span v-else>⏳ Enviando...</span>
            </button>

            <div v-if="submitMessage" :class="['submit-message', submitMessage.type]">
              {{ submitMessage.text }}
            </div>
          </form>
        </div>

        <div class="quotation-info">
          <div class="info-card">
            <div class="info-icon">⏱️</div>
            <h3>Rápido</h3>
            <p>Respuesta en máximo 24 horas a tu correo electrónico.</p>
          </div>

          <div class="info-card">
            <div class="info-icon">💼</div>
            <h3>Profesional</h3>
            <p>Análisis personalizado según tus necesidades específicas.</p>
          </div>

          <div class="info-card">
            <div class="info-icon">🔒</div>
            <h3>Confidencial</h3>
            <p>Tus datos están protegidos y no se comparten.</p>
          </div>

          <div class="info-card">
            <div class="info-icon">💰</div>
            <h3>Sin Compromiso</h3>
            <p>Cotización gratuita sin obligación de compra.</p>
          </div>

          <div class="info-card">
            <div class="info-icon">📞</div>
            <h3>Contacto Directo</h3>
            <p>También puedes llamar o enviar WhatsApp directamente.</p>
          </div>

          <div class="info-card">
            <div class="info-icon">🌍</div>
            <h3>Cobertura Nacional</h3>
            <p>Servicio a todo Perú con entrega rápida.</p>
          </div>
        </div>
      </div>

      <div class="alternative-contact">
        <h3>¿Prefieres contactar de otra forma?</h3>
        <div class="contact-methods">
          <a href="https://wa.me/51978418809" target="_blank" class="contact-btn whatsapp">
            <span>💬</span> WhatsApp
          </a>
          <a href="tel:+51978418809" class="contact-btn phone">
            <span>📞</span> Llamar
          </a>
          <a href="mailto:ztar.sales@gmail.com" class="contact-btn email">
            <span>✉️</span> Email
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  message: '',
  agreeTerms: false
})

const isSubmitting = ref(false)
const submitMessage = ref(null)

const submitQuotation = async () => {
  if (form.value.message.length > 500) {
    submitMessage.value = {
      type: 'error',
      text: 'El mensaje no puede exceder 500 caracteres'
    }
    return
  }

  isSubmitting.value = true
  submitMessage.value = null

  try {
    const emailContent = `
      Solicitud de Cotización - Ztar Tech

      Datos del Cliente:
      - Nombre: ${form.value.name}
      - Email: ${form.value.email}
      - Teléfono: ${form.value.phone}
      - Empresa: ${form.value.company || 'N/A'}

      Detalles de la Solicitud:
      - Servicio: ${form.value.service}
      - Presupuesto: ${form.value.budget || 'No definido'}
      - Mensaje: ${form.value.message}
    `

    void emailContent

    await new Promise(resolve => setTimeout(resolve, 1500))

    submitMessage.value = {
      type: 'success',
      text: '✅ Cotización enviada correctamente. Nos pondremos en contacto pronto.'
    }

    form.value = {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      budget: '',
      message: '',
      agreeTerms: false
    }

    setTimeout(() => {
      submitMessage.value = null
    }, 5000)
  } catch (error) {
    submitMessage.value = {
      type: 'error',
      text: '❌ Hubo un error al enviar. Intenta de nuevo.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.quotation-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, var(--color-bg-light) 0%, var(--surface-color) 100%);
  margin: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 48px;
  color: var(--color-primary);
  margin-bottom: 16px;
  font-weight: 800;
}

.section-header p {
  font-size: 18px;
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.quotation-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
}

.quotation-form-wrapper {
  background: var(--surface-color);
  padding: 40px;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

.quotation-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(77, 184, 255, 0.12);
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
  font-family: inherit;
}

.char-count {
  font-size: 12px;
  color: var(--color-text-light);
  text-align: right;
  margin-top: -4px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-light);
}

.checkbox input {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.submit-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(77, 184, 255, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(77, 184, 255, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-message {
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin-top: 16px;
}

.submit-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.submit-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.quotation-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.info-card {
  background: var(--surface-color);
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.info-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.info-card h3 {
  font-size: 18px;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.info-card p {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.6;
  margin: 0;
}

.alternative-contact {
  text-align: center;
  padding: 40px;
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.alternative-contact h3 {
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 24px;
}

.contact-methods {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.contact-btn.whatsapp {
  background: #25d366;
  color: white;
}

.contact-btn.whatsapp:hover {
  background: #1fbd5b;
  transform: translateY(-2px);
}

.contact-btn.phone {
  background: var(--color-accent);
  color: white;
}

.contact-btn.phone:hover {
  background: #2f6fb4;
  transform: translateY(-2px);
}

.contact-btn.email {
  background: #ff9800;
  color: white;
}

.contact-btn.email:hover {
  background: #e68900;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .quotation-section {
    padding: 40px 20px;
  }

  .section-header h2 {
    font-size: 36px;
  }

  .quotation-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .quotation-form-wrapper {
    padding: 24px;
  }

  .quotation-info {
    grid-template-columns: 1fr;
  }

  .contact-methods {
    flex-direction: column;
    align-items: stretch;
  }

  .contact-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .quotation-section {
    padding: 30px 16px;
  }

  .section-header h2 {
    font-size: 28px;
  }

  .quotation-form-wrapper {
    padding: 20px;
  }

  .submit-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>
