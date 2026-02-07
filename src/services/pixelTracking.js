/**
 * Servicio de Pixel Tracking
 * Integra Facebook Pixel, Google Analytics, Google Ads y TikTok Pixel
 */

export const pixelTracking = {
  /**
   * Track event en Facebook Pixel
   */
  facebookTrack(eventName, data = {}) {
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, data)
    }
  },

  /**
   * Track event en Google Analytics
   */
  googleAnalyticsTrack(eventName, data = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data)
    }
  },

  /**
   * Track event en Google Ads
   */
  googleAdsTrack(conversionId, conversionLabel, value = 0) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `AW-YOUR_GOOGLE_ADS_ID/${conversionId}/${conversionLabel}`,
        'value': value,
        'currency': 'USD'
      })
    }
  },

  /**
   * Track event en TikTok Pixel
   */
  tiktokTrack(eventName, data = {}) {
    if (typeof ttq !== 'undefined') {
      ttq.track(eventName, data)
    }
  },

  /**
   * Track de Vista de Página
   */
  trackPageView(pageName) {
    this.facebookTrack('PageView')
    this.googleAnalyticsTrack('page_view', {
      'page_title': pageName
    })
    this.tiktokTrack('PageView')
  },

  /**
   * Track de Vista de Producto
   */
  trackViewProduct(product) {
    const data = {
      content_name: product.nombre,
      content_ids: [product.id],
      content_type: 'product',
      value: product.precio,
      currency: 'USD'
    }

    this.facebookTrack('ViewContent', data)
    this.googleAnalyticsTrack('view_item', {
      items: [{
        item_id: product.id,
        item_name: product.nombre,
        price: product.precio
      }]
    })
    this.tiktokTrack('ViewContent', {
      content_id: product.id,
      content_name: product.nombre,
      content_type: 'product',
      value: product.precio
    })
  },

  /**
   * Track de Añadir al Carrito
   */
  trackAddToCart(product, quantity = 1) {
    const totalValue = product.precio * quantity

    const data = {
      content_name: product.nombre,
      content_ids: [product.id],
      content_type: 'product',
      content_category: product.categoria,
      value: totalValue,
      currency: 'USD',
      quantity: quantity
    }

    this.facebookTrack('AddToCart', data)
    this.googleAnalyticsTrack('add_to_cart', {
      items: [{
        item_id: product.id,
        item_name: product.nombre,
        price: product.precio,
        quantity: quantity
      }]
    })
    this.tiktokTrack('AddToCart', {
      content_id: product.id,
      content_name: product.nombre,
      quantity: quantity,
      value: totalValue
    })
  },

  /**
   * Track de Eliminar del Carrito
   */
  trackRemoveFromCart(product, quantity = 1) {
    const totalValue = product.precio * quantity

    const data = {
      content_name: product.nombre,
      content_ids: [product.id],
      content_type: 'product',
      value: totalValue,
      currency: 'USD'
    }

    this.facebookTrack('RemoveFromCart', data)
    this.googleAnalyticsTrack('remove_from_cart', {
      items: [{
        item_id: product.id,
        item_name: product.nombre,
        price: product.precio,
        quantity: quantity
      }]
    })
  },

  /**
   * Track de Vista del Carrito
   */
  trackViewCart(cartItems, cartTotal) {
    const data = {
      content_name: 'Cart',
      content_type: 'product',
      value: cartTotal,
      currency: 'USD',
      num_items: cartItems.length
    }

    this.facebookTrack('ViewCart', data)
    this.googleAnalyticsTrack('view_cart', {
      value: cartTotal,
      currency: 'USD',
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.nombre,
        price: item.precio,
        quantity: item.quantity || 1
      }))
    })
    this.tiktokTrack('ViewCart', {
      value: cartTotal,
      currency: 'USD'
    })
  },

  /**
   * Track de Inicio de Checkout
   */
  trackInitiateCheckout(cartItems, cartTotal) {
    const data = {
      content_name: 'Checkout',
      content_type: 'product',
      value: cartTotal,
      currency: 'USD',
      num_items: cartItems.length
    }

    this.facebookTrack('InitiateCheckout', data)
    this.googleAnalyticsTrack('begin_checkout', {
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.nombre,
        price: item.precio,
        quantity: item.quantity || 1
      })),
      value: cartTotal,
      currency: 'USD'
    })
    this.tiktokTrack('InitiateCheckout', {
      value: cartTotal,
      currency: 'USD'
    })
  },

  /**
   * Track de Información de Envío (Optional para Checkout)
   */
  trackAddPaymentInfo(cartTotal) {
    const data = {
      content_name: 'Payment Info',
      value: cartTotal,
      currency: 'USD'
    }

    this.facebookTrack('AddPaymentInfo', data)
    this.googleAnalyticsTrack('add_payment_info', {
      value: cartTotal,
      currency: 'USD'
    })
  },

  /**
   * Track de Compra (Conversión)
   */
  trackPurchase(orderId, cartItems, cartTotal, userEmail = null) {
    const data = {
      content_name: 'Purchase',
      content_ids: cartItems.map(item => item.id),
      content_type: 'product',
      value: cartTotal,
      currency: 'USD',
      num_items: cartItems.length,
      transaction_id: orderId
    }

    if (userEmail) {
      data.em = this.hashEmail(userEmail)
    }

    this.facebookTrack('Purchase', data)
    
    this.googleAnalyticsTrack('purchase', {
      transaction_id: orderId,
      value: cartTotal,
      currency: 'USD',
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.nombre,
        price: item.precio,
        quantity: item.quantity || 1
      }))
    })

    // Google Ads Conversion
    this.googleAdsTrack('YOUR_CONVERSION_ID', 'YOUR_CONVERSION_LABEL', cartTotal)

    this.tiktokTrack('PlaceAnOrder', {
      value: cartTotal,
      currency: 'USD'
    })
  },

  /**
   * Track de Búsqueda
   */
  trackSearch(searchQuery) {
    const data = {
      search_string: searchQuery
    }

    this.facebookTrack('Search', data)
    this.googleAnalyticsTrack('search', {
      search_term: searchQuery
    })
    this.tiktokTrack('Search', {
      query: searchQuery
    })
  },

  /**
   * Track de Filtro/Vista de Categoría
   */
  trackViewCategory(category) {
    const data = {
      content_name: category,
      content_type: 'product_group'
    }

    this.facebookTrack('ViewCategory', data)
    this.googleAnalyticsTrack('view_item_list', {
      item_category: category
    })
    this.tiktokTrack('Browse', {
      category: category
    })
  },

  /**
   * Track de Inicio de Sesión
   */
  trackLogin() {
    this.facebookTrack('Login')
    this.googleAnalyticsTrack('login')
  },

  /**
   * Track de Registro
   */
  trackSignUp() {
    this.facebookTrack('CompleteRegistration')
    this.googleAnalyticsTrack('sign_up')
    this.tiktokTrack('CompleteRegistration')
  },

  /**
   * Track de Añadir a Favoritos
   */
  trackAddToWishlist(product) {
    const data = {
      content_name: product.nombre,
      content_ids: [product.id],
      content_type: 'product',
      value: product.precio,
      currency: 'USD'
    }

    this.facebookTrack('AddToWishlist', data)
    this.googleAnalyticsTrack('add_to_wishlist', {
      items: [{
        item_id: product.id,
        item_name: product.nombre,
        price: product.precio
      }]
    })
  },

  /**
   * Identificar Usuario (Custom Audience)
   */
  identifyUser(userId, userData = {}) {
    if (typeof fbq !== 'undefined') {
      fbq('init', 'YOUR_FACEBOOK_PIXEL_ID', {
        em: this.hashEmail(userData.email),
        fn: userData.firstName,
        ln: userData.lastName,
        ph: userData.phone,
        ct: userData.city,
        st: userData.state,
        zp: userData.zip,
        country: userData.country
      })
    }

    if (typeof gtag !== 'undefined') {
      gtag('config', 'YOUR_GA_ID', {
        'user_id': userId,
        'user_properties': {
          'email': userData.email,
          'name': userData.firstName + ' ' + userData.lastName
        }
      })
    }
  },

  /**
   * Hash de Email SHA256 (para Facebook)
   */
  hashEmail(email) {
    // Esta es una función simplificada
    // En producción, usa una librería como crypto-js
    if (!email) return ''
    return email.toLowerCase().trim()
  },

  /**
   * Track de Error
   */
  trackError(errorMessage, errorCode) {
    this.googleAnalyticsTrack('exception', {
      description: errorMessage,
      fatal: false
    })

    console.error('[Tracking Error]', {
      message: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString()
    })
  },

  /**
   * Track de Evento Personalizado
   */
  trackCustomEvent(eventName, eventData = {}) {
    this.facebookTrack(eventName, eventData)
    this.googleAnalyticsTrack(eventName, eventData)
    this.tiktokTrack(eventName, eventData)
  }
}

/**
 * Composable para usar en componentes Vue
 */
export function usePixelTracking() {
  return {
    ...pixelTracking
  }
}
