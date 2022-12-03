function fireGADSGoogleEvent(eventName, eventObject) {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.google_ads.fire_events) {
    return;
  }

  gtag('event', eventName, eventObject);
}

function getGadsAllPixels() {
  var allGadsPixels = GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels.map(function (pix) {
    return pix.pixel;
  });
  return allGadsPixels;
}

function getGadsSentToFromEventName(eventName) {
  var allGadsPixels = GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels.map(function (pix) {
    return pix.pixel;
  });
  var allGooglePixelLabels = GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels.map(function (pix) {
    return pix.labels[eventName];
  });
  var final_google_ads_pixels = [];

  if (allGooglePixelLabels[0]) {
    for (var x = 0; x < GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels.length; x++) {
      allGooglePixelLabels[x].map(function (lbl) {
        final_google_ads_pixels.push(`${allGadsPixels[x]}/${lbl}`);
      });
    }
  } else {
    console.log('Evento sem rotulo no google ads, mandando pro pixel padrao!');
    final_google_ads_pixels = allGadsPixels;
  }

  return final_google_ads_pixels;
}

function fireGadsViewItem(productObj) {
  var sentTo = getGadsSentToFromEventName('view_item');

  var viewItemObj = {
    value: productObj.product_price,
    currency: 'BRL',
    send_to: sentTo
  };

  saveFiredEventInCookies(`GADS_CONVERSION_${'view_item'}`);
  fireGADSGoogleEvent('conversion', viewItemObj);
}

function fireGadsViewCart(cartObj) {
  var sentTo = getGadsSentToFromEventName('add_to_cart');

  var viewItemObj = {
    value: cartObj.cart_total_price,
    currency: 'BRL',
    send_to: sentTo
  };

  saveFiredEventInCookies(`GADS_CONVERSION_${'add_to_cart'}`);
  fireGADSGoogleEvent('conversion', viewItemObj);
}

function fireGadsBeginCheckout(checkoutObj) {
  var sentTo = getGadsSentToFromEventName('begin_checkout');

  var viewItemObj = {
    value: checkoutObj.checkout_price_total,
    currency: 'BRL',
    send_to: sentTo,
    transaction_id: checkoutObj.checkout_token
  };

  saveFiredEventInCookies(`GADS_CONVERSION_${'begin_checkout'}`);
  fireGADSGoogleEvent('conversion', viewItemObj);
}

function fireGadsAddAddressInfo(checkoutObj) {
  var sentTo = getGadsSentToFromEventName('add_address_info');

  var viewItemObj = {
    value: checkoutObj.checkout_price_total,
    currency: 'BRL',
    send_to: sentTo,
    transaction_id: checkoutObj.checkout_token
  };

  saveFiredEventInCookies(`GADS_CONVERSION_${'add_address_info'}`);
  fireGADSGoogleEvent('conversion', viewItemObj);
}

function fireGadsAddPaymentInfo(checkoutObj) {
  var sentTo = getGadsSentToFromEventName('add_payment_info');

  var viewItemObj = {
    value: checkoutObj.checkout_price_total,
    currency: 'BRL',
    send_to: sentTo,
    transaction_id: checkoutObj.checkout_token
  };

  saveFiredEventInCookies(`GADS_CONVERSION_${'add_payment_info'}`);
  fireGADSGoogleEvent('conversion', viewItemObj);
}

function fireGadsPurchase(purchaseObj) {
  var sentTo = getGadsSentToFromEventName('purchase');

  var viewItemObj = {
    value: purchaseObj.purchase_price_total,
    currency: 'BRL',
    send_to: sentTo,
    transaction_id: purchaseObj.purchase_token
  };

  saveFiredEventInCookies(`GADS_CONVERSION_${'purchase'}`);
  fireGADSGoogleEvent('conversion', viewItemObj);
}

// -----------------------------------------------------------------------------

function formatProductsToGoogleMerchant(productsArr) {
  var formatedProducts = productsArr.map(function (pdt) {
    return {
      id: pdt.product_default_variant_merchant_id.toString(),
      google_business_vertical: 'retail'
    };
  });

  return formatedProducts;
}

