function fireUAGoogleEvent(eventName, eventObject) {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.google_ua.fire_events) {
    return;
  }

  var allUAPixels = GLOBAL_VARIABLES['store'].pixel_settings.google_ua.pixels;
  var eventObj = Object.assign(eventObject, { send_to: allUAPixels });

  saveFiredEventInCookies(`GUA_${eventName}`);
  gtag('event', eventName, eventObj);
}

function formatProdArrToGUA(prodsArr) {
  var allProducts = [];

  for (var x = 0; x < prodsArr.length; x++) {
    var curProd = prodsArr[x];

    var UA_prod = {
      id: curProd.product_default_variant_merchant_id,
      name: curProd.product_name,
      list_name: curProd.product_fixed_collection,
      brand: curProd.product_brand,
      category: curProd.product_fixed_collection,
      variant: curProd.product_default_variant,
      list_position: Number(x + 1),
      quantity: curProd.product_quantity,
      price: curProd.product_price
    };

    allProducts.push(UA_prod);
  }

  return allProducts;
}

function fireUAViewItemList(collectionObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_product_impressions

  var UA_productsArr = formatProdArrToGUA(collectionObj.collection_products);
  var UA_viewItemListObj = {
    items: UA_productsArr
  };

  fireUAGoogleEvent('view_item_list', UA_viewItemListObj);
}

function fireUAViewItem(productObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_product_detail_views

  var UA_productsArr = formatProdArrToGUA([productObj]);
  var UA_viewItemObj = {
    items: UA_productsArr
  };

  fireUAGoogleEvent('view_item', UA_viewItemObj);
}

function fireUAAddToCart(cartObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_additions_to_and_removals_from_shopping_carts

  var UA_productsArr = formatProdArrToGUA(cartObj.cart_products);
  var UA_addToCartObj = {
    items: UA_productsArr
  };

  fireUAGoogleEvent('add_to_cart', UA_addToCartObj);
}

function fireUABeginCheckout(checkoutObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#1_measure_checkout_steps

  var UA_productsArr = formatProdArrToGUA(checkoutObj.checkout_products);
  var UA_beginCheckoutObj = {
    items: UA_productsArr,
    coupon: checkoutObj.checkout_coupon
  };

  fireUAGoogleEvent('begin_checkout', UA_beginCheckoutObj);
}

function fireUACheckoutStep2(checkoutObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#1_measure_checkout_steps

  var UA_productsArr = formatProdArrToGUA(checkoutObj.checkout_products);
  var UA_beginCheckoutObj = {
    items: UA_productsArr,
    coupon: checkoutObj.checkout_coupon,
    checkout_step: 2
  };

  fireUAGoogleEvent('checkout_progress', UA_beginCheckoutObj);
}

function fireUACheckoutStep3(checkoutObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#1_measure_checkout_steps

  var UA_productsArr = formatProdArrToGUA(checkoutObj.checkout_products);
  var UA_beginCheckoutObj = {
    items: UA_productsArr,
    coupon: checkoutObj.checkout_coupon,
    checkout_step: 2
  };

  fireUAGoogleEvent('checkout_progress', UA_beginCheckoutObj);
}

function fireUAPurchase(purchaseObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_purchases
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#action-data

  var UA_productsArr = formatProdArrToGUA(purchaseObj.purchase_products);
  var UA_purchaseObj = {
    items: UA_productsArr,
    transaction_id: purchaseObj.purchase_token,
    affiliation: purchaseObj.purchase_affiliation, // purchase_products[0].product_brand
    value: purchaseObj.purchase_price_total,
    currency: GLOBAL_VARIABLES['settings'].currency,
    tax: 0,
    shipping: purchaseObj.purchase_price_shipping,
    checkout_option: purchaseObj.purchase_payment_method,
    coupon: purchaseObj.purchase_coupon
  };

  fireUAGoogleEvent('purchase', UA_purchaseObj);
}
