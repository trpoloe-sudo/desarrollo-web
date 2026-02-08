<template>
  <div class="home">
    <HeroSection />
    <ServicesSection />
    <ContactSection />
  </div>
</template>

<script setup>
import HeroSection from '@/components/HeroSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import ContactSection from '@/components/ContactSection.vue'
</script>

<style scoped>
.home {
  width: 100%;
}
</style>
