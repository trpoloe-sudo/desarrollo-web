<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h2>

      <div class="google-login-section">
        <div id="google-button-container" class="google-button-container"></div>
        <p v-if="!googleReady" class="hint">
          Google Sign-In no está disponible por ahora.
        </p>
        <p class="divider">o continúa con email</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="tu@email.com"
            autocomplete="email"
            required
            :class="{ 'input-error': fieldErrors.email }"
          />
          <span v-if="fieldErrors.email" class="field-error" aria-live="polite">{{ fieldErrors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Tu contraseña"
            :autocomplete="isLogin ? 'current-password' : 'new-password'"
            required
            :class="{ 'input-error': fieldErrors.password }"
          />
          <span v-if="fieldErrors.password" class="field-error" aria-live="polite">{{ fieldErrors.password }}</span>
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="name">Nombre:</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            placeholder="Tu nombre"
            autocomplete="name"
            required
            :class="{ 'input-error': fieldErrors.name }"
          />
          <span v-if="fieldErrors.name" class="field-error" aria-live="polite">{{ fieldErrors.name }}</span>
        </div>

        <div v-if="error" class="error-message" aria-live="polite">{{ error }}</div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="btn-loader"></span>
          {{ isLoading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta') }}
        </button>
      </form>

      <p class="toggle-auth">
        {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button @click="isLogin = !isLogin" class="link-btn">
          {{ isLogin ? 'Regístrate' : 'Inicia sesión' }}
        </button>
      </p>
      <button
        v-if="userStore.isLoggedIn"
        class="btn-secondary logout-btn"
        @click="logout"
      >
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  initializeGoogleSignIn,
  renderGoogleButton,
  showGooglePrompt,
  isGoogleSignInAvailable
} from '@/services/googleAuth'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const isLoading = ref(false)
const error = ref('')
const googleReady = ref(false)
const form = ref({
  email: '',
  password: '',
  name: ''
})
const fieldErrors = reactive({
  email: '',
  password: '',
  name: ''
})

onMounted(async () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.warn('Google Client ID no configurado en .env')
    return
  }

  try {
    await initializeGoogleSignIn(clientId, handleGoogleSignInSuccess)
    googleReady.value = true
    renderGoogleButton('google-button-container', { width: 320 })

    showGooglePrompt(() => {
      console.log('Google prompt cerrado')
    })
  } catch (err) {
    console.error('Error inicializando Google Sign-In:', err)
    error.value = 'Google Sign-In no disponible. Usa el login tradicional.'
  }
})

function handleGoogleLogin() {
  if (!googleReady.value) return
  if (!isGoogleSignInAvailable()) {
    error.value = 'Google Sign-In no está disponible. Por favor intenta más tarde.'
    return
  }

  isLoading.value = true

  try {
    const container = document.getElementById('google-button-container')
    if (container && container.children.length === 0) {
      renderGoogleButton('google-button-container')
    }

    showGooglePrompt(() => {
      console.log('Por favor usa el botón de Google abajo')
    })
  } catch (err) {
    error.value = 'Error al inicializar Google Sign-In'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

function handleGoogleSignInSuccess(googleData) {
  try {
    isLoading.value = true
    error.value = ''

    userStore.loginWithGoogle(
      googleData.email,
      googleData.name,
      googleData.picture || null
    )

    showNotification('Sesión iniciada con Google', 'success')

    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (err) {
    error.value = err.message || 'Error al iniciar sesión con Google'
    showNotification(error.value, 'error')
    console.error('Google sign-in error:', err)
  } finally {
    isLoading.value = false
  }
}

async function handleSubmit() {
  try {
    isLoading.value = true
    error.value = ''
    fieldErrors.email = ''
    fieldErrors.password = ''
    fieldErrors.name = ''

    const emailValue = form.value.email.trim()
    const passwordValue = form.value.password.trim()
    const nameValue = form.value.name.trim()

    if (!emailValue || !/^\S+@\S+\.\S+$/.test(emailValue)) {
      fieldErrors.email = 'Ingresa un email válido'
    }
    if (!passwordValue || passwordValue.length < 6) {
      fieldErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    if (!isLogin.value && nameValue.length < 2) {
      fieldErrors.name = 'Ingresa tu nombre'
    }

    if (fieldErrors.email || fieldErrors.password || fieldErrors.name) {
      isLoading.value = false
      return
    }

    if (isLogin.value) {
      userStore.login(emailValue, passwordValue)
    } else {
      userStore.register(emailValue, passwordValue, nameValue)
    }

    showNotification(isLogin.value ? 'Sesión iniciada' : 'Cuenta creada', 'success')

    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (err) {
    error.value = err.message
    showNotification(error.value, 'error')
  } finally {
    isLoading.value = false
  }
}

function showNotification(message, type) {
  console.log(`[${type.toUpperCase()}] ${message}`)
}

function logout() {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.auth-card {
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
  border: 1px solid rgba(77, 184, 255, 0.15);
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  inset: -40% -20%;
  background: radial-gradient(circle, rgba(77, 184, 255, 0.15), transparent 60%);
  opacity: 0.6;
  pointer-events: none;
}

.auth-card > * {
  position: relative;
  z-index: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  text-align: center;
  color: var(--color-text);
  margin-bottom: 30px;
  font-size: 1.5em;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--color-text-light);
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s;
  background: rgba(255, 255, 255, 0.9);
}

input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(77, 184, 255, 0.12);
}

.input-error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #2f6fb4 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: var(--color-error);
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 0.9em;
}

.field-error {
  display: block;
  margin-top: 6px;
  font-size: 0.85em;
  color: var(--color-error);
}

.toggle-auth {
  text-align: center;
  margin-top: 20px;
  color: var(--color-text-light);
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
}

.link-btn:hover {
  color: var(--color-secondary);
}

.google-login-section {
  margin-bottom: 20px;
}

.google-button-container {
  min-height: 48px;
  display: flex;
  justify-content: center;
}

.hint {
  margin: 8px 0 0;
  font-size: 0.85em;
  color: var(--color-text-light);
  text-align: center;
}

.divider {
  text-align: center;
  color: var(--color-text-light);
  margin: 15px 0;
  font-size: 0.9em;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: var(--color-border);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.google-button-container {
  display: block;
  margin-top: 10px;
  text-align: center;
}

.btn-secondary {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  background: var(--color-bg-light);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e9edf5;
}

.btn-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