function fireGadsDynamicRmkViewItemList(collectionObj) {
  var gads_viewItemListObj = {
    currency: 'BRL',
    value: collectionObj.product_price,
    items: formatProductsToGoogleMerchant(collectionObj.collection_products),

    ecomm_pagetype: 'category',
    ecomm_category: collectionObj.collection_fixed_name,
    ecomm_prodid: collectionObj.collection_products.map(function (pdt) {
      return pdt.product_default_variant_merchant_id;
    }),

    send_to: getGadsAllPixels()
  };

  saveFiredEventInCookies(`GADS_RMK_${'view_item_list'}`);
  fireGADSGoogleEvent('view_item_list', gads_viewItemListObj);
}

function fireGadsDynamicRmkViewItem(productObj) {
  var productCategory = productObj.product_collections.length > 0 ? productObj.product_collections[0] : '';

  var gads_viewItemObj = {
    currency: 'BRL',
    value: productObj.product_price,
    items: formatProductsToGoogleMerchant([productObj]),

    ecomm_pagetype: 'product',
    ecomm_totalvalue: productObj.product_price,
    ecomm_category: productCategory,
    ecomm_prodid: productObj.product_default_variant_merchant_id.toString(),

    send_to: getGadsAllPixels()
  };

  saveFiredEventInCookies(`GADS_RMK_${'view_item'}`);
  fireGADSGoogleEvent('view_item', gads_viewItemObj);
}

function fireGadsDynamicRmkAddToCart(cartObj) {
  var gads_AddToCartObj = {
    currency: 'BRL',
    value: cartObj.product_price,
    items: formatProductsToGoogleMerchant(cartObj.cart_products),

    ecomm_pagetype: 'cart',
    ecomm_totalvalue: cartObj.cart_total_price,
    ecomm_prodid: cartObj.cart_products.map(function (pdt) {
      return pdt.product_default_variant_merchant_id;
    }),

    send_to: getGadsAllPixels()
  };

  saveFiredEventInCookies(`GADS_RMK_${'add_to_cart'}`);
  fireGADSGoogleEvent('add_to_cart', gads_AddToCartObj);
}

function fireGadsDynamicRmkPurchase(purchaseObj) {
  var gads_purchaseObj = {
    currency: 'BRL',
    value: purchaseObj.purchase_price_total,
    items: formatProductsToGoogleMerchant(purchaseObj.purchase_products),

    ecomm_pagetype: 'purchase',
    ecomm_totalvalue: purchaseObj.purchase_price_total,
    ecomm_prodid: purchaseObj.purchase_products.map(function (pdt) {
      return pdt.product_default_variant_merchant_id;
    }),

    send_to: getGadsAllPixels()
  };

  saveFiredEventInCookies(`GADS_RMK_${'purchase'}`);
  fireGADSGoogleEvent('purchase', gads_purchaseObj);
}

function setEnhancedConversionFieldsForGAds(gads_purchaseObj) {
  var nameArr = gads_purchaseObj.purchase_customer_name.split(' ');

  gtag('set', 'user_data', {
    email: gads_purchaseObj.purchase_customer_email,
    phone_number: convertPhoneToE164Format(gads_purchaseObj.purchase_customer_phone),
    address: {
      first_name: nameArr[0],
      last_name: nameArr[nameArr.length - 1],
      street: gads_purchaseObj.purchase_customer_address,
      city: gads_purchaseObj.purchase_customer_city,
      region: gads_purchaseObj.purchase_customer_state,
      postal_code: gads_purchaseObj.purchase_customer_cep.replace('-', ''),
      country: gads_purchaseObj.purchase_customer_country
    }
  });
}

function convertPhoneToE164Format(phone) {
  var finalNumber = `+55${phone}`;
  finalNumber = finalNumber.replace('(', '');
  finalNumber = finalNumber.replace(')', '');
  finalNumber = finalNumber.replace(' ', '');
  finalNumber = finalNumber.replace('-', '');
  finalNumber = finalNumber.replace('-', '');

  return finalNumber;
}
