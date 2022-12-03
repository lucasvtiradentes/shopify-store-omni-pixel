function addTiktokPixelFunction() {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.tiktok.fire_events) {
    return;
  }

  var tiktokPixelsArr = GLOBAL_VARIABLES['store'].pixel_settings.tiktok.pixels;

  var allPixelsInit = '';
  for (var x = 0; x < tiktokPixelsArr.length; x++) {
    var tiktokPixel = tiktokPixelsArr[x];
    GLOBAL_VARIABLES['session'].active_pixels.push(`TIKTOK_${tiktokPixel}`);
    allPixelsInit = allPixelsInit + '\n' + `ttq.load('${tiktokPixel}');`;
  }
  var tiktokContent = `
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

    ${allPixelsInit}
    ttq.page();
  }(window, document, 'ttq');
  `;
  var tiktokScript = document.createElement('script');
  tiktokScript.setAttribute('type', 'text/javascript');
  tiktokScript.innerHTML = tiktokContent;
  document.body.appendChild(tiktokScript);
}

function fireTikTokStandardEvent(eventName, eventObject) {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.tiktok.fire_events) {
    return;
  }

  if (typeof ttq === 'undefined') {
    setTimeout(function () {
      fireTikTokStandardEvent(eventName, eventObject);
    }, 1000);
    return;
  }

  if (!eventObject) {
    ttq.track(eventName);
  } else {
    ttq.track(eventName, eventObject);
  }

  console.log('TIKTOK EVENT FIRED: ' + eventName);
  saveFiredEventInCookies(`TIKTOK_${eventName}`);
}

function fireTikTokViewContent(productObj) {
  fireTikTokStandardEvent('ViewContent', {
    content_type: 'product', // 'product_group'
    quantity: productObj.product_quantity,
    description: 'product description',
    content_id: productObj.product_default_variant_merchant_id,
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: productObj.product_price
  });
}

function fireTikTokAddToCart(cartObj) {
  fireTikTokStandardEvent('AddToCart', {
    content_type: 'product_group',
    quantity: cartObj.cart_total_products,
    description: 'cart product descriptions',
    // content_id,
    contents: cartObj.cart_products.map(function (pdt) {
      return {
        content_id: pdt.product_default_variant_merchant_id,
        content_name: pdt.product_name,
        content_category: pdt.product_collections[0],
        quantity: pdt.product_quantity,
        price: pdt.product_price
      };
    }),
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: cartObj.cart_total_price
  });
}

function fireTikTokInitiateCheckout(checkoutObj) {
  fireTikTokStandardEvent('InitiateCheckout', checkoutObj);
}

function fireTikTokAddPaymentInfo(checkoutObj) {
  fireTikTokStandardEvent('AddPaymentInfo', checkoutObj);
}

function fireTikTokCompletePayment(purchaseObj) {
  fireTikTokStandardEvent('CompletePayment', {
    content_type: 'product_group',
    quantity: purchaseObj.purchase_products.length,
    description: 'purchase product descriptions',
    // content_id,
    contents: purchaseObj.purchase_products.map(function (pdt) {
      return {
        content_id: pdt.product_default_variant_merchant_id,
        content_name: pdt.product_name,
        content_category: pdt.product_collections[0],
        quantity: pdt.product_quantity,
        price: pdt.product_price
      };
    }),
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: purchaseObj.purchase_price_total
  });
}

function fireTikTokPlaceAnOrder(purchaseObj) {
  fireTikTokStandardEvent('PlaceAnOrder', {
    content_type: 'product_group',
    quantity: purchaseObj.purchase_products.length,
    description: 'purchase product descriptions',
    // content_id,
    contents: purchaseObj.purchase_products.map(function (pdt) {
      return {
        content_id: pdt.product_default_variant_merchant_id,
        content_name: pdt.product_name,
        content_category: pdt.product_collections[0],
        quantity: pdt.product_quantity,
        price: pdt.product_price
      };
    }),
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: purchaseObj.purchase_price_total
  });
}

function fireTikTokSearch(search_obj) {
  fireTikTokStandardEvent('Search', {
    query: search_obj.search_term
  });
}

function fireTikTokContact() {
  fireTikTokStandardEvent('Contact');
}
