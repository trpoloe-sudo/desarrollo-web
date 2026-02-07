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
          const decoded = parseJwt(response.credential)
          onSuccess({
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
            email_verified: decoded.email_verified
          })
        } catch (error) {
          console.error('Error decodificando Google token:', error)
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
    width: '100%'
  }

  try {
    const container = document.getElementById(containerId)
    if (container && window.google && window.google.accounts) {
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
 * Muestra el prompt de Google Sign-In
 * @param {Function} onPromptClosed - Callback cuando se cierra el prompt
 */
export function showGooglePrompt(onPromptClosed) {
  try {
    if (window.google && window.google.accounts) {
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          if (typeof onPromptClosed === 'function') {
            onPromptClosed()
          }
        }
      })
    }
  } catch (error) {
    console.error('Error mostrando Google prompt:', error)
  }
}

/**
 * Decodifica un JWT (sin validar firma, solo para el cliente)
 * @param {string} token - JWT token
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    throw new Error('Error al decodificar JWT: ' + error.message)
  }
}

/**
 * Verifica si Google Sign-In está disponible
 */
export function isGoogleSignInAvailable() {
  return !!(window.google && window.google.accounts)
}
