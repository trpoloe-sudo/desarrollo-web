/**
 * Servicio de Autenticación con Google
 * Maneja la integración completa con Google Sign-In
 */

const GOOGLE_SCRIPT_ID = 'google-signin-script'

/**
 * Carga el script de Google Sign-In en el DOM
 */
export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    // Si ya está cargado, resolver inmediatamente
    if (window.google && window.google.accounts) {
      resolve(true)
      return
    }

    // Si ya existe el script, solo esperar
    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.accounts) {
          clearInterval(checkInterval)
          resolve(true)
        }
      }, 100)
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('Google script timeout'))
      }, 5000)
      return
    }

    // Crear y cargar el script
    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => {
      setTimeout(() => {
        if (window.google && window.google.accounts) {
          resolve(true)
        } else {
          reject(new Error('Google accounts not available'))
        }
      }, 100)
    }

    script.onerror = () => {
      reject(new Error('Failed to load Google Sign-In script'))
    }

    document.head.appendChild(script)
  })
}

/**
 * Inicializa Google Sign-In
 * @param {string} clientId - Google Client ID
 * @param {Function} onSuccess - Callback cuando se autentica exitosamente
 */
export async function initializeGoogleSignIn(clientId, onSuccess) {
  if (!clientId) {
    throw new Error('Google Client ID no configurado')
  }

  try {
    await loadGoogleScript()

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        try {
          if (!response?.credential) {
            throw new Error('Google no devolvio una credencial valida')
          }

          onSuccess({
            credential: response.credential,
            selectBy: response.select_by || null
          })
        } catch (error) {
          console.error('Error procesando Google token:', error)
          throw error
        }
      }
    })

    return true
  } catch (error) {
    console.error('Error inicializando Google Sign-In:', error)
    throw error
  }
}

/**
 * Renderiza el botón de Google Sign-In
 * @param {string} containerId - ID del elemento contenedor
 * @param {Object} options - Opciones personalizadas del botón
 */
export function renderGoogleButton(containerId, options = {}) {
  const defaultOptions = {
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    shape: 'pill',
    width: '100%'
  }

  try {
    const container = document.getElementById(containerId)
    if (container && window.google && window.google.accounts) {
      container.replaceChildren()
      google.accounts.id.renderButton(
        container,
        { ...defaultOptions, ...options }
      )
      return true
    }
    return false
  } catch (error) {
    console.error('Error renderizando botón de Google:', error)
    return false
  }
}

/**
 * Verifica si Google Sign-In está disponible
 */
export function isGoogleSignInAvailable() {
  return !!(window.google && window.google.accounts)
}
