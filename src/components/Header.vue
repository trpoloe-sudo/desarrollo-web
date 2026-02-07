<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <img :src="logoImage" alt="ZTAR TECH" class="logo-img" />
        </div>
        <div class="header-info">
          <p class="tagline"></p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import logoImage from '@/img/ztartech3.png'
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

.logo-img {
  height: 120px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
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
