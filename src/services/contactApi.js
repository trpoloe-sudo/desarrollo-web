import axios from 'axios'

const apiBaseURL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || '/api')

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 4000,
  withCredentials: true
})

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.error
    || (Array.isArray(error?.response?.data?.errors) ? error.response.data.errors.join(', ') : null)
    || error?.message
    || fallbackMessage
}

const request = async (promise, fallbackMessage) => {
  try {
    const { data } = await promise
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage))
  }
}

export const contactApi = {
  submitLead(payload) {
    return request(api.post('/contact/leads', payload), 'No se pudo registrar la consulta.')
  },

  listLeads() {
    return request(api.get('/contact/leads'), 'No se pudo cargar la bandeja de contactos.')
  },

  updateLeadStatus(leadId, status) {
    return request(
      api.patch(`/contact/leads/${encodeURIComponent(leadId)}/status`, { status }),
      'No se pudo actualizar el estado del contacto.'
    )
  }
}
