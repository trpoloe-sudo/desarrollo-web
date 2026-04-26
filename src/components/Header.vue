<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <span class="logo-wrap">
            <img :src="logoImage" alt="ZTAR TECH" class="logo-img" />
          </span>
        </div>
        <div class="header-info">
          <p class="tagline"></p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { BRAND_LOGO_URL } from '@/config/assets'

const logoImage = BRAND_LOGO_URL
</script>

<style scoped>
.header {
  background: var(--surface-color);
  color: var(--text-color);
  padding: 10px 20px;
  box-shadow: var(--box-shadow);
  border-bottom: 1px solid var(--border-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
}

.logo-wrap::before {
  content: '';
  position: absolute;
  inset: 12%;
  z-index: -1;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.62) 0%, rgba(225, 244, 255, 0.34) 44%, rgba(225, 244, 255, 0) 74%);
  filter: blur(18px);
}

.logo-img {
  height: 120px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  filter:
    drop-shadow(0 0 4px rgba(255, 255, 255, 0.95))
    drop-shadow(0 0 12px rgba(241, 249, 255, 0.82))
    drop-shadow(0 0 26px rgba(204, 233, 255, 0.48))
    drop-shadow(0 2px 6px rgba(0, 0, 0, 0.14));
}

.logo:hover .logo-img {
  transform: scale(1.05);
}

.tagline {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .header {
    padding: 8px 15px;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .logo-img {
    height: 90px;
  }

  .tagline {
    text-align: center;
    font-size: 12px;
  }
}
</style>
