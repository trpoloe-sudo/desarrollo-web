const GOOGLE_ADS_SEND_TO = String(import.meta.env.VITE_GOOGLE_ADS_SEND_TO || '').trim()
const GA_MEASUREMENT_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim()
const FACEBOOK_PIXEL_ID = String(import.meta.env.VITE_FACEBOOK_PIXEL_ID || '').trim()
const TIKTOK_PIXEL_ID = String(import.meta.env.VITE_TIKTOK_PIXEL_ID || '').trim()

const hasFunction = (value) => typeof value === 'function'

const canTrackFacebook = () => FACEBOOK_PIXEL_ID && hasFunction(globalThis.fbq)
const canTrackGoogle = () => GA_MEASUREMENT_ID && hasFunction(globalThis.gtag)
const canTrackTikTok = () => TIKTOK_PIXEL_ID && globalThis.ttq && hasFunction(globalThis.ttq.track)

const sanitizeItems = (items = []) => {
  return items.map((item) => ({
    item_id: item.id,
    item_name: item.nombre,
    item_category: item.categoria,
    price: Number(item.precio || 0),
    quantity: Number(item.quantity || 1)
  }))
}

export const pixelTracking = {
  facebookTrack(eventName, data = {}) {
    if (canTrackFacebook()) {
      globalThis.fbq('track', eventName, data)
    }
  },

  googleAnalyticsTrack(eventName, data = {}) {
    if (canTrackGoogle()) {
      globalThis.gtag('event', eventName, data)
    }
  },

  googleAdsTrack(value = 0, currency = 'PEN') {
    if (GOOGLE_ADS_SEND_TO && canTrackGoogle()) {
      globalThis.gtag('event', 'conversion', {
        send_to: GOOGLE_ADS_SEND_TO,
        value,
        currency
      })
    }
  },

  tiktokTrack(eventName, data = {}) {
    if (canTrackTikTok()) {
      globalThis.ttq.track(eventName, data)
    }
  },

  trackPageView(pageName) {
    this.facebookTrack('PageView')
    this.googleAnalyticsTrack('page_view', { page_title: pageName })
    this.tiktokTrack('PageView')
  },

  trackViewProduct(product) {
    const value = Number(product?.precio || 0)
    const items = sanitizeItems([product])

    this.facebookTrack('ViewContent', {
      content_name: product?.nombre,
      content_ids: [product?.id],
      content_type: 'product',
      value,
      currency: 'PEN'
    })
    this.googleAnalyticsTrack('view_item', {
      currency: 'PEN',
      value,
      items
    })
    this.tiktokTrack('ViewContent', {
      content_id: product?.id,
      content_name: product?.nombre,
      value
    })
  },

  trackAddToCart(product, quantity = 1) {
    const totalValue = Number(product?.precio || 0) * Number(quantity || 1)
    const items = sanitizeItems([{ ...product, quantity }])

    this.facebookTrack('AddToCart', {
      content_name: product?.nombre,
      content_ids: [product?.id],
      content_type: 'product',
      value: totalValue,
      currency: 'PEN',
      quantity
    })
    this.googleAnalyticsTrack('add_to_cart', {
      currency: 'PEN',
      value: totalValue,
      items
    })
    this.tiktokTrack('AddToCart', {
      content_id: product?.id,
      content_name: product?.nombre,
      value: totalValue,
      quantity
    })
  },

  trackInitiateCheckout(cartItems, cartTotal) {
    const items = sanitizeItems(cartItems)

    this.facebookTrack('InitiateCheckout', {
      content_type: 'product',
      value: cartTotal,
      currency: 'PEN',
      num_items: cartItems.length
    })
    this.googleAnalyticsTrack('begin_checkout', {
      currency: 'PEN',
      value: cartTotal,
      items
    })
    this.tiktokTrack('InitiateCheckout', {
      value: cartTotal,
      currency: 'PEN'
    })
  },

  trackLead(label = 'lead', data = {}) {
    this.facebookTrack('Lead', {
      content_name: label,
      ...data
    })
    this.googleAnalyticsTrack('generate_lead', {
      lead_label: label,
      ...data
    })
    this.googleAdsTrack(Number(data.value || 0), data.currency || 'PEN')
    this.tiktokTrack('SubmitForm', {
      form_name: label
    })
  },

  trackSearch(searchQuery) {
    this.facebookTrack('Search', { search_string: searchQuery })
    this.googleAnalyticsTrack('search', { search_term: searchQuery })
    this.tiktokTrack('Search', { query: searchQuery })
  },

  trackViewCategory(category) {
    this.facebookTrack('ViewCategory', {
      content_name: category,
      content_type: 'product_group'
    })
    this.googleAnalyticsTrack('view_item_list', {
      item_category: category
    })
    this.tiktokTrack('Browse', { category })
  },

  trackLogin() {
    this.facebookTrack('Login')
    this.googleAnalyticsTrack('login')
  },

  trackSignUp() {
    this.facebookTrack('CompleteRegistration')
    this.googleAnalyticsTrack('sign_up')
    this.tiktokTrack('CompleteRegistration')
  },

  trackAddToWishlist(product) {
    this.facebookTrack('AddToWishlist', {
      content_name: product?.nombre,
      content_ids: [product?.id],
      content_type: 'product',
      value: Number(product?.precio || 0),
      currency: 'PEN'
    })
    this.googleAnalyticsTrack('add_to_wishlist', {
      currency: 'PEN',
      value: Number(product?.precio || 0),
      items: sanitizeItems([product])
    })
  },

  trackError(errorMessage, errorCode) {
    this.googleAnalyticsTrack('exception', {
      description: errorMessage,
      fatal: false,
      error_code: errorCode || 'unknown'
    })
    console.error('[Tracking Error]', {
      message: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString()
    })
  },

  trackCustomEvent(eventName, eventData = {}) {
    this.facebookTrack(eventName, eventData)
    this.googleAnalyticsTrack(eventName, eventData)
    this.tiktokTrack(eventName, eventData)
  }
}

export function usePixelTracking() {
  return {
    ...pixelTracking
  }
}
