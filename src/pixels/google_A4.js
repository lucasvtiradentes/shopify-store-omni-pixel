function fireGA4GoogleEvent(eventName, eventObject) {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.google_a4.fire_events) {
    return;
  }

  var allGa4Pixels = GLOBAL_VARIABLES['store'].pixel_settings.google_a4.pixels;
  var eventObj = Object.assign(eventObject, { send_to: allGa4Pixels });

  // dataLayer.push(eventObj)
  saveFiredEventInCookies(`GA4_${eventName}`);
  gtag('event', eventName, eventObj);
}

function formatProdArrToGA4(prodsArr, purchaseCoupon) {
  var allProducts = [];

  var affiliation = GLOBAL_VARIABLES['session'].url_parameters.affiliation;
  var finalCoupon = purchaseCoupon ? purchaseCoupon : '';

  for (var x = 0; x < prodsArr.length; x++) {
    var curProd = prodsArr[x];

    var GA4_prod = {
      item_id: curProd.product_default_variant_merchant_id,
      item_name: curProd.product_name,
      affiliation: affiliation ? affiliation : '',
      coupon: finalCoupon,
      currency: GLOBAL_VARIABLES['settings'].currency,
      discount: 0,
      index: Number(x + 1),
      item_brand: curProd.product_brand,
      item_category: curProd.product_tags[0] || '-',
      item_category2: curProd.product_tags[1] || '-',
      item_category3: curProd.product_tags[2] || '-',
      item_category4: curProd.product_tags[3] || '-',
      item_category5: curProd.product_tags[4] || '-',
      item_list_id: curProd.product_fixed_collection,
      item_list_name: curProd.product_fixed_collection,
      item_variant: curProd.product_default_variant,
      // location_id: curProd.product_brand,
      price: curProd.product_price,
      quantity: curProd.product_quantity
    };

    allProducts.push(GA4_prod);
  }

  return allProducts;
}

function fireGA4Search(searchObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/ga4/reference/events#search

  var GA4_searchObj = {
    search_term: searchObj.search_term
  };

  fireGA4GoogleEvent('search', GA4_searchObj);
}

function fireGA4ViewItemList(collectionObj) {
  // ref: https://developers.google.com/analytics/devguides/migration/ecommerce/ecommerce-gtag#select_an_item_from_a_list

  var GA4_productsArr = formatProdArrToGA4(collectionObj.collection_products);
  var GA4_viewItemListObj = {
    item_list_id: convertCollectionToFixedCollection(collectionObj.collection_fixed_name),
    item_list_name: convertCollectionToFixedCollection(collectionObj.collection_name),
    items: GA4_productsArr
  };

  fireGA4GoogleEvent('view_item_list', GA4_viewItemListObj);
}

function fireGa4ViewItem(productObj) {
  // ref: https://developers.google.com/analytics/devguides/migration/ecommerce/ecommerce-gtag#view_item_details

  var GA4_productsArr = formatProdArrToGA4([productObj]);
  var GA4_viewItemObj = {
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: productObj.product_price,
    items: GA4_productsArr
  };

  fireGA4GoogleEvent('view_item', GA4_viewItemObj);
}

function fireGA4AddToCart(cartObj) {
  // ref: https://developers.google.com/analytics/devguides/migration/ecommerce/ecommerce-gtag#add_or_remove_an_item_from_a_shopping_cart

  var GA4_productsArr = formatProdArrToGA4(cartObj.cart_products);
  var GA4_addToCartObj = {
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: cartObj.cart_total_price,
    items: GA4_productsArr
  };

  fireGA4GoogleEvent('add_to_cart', GA4_addToCartObj);
  fireGA4GoogleEvent('view_cart', GA4_addToCartObj);
}

function fireGA4BeginCheckout(checkoutObj) {
  // ref: https://developers.google.com/analytics/devguides/migration/ecommerce/ecommerce-gtag#initiate_the_checkout_process

  var GA4_productsArr = formatProdArrToGA4(checkoutObj.checkout_products);
  var GA4_beginCheckoutObj = {
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: checkoutObj.checkout_price_total,
    coupon: checkoutObj.checkout_coupon,
    items: GA4_productsArr
  };

  fireGA4GoogleEvent('begin_checkout', GA4_beginCheckoutObj);
}

function fireGA4AddShippingInfo(checkoutObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#1_measure_checkout_steps

  var GA4_productsArr = formatProdArrToGA4(checkoutObj.checkout_products);
  var GA4_addShippingInfoObj = {
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: checkoutObj.checkout_price_total,
    coupon: checkoutObj.checkout_coupon,
    // shipping_tier: "Ground",
    items: GA4_productsArr
  };

  fireGA4GoogleEvent('add_shipping_info', GA4_addShippingInfoObj);
}

function fireGA4AddPaymentInfo(checkoutObj) {
  // ref: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#1_measure_checkout_steps

  var GA4_productsArr = formatProdArrToGA4(checkoutObj.checkout_products);
  var GA4_addShippingInfoObj = {
    currency: GLOBAL_VARIABLES['settings'].currency,
    value: checkoutObj.checkout_price_total,
    coupon: checkoutObj.checkout_coupon,
    // payment_type: "Credit Card",
    items: GA4_productsArr
  };

  fireGA4GoogleEvent('add_shipping_info', GA4_addShippingInfoObj);
}

function fireGA4Purchase(purchaseObj) {
  // ref: https://developers.google.com/analytics/devguides/migration/ecommerce/ecommerce-gtag#make_a_purchase_or_issue_a_refund

  var GA4_productsArr = formatProdArrToGA4(purchaseObj.purchase_products, purchaseObj.purchase_coupon);
  var GA4_purchaseObj = {
    transaction_id: purchaseObj.purchase_token,
    affiliation: purchaseObj.purchase_affiliation,
    value: purchaseObj.purchase_price_total,
    tax: 0,
    shipping: purchaseObj.purchase_price_shipping,
    currency: GLOBAL_VARIABLES['settings'].currency,
    coupon: purchaseObj.purchase_coupon,
    items: GA4_productsArr
  };

  fireGA4GoogleEvent('purchase', GA4_purchaseObj);
}
