<template>
  <section class="services-section">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">Nuestros Servicios</h1>
        <p class="section-subtitle">
          Ofrecemos soluciones integrales en tecnología: desde la venta de equipos de calidad
          hasta servicio técnico especializado y asesoría profesional.
        </p>
      </div>

      <div class="services-grid">
        <div class="service-card">
          <div class="service-header">
            <div class="service-icon">🔧</div>
            <h2>Servicio Técnico y Reparación</h2>
          </div>

          <div class="service-description">
            <p>
              Contamos con profesionales certificados listos para diagnosticar y solucionar
              cualquier problema técnico en tu computadora o dispositivo.
            </p>
          </div>

          <div class="service-details">
            <h3>Nuestras Especialidades:</h3>
            <ul class="service-list">
              <li>Diagnóstico y reparación de hardware (procesador, memoria, disco duro).</li>
              <li>Problemas de software y drivers.</li>
              <li>Limpieza, mantenimiento preventivo y optimización.</li>
              <li>Instalación de sistemas operativos Windows, Linux, macOS.</li>
              <li>Reparación de pantallas, teclados y componentes móviles.</li>
              <li>Recuperación de datos en caso de fallo del disco.</li>
            </ul>
          </div>

          <div class="service-benefits">
            <h3>Beneficios para ti:</h3>
            <ul class="benefits-list">
              <li>⚡ <strong>Diagnóstico rápido</strong> - Identificamos el problema en máximo 2 horas.</li>
              <li>💰 <strong>Presupuesto transparente</strong> - Cotización antes de reparar.</li>
              <li>✅ <strong>Garantía en reparaciones</strong> - 6 meses de cobertura.</li>
              <li>🚀 <strong>Rendimiento mejorado</strong> - Tu equipo funcionará como nuevo.</li>
              <li>🛡️ <strong>Datos protegidos</strong> - Tratamiento confidencial de tu información.</li>
            </ul>
          </div>

          <div class="service-cta">
            <button class="cta-btn primary" @click="scrollToQuotation">
              Solicitar Reparación
            </button>
          </div>
        </div>

        <div class="service-card">
          <div class="service-header">
            <div class="service-icon">💡</div>
            <h2>Asesoría Técnica Profesional</h2>
          </div>

          <div class="service-description">
            <p>
              Nuestro equipo de expertos te ayuda a elegir la mejor solución tecnológica
              según tus necesidades específicas y presupuesto.
            </p>
          </div>

          <div class="service-details">
            <h3>Servicios de Asesoría:</h3>
            <ul class="service-list">
              <li>Evaluación de necesidades y recomendación de equipos.</li>
              <li>Optimización de configuración y performance.</li>
              <li>Selección de componentes para upgrades y mejoras.</li>
              <li>Asesoría en seguridad informática y protección de datos.</li>
              <li>Consultoría para empresas (redes, servidores, infraestructura).</li>
              <li>Soporte técnico a distancia vía remoto.</li>
            </ul>
          </div>

          <div class="service-benefits">
            <h3>Beneficios para ti:</h3>
            <ul class="benefits-list">
              <li>📊 <strong>Análisis especializado</strong> - Evaluamos tu situación actual.</li>
              <li>💼 <strong>Soluciones a medida</strong> - Recomendaciones personalizadas.</li>
              <li>💵 <strong>Optimización de presupuesto</strong> - Máximo valor por inversión.</li>
              <li>🎯 <strong>Decisiones informadas</strong> - Explicamos cada opción.</li>
              <li>📈 <strong>Mejora de productividad</strong> - Configuración óptima.</li>
            </ul>
          </div>

          <div class="service-cta">
            <button class="cta-btn primary" @click="scrollToQuotation">
              Solicitar Asesoría
            </button>
          </div>
        </div>

        <div class="service-card">
          <div class="service-header">
            <div class="service-icon">💻</div>
            <h2>Venta de Equipos y Componentes</h2>
          </div>

          <div class="service-description">
            <p>
              Distribuimos computadoras nuevas de marcas reconocidas y componentes de calidad
              con garantía completa y precios competitivos.
            </p>
          </div>

          <div class="service-details">
            <h3>Productos Disponibles:</h3>
            <ul class="service-list">
              <li>Computadoras de escritorio (gaming, trabajo, hogar).</li>
              <li>Laptops y notebooks de marcas reconocidas.</li>
              <li>Procesadores (Intel, AMD) de última generación.</li>
              <li>Tarjetas gráficas (NVIDIA, AMD) para gaming y diseño.</li>
              <li>Memoria RAM, discos SSD y almacenamiento.</li>
              <li>Periféricos (monitores, teclados, mouse, headsets).</li>
            </ul>
          </div>

          <div class="service-benefits">
            <h3>Beneficios para ti:</h3>
            <ul class="benefits-list">
              <li>✨ <strong>Marcas certificadas</strong> - Producto nuevo con garantía.</li>
              <li>💲 <strong>Precios competitivos</strong> - Mejor precio sin sacrificar calidad.</li>
              <li>📦 <strong>Entrega rápida</strong> - Envío a todo Perú.</li>
              <li>🎁 <strong>Instalación incluida</strong> - Asesoría según tu equipo.</li>
              <li>🔄 <strong>Garantía completa</strong> - Soporte técnico post-venta.</li>
            </ul>
          </div>

          <div class="service-cta">
            <button class="cta-btn primary" @click="navigateToProducts">
              Ver Catálogo
            </button>
          </div>
        </div>
      </div>

      <div class="process-section">
        <h2>Cómo Trabajamos Contigo</h2>
        <div class="process-grid">
          <div class="process-step">
            <div class="step-number">1</div>
            <h3>Contacto</h3>
            <p>Te comunicas con nosotros vía WhatsApp, llamada, email o formulario.</p>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <h3>Evaluación</h3>
            <p>Analizamos tu situación y te ofrecemos la mejor solución.</p>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <h3>Presupuesto</h3>
            <p>Te presentamos un presupuesto claro y sin compromiso.</p>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <h3>Ejecución</h3>
            <p>Realizamos el trabajo con profesionalismo y calidad garantizada.</p>
          </div>
          <div class="process-step">
            <div class="step-number">5</div>
            <h3>Seguimiento</h3>
            <p>Garantía en el servicio y soporte técnico post-venta.</p>
          </div>
        </div>
      </div>

      <div class="why-us-section">
        <h2>¿Por Qué Elegirnos?</h2>
        <div class="why-us-grid">
          <div class="why-us-item">
            <div class="why-us-icon">👨‍💼</div>
            <h3>Profesionales Certificados</h3>
            <p>Equipo técnico con certificaciones en reparación y soporte de sistemas.</p>
          </div>
          <div class="why-us-item">
            <div class="why-us-icon">⏱️</div>
            <h3>Atención Rápida</h3>
            <p>Respuesta en máximo 24 horas a todas tus solicitudes.</p>
          </div>
          <div class="why-us-item">
            <div class="why-us-icon">🛡️</div>
            <h3>Garantía en Todo</h3>
            <p>Garantía en productos y 6 meses en trabajos de reparación.</p>
          </div>
          <div class="why-us-item">
            <div class="why-us-icon">💬</div>
            <h3>Atención Personalizada</h3>
            <p>Te escuchamos y buscamos la solución que se ajuste a tus necesidades.</p>
          </div>
          <div class="why-us-item">
            <div class="why-us-icon">🌍</div>
            <h3>Cobertura Nacional</h3>
            <p>Servicio a todo Perú con entrega y soporte técnico disponible.</p>
          </div>
          <div class="why-us-item">
            <div class="why-us-icon">💰</div>
            <h3>Precios Justos</h3>
            <p>Precios competitivos sin comprometer la calidad del servicio.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const scrollToQuotation = () => {
  const quotationSection = document.querySelector('#quotation-section')
  if (quotationSection) {
    quotationSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const navigateToProducts = () => {
  router.push('/products')
}
</script>

<style scoped>
.services-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, var(--surface-color) 0%, var(--color-bg-light) 100%);
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

.section-title {
  font-size: 48px;
  color: var(--color-primary);
  margin-bottom: 16px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--color-text-light);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 80px;
}

