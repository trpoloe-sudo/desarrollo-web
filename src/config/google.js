/**
 * Configuración de Google OAuth 2.0
 * 
 * Para usar Google Sign-In necesitas:
 * 1. Crear un proyecto en Google Cloud Console
 * 2. Configurar OAuth 2.0 y obtener tu Client ID
 * 3. Agregar el Client ID a tu archivo .env
 * 
 * Instrucciones:
 * 1. Ve a https://console.cloud.google.com/
 * 2. Crea un nuevo proyecto
 * 3. Ve a "Credenciales" y crea una credencial OAuth 2.0
 * 4. Configura como "Aplicación web"
 * 5. Agrega tu dominio a "Orígenes autorizados de JavaScript"
 * 6. Agrega tu URL de redirección a "URI de redirección autorizados"
 * 7. Copia el Client ID y agrégalo a tu .env como VITE_GOOGLE_CLIENT_ID
 */

export const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  scope: 'profile email',
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'
  ],
  // Callback después de login exitoso
  onSuccess: (credentialResponse) => {
    console.log('Google login exitoso:', credentialResponse)
  },
  // Callback en caso de error
  onError: (error) => {
    console.error('Error en Google login:', error)
  }
}

/**
 * Inicia la autenticación con Google
 * @param {Object} callbacks - Objeto con onSuccess y onError
 */
export function initGoogleAuth(callbacks = {}) {
  if (!window.google) {
    console.warn('Google Sign-In library no cargada')
    return
  }

  try {
    const clientId = GOOGLE_CONFIG.clientId
    
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID no configurado en .env')
      return
    }

    google.accounts.id.initialize({
      client_id: clientId,
      callback: callbacks.onSuccess || GOOGLE_CONFIG.onSuccess
    })

    return true
  } catch (error) {
    console.error('Error inicializando Google Auth:', error)
    return false
  }
}

/**
 * Renderiza el botón de Google Sign-In
 * @param {string} containerId - ID del elemento contenedor
 * @param {Object} options - Opciones del botón
 */
export function renderGoogleButton(containerId = 'google-button-container', options = {}) {
  if (!window.google) {
    console.warn('Google Sign-In library no cargada')
    return
  }

  const defaultOptions = {
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    width: '100%'
  }

  try {
    const container = document.getElementById(containerId)
    if (container) {
      google.accounts.id.renderButton(
        container,
        { ...defaultOptions, ...options }
      )
    }
  } catch (error) {
    console.error('Error renderizando botón de Google:', error)
  }
}
