export const BRAND_LOGO_URL = '/brand-logo-transparent.png'
export const PRODUCT_IMAGE_FALLBACK_URL = BRAND_LOGO_URL

export function getAbsoluteAssetUrl(path) {
  const normalizedPath = String(path || BRAND_LOGO_URL).trim() || BRAND_LOGO_URL

  if (typeof window === 'undefined') {
    return normalizedPath
  }

  return new URL(normalizedPath, window.location.origin).href
}

export function getProductImageUrl(product) {
  return String(product?.imagen_url || PRODUCT_IMAGE_FALLBACK_URL).trim() || PRODUCT_IMAGE_FALLBACK_URL
}
