function checkIfisNewUser() {
  var userGaId = getCookie('_ga');
  var isNewUser = userGaId === undefined;
  return isNewUser;
}

function getProductDetailsFromName(prodName) {
  var curFilteredProduct = GLOBAL_VARIABLES['user'].behavior.products_details.filter(function (pdt) {
    return prodName === pdt.product_name;
  })[0];
  return curFilteredProduct;
}

function hasUserVisitedPage(page) {
  var cookieVisited = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VISITED_PAGES']);
  var visitedPagesArr = cookieVisited ? JSON.parse(cookieVisited) : [];
  var hasVisitedPage = visitedPagesArr.indexOf(page) > -1;
  return hasVisitedPage;
}

function addMaximumFunnelStep(curNumber) {
  if (typeof GLOBAL_VARIABLES['user'].behavior.maximum_step === 'undefined' || Number(GLOBAL_VARIABLES['user'].behavior.maximum_step) < curNumber) {
    updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_MAXIMUM_STEP'], curNumber);
    GLOBAL_VARIABLES['user'].behavior.maximum_step = curNumber;
    return true;
  } else {
    return false;
  }
}

function getProductVariantNameFromMerchantId(product_name, product_variant_merchant_id) {
  var detailedProducts = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_PRODUCTS_DETAILS']);
  var detailedProductsArr = detailedProducts ? JSON.parse(detailedProducts) : [];

  var filteredProduct = detailedProductsArr.filter(function (pdt) {
    return pdt.product_name === product_name;
  });

  var curVariant = filteredProduct[0].product_variants.filter(function (variant) {
    return variant.product_variant_merchant_id === product_variant_merchant_id;
  });

  return curVariant[0].product_variant;
}

function getOrderIndexFromToken(token) {
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var curOrders = userOrders ? JSON.parse(userOrders) : [];
  var orderIndex = curOrders.findIndex(function (order) {
    return order.token === token;
  });
  return orderIndex;
}

function getOrderFromToken(token) {
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var curOrders = userOrders ? JSON.parse(userOrders) : [];
  var orderIndex = getOrderIndexFromToken(token);
  return orderIndex > -1 ? curOrders[orderIndex] : {};
}

function updateOrderFromToken(token, newOrder) {
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var curOrders = userOrders ? JSON.parse(userOrders) : [];
  var orderIndex = getOrderIndexFromToken(token);

  var newOrders = curOrders;
  newOrders[orderIndex] = newOrder;

  updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS'], JSON.stringify(newOrders));
}

function saveVisitedPages() {
  var hasVisitedPage = false;

  if (getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VISITED_PAGES']) === undefined) {
    console.log(`Salvando primeira visita a pagina: ${GLOBAL_VARIABLES['session'].current_page.page_name}`);
    updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VISITED_PAGES'], JSON.stringify([GLOBAL_VARIABLES['session'].current_page.page_name]));
  } else {
    var visitedPagesArr = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VISITED_PAGES']));
    hasVisitedPage = visitedPagesArr.indexOf(GLOBAL_VARIABLES['session'].current_page.page_name) > -1;
    if (!hasVisitedPage) {
      console.log(`Salvando primeira visita a pagina: ${GLOBAL_VARIABLES['session'].current_page.page_name}`);
      var finalArr = visitedPagesArr.concat([GLOBAL_VARIABLES['session'].current_page.page_name]);
      updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VISITED_PAGES'], JSON.stringify(finalArr));
    }
  }

  GLOBAL_VARIABLES['user'].behavior.visited_pages = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VISITED_PAGES']));
}

function updateDetailedProducts(cart_products) {
  for (var x = 0; x < cart_products.length; x++) {
    var curProduct = cart_products[x];
    var product_variant = curProduct.product_variant;
    var product_variant_sku = curProduct.product_variant_sku;
    var product_variant_merchant_id = curProduct.product_variant_merchant_id;

    var variantObj = {
      product_variant,
      product_variant_sku,
      product_variant_merchant_id
    };

    addVariantToDetailedProducts(curProduct.product_name, variantObj);
  }
}

function addVariantToDetailedProducts(product_name, variantObj) {
  var viewdProducts = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_PRODUCTS_DETAILS']);
  var viewedProductsArr = viewdProducts ? JSON.parse(viewdProducts) : [];
  var productIndex = viewedProductsArr.findIndex(function (item) {
    return item.product_name === product_name;
  });

  if (productIndex > -1) {
    var curProduct = viewedProductsArr[productIndex];
    var variantIndex = curProduct.product_variants.findIndex(function (item) {
      return item.product_variant_sku === variantObj.product_variant_sku;
    });

    if (variantIndex > -1) {
      console.log('Variante ja foi adicionado anteriormente');
    } else {
      console.log('Variante adicionada');

      var completeObj = curProduct;
      completeObj.product_variants.push(variantObj);
      viewedProductsArr[productIndex] = completeObj;

      updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_PRODUCTS_DETAILS'], JSON.stringify(viewedProductsArr));
      GLOBAL_VARIABLES['user'].behavior.products_details = viewedProductsArr;
    }
  } else {
    console.log('Produto nao foi encontrado');
  }
}

function getDetailedProductFromName(name) {
  var detailedProducts = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_PRODUCTS_DETAILS']);
  var detailedProductsArr = detailedProducts ? JSON.parse(detailedProducts) : [];
  var productIndex = detailedProductsArr.findIndex(function (item) {
    return item.product_name === name;
  });
  return detailedProductsArr[productIndex];
}

function saveFiredEventInCookies(eventName) {
  var curPage = GLOBAL_VARIABLES['session'].current_page.page_name;

  var finalEventName = `${getDateTime()} - ${curPage} - ${eventName}`;
  var firedEventsCookieArr = getCookie(GLOBAL_COOKIES['SESSION_FIRED_EVENTS']);
  var firedEventsArr = firedEventsCookieArr ? JSON.parse(firedEventsCookieArr) : [];

  var finalArr = firedEventsArr.concat([finalEventName]);
  updateCookie(GLOBAL_COOKIES['SESSION_FIRED_EVENTS'], JSON.stringify(finalArr));
  GLOBAL_VARIABLES['session'].fired_events = finalArr;
}
