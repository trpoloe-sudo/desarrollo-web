const DEFAULT_GOOGLE_CLIENT_ID =
  '830570310646-ogjq785e6i3skd9hnv13mm3f797lj4gi.apps.googleusercontent.com'

export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID
}

export const GOOGLE_CONFIG = {
  clientId: getGoogleClientId(),
  scope: 'profile email',
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'
  ],
  onSuccess: credentialResponse => {
    console.log('Google login exitoso:', credentialResponse)
  },
  onError: error => {
    console.error('Error en Google login:', error)
  }
}

export function initGoogleAuth(callbacks = {}) {
  if (!window.google) {
    console.warn('Google Sign-In library no cargada')
    return
  }

  try {
    const clientId = getGoogleClientId()

    if (!clientId) {
      console.warn('Google Client ID no configurado')
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
    console.error('Error renderizando boton de Google:', error)
  }
}
