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
            <div class="service-icon">
              <Wrench size="36" />
            </div>
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
              <li><Zap class="benefit-icon" size="16" /> <strong>Diagnóstico rápido</strong> - Identificamos el problema en máximo 2 horas.</li>
              <li><ClipboardCheck class="benefit-icon" size="16" /> <strong>Presupuesto transparente</strong> - Cotización antes de reparar.</li>
              <li><ShieldCheck class="benefit-icon" size="16" /> <strong>Garantía en reparaciones</strong> - 6 meses de cobertura.</li>
              <li><Gauge class="benefit-icon" size="16" /> <strong>Rendimiento mejorado</strong> - Tu equipo funcionará como nuevo.</li>
              <li><Lock class="benefit-icon" size="16" /> <strong>Datos protegidos</strong> - Tratamiento confidencial de tu información.</li>
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
            <div class="service-icon">
              <Headset size="36" />
            </div>
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
              <li><BarChart3 class="benefit-icon" size="16" /> <strong>Análisis especializado</strong> - Evaluamos tu situación actual.</li>
              <li><SlidersHorizontal class="benefit-icon" size="16" /> <strong>Soluciones a medida</strong> - Recomendaciones personalizadas.</li>
              <li><PiggyBank class="benefit-icon" size="16" /> <strong>Optimización de presupuesto</strong> - Máximo valor por inversión.</li>
              <li><Target class="benefit-icon" size="16" /> <strong>Decisiones informadas</strong> - Explicamos cada opción.</li>
              <li><TrendingUp class="benefit-icon" size="16" /> <strong>Mejora de productividad</strong> - Configuración óptima.</li>
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
            <div class="service-icon">
              <Monitor size="36" />
            </div>
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
              <li><BadgeCheck class="benefit-icon" size="16" /> <strong>Marcas certificadas</strong> - Producto nuevo con garantía.</li>
              <li><Wallet class="benefit-icon" size="16" /> <strong>Precios competitivos</strong> - Mejor precio sin sacrificar calidad.</li>
              <li><Truck class="benefit-icon" size="16" /> <strong>Entrega rápida</strong> - Envío a todo Perú.</li>
              <li><Gift class="benefit-icon" size="16" /> <strong>Instalación incluida</strong> - Asesoría según tu equipo.</li>
              <li><LifeBuoy class="benefit-icon" size="16" /> <strong>Garantía completa</strong> - Soporte técnico post-venta.</li>
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
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  BadgeCheck,
  BarChart3,
  ClipboardCheck,
  Gauge,
  Gift,
  Headset,
  LifeBuoy,
  Lock,
  Monitor,
  PiggyBank,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Truck,
  Wallet,
  Wrench,
  Zap
} from 'lucide-vue-next'

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
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 20%, rgba(77, 184, 255, 0.18) 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, rgba(17, 46, 82, 0.55) 0%, transparent 55%),
    linear-gradient(135deg, #0a1a2d 0%, #102a44 45%, #0b1b2f 100%);
  margin: 40px 0;
}

.services-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(77, 184, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(77, 184, 255, 0.08) 1px, transparent 1px);
  background-size: 36px 36px;
  opacity: 0.35;
  pointer-events: none;
}

.services-section::after {
  content: '';
  position: absolute;
  inset: -30% -10% auto auto;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(77, 184, 255, 0.25), transparent 60%);
  filter: blur(10px);
  opacity: 0.6;
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 48px;
  color: #e6f1ff;
  margin-bottom: 16px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 18px;
  color: rgba(230, 241, 255, 0.72);
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
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 40px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(77, 184, 255, 0.2);
  backdrop-filter: blur(6px);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md);
  border-color: rgba(77, 184, 255, 0.5);
}

.service-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.service-icon {
  flex-shrink: 0;
  color: var(--color-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(77, 184, 255, 0.12);
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
  background: rgba(15, 32, 55, 0.04);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(77, 184, 255, 0.12);
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
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.benefit-icon {
  color: var(--color-accent);
  margin-top: 3px;
  flex-shrink: 0;
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
  background: rgba(255, 255, 255, 0.94);
  padding: 60px 40px;
  border-radius: 12px;
  margin-bottom: 60px;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(77, 184, 255, 0.2);
}

.process-section h2 {
  font-size: 36px;
  color: #0f1b2d;
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

@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .process-grid {
    grid-template-columns: repeat(3, 1fr);
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
    transform: scale(0.9);
  }
}
</style>
