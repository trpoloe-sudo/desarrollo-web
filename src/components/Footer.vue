<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>ZTAR TECH</h3>
          <p>Distribuidor líder en computadoras y partes de calidad</p>
        </div>
        <div class="footer-section">
          <h3>Contacto</h3>
          <p>Email: ztar.sales@gmail.com</p>
          <p>Tel: +51 978 418 809</p>
        </div>
        <div class="footer-section">
          <h3>Enlaces</h3>
          <ul class="footer-links">
            <li><RouterLink to="/">Inicio</RouterLink></li>
            <li><RouterLink to="/products">Productos</RouterLink></li>
            <li><RouterLink to="/cart">Carrito</RouterLink></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Ztar Tech. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.footer {
  background-color: var(--dark-color);
  color: white;
  padding: 40px 20px 20px;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
}

.footer-section p {
  margin: 5px 0;
  font-size: 14px;
  opacity: 0.9;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--accent-color);
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .footer-section {
    text-align: center;
  }
}
</style>

