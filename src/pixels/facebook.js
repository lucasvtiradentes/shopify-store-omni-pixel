function addFbPixelFunction() {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.facebook.fire_events) {
    return;
  }

  var facebookPixelsArr = GLOBAL_VARIABLES['store'].pixel_settings.facebook.pixels;

  var allPixelsInit = '';
  for (var x = 0; x < facebookPixelsArr.length; x++) {
    var fbPixel = facebookPixelsArr[x];
    GLOBAL_VARIABLES['session'].active_pixels.push(`FB_${fbPixel}`);
    allPixelsInit = allPixelsInit + '\n' + `fbq('init', '${fbPixel}');`;
  }
  var fbContent = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');

    ${allPixelsInit}
    fbq('track', "PageView");
  `;
  var fbScript = document.createElement('script');
  fbScript.setAttribute('type', 'text/javascript');
  fbScript.setAttribute('nonce', 'O11f2DHz');
  fbScript.innerHTML = fbContent;
  document.body.appendChild(fbScript);
}

function fireFacebookStandardEvent(eventName, eventObject) {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.facebook.fire_events) {
    return;
  }

  if (typeof fbq === 'undefined') {
    setTimeout(function () {
      fireFacebookEvent(eventName, eventObject);
    }, 1000);
    return;
  }

  if (!eventObject) {
    fbq('track', eventName);
  } else {
    fbq('track', eventName, eventObject);
  }

  console.log('FBQ EVENT FIRED: ' + eventName);
  saveFiredEventInCookies(`FB_STANDARD_${eventName}`);
}

function fireFacebookViewContent(productObj) {
  fireFacebookStandardEvent('ViewContent', {
    value: productObj.product_price,
    currency: 'BRL',
    content_name: productObj.product_name,
    content_category: productObj.product_collections[0],

    content_type: 'product',
    content_ids: [productObj.product_default_variant_merchant_id]
  });
}

function fireFacebookAddToCart(cartObj) {
  for (var x = 0; x < cartObj.length; x++) {
    var curProduct = cartObj.checkout_products[x];

    fireFacebookStandardEvent('AddToCart', {
      // content_category,
      // contents,

      value: curProduct.product_price,
      currency: 'BRL',
      content_name: curProduct.product_name,

      content_type: 'product',
      content_ids: curProduct.product_default_variant_merchant_id
    });
  }
}

function fireFacebookInitiateCheckout(checkoutObj) {
  fireFacebookStandardEvent('InitiateCheckout', {
    // content_category,
    // contents,

    value: checkoutObj.purchase_price_total,
    currency: 'BRL',
    content_name: 'initiate checkout page',
    num_items: checkoutObj.checkout_products.length,

    content_type: 'product',
    content_ids: checkoutObj.checkout_products.map(function (pdt) {
      return pdt.product_default_variant_merchant_id;
    })
  });
}

function fireFacebookAddPaymentInfo(checkoutObj) {
  fireFacebookStandardEvent('AddPaymentInfo', {
    // content_category,
    // contents,

    value: checkoutObj.purchase_price_total,
    currency: 'BRL',
    content_name: 'add payment page',
    num_items: checkoutObj.checkout_products.length,

    content_type: 'product',
    content_ids: checkoutObj.checkout_products.map(function (pdt) {
      return pdt.product_default_variant_merchant_id;
    })
  });
}

function fireFacebookPurchase(purchaseObj) {
  fireFacebookStandardEvent('Purchase', {
    value: purchaseObj.purchase_price_total,
    currency: 'BRL',
    content_name: 'purchase page',
    num_items: purchaseObj.purchase_products.length,

    content_type: 'product',
    content_ids: purchaseObj.purchase_products.map(function (pdt) {
      return pdt.product_default_variant_merchant_id;
    }),
    payment_method: purchaseObj.purchase_payment_method
  });
}

function fireFacebookSearch(search_obj) {
  fireFacebookStandardEvent('Search', {
    search_string: search_obj.search_term
  });
}

function fireFacebookContact() {
  fireFacebookStandardEvent('Contact');
}
