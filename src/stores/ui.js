import { defineStore } from 'pinia'
import { ref } from 'vue'

let toastIdCounter = 0

export const useUiStore = defineStore('ui', () => {
  const toasts = ref([])
  const confirmation = ref(null)
  let confirmResolver = null

  function notify({
    title = '',
    message = '',
    type = 'info',
    duration = 3200
  }) {
    const id = ++toastIdCounter
    const toast = { id, title, message, type }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }

    return id
  }

  function dismissToast(id) {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  function success(message, title = 'Exito') {
    return notify({ title, message, type: 'success' })
  }

  function error(message, title = 'Error') {
    return notify({ title, message, type: 'error', duration: 4200 })
  }

  function info(message, title = 'Informacion') {
    return notify({ title, message, type: 'info' })
  }

  function warning(message, title = 'Atencion') {
    return notify({ title, message, type: 'warning', duration: 3800 })
  }

  function confirm(options = {}) {
    if (confirmResolver) {
      confirmResolver(false)
      confirmResolver = null
    }

    confirmation.value = {
      title: options.title || 'Confirmar accion',
      message: options.message || 'Deseas continuar?',
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      danger: Boolean(options.danger)
    }

    return new Promise(resolve => {
      confirmResolver = resolve
    })
  }

  function resolveConfirmation(result) {
    if (confirmResolver) {
      confirmResolver(result)
      confirmResolver = null
    }

    confirmation.value = null
  }

  return {
    toasts,
    confirmation,
    notify,
    dismissToast,
    success,
    error,
    info,
    warning,
    confirm,
    resolveConfirmation
  }
})
