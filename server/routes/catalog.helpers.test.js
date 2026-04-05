import { describe, expect, it } from 'vitest'
import {
  createManagedCatalogState,
  hasManagedCatalogLayer,
  mergeCatalogProducts,
} from './catalog.helpers.js'

describe('catalog helpers', () => {
  it('merges remote and managed products while honoring hidden ids', () => {
    const mergedProducts = mergeCatalogProducts(
      [
        { id: 1, nombre: 'Remoto 1', precio: 10 },
        { id: 2, nombre: 'Remoto 2', precio: 20 },
      ],
      [
        { id: 2, nombre: 'Editado 2', precio: 25 },
        { id: 3, nombre: 'Manual 3', precio: 30 },
      ],
      [1]
    )

    expect(mergedProducts).toEqual([
      { id: 2, nombre: 'Editado 2', precio: 25 },
      { id: 3, nombre: 'Manual 3', precio: 30 },
    ])
  })

  it('creates an overlay state from a submitted catalog', () => {
    const nextState = createManagedCatalogState(
      [
        { id: 2, nombre: 'CPU 2 editada', categoria: 'CPU', precio: 22, stock: 3, descripcion: '', imagen_url: '', especificaciones: '' },
        { id: 3, nombre: 'Manual 3', categoria: 'Manual', precio: 30, stock: 5, descripcion: '', imagen_url: '', especificaciones: '' },
      ],
      [
        { id: 1, nombre: 'CPU 1', categoria: 'CPU', precio: 10, stock: 2, descripcion: '', imagen_url: '', especificaciones: '' },
        { id: 2, nombre: 'CPU 2', categoria: 'CPU', precio: 20, stock: 3, descripcion: '', imagen_url: '', especificaciones: '' },
      ]
    )

    expect(nextState.managedProducts).toEqual([
      { id: 2, nombre: 'CPU 2 editada', categoria: 'CPU', precio: 22, stock: 3, descripcion: '', imagen_url: '', especificaciones: '' },
      { id: 3, nombre: 'Manual 3', categoria: 'Manual', precio: 30, stock: 5, descripcion: '', imagen_url: '', especificaciones: '' },
    ])
    expect(nextState.hiddenProductIds).toEqual([1])
  })

  it('detects when the managed layer is active', () => {
    expect(hasManagedCatalogLayer([], [])).toBe(false)
    expect(hasManagedCatalogLayer([{ id: 1 }], [])).toBe(true)
    expect(hasManagedCatalogLayer([], [5])).toBe(true)
  })
})
