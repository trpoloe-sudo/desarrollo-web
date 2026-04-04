import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '@/stores/ui'

describe('UiStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds and dismisses toasts', () => {
    const uiStore = useUiStore()
    const toastId = uiStore.notify({ title: 'Hola', message: 'Mensaje', duration: 0 })

    expect(uiStore.toasts).toHaveLength(1)
    expect(uiStore.toasts[0].id).toBe(toastId)

    uiStore.dismissToast(toastId)

    expect(uiStore.toasts).toHaveLength(0)
  })

  it('auto dismisses timed toasts', () => {
    vi.useFakeTimers()
    const uiStore = useUiStore()

    uiStore.notify({ message: 'Temporal', duration: 1000 })
    expect(uiStore.toasts).toHaveLength(1)

    vi.advanceTimersByTime(1000)
    expect(uiStore.toasts).toHaveLength(0)

    vi.useRealTimers()
  })

  it('resolves confirmation prompts', async () => {
    const uiStore = useUiStore()
    const confirmationPromise = uiStore.confirm({ title: 'Confirmar', message: 'Seguir' })

    expect(uiStore.confirmation?.title).toBe('Confirmar')

    uiStore.resolveConfirmation(true)

    await expect(confirmationPromise).resolves.toBe(true)
    expect(uiStore.confirmation).toBeNull()
  })
})
