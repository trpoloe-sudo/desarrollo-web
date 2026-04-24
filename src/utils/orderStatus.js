export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente de coordinacion' },
  { value: 'payment_review', label: 'Pago por verificar' },
  { value: 'paid', label: 'Pago verificado' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' }
]

const ORDER_STATUS_META = {
  pending: {
    label: 'Pendiente de coordinacion',
    description: 'Recibimos tu pedido y te contactaremos para confirmar stock, pago y entrega.'
  },
  payment_review: {
    label: 'Pago por verificar',
    description: 'Registramos tu referencia y estamos validando la operacion antes de liberar el pedido.'
  },
  paid: {
    label: 'Pago verificado',
    description: 'El pago ya fue confirmado. Tu pedido esta en preparacion o listo para coordinacion final.'
  },
  completed: {
    label: 'Completado',
    description: 'El pedido fue cerrado correctamente.'
  },
  cancelled: {
    label: 'Cancelado',
    description: 'El pedido fue cancelado.'
  }
}

export function getOrderStatusMeta(status) {
  return ORDER_STATUS_META[status] || {
    label: status || 'Sin estado',
    description: 'Estado no reconocido.'
  }
}

export function getOrderStatusLabel(status) {
  return getOrderStatusMeta(status).label
}

export function getOrderStatusDescription(status) {
  return getOrderStatusMeta(status).description
}
