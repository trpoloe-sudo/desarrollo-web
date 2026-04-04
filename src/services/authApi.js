import axios from 'axios'

const apiBaseURL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || '/api')

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 4000,
  withCredentials: true
})

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.error
    || (Array.isArray(error?.response?.data?.errors) ? error.response.data.errors.join(', ') : null)
    || error?.message
    || fallbackMessage
}

async function request(promise, fallbackMessage) {
  try {
    const { data } = await promise
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage))
  }
}

export const authApi = {
  login(credentials) {
    return request(api.post('/auth/login', credentials), 'No se pudo iniciar sesion.')
  },

  register(payload) {
    return request(api.post('/auth/register', payload), 'No se pudo crear la cuenta.')
  },

  loginWithGoogle(payload) {
    return request(api.post('/auth/google', payload), 'No se pudo iniciar sesion con Google.')
  },

  getSession() {
    return request(api.get('/auth/session'), 'No se pudo restaurar la sesion.')
  },

  logout() {
    return request(api.post('/auth/logout'), 'No se pudo cerrar la sesion.')
  },

  addOrder(payload) {
    return request(api.post('/auth/orders', payload), 'No se pudo guardar la orden.')
  },

  listUsers() {
    return request(api.get('/auth/users'), 'No se pudo cargar la lista de usuarios.')
  },

  updateUserRole(email, role) {
    return request(
      api.patch(`/auth/users/${encodeURIComponent(email)}/role`, { role }),
      'No se pudo actualizar el rol del usuario.'
    )
  },

  updateOrderStatus(orderId, status) {
    return request(
      api.patch(`/auth/orders/${encodeURIComponent(orderId)}/status`, { status }),
      'No se pudo actualizar el estado de la orden.'
    )
  }
}