.service-card {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 40px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md);
}

.service-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.service-icon {
  font-size: 44px;
  flex-shrink: 0;
}

.service-header h2 {
  font-size: 22px;
  color: var(--color-primary);
  margin: 0;
  font-weight: 700;
}

.service-description {
  margin-bottom: 24px;
}

.service-description p {
  color: var(--color-text-light);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.service-details {
  margin-bottom: 24px;
  flex-grow: 1;
}

.service-details h3 {
  font-size: 16px;
  color: var(--color-primary);
  margin-bottom: 12px;
  font-weight: 700;
}

.service-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.service-list li {
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 1.6;
  padding-left: 20px;
  margin-bottom: 10px;
  position: relative;
}

.service-list li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--color-accent);
  font-weight: bold;
}

.service-benefits {
  background: var(--color-bg-light);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.service-benefits h3 {
  font-size: 16px;
  color: var(--color-primary);
  margin-bottom: 12px;
  font-weight: 700;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-list li {
  color: var(--color-text-light);
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 10px;
}

.benefits-list strong {
  color: var(--color-primary);
  font-weight: 600;
}

.service-cta {
  margin-top: auto;
}

.cta-btn {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cta-btn.primary {
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(77, 184, 255, 0.3);
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(77, 184, 255, 0.4);
}

.process-section {
  background: var(--surface-color);
  padding: 60px 40px;
  border-radius: 12px;
  margin-bottom: 60px;
  box-shadow: var(--shadow-sm);
}

.process-section h2 {
  font-size: 36px;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 40px;
  font-weight: 800;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.process-step {
  text-align: center;
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 16px;
}

.process-step h3 {
  font-size: 18px;
  color: var(--color-primary);
  margin-bottom: 8px;
  font-weight: 700;
}

.process-step p {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.6;
  margin: 0;
}

.why-us-section {
  text-align: center;
}

.why-us-section h2 {
  font-size: 36px;
  color: var(--color-primary);
  margin-bottom: 40px;
  font-weight: 800;
}

.why-us-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.why-us-item {
  background: var(--surface-color);
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.why-us-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.why-us-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.why-us-item h3 {
  font-size: 18px;
  color: var(--color-primary);
  margin-bottom: 12px;
  font-weight: 700;
}

.why-us-item p {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .process-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .why-us-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .services-section {
    padding: 40px 20px;
  }

  .section-title {
    font-size: 36px;
  }

  .service-card {
    padding: 24px;
  }

  .process-section {
    padding: 40px 20px;
  }

  .process-grid {
    grid-template-columns: 1fr;
  }

  .process-step {
    border-left: 2px solid var(--color-accent);
    padding-left: 20px;
    text-align: left;
  }

  .step-number {
    margin: 0;
  }

  .why-us-grid {
    grid-template-columns: 1fr;
  }

  .why-us-section h2 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .services-section {
    padding: 30px 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .service-header h2 {
    font-size: 18px;
  }

  .service-icon {
    font-size: 36px;
  }

  .why-us-icon {
    font-size: 32px;
  }
}
</style>
