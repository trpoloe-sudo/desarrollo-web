const DEFAULT_TITLE = 'Ztar Tech'
const TITLE_SUFFIX = ' | Ztar Tech'
const DEFAULT_SITE_URL = 'https://ztartech.webcindario.com'
const DEFAULT_IMAGE = '/brand-logo-transparent.png'
const DEFAULT_DESCRIPTION =
  'Servicio técnico, reparación y venta de computadoras en Perú. Diagnóstico claro, atención rápida y soporte real.'

const ROUTER_MODE = String(import.meta.env.VITE_ROUTER_MODE || 'hash').trim().toLowerCase()
const IS_HASH_ROUTER = ROUTER_MODE !== 'history'
const ABSOLUTE_URL_PATTERN = /^https?:\/\//i

const resolveAbsoluteUrl = (value, siteUrl) => {
  const cleanValue = String(value || '').trim()

  if (!cleanValue) {
    return ''
  }

  if (ABSOLUTE_URL_PATTERN.test(cleanValue)) {
    return cleanValue
  }

  return `${siteUrl}${cleanValue.startsWith('/') ? cleanValue : `/${cleanValue}`}`
}

const getSiteUrl = () => {
  const configuredUrl = String(import.meta.env.VITE_SITE_URL || '').trim()

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '')
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return String(window.location.origin).replace(/\/$/, '')
  }

  return DEFAULT_SITE_URL
}

const ensureHeadElement = (selector, factory) => {
  const existingElement = document.head.querySelector(selector)

  if (existingElement) {
    return existingElement
  }

  const element = factory()
  document.head.appendChild(element)
  return element
}

const upsertMeta = (attribute, value, content) => {
  const selector = `meta[${attribute}="${value}"]`
  const meta = ensureHeadElement(selector, () => {
    const element = document.createElement('meta')
    element.setAttribute(attribute, value)
    return element
  })

  meta.setAttribute('content', content)
}

const setCanonical = (href) => {
  const canonical = ensureHeadElement('link[rel="canonical"]', () => {
    const element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    return element
  })

  canonical.setAttribute('href', href)
}

export function setSeoMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image,
  noindex = false,
  type = 'website'
} = {}) {
  const normalizedTitle = title === DEFAULT_TITLE || title.endsWith(TITLE_SUFFIX)
    ? title
    : `${title}${TITLE_SUFFIX}`
  const siteUrl = getSiteUrl()
  const resolvedCanonical = String(canonical || siteUrl).replace(/\/$/, '') || siteUrl
  const resolvedImage = resolveAbsoluteUrl(image || DEFAULT_IMAGE, siteUrl)

  document.title = normalizedTitle

  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
  upsertMeta('property', 'og:title', normalizedTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:url', resolvedCanonical)
  upsertMeta('property', 'og:site_name', DEFAULT_TITLE)
  upsertMeta('property', 'og:locale', 'es_PE')
  upsertMeta('property', 'og:image', resolvedImage)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:domain', siteUrl.replace(/^https?:\/\//, ''))
  upsertMeta('name', 'twitter:title', normalizedTitle)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', resolvedImage)
  setCanonical(resolvedCanonical)
}

export function setStructuredData(id, data) {
  const selector = `script[data-seo-id="${id}"]`
  const script = ensureHeadElement(selector, () => {
    const element = document.createElement('script')
    element.type = 'application/ld+json'
    element.dataset.seoId = id
    return element
  })

  script.textContent = JSON.stringify(data)
}

export function clearStructuredData(id) {
  document.head.querySelector(`script[data-seo-id="${id}"]`)?.remove()
}

export function buildCanonicalUrl(pathname = '/') {
  const siteUrl = getSiteUrl()
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`

  if (IS_HASH_ROUTER) {
    if (normalizedPath === '/') {
      return `${siteUrl}/`
    }

    return `${siteUrl}/#${normalizedPath}`
  }

  return `${siteUrl}${normalizedPath}`.replace(/\/$/, (match, offset, fullValue) => {
    return fullValue.endsWith('/') && fullValue.length > siteUrl.length + 1 ? '' : match
  })
}
