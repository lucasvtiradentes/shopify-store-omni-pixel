window.GLOBAL_VARIABLES = {
  settings: {
    set_pixels_only_after_delay: true,
    run_tracker_only_for_brazilians: true,
    checkout_delay: 1500,
    initial_delay: 0,
    cookies_expiration_days: 60,
    session_duration_minutes: 15,
    version: '1.5',
    currency: 'BRL',
    cookies_prefix: '__LVT_'
  },
  store: {},
  session: {
    current_page: {},
    active_pixels: [],
    fired_events: {},
    url_parameters: {}
  },
  user: {
    access: {},
    behavior: {},
    data: {}
  }
};

var GLOBAL_COOKIES = {
  SESSION_PARAMETERS: 'session_parameters',
  SESSION_FIRED_EVENTS: 'session_fired_events',

  USER_ACCESS_INITIAL_ACCESS: 'access_initial_access_time',
  USER_ACCESS_LAST_ACCESS: 'access_last_access_time',

  USER_BEHAVIOR_VISITED_PAGES: 'behavior_visited',
  USER_BEHAVIOR_VIEWED_PRODUCTS: 'behavior_viewed_products',
  USER_BEHAVIOR_VIEWED_COLLECTIONS: 'behavior_viewed_collections',
  USER_BEHAVIOR_VIEWED_ARTICLES: 'behavior_viewed_articles',
  USER_BEHAVIOR_SEARCHS_MADE: 'behavior_searchs_made',
  USER_BEHAVIOR_MAXIMUM_STEP: 'behavior_maximum_step',
  USER_BEHAVIOR_PRODUCTS_DETAILS: 'behavior_products_details',
  USER_BEHAVIOR_ORDERS: 'behavior_orders',

  USER_DATA_DEVICE: 'data_device',
  USER_DATA_TOKEN: 'data_token',
  USER_DATA_IP: 'data_ip',
  USER_DATA_LOCATION: 'data_location',
  USER_DATA_COUNTRY: 'data_country'
};

for (const [key, value] of Object.entries(GLOBAL_COOKIES)) {
  GLOBAL_COOKIES[key] = `${GLOBAL_VARIABLES['settings'].cookies_prefix}${value}`;
}

function detectDevice() {
  var isMobile =
    window.navigator.userAgent.match(/Mobile/i) ||
    window.navigator.userAgent.match(/iPhone/i) ||
    window.navigator.userAgent.match(/iPod/i) ||
    window.navigator.userAgent.match(/IEMobile/i) ||
    window.navigator.userAgent.match(/Windows Phone/i) ||
    window.navigator.userAgent.match(/Android/i) ||
    window.navigator.userAgent.match(/BlackBerry/i) ||
    window.navigator.userAgent.match(/webOS/i);

  var isTablet = window.navigator.userAgent.match(/Tablet/i) || window.navigator.userAgent.match(/iPad/i) || window.navigator.userAgent.match(/Nexus 7/i) || window.navigator.userAgent.match(/Nexus 10/i) || window.navigator.userAgent.match(/KFAPWI/i);

  var isPc = !isMobile && !isTablet;

  var userAgent = isMobile ? 'mobile' : isTablet ? 'tablet' : 'pc';

  return userAgent;
}

function generateToken() {
  var tokenLength = 15;
  var a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  var b = [];

  for (var i = 0; i < tokenLength; i++) {
    var j = (Math.random() * (a.length - 1)).toFixed(0);
    b[i] = a[j];
  }

  var finalToken = b.join('');
  return finalToken;
}

function getCurrentPageData() {
  var hostname = window.location.hostname;
  var pathname = window.location.pathname;

  var currentPage = '';
  var currentPageFunction = '';
  var currentHost = '';

  if (pathname === '/') {
    currentPage = 'home';
    currentPageFunction = shopifyHome;
    currentHost = 'shopify';
  } else if (pathname.search('products') > -1) {
    currentPage = 'product';
    currentPageFunction = shopifyProduct;
    currentHost = 'shopify';
  } else if (pathname.search('cart') > -1) {
    currentPage = 'cart';
    currentPageFunction = shopifyCart;
    currentHost = 'shopify';
  } else if (pathname.search('/collections/all') > -1) {
    currentPage = 'all_products';
    currentPageFunction = shopifyProducts;
    currentHost = 'shopify';
  } else if (pathname.search('/collections/') > -1) {
    currentPage = 'collection';
    currentPageFunction = shopifyCollection;
    currentHost = 'shopify';
  } else if (pathname.search('/collections') > -1) {
    currentPage = 'all_collections';
    currentPageFunction = shopifyCollections;
    currentHost = 'shopify';
  } else if (pathname.search('/search') > -1) {
    currentPage = 'search';
    currentPageFunction = shopifySearch;
    currentHost = 'shopify';
  } else if (pathname.search(`${GLOBAL_VARIABLES['store'].shopify_store.blog_url}/`) > -1) {
    currentPage = 'article';
    currentPageFunction = shopifyArticle;
    currentHost = 'shopify';
  } else if (pathname.search(GLOBAL_VARIABLES['store'].shopify_store.blog_url) > -1) {
    currentPage = 'blog';
    currentPageFunction = shopifyBlog;
    currentHost = 'shopify';
  } else if (pathname.search(GLOBAL_VARIABLES['store'].shopify_store.tracking_url) > -1) {
    currentPage = 'tracking';
    currentPageFunction = shopifyTracking;
    currentHost = 'shopify';
  } else if (pathname.search(GLOBAL_VARIABLES['store'].shopify_store.contact_url) > -1) {
    currentPage = 'contact';
    currentPageFunction = shopifyContact;
    currentHost = 'shopify';
  } else if (pathname.search('/finalization') > -1) {
    currentPage = 'purchase';
    currentPageFunction = yampiPurchase;
    currentHost = 'yampi';
  } else if (pathname.search('/payment') > -1) {
    currentPage = 'payment';
    currentPageFunction = yampiPayment;
    currentHost = 'yampi';
  } else if (pathname.search('/address') > -1) {
    currentPage = 'address';
    currentPageFunction = yampiAddress;
    currentHost = 'yampi';
  } else if (hostname === GLOBAL_VARIABLES['store'].shopify_store.checkout_url) {
    currentPage = 'checkout';
    currentPageFunction = yampiCheckout;
    currentHost = 'yampi';
  } else {
    currentPage = 'other';
    currentPageFunction = function () {
      console.log('Outra pagina');
    };
    currentHost = 'outra';
  }

  return {
    page_name: currentPage,
    page_host: currentHost,
    page_function: currentPageFunction
  };
}

function runWhenGetUserIp(cbFunction) {
  var url = 'https://myip.wtf/json';

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cbFunction({
        ip: data.YourFuckingIPAddress,
        location: data.YourFuckingLocation,
        country: data.YourFuckingCountryCode
      });
    });
}

function getCurCollection(allCollections) {
  if (!allCollections) {
    return '_';
  }

  var ignoredCollections = GLOBAL_VARIABLES['store'].shopify_store.ignored_collections;
  var fixedIgnoredCollections = ignoredCollections.map(convertCollectionToFixedCollection);

  var onlyValidCollectionsArr = allCollections.filter(function (item) {
    return fixedIgnoredCollections.indexOf(item) === -1;
  });

  var curFixedCollection = onlyValidCollectionsArr.length > 0 ? onlyValidCollectionsArr[0] : '#';
  var curCollection = onlyValidCollectionsArr.length > 0 ? convertFixedCollectionToCollection(onlyValidCollectionsArr[0]) : '#';

  return {
    curFixedCollection,
    curCollection
  };
}

function convertCollectionToFixedCollection(col) {
  var finalCol = col.toLowerCase();
  finalCol = finalCol.replace(' ', '_');
  return `#${finalCol}`;
}

function convertFixedCollectionToCollection(fixCol) {
  var finalCol = fixCol.toUpperCase();
  finalCol = finalCol.replace('_', ' ');
  finalCol = finalCol.replace('#', '');
  return finalCol;
}

function getProductsInfo(arr) {
  var allProducts = [];
  var page_type = getCurrentPageData().page_name;

  for (var x = 0; x < arr.length; x++) {
    var product_name = '';
    var product_id = '';
    var product_type = '';
    var product_price = '';
    var product_quantity = '';
    var product_collections = '';
    var product_collection = '';
    var product_fixed_collection = '';
    var product_tags = '';
    var product_brand = '';
    var product_default_variant = '';
    var product_default_variant_sku = '';
    var product_default_variant_merchant_id = '';
    var product_variant = '';
    var product_variant_sku = '';
    var product_variant_merchant_id = '';

    var product = arr[x];

    if (product['blog_id']) {
      continue;
    } // pula posts de blog na tela de pesquisa
    if (product['error']) {
      continue;
    } // pula paginas de politicas

    if (page_type === 'cart') {
      var curFilteredProduct = getProductDetailsFromName(product['product_title']);
      product_name = product['product_title'];
      product_id = product['product_id']; // curFilteredProduct.product_variant_merchant_id //
      product_type = product['product_type'];
      product_price = Number(product['price'] / 100);
      product_quantity = Number(product['quantity']);
      product_collections = curFilteredProduct.product_collections;
      product_collection = getCurCollection(product_collections).curCollection;
      product_fixed_collection = getCurCollection(product_collections).curFixedCollection;
      product_tags = curFilteredProduct.product_tags;
      product_brand = product['vendor'];
      product_default_variant = curFilteredProduct.product_default_variant;
      product_default_variant_sku = curFilteredProduct.product_default_variant_sku;
      product_variant = product['variant_title'];
      product_variant_sku = product['variant_id'];
    } else if (page_type === 'collection') {
      product_name = product['title'];
      product_id = product['id'];
      product_type = product['type'];
      product_price = Number(product['price'] / 100);
      product_quantity = 1;
      product_collections = product['tags'].filter((it) => it.search('#') > -1);
      product_collection = getCurCollection(product_collections).curCollection;
      product_fixed_collection = getCurCollection(product_collections).curFixedCollection;
      product_tags = product['tags'].filter((it) => it.search('#') === -1);
      product_brand = product['vendor'];
      product_default_variant = product['variants'][0].title;
      product_default_variant_sku = product['variants'][0].id;
      product_variant = product['variants'][0].title;
      product_variant_sku = product['variants'][0].id;
    } else if (page_type === 'search') {
      product_name = product['title'];
      product_id = product['id'];
      product_type = product['type'];
      product_price = Number(product['price'] / 100);
      product_quantity = 1;
      product_collections = product['tags'].filter((it) => it.search('#') > -1);
      product_collection = getCurCollection(product_collections).curCollection;
      product_fixed_collection = getCurCollection(product_collections).curFixedCollection;
      product_tags = product['tags'].filter((it) => it.search('#') === -1);
      product_brand = product['vendor'];
      product_default_variant = product['variants'][0].title;
      product_default_variant_sku = product['variants'][0].id;
      product_variant = product['variants'][0].title;
      product_variant_sku = product['variants'][0].id;
    } else if (page_type === 'product') {
      var inputEl = document.querySelector('input.qty');

      product_name = product['title'];
      product_id = product['id'];
      product_type = product['type'];
      product_price = Number(product['price'] / 100);
      product_quantity = inputEl ? Number(inputEl.value) : 0;
      product_collections = product['tags'].filter((it) => it.search('#') > -1);
      product_collection = getCurCollection(product_collections).curCollection;
      product_fixed_collection = getCurCollection(product_collections).curFixedCollection;
      product_tags = product['tags'].filter((it) => it.search('#') === -1);
      product_brand = product['vendor'];
      product_default_variant = product['variants'][0].title;
      product_default_variant_sku = product['variants'][0].id;
      product_variant = product['variants'][0].title; // muda quando o cara clicar em variants
      product_variant_sku = product['variants'][0].id; // muda quando o cara clicar em variants
    }

    product_default_variant_merchant_id = `shopify_BR_${product_id}_${product_default_variant_sku}`;
    product_variant_merchant_id = `shopify_BR_${product_id}_${product_variant_sku}`;

    var productObj = {
      product_name,
      product_price,
      product_quantity,
      product_type,
      product_collections,
      product_collection,
      product_fixed_collection,
      product_tags,
      product_brand,
      product_id,
      product_default_variant,
      product_default_variant_sku,
      product_default_variant_merchant_id,
      product_variant,
      product_variant_sku,
      product_variant_merchant_id
    };

    allProducts.push(productObj);
  }

  return allProducts;
}

function getCheckoutInfoObj() {
  var datalayerInfo = dataLayer.filter((Obj) => Obj.hasOwnProperty('customer_id'))[0]; //getDataLayerInfo()
  var checkout_token = datalayerInfo.token;

  var orderDetail = getOrderFromToken(checkout_token);

  var checkout_price_shipping = orderDetail.shipping_price ? orderDetail.shipping_price : 0; // getYampiShipping()
  var checkout_price_total = datalayerInfo.prices.total;
  var checkout_price_without_shipping = Number(checkout_price_total - checkout_price_shipping);

  var checkout_coupon = orderDetail.coupon ? orderDetail.coupon : ''; // document.querySelector('#promocode').value
  var checkout_affiliation = orderDetail.affiliation ? orderDetail.affiliation : '';

  var checkout_products = datalayerInfo.items.map(function (pdt, index) {
    var curFilteredProduct = getProductDetailsFromName(pdt.name);

    var product_name = pdt.name;
    var product_id = curFilteredProduct.product_id; //pdt.shopify_product_id
    var product_type = curFilteredProduct.product_type;
    var product_price = pdt.price_total;
    var product_quantity = pdt.quantity;
    var product_collections = curFilteredProduct.product_collections;
    var product_tags = curFilteredProduct.product_tags;
    var product_brand = curFilteredProduct.product_brand; // pdt.brand.name
    var product_default_variant = curFilteredProduct.product_default_variant;
    var product_default_variant_sku = curFilteredProduct.product_default_variant_sku;
    var product_default_variant_merchant_id = `shopify_BR_${product_id}_${product_default_variant_sku}`;
    var product_variant_sku = pdt.shopify_variant_id;
    var product_variant_merchant_id = `shopify_BR_${product_id}_${product_variant_sku}`;
    var product_variant = getProductVariantNameFromMerchantId(product_name, product_variant_merchant_id); // pdt.name_with_grids.replace(pdt.name + " ", '')

    return {
      product_name,
      product_id,
      product_type,
      product_price,
      product_quantity,
      product_collections,
      product_tags,
      product_brand,
      product_default_variant,
      product_default_variant_sku,
      product_default_variant_merchant_id,
      product_variant,
      product_variant_sku,
      product_variant_merchant_id
    };
  });

  var checkoutObj = {
    checkout_token,
    checkout_price_shipping,
    checkout_price_total,
    checkout_price_without_shipping,
    checkout_coupon,
    checkout_affiliation,
    checkout_products
  };

  return checkoutObj;
}

function setupAddPromotionEvent() {
  var elAddCouponButton = document.querySelector('#form-promocode > div > div > div > button');
  elAddCouponButton?.removeEventListener('click', trackClickOnPromotionInput);
  elAddCouponButton?.addEventListener('click', trackClickOnPromotionInput);
}

function trackClickOnPromotionInput(e) {
  console.log('CLICOU BOTAO!');

  setTimeout(function () {
    var curToken = getCheckoutInfoObj().checkout_token;
    var orderIndex = getOrderIndexFromToken(curToken);

    var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
    var curOrders = userOrders ? JSON.parse(userOrders) : [];

    var elItems = document.querySelectorAll('div.cart-resume > div.detail');

    var descountItemEl = Array.from(elItems).filter(function (item) {
      var description = item.querySelector('div.description').innerText.trim();
      return description.search('Descontos') > -1;
    });

    if (descountItemEl.length > 0) {
      var coupon = document.querySelector('input#promocode').value;
      var coupon_discount = descountItemEl[0].querySelector('div.value').innerText.trim();
      coupon_discount = coupon_discount.replace('- R$ ', 0);
      coupon_discount = coupon_discount.replace(',', '.');
      coupon_discount = Number(coupon_discount);
      var final_price = Number(GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].total_price + GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].shipping_price - coupon_discount);

      var newOrder = curOrders[orderIndex];
      newOrder.coupon = coupon;
      newOrder.coupon_discount = coupon_discount;
      newOrder.final_price = final_price;
      updateOrderFromToken(curToken, newOrder);

      GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].coupon = coupon;
      GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].coupon_discount = coupon_discount;
      GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].final_price = final_price;

      console.log(`promotion added: ${coupon}`);

      setTimeout(function () {
        console.log('track promotion again na humildade');
        setupAddPromotionEvent();
        // runPageAction()
      }, GLOBAL_VARIABLES['settings'].checkout_delay);

      // ---------------------------------------------------------------------

      var elDelCoupon = document.querySelector('a.delete-promocode');
      function trackDeletePromotion(e) {
        var curToken = getCheckoutInfoObj().checkout_token;
        var orderIndex = getOrderIndexFromToken(curToken);

        console.log(`promotion removed: ${GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].coupon}`);
        var final_price = Number(GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].total_price + GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].shipping_price);

        var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
        var curOrders = userOrders ? JSON.parse(userOrders) : [];
        var newOrder = curOrders[orderIndex];
        newOrder.coupon = '';
        newOrder.coupon_discount = 0;
        newOrder.final_price = final_price;
        updateOrderFromToken(curToken, newOrder);

        GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].coupon = '';
        GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].coupon_discount = 0;
        GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].final_price = final_price;

        setTimeout(function () {
          console.log('track promotion again');
          setupAddPromotionEvent();
        }, GLOBAL_VARIABLES['settings'].checkout_delay);
      }
      elDelCoupon?.removeEventListener('click', trackDeletePromotion);
      elDelCoupon?.addEventListener('click', trackDeletePromotion);
    }
  }, GLOBAL_VARIABLES['settings'].checkout_delay);
}

function updateOrderMaximumStep(curStep, curToken) {
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var curOrders = userOrders ? JSON.parse(userOrders) : [];
  var orderIndex = getOrderIndexFromToken(curToken);

  addMaximumFunnelStep(curStep);

  if (curOrders[orderIndex].maximum_step < curStep) {
    console.log(`Primeira vez na etapa ${curStep}`);
    var newOrder = curOrders[orderIndex];
    newOrder.maximum_step = curStep;
    updateOrderFromToken(curToken, newOrder);
    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].maximum_step = curStep;
    return true;
  } else {
    console.log(`Ja esteve na etapa ${curStep} anteriormente`);
    return false;
  }
}

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

function deleteCookie(name) {
  var cookieDomain = GLOBAL_VARIABLES['store'].shopify_store.store_url;
  document.cookie = name + '=; Max-Age=0; path=/; domain=' + cookieDomain;
}

function saveCookie(cookieName, cookieValue) {
  var cookieDomain = GLOBAL_VARIABLES['store'].shopify_store.store_url;

  var daysToExpire = GLOBAL_VARIABLES['settings'].cookies_expiration_days;
  var expirationTime = daysToExpire * (24 * 60 * 60);

  expirationTime = expirationTime * 1000;
  var date = new Date();
  var dateTimeNow = date.getTime();
  date.setTime(dateTimeNow + expirationTime);
  var date = date.toUTCString();

  document.cookie = cookieName + '=' + cookieValue + '; SameSite=None; Secure; expires=' + date + '; path=/; domain=.' + cookieDomain; // location.hostname.replace(/^www\./i, "")
}

function updateCookie(name, value) {
  deleteCookie(name);
  saveCookie(name, value);
}

function getCookie(name) {
  var cookies = document.cookie.split(';');
  var toReturn;

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(name + '=') === 0) {
      toReturn = cookie.substring((name + '=').length, cookie.length);
    }
  }

  return toReturn;
}

function getLVTCookies() {
  var pairs = document.cookie.split(';');
  var cookies = {};
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    cookies[(pair[0] + '').trim()] = unescape(pair.slice(1).join('='));
  }

  var LVTCookies = Object.keys(cookies).filter(function (coo) {
    return coo.search('__LVT') > -1;
  });

  return LVTCookies;
}

function deleteAllLVTCookies() {
  var LVTCookies = getLVTCookies();
  LVTCookies.forEach(function (coo) {
    deleteCookie(coo);
  });
}

function getDateInfo() {
  var dateObj = new Date();

  dateObj.setHours(dateObj.getHours() + 0);
  var currentDate = dateObj.toLocaleDateString('pt-BR');
  var currentHour = dateObj.getHours().toString().length == 1 ? '0' + dateObj.getHours() : dateObj.getHours();
  var currentMinute = dateObj.getMinutes().toString().length == 1 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
  var currentTime = currentHour + ':' + currentMinute;

  var dateObj = {};
  dateObj.currentDate = currentDate;
  dateObj.currentTime = currentTime;

  return dateObj;
}

function getDateTime() {
  return `${getDateInfo().currentDate} ${getDateInfo().currentTime}`;
}

function getMinDiff(date1, date2) {
  if (!date1 || !date2) {
    return undefined;
  }

  const [day1, month1, year1] = date1
    .toString()
    .split(' ')[0]
    .split('/')
    .map((item) => Number(item));
  const [hour1, minutes1] = date1
    .toString()
    .split(' ')[1]
    .split(':')
    .map((item) => Number(item));
  const datetime1 = new Date(year1, month1 - 1, day1, hour1, minutes1, 0, 0);

  const [day2, month2, year2] = date2
    .toString()
    .split(' ')[0]
    .split('/')
    .map((item) => Number(item));
  const [hour2, minutes2] = date2
    .toString()
    .split(' ')[1]
    .split(':')
    .map((item) => Number(item));
  const datetime2 = new Date(year2, month2 - 1, day2, hour2, minutes2, 0, 0);

  let minDiff = ((Number(datetime2) - Number(datetime1)) / 60 / 1000).toFixed(0);
  return Number(minDiff);
}

function getQueryParams() {
  var queryObj = {};

  var queryLength = window.location.search.length;

  if (queryLength > 0) {
    var queriesUrl = window.location.search.replace('?', '');
    var query_entries = queriesUrl.split('&');

    for (var x = 0; x < query_entries.length; x++) {
      var row = query_entries[x];
      var rowArr = row.split('=');
      if (rowArr.length === 2) {
        var key = rowArr[0];
        var value = decodeURI(rowArr[1]);
        queryObj[key] = decodeURI(value);
      }
    }
  }

  return queryObj;
}

function objectToQuery(objToConvert) {
  var totalQuery = '';
  var objKeys = Object.keys(objToConvert);
  var objValues = Object.values(objToConvert);

  for (var x = 0; x < objKeys.length; x++) {
    var curKey = objKeys[x];
    var curValue = objValues[x];
    var curRow = curKey + '=' + curValue;

    if (totalQuery === '') {
      totalQuery = curRow;
    } else {
      totalQuery = totalQuery + '&' + curRow;
    }
  }

  return totalQuery;
}

function shopifyProduct() {
  var isFirstVisitAtStep = addMaximumFunnelStep(1);
  var productObj = getProductsInfo([LVT_product])[0];
  var curProductUrl = window.location.pathname;
  var viewdProducts = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_PRODUCTS']);
  var viewedProductsArr = viewdProducts ? JSON.parse(viewdProducts) : [];
  var hasViewedProduct = viewedProductsArr.indexOf(curProductUrl) > -1;

  if (!hasViewedProduct) {
    saveProductDetailsInCookies(productObj);
    fireUAViewItem(productObj);
    fireGa4ViewItem(productObj);
    fireInstigareViewProduct(productObj);
    fireGadsViewItem(productObj);
    fireGadsDynamicRmkViewItem(productObj);
    fireFacebookViewContent(productObj);
    fireTikTokViewContent(productObj);
  } else {
    console.log('Produto ja foi adicionado aos cookies anteriormente');
  }

  console.log(`Product: ${productObj.product_name}`);
  console.log(productObj);
}

function saveProductDetailsInCookies(productObj) {
  var curProductUrl = window.location.pathname;
  var viewdProducts = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_PRODUCTS']);
  var viewedProductsArr = viewdProducts ? JSON.parse(viewdProducts) : [];

  var savedProduct = Object.assign(productObj, { product_url: curProductUrl, product_variants: [] });
  delete savedProduct.product_variant;
  delete savedProduct.product_variant_sku;
  delete savedProduct.product_variant_merchant_id;

  console.log(`Salvando primeira vista ao produto: ${curProductUrl}`);
  var finalArr = viewedProductsArr.concat([curProductUrl]);
  updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_PRODUCTS'], JSON.stringify(finalArr));
  GLOBAL_VARIABLES['user'].behavior.viewed_products = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_PRODUCTS']));

  var finalProductsDetailsArr = GLOBAL_VARIABLES['user'].behavior.products_details.concat([savedProduct]);
  updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_PRODUCTS_DETAILS'], JSON.stringify(finalProductsDetailsArr));
  GLOBAL_VARIABLES['user'].behavior.products_details = finalProductsDetailsArr;
}

function shopifyCart() {
  var cartObj = getCartObj();
  console.log('Carrinho');
  console.log(cartObj);

  var isFirstVisitAtStep = addMaximumFunnelStep(2);
  if (isFirstVisitAtStep) {
    fireUAAddToCart(cartObj);
    fireGA4AddToCart(cartObj);
    fireInstigareViewCart(cartObj);
    fireGadsViewCart(cartObj);
    fireGadsDynamicRmkAddToCart(cartObj);
    fireFacebookAddToCart(cartObj);
    fireTikTokAddToCart(cartObj);
  }

  updateDetailedProducts(cartObj.cart_products);
}

function getCartObj() {
  var urlParameters = getCookie(GLOBAL_COOKIES['SESSION_PARAMETERS']);
  var urlParametersObj = urlParameters ? JSON.parse(urlParameters) : {};

  var cart_products = getProductsInfo(LVT_cart.items);
  var cart_total_products = LVT_cart.items.length;
  var cart_total_price = Number(LVT_cart.total_price / 100);
  var cart_affiliation = urlParametersObj.affiliation ? urlParametersObj.affiliation : '';
  var cart_coupon = urlParametersObj.coupon ? urlParametersObj.coupon : '';

  var cartObj = {
    cart_products,
    cart_total_products,
    cart_total_price,
    cart_affiliation,
    cart_coupon
  };

  return cartObj;
}

function yampiCheckout() {
  var checkoutObj = getCheckoutInfoObj();
  var curToken = checkoutObj.checkout_token;

  var orderIndex = getOrderIndexFromToken(curToken);
  if (orderIndex === -1) {
    addCheckoutOrderToCookies(curToken);
    fireUABeginCheckout(checkoutObj);
    fireGA4BeginCheckout(checkoutObj);
    fireInstigareBeginCheckout(checkoutObj);
    fireGadsBeginCheckout(checkoutObj);
    fireFacebookInitiateCheckout(checkoutObj);
  }

  setupAddPromotionEvent();
  setupCheckoutInputs();
}

function addCheckoutOrderToCookies(curToken) {
  console.log('Pedido adicionado aos cookies');

  var urlParameters = getCookie(GLOBAL_COOKIES['SESSION_PARAMETERS']);
  var urlParametersObj = urlParameters ? JSON.parse(urlParameters) : {};

  var checkoutData = getCheckoutInfoObj();

  var curOrder = {
    maximum_step: 3,
    date_time: getDateTime(),
    name: '',
    email: '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
    city: '',
    state: '',
    utm_params: urlParametersObj,
    products: checkoutData.checkout_products,
    token: curToken,
    affiliation: urlParametersObj.affiliation || '',
    coupon: '',
    total_price: checkoutData.checkout_price_total,
    shipping_price: 0,
    coupon_discount: 0,
    final_price: checkoutData.checkout_price_total,
    shipping_method: '',
    payment_method: ''
  };

  updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS'], JSON.stringify([curOrder]));
  GLOBAL_VARIABLES['user'].behavior.orders.push(curOrder);
}

function setupCheckoutInputs() {
  console.log('setup checkout');

  var curToken = getCheckoutInfoObj().checkout_token;

  var elConfirmPersonalDataButton = document.querySelector('div.box-customer > div.box-content > form > div.form-group > button[type="submit"]');
  function goToAddressStep(e) {
    console.log('clicou butao, passou pra address 1');

    var elNameInput = document.querySelector('#name');
    var elEmailInput = document.querySelector('#email1');
    var elCpfInput = document.querySelector('#cpf');
    var elPhoneInput = document.querySelector('#homephone');

    var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
    var curOrders = userOrders ? JSON.parse(userOrders) : [];
    var orderIndex = getOrderIndexFromToken(curToken);
    var newOrder = curOrders[orderIndex];
    newOrder.name = elNameInput.value;
    newOrder.email = elEmailInput.value;
    newOrder.cpf = elCpfInput.value;
    newOrder.phone = elPhoneInput.value;
    updateOrderFromToken(curToken, newOrder);

    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].name = elNameInput.value;
    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].email = elEmailInput.value;
    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].cpf = elCpfInput.value;
    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].phone = elPhoneInput.value;

    setTimeout(function () {
      runPageAction();
    }, GLOBAL_VARIABLES['settings'].checkout_delay);
  }
  elConfirmPersonalDataButton?.removeEventListener('click', goToAddressStep);
  elConfirmPersonalDataButton?.addEventListener('click', goToAddressStep);
}

function yampiAddress() {
  var checkoutObj = getCheckoutInfoObj();
  var curToken = checkoutObj.checkout_token;
  var isFirstVisitAtStep = updateOrderMaximumStep(4, curToken);

  if (isFirstVisitAtStep) {
    fireUACheckoutStep2(checkoutObj);
    fireGA4AddShippingInfo(checkoutObj);
    fireInstigareAddShippingInfo(checkoutObj);
    fireGadsAddAddressInfo(checkoutObj);
  }

  var addressStep = document.querySelector('div.box-address.selected');

  if (!addressStep) {
    setupAddressInputsStepe1();
  } else {
    setupAddressInputsStepe2();
  }
}

function setupAddressInputsStepe1() {
  setupAddPromotionEvent();
  console.log('setup address step 1');

  var curToken = getCheckoutInfoObj().checkout_token;

  var elCep = document.querySelector('div.box-addresses > div.box-content > form > div > div > div > #zipcode');
  function trackUserCep(e) {
    var cep = e.target.value;

    var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
    var curOrders = userOrders ? JSON.parse(userOrders) : [];
    var orderIndex = getOrderIndexFromToken(curToken);
    var newOrder = curOrders[orderIndex];
    newOrder.cep = cep;
    updateOrderFromToken(curToken, newOrder);
    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].cep = cep;
  }
  elCep?.removeEventListener('input', trackUserCep);
  elCep?.addEventListener('input', trackUserCep);

  var elUserData = document.querySelector('div.content > div.container > div.container-promocode > div.holder-cols-checkout > ul.steps-checkout > li.checkout-step > a');
  function goBackToCheckout(e) {
    console.log('clicou butao, voltou para checkout');
    setTimeout(function () {
      setupCheckoutInputs();
    }, GLOBAL_VARIABLES['settings'].checkout_delay);
  }
  elUserData?.removeEventListener('click', goBackToCheckout);
  elUserData?.addEventListener('click', goBackToCheckout);

  var elConfirmAddressButton = document.querySelector('div.box-addresses > div.box-content > form#form-checkout-shipment > div > div > button');
  function goToPaymentStep(e) {
    var address = document.querySelector('#street').value;
    var addressNumber = document.querySelector('#number').value;
    var district = document.querySelector('#neighborhood').value;
    var cityName = document.querySelector('span.city-name').innerText;
    var state = document.querySelector('span.city-uf').innerText;

    var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
    var curOrders = userOrders ? JSON.parse(userOrders) : [];
    var orderIndex = getOrderIndexFromToken(curToken);
    var newOrder = curOrders[orderIndex];
    var completeAddress = `${address}, ${addressNumber}`; // ${district},

    newOrder.address = completeAddress;
    newOrder.city = cityName;
    newOrder.state = state;
    updateOrderFromToken(curToken, newOrder);

    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].address = completeAddress;
    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].city = cityName;
    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].state = state;

    console.log('clicou butao, passou pra address 2');
    setTimeout(function () {
      setupAddressInputsStepe2();
    }, GLOBAL_VARIABLES['settings'].checkout_delay);
  }
  elConfirmAddressButton?.removeEventListener('click', goToPaymentStep);
  elConfirmAddressButton?.addEventListener('click', goToPaymentStep);
}

function setupAddressInputsStepe2(dontSetInitialShippiment) {
  setupAddPromotionEvent();
  console.log('setup address step 2');

  if (!dontSetInitialShippiment) {
    updateShippingMethodByIndex();
  }

  var shippingOptions = document.querySelectorAll('div.shipment-options > label');
  function selectShippingOption(e) {
    setTimeout(function () {
      setupAddressInputsStepe2(true);
      updateShippingMethodByIndex();
    }, GLOBAL_VARIABLES['settings'].checkout_delay);
  }
  for (var x = 0; x < shippingOptions.length; x++) {
    shippingOptions[x].removeEventListener('click', selectShippingOption);
    shippingOptions[x].addEventListener('click', selectShippingOption);
  }

  var elConfirmShippingButton = document.querySelector('div.box-addresses > div.box-content > div.container-addresses > div > button');
  function goToPaymentOption(e) {
    setTimeout(function () {
      console.log('clicou butao, passando pra payment');
      runPageAction();
    }, GLOBAL_VARIABLES['settings'].checkout_delay);
  }
  elConfirmShippingButton.removeEventListener('click', goToPaymentOption);
  elConfirmShippingButton.addEventListener('click', goToPaymentOption);
}

function updateShippingMethodByIndex() {
  var curToken = getCheckoutInfoObj().checkout_token;
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var curOrders = userOrders ? JSON.parse(userOrders) : [];
  var orderIndex = getOrderIndexFromToken(curToken);

  var selectedShipping = document.querySelector('div.shipment-options > label.selected');
  var shippingName = selectedShipping.querySelector('div > div > span').innerText;
  var shippingPrice = selectedShipping.querySelector('div > div.price').innerText;

  shippingPrice = shippingPrice.replace('R$ ', '');
  shippingPrice = shippingPrice.replace(',', '.');
  shippingPrice = shippingPrice.search('Gr') > -1 ? 0 : shippingPrice;
  shippingPrice = Number(shippingPrice);

  var _totalPrice = GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].total_price;
  var _shippingPrice = shippingPrice;
  var _couponPrice = GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].coupon_discount;
  var finalPrice = Number(_totalPrice + _shippingPrice - _couponPrice);

  var newOrder = curOrders[orderIndex];
  newOrder.shipping_price = shippingPrice;
  newOrder.shipping_method = shippingName;
  newOrder.final_price = finalPrice;

  updateOrderFromToken(curToken, newOrder);
  GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].shipping_price = shippingPrice;
  GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].shipping_method = shippingName;
  GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].final_price = finalPrice;
}

function yampiPayment() {
  var checkoutObj = getCheckoutInfoObj();
  var curToken = checkoutObj.checkout_token;
  var isFirstVisitAtStep = updateOrderMaximumStep(5, curToken);

  if (isFirstVisitAtStep) {
    fireUACheckoutStep2(checkoutObj);
    fireGA4AddPaymentInfo(checkoutObj);
    fireInstigareAddPaymentInfo(checkoutObj);
    fireGadsAddPaymentInfo(checkoutObj);
    fireFacebookAddPaymentInfo(checkoutObj);
    fireTikTokAddPaymentInfo(checkoutObj);
  }

  setupAddPromotionEvent();
  setupPaymentInputs();
  setupGoBackToOtherSteps();
}

function setupPaymentInputs(dontSetInitialShippiment) {
  console.log('setup payment');
  if (!dontSetInitialShippiment) {
    updatePaymentMethod();
  }

  var allPaymentContainers = document.querySelectorAll('div.payments > div.payment > label');
  function setupOtherPaymentMethods() {
    setTimeout(function () {
      console.log('clicou em outra opcao de pagamento');
      updatePaymentMethod();
      // setupPaymentInputs(true)
    }, GLOBAL_VARIABLES['settings'].checkout_delay);
  }
  for (var x = 0; x < allPaymentContainers.length; x++) {
    allPaymentContainers[x].removeEventListener('click', setupOtherPaymentMethods);
    allPaymentContainers[x].addEventListener('click', setupOtherPaymentMethods);
  }
}

function setupGoBackToOtherSteps() {
  var elOtherSteps = document.querySelectorAll('div.container > div.container-promocode > div.holder-cols-checkout > ul.steps-checkout > li.checkout-step > a');
  function goBackToPersonalData() {
    setTimeout(function () {
      console.log('CLICOU a[0] checkou');
      setupCheckoutInputs();
    }, GLOBAL_VARIABLES['settings'].checkout_delay);
  }
  elOtherSteps[0].removeEventListener('click', goBackToPersonalData);
  elOtherSteps[0].addEventListener('click', goBackToPersonalData);

  function goBackToAddressData() {
    setTimeout(function () {
      console.log('CLICOU a[1] address');
      setupAddressInputsStepe2(true);
    }, GLOBAL_VARIABLES['settings'].checkout_delay);
  }
  elOtherSteps[1].removeEventListener('click', goBackToAddressData);
  elOtherSteps[1].addEventListener('click', goBackToAddressData);
}

function updatePaymentMethod() {
  var paymentSelectedEl = document.querySelector('div.payments > div.payment.selected > label');
  if (!paymentSelectedEl) {
    console.log('Erro ao encontrar jeito de pagamento');
    return;
  }

  var paymentMethod = paymentSelectedEl.getAttribute('for');
  paymentMethod = paymentMethod.replace('payment-credit-card', 'cartao de credito');
  paymentMethod = paymentMethod.replace('payment-pix', 'pix');
  paymentMethod = paymentMethod.replace('payment-billet', 'boleto');

  var curToken = getCheckoutInfoObj().checkout_token;
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var curOrders = userOrders ? JSON.parse(userOrders) : [];
  var orderIndex = getOrderIndexFromToken(curToken);

  var newOrder = curOrders[orderIndex];
  newOrder.payment_method = paymentMethod;
  updateOrderFromToken(curToken, newOrder);

  GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].payment_method = paymentMethod;
}

function yampiPurchase() {
  var purchaseObj = getPurchaseObj();
  var curToken = purchaseObj.purchase_token; // getDataLayerInfo().order.token
  var isFirstVisitAtStep = updateOrderMaximumStep(6, curToken);

  setEnhancedConversionFieldsForGAds(purchaseObj);
  fireGadsPurchase(purchaseObj);
  fireGadsDynamicRmkPurchase(purchaseObj);

  fireUAPurchase(purchaseObj);
  fireGA4Purchase(purchaseObj);
  fireFacebookPurchase(purchaseObj);
  fireInstigarePurchase(purchaseObj);

  console.log(purchaseObj);
}

function getPurchaseObj() {
  var dataLayerData = dataLayer.filter((Obj) => Obj.hasOwnProperty('order'))[0].order; //getDataLayerInfo()
  var purchase_token = dataLayerData.token;
  var orderInfoFromToken = getOrderFromToken(purchase_token);

  var purchase_customer_name = orderInfoFromToken.name; //dataLayerData.customer.full_name
  var purchase_customer_email = orderInfoFromToken.email; // dataLayerData.customer.email
  var purchase_customer_cpf = orderInfoFromToken.cpf; // dataLayerData.customer.document
  var purchase_customer_cep = orderInfoFromToken.cep;
  var purchase_customer_phone = orderInfoFromToken.phone;
  var purchase_customer_address = orderInfoFromToken.address;
  var purchase_customer_city = orderInfoFromToken.city;
  var purchase_customer_state = orderInfoFromToken.state;
  var purchase_customer_country = 'BR';

  var purchase_payment_method = orderInfoFromToken.payment_method; // dataLayerData.payment_method
  var purchase_payment_status = dataLayerData.status;

  var purchase_price_total = Number(dataLayerData.total.toFixed(2));
  var purchase_price_without_shipping = Number(dataLayerData.total_without_shipping.toFixed(2));
  var purchase_price_shipping = Number((purchase_price_total - purchase_price_without_shipping).toFixed(2));

  var purchase_coupon = orderInfoFromToken.coupon;
  var purchase_coupon_discount = orderInfoFromToken.coupon_discount;
  var purchase_affiliation = orderInfoFromToken.affiliation;

  var purchase_products = dataLayerData.items.map(function (prod, ind) {
    var detailedProductObj = getDetailedProductFromName(prod.name);

    var product_name = prod.name;
    var product_price = prod.product.price;
    var product_quantity = prod.quantity;
    var product_type = detailedProductObj.product_type;
    var product_collections = detailedProductObj.product_collections; // prod.product.categories
    var product_collection = getCurCollection(product_collections).curCollection;
    var product_fixed_collection = getCurCollection(product_collections).curFixedCollection;
    var product_tags = detailedProductObj.product_tags;
    var product_brand = detailedProductObj.product_brand; // prod.product.brand
    var product_id = detailedProductObj.product_id; // dataLayerData.optionsIds[ind]
    var product_default_variant = detailedProductObj.product_default_variant;
    var product_default_variant_sku = detailedProductObj.product_default_variant_sku;
    var product_default_variant_merchant_id = `shopify_BR_${product_id}_${product_default_variant_sku}`;
    var product_variant = detailedProductObj.product_default_variant;
    var product_variant_sku = detailedProductObj.product_default_variant_sku; // prod.product.id
    var product_variant_merchant_id = `shopify_BR_${product_id}_${product_variant_sku}`;

    return {
      product_name,
      product_price,
      product_quantity,
      product_type,
      product_collections,
      product_collection,
      product_fixed_collection,
      product_tags,
      product_brand,
      product_id,
      product_default_variant,
      product_default_variant_sku,
      product_default_variant_merchant_id,
      product_variant,
      product_variant_sku,
      product_variant_merchant_id
    };
  });

  var purchaseObj = {
    purchase_customer_name,
    purchase_customer_email,
    purchase_customer_cpf,
    purchase_customer_cep,
    purchase_customer_phone,
    purchase_customer_address,
    purchase_customer_city,
    purchase_customer_state,
    purchase_customer_country,
    purchase_payment_method,
    purchase_payment_status,
    purchase_token,
    purchase_price_shipping,
    purchase_price_total,
    purchase_price_without_shipping,
    purchase_coupon,
    purchase_coupon_discount,
    purchase_affiliation,
    purchase_products
  };

  return purchaseObj;
}

function shopifyArticle() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);

  var curArticleUrl = window.location.pathname;
  var viewdArticles = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_ARTICLES']);
  var viewedArticlesArr = viewdArticles ? JSON.parse(viewdArticles) : [];
  var hasViewedArticle = viewedArticlesArr.indexOf(curArticleUrl) > -1;
  if (!hasViewedArticle) {
    console.log(`Salvando primeira vista a artigo: ${curArticleUrl}`);
    var finalArr = viewedArticlesArr.concat([curArticleUrl]);
    updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_ARTICLES'], JSON.stringify(finalArr));
    GLOBAL_VARIABLES['user'].behavior.viewed_articles = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_ARTICLES']));
  }

  var articleObj = getArticleObj();
  console.log(`Article: ${articleObj.title}`);
  console.log(articleObj);
}

function getArticleObj() {
  var LVT_article_title = document.querySelector('div > h3').innerText;

  return {
    title: LVT_article_title
  };
}

function shopifyBlog() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);
  console.log('Blog');
}

function shopifyCollection() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);

  var collectionObj = getCollectionObj();
  console.log(`Colecao: ${collectionObj.collection_name}`);
  console.log(collectionObj);

  var curCollectionUrl = window.location.pathname;
  var viewdCollections = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_COLLECTIONS']);
  var viewedCollectionsArr = viewdCollections ? JSON.parse(viewdCollections) : [];
  var hasViewedCollection = viewedCollectionsArr.indexOf(curCollectionUrl) > -1;
  if (!hasViewedCollection) {
    console.log(`Salvando primeira vista a colecao: ${curCollectionUrl}`);
    var finalArr = viewedCollectionsArr.concat([curCollectionUrl]);
    updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_COLLECTIONS'], JSON.stringify(finalArr));
    GLOBAL_VARIABLES['user'].behavior.viewed_collections = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_COLLECTIONS']));

    fireUAViewItemList(collectionObj);
    fireGA4ViewItemList(collectionObj);
    fireGadsDynamicRmkViewItemList(collectionObj);
  }
}

function getCollectionObj() {
  var collection_name = document.querySelector('div > div > h3').innerText;
  var collection_fixed_name = collection_name.replace(new RegExp(' ', 'g'), '_');
  var collection_products = getProductsInfo(LVT_collection);

  var collection = {
    collection_name,
    collection_fixed_name,
    collection_products
  };

  return collection;
}

function shopifyCollections() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);
  console.log('Calecoes');
}

function shopifyContact() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);
  console.log('Contact');

  fireFacebookContact();
  fireTikTokContact();
}

function shopifyHome() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);
  console.log('Home');
}

function shopifyProducts() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);
  console.log('Products');
}

function shopifySearch() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);

  var search_obj = getSearchObj();

  var curSearchTerm = search_obj.search_term;
  var searchsMade = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_SEARCHS_MADE']);
  var searchsMadeArr = searchsMade ? JSON.parse(searchsMade) : [];
  var hasViewedArticle = searchsMadeArr.indexOf(curSearchTerm) > -1;
  if (!hasViewedArticle) {
    console.log(`Salvando primeira pesquisa: ${curSearchTerm}`);
    var finalArr = searchsMadeArr.concat([curSearchTerm]);
    updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_SEARCHS_MADE'], JSON.stringify(finalArr));
    GLOBAL_VARIABLES['user'].behavior.searchs_made = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_SEARCHS_MADE']));

    fireGA4Search(search_obj);
    fireFacebookSearch(search_obj);
    fireTikTokSearch(search_obj);
  }

  console.log('search');
  console.log(search_obj);
}

function getSearchObj() {
  var search_term = document.querySelector('#Search').value;

  var searchObj = {
    search_products: getProductsInfo(LVT_search),
    search_term
  };

  return searchObj;
}

function shopifyTracking() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);
  console.log('Tracking');
}

function addClarityPixelFunction() {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.clarity.fire_events) {
    return;
  }
  if (!GLOBAL_VARIABLES['store'].pixel_settings.clarity.pixels) {
    return;
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.clarity.pixels.length === 0) {
    return;
  }

  var clarityPixel = GLOBAL_VARIABLES['store'].pixel_settings.clarity.pixels[0];

  var clarityContent = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityPixel}");
  `;
  var clarityScript = document.createElement('script');
  clarityScript.setAttribute('type', 'text/javascript');
  clarityScript.innerHTML = clarityContent;
  document.head.appendChild(clarityScript);
}

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

var GLOBAL_EVENTS = {
  PAGE_VIEW: 'LVT_pageview',
  VIEW_PRODUCT: 'LVT_product',
  ADD_TO_CART: 'LVT_add_to_cart',
  VIEW_CART: 'LVT_view_cart',
  VIEW_CHECKOUT: 'LVT_checkout',
  ADD_ADDRESS_INFO: 'LVT_address',
  ADD_PAYMENT_INFO: 'LVT_payment',
  PURCHASE: 'LVT_purchase',

  FIRST_VISIT: 'LVT_first_visitor',
  RETURNING_VISIT: 'LVT_returning_visitor',

  SEARCH: 'LVT_search',
  ARTICLE: 'LVT_article',
  BLOG: 'LVT_blog',
  HOME: 'LVT_home',
  TRACKING: 'LVT_tracking',
  COLLECTION: 'LVT_collection',
  ALL_COLLECTIONS: 'LVT_all_collections',
  ALL_PRODUCTS: 'LVT_all_products'
};

function addGooglePixelFunction() {
  var allScripts = document.querySelectorAll('script'); // head >
  var hasGtag = false;
  for (var x = 0; x < allScripts.length; x++) {
    var src = allScripts[x].getAttribute('src');
    if (!src) {
      continue;
    }

    var isGtag = src.search('https://www.googletagmanager.com/gtag/js') > -1;
    if (isGtag) {
      console.log(`gtag encontrado ${src}`);
      hasGtag = true;
      break;
    }
  }

  var googlePixelsArr = [];
  if (GLOBAL_VARIABLES['store'].pixel_settings.google_a4.fire_events) {
    googlePixelsArr.push(GLOBAL_VARIABLES['store'].pixel_settings.google_a4.pixels);
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.google_ua.fire_events) {
    googlePixelsArr.push(GLOBAL_VARIABLES['store'].pixel_settings.google_ua.pixels);
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.google_ads.fire_events) {
    googlePixelsArr.push(
      GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels.map(function (px) {
        return px.pixel;
      })
    );
  }

  if (!hasGtag && googlePixelsArr.length > 0) {
    var pixelToGtag = googlePixelsArr[0][0];

    var googleScript = document.createElement('script');
    googleScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${pixelToGtag}`);
    googleScript.setAttribute('type', 'text/javascript');
    googleScript.setAttribute('async', '');
    document.head.appendChild(googleScript);

    var commomPixelConfig = {
      transport_type: 'beacon'
      // 'send_page_view': false
    };

    var allConfigTags = '';

    if (GLOBAL_VARIABLES['store'].pixel_settings.google_ua.fire_events) {
      for (var x = 0; x < GLOBAL_VARIABLES['store'].pixel_settings.google_ua.pixels.length; x++) {
        var curPixel = GLOBAL_VARIABLES['store'].pixel_settings.google_ua.pixels[x];
        if (isGooglePixelAlreadySet(curPixel)) {
          continue;
        }
        GLOBAL_VARIABLES['session'].active_pixels.push(`GUA_${curPixel}`);
        allConfigTags = allConfigTags + '\n' + `gtag('config', '${curPixel}', ${JSON.stringify(commomPixelConfig)})`;
      }
    }

    if (GLOBAL_VARIABLES['store'].pixel_settings.google_a4.fire_events) {
      for (var x = 0; x < GLOBAL_VARIABLES['store'].pixel_settings.google_a4.pixels.length; x++) {
        var curPixel = GLOBAL_VARIABLES['store'].pixel_settings.google_a4.pixels[x];
        if (isGooglePixelAlreadySet(curPixel)) {
          continue;
        }
        GLOBAL_VARIABLES['session'].active_pixels.push(`GA4_${curPixel}`);
        allConfigTags = allConfigTags + '\n' + `gtag('config', '${curPixel}', ${JSON.stringify(commomPixelConfig)})`;
      }
    }

    if (GLOBAL_VARIABLES['store'].pixel_settings.google_ads.fire_events) {
      commomPixelConfig = Object.assign(commomPixelConfig, { allow_enhanced_conversions: true });

      for (var x = 0; x < GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels.length; x++) {
        var curPixel = GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels[x].pixel;
        if (isGooglePixelAlreadySet(curPixel)) {
          continue;
        }
        GLOBAL_VARIABLES['session'].active_pixels.push(`GADS_${curPixel}`);
        allConfigTags = allConfigTags + '\n' + `gtag('config', '${curPixel}', ${JSON.stringify(commomPixelConfig)})`;
      }
    }

    var gtagContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      ${allConfigTags}
    `;

    var gtagScript = document.createElement('script');
    gtagScript.setAttribute('type', 'text/javascript');
    gtagScript.innerHTML = gtagContent;
    document.head.appendChild(gtagScript);
  }
}

function isGooglePixelAlreadySet(pixelName) {
  if (!window.dataLayer) {
    return false;
  }

  for (var x = 0; x < window.dataLayer.length; x++) {
    var curItem = window.dataLayer[x];
    if (curItem) {
      if (curItem[1] === pixelName) {
        return true;
      }
    }
  }
}

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

function sendDataToApi(method, queryObj) {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.lvt.fire_events) {
    return;
  }

  var SPREAD_ID = GLOBAL_VARIABLES['store'].pixel_settings.lvt.settings.spreadsheet_id;
  var STORE_SHEET_NAME = GLOBAL_VARIABLES['store'].pixel_settings.lvt.settings.store_sheet_name;
  var API_URL = GLOBAL_VARIABLES['store'].pixel_settings.lvt.settings.api_url;

  var commomLink = API_URL + '?' + `spread_id=${SPREAD_ID}` + '&' + `sheet_name=${STORE_SHEET_NAME}`;
  var queryUrl = objectToQuery(queryObj);
  var finalUrl = commomLink + '&' + `method=${method}` + '&' + queryUrl;

  fireInstigareEventInBeacon(finalUrl);
  saveFiredEventInCookies(`LVT_${method}`);
}

function fireInstigareEventInBeacon(url) {
  navigator.sendBeacon(url);
}

function fireInstigareEventInFetch(url) {
  console.log(url);

  fetch(url)
    .then(function (response) {
      var jsonData = response.json();
      return jsonData;
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function fireInstigareFirstVisit() {
  if (GLOBAL_VARIABLES['store'].pixel_settings.clarity.fire_events && !GLOBAL_VARIABLES['user'].data.clarity_id) {
    console.log('Clarity ID nao definido, mandando FIRST VISIT DEPOIS');
    setTimeout(fireInstigareFirstVisit, 300);
    return;
  }

  console.log('LVT FIRST VISIT');

  var dateInfo = getDateInfo();
  var firstAccessObj = {};

  var siteQuery = window.location.search;
  siteQuery = siteQuery.replace(/\?/g, '');
  siteQuery = siteQuery.replace(/=/g, '__');
  siteQuery = siteQuery.replace(/&/g, '___');

  firstAccessObj['date'] = dateInfo.currentDate;
  firstAccessObj['time'] = dateInfo.currentTime;
  firstAccessObj['token'] = GLOBAL_VARIABLES['user'].data.token;

  firstAccessObj['clarity_id'] = GLOBAL_VARIABLES['user'].data.clarity_id;
  firstAccessObj['ip_address'] = GLOBAL_VARIABLES['user'].data.ip;
  firstAccessObj['ip_location'] = GLOBAL_VARIABLES['user'].data.location;
  firstAccessObj['device'] = GLOBAL_VARIABLES['user'].data.device;

  var location = GLOBAL_VARIABLES['user'].data.location;
  var locationArr = location.split(', ');
  var state = locationArr.length === 3 ? locationArr[1] : '-';
  var city = locationArr.length === 3 ? locationArr[0] : '-';
  var country = locationArr.length === 3 ? locationArr[2] : location === 'Brazil' ? 'Brazil' : '-';

  firstAccessObj['state'] = state;
  firstAccessObj['city'] = city;
  firstAccessObj['country'] = country;

  var dateArr = dateInfo.currentDate.split('/');
  var year = Number(dateArr[2]);
  var month = Number(dateArr[1]);
  var day = Number(dateArr[0]);
  var dateObject = new Date(year, month - 1, day, 0, 0, 0, 0);
  var weekDayArr = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  var weekDay = weekDayArr[dateObject.getDay()];

  firstAccessObj['month'] = month;
  firstAccessObj['week_day'] = weekDay;
  firstAccessObj['day'] = day;

  var timeArr = dateInfo.currentTime.split(':');
  var hour = Number(timeArr[0]);
  firstAccessObj['hour'] = hour;

  // ---------------------------------------------------------------------------

  firstAccessObj['referrer'] = document.referrer || '-';
  firstAccessObj['url'] = window.location.pathname;
  firstAccessObj['path'] = siteQuery || '-';

  firstAccessObj['utm_source'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_source || '-');
  firstAccessObj['utm_medium'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_medium || '-');
  firstAccessObj['utm_campaign'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_campaign || '-');
  firstAccessObj['utm_content'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_content || '-');
  firstAccessObj['utm_term'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_term || '-');

  firstAccessObj['utm_id'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_id || '-');
  firstAccessObj['utm_ad'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_ad || '-');
  firstAccessObj['utm_placement'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_placement || '-');
  firstAccessObj['utm_prodid'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_prodid || '-');
  firstAccessObj['utm_affiliation'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_affiliation || '-');
  firstAccessObj['utm_coupon'] = decodeURI(GLOBAL_VARIABLES['session'].url_parameters.utm_coupon || '-');

  firstAccessObj['initial_date'] = dateInfo.currentDate;
  firstAccessObj['initial_time'] = dateInfo.currentTime;
  firstAccessObj['initial_page'] = GLOBAL_VARIABLES['session'].current_page.page_name;
  firstAccessObj['maximum_step'] = GLOBAL_VARIABLES['session'].current_page.page_name;

  console.log(firstAccessObj);

  sendDataToApi('initial_access', firstAccessObj);
}

function fireInstigareViewProduct(productObj) {
  console.log('LVT VIEW PRODUCT EVENT');
}

function fireInstigareViewCart(cartObj) {
  console.log('LVT VIEW CART EVENT');
}

function fireInstigareBeginCheckout(checkoutObj) {
  console.log('LVT BEGIN CHECKOUT EVENT');

  var dateInfo = getDateInfo();
  var beginCheckoutObj = {};

  beginCheckoutObj['date'] = dateInfo.currentDate;
  beginCheckoutObj['time'] = dateInfo.currentTime;
  beginCheckoutObj['token'] = GLOBAL_VARIABLES['user'].data.token;

  beginCheckoutObj['maximum_step'] = GLOBAL_VARIABLES['session'].current_page.page_name;

  beginCheckoutObj['shopify_token'] = checkoutObj.checkout_token;
  beginCheckoutObj['product'] = checkoutObj.checkout_products[0].product_name;
  beginCheckoutObj['price'] = checkoutObj.checkout_price_total;

  sendDataToApi('initiate_checkout', beginCheckoutObj);
}

function fireInstigareAddShippingInfo(checkoutObj) {
  var dateInfo = getDateInfo();
  var orderInfo = getOrderFromToken(checkoutObj.checkout_token);
  var addressObj = {};

  addressObj['date'] = dateInfo.currentDate;
  addressObj['time'] = dateInfo.currentTime;
  addressObj['token'] = GLOBAL_VARIABLES['user'].data.token;

  addressObj['maximum_step'] = GLOBAL_VARIABLES['session'].current_page.page_name;

  addressObj['email'] = orderInfo.email;
  addressObj['name'] = orderInfo.name;
  addressObj['cpf'] = orderInfo.cpf;
  addressObj['phone'] = orderInfo.phone;

  sendDataToApi('add_address_info', addressObj);
}

function fireInstigareAddPaymentInfo(checkoutObj) {
  var dateInfo = getDateInfo();
  var orderInfo = getOrderFromToken(checkoutObj.checkout_token);
  var paymentObj = {};

  paymentObj['date'] = dateInfo.currentDate;
  paymentObj['time'] = dateInfo.currentTime;
  paymentObj['token'] = GLOBAL_VARIABLES['user'].data.token;

  paymentObj['maximum_step'] = GLOBAL_VARIABLES['session'].current_page.page_name;

  paymentObj['cep'] = orderInfo.cep;
  paymentObj['shipping_method'] = orderInfo.shipping_method;

  sendDataToApi('add_payment_info', paymentObj);
}

function fireInstigarePurchase(purchaseObj) {
  var dateInfo = getDateInfo();
  var newPurchaseObj = {};

  newPurchaseObj['date'] = dateInfo.currentDate;
  newPurchaseObj['time'] = dateInfo.currentTime;
  newPurchaseObj['token'] = GLOBAL_VARIABLES['user'].data.token;

  newPurchaseObj['maximum_step'] = GLOBAL_VARIABLES['session'].current_page.page_name;
  newPurchaseObj['payment_method'] = purchaseObj.purchase_payment_method;

  sendDataToApi('purchase', newPurchaseObj);
}

window.onbeforeunload = function () {
  // modifica valor ao fechar, atualizar, alterar pagina
  console.log('Atualizando dados de ultimo acesso!');
  updateCookie(GLOBAL_COOKIES['USER_ACCESS_LAST_ACCESS'], getDateTime());
};

document.addEventListener('visibilitychange', function (e) {
  var oldTitle = GLOBAL_VARIABLES['session'].current_page.page_title;

  if (oldTitle === undefined) {
    return;
  }

  if (document.visibilityState !== 'visible') {
    document.title = 'Ei, volta!';
  } else {
    document.title = oldTitle;
  }
});

function runTrackerWhenReady(_curStoreObj) {
  try {
    GLOBAL_VARIABLES['store'] = _curStoreObj;

    if (window.location.hostname.search(GLOBAL_VARIABLES['store'].shopify_store.store_url) === -1) {
      console.log('Nao esta no dominio da loja');
      return;
    } else {
      console.log(GLOBAL_VARIABLES);
    }

    if (!GLOBAL_VARIABLES['settings'].set_pixels_only_after_delay) {
      addPixelsToPage();
    }

    var isCartPage = window.location.pathname.search('cart') > -1;
    var skipCart = GLOBAL_VARIABLES['store'].shopify_store.skip_cart;

    if (isCartPage && skipCart) {
      initTracker();
    } else {
      console.log(`LVT FUNNEL - iniciando em ${GLOBAL_VARIABLES['settings'].initial_delay / 1000}s`);
      setTimeout(initTracker, GLOBAL_VARIABLES['settings'].initial_delay);
    }
  } catch (e) {
    console.log(`ERRO NO IM TRACKER: ${e.message}`);
  }
}

function initTracker() {
  var hasLocationDataSaved = getCookie(GLOBAL_COOKIES['USER_DATA_IP']) !== undefined;
  console.log('LVT FUNNEL - iniciado');

  if (hasLocationDataSaved) {
    console.log('Ja tem dados de cookies salvos');
    if (GLOBAL_VARIABLES['settings'].set_pixels_only_after_delay) {
      addPixelsToPage();
    }
    getDataFromCookies();
    returningVisitorActions();
    runPageAction();
  } else {
    console.log('Nao tem dados de cookies salvos');

    runWhenGetUserIp(function (ipData) {
      console.log(`Dados de localizacao obtidos: ${ipData.country}`);

      updateCookie(GLOBAL_COOKIES['USER_DATA_IP'], ipData.ip);
      updateCookie(GLOBAL_COOKIES['USER_DATA_LOCATION'], ipData.location);
      updateCookie(GLOBAL_COOKIES['USER_DATA_COUNTRY'], ipData.country);

      var isBrazil = ipData.country === 'BR';

      if (GLOBAL_VARIABLES['settings'].run_tracker_only_for_brazilians && !isBrazil) {
        console.log('Resto do funil desativado pois nao e do Brasil');
      } else {
        if (GLOBAL_VARIABLES['settings'].set_pixels_only_after_delay) {
          addPixelsToPage();
        }
        saveInitialInfoCookies();
        getDataFromCookies();
        newVisitorActions();
        runPageAction();
      }
    });
  }
}

function addPixelsToPage() {
  addFbPixelFunction();
  addTiktokPixelFunction();
  addGooglePixelFunction();
  addClarityPixelFunction();
}

function saveInitialInfoCookies() {
  updateCookie(GLOBAL_COOKIES['USER_DATA_TOKEN'], generateToken());
  updateCookie(GLOBAL_COOKIES['USER_DATA_DEVICE'], detectDevice());

  updateCookie(GLOBAL_COOKIES['USER_ACCESS_INITIAL_ACCESS'], getDateTime());
  updateCookie(GLOBAL_COOKIES['USER_ACCESS_LAST_ACCESS'], getDateTime());

  var urlParamsObj = getQueryParams();

  if (Object.keys(urlParamsObj).length > 0) {
    updateCookie(GLOBAL_COOKIES['SESSION_PARAMETERS'], JSON.stringify(urlParamsObj));
    console.log('Salvando parametros de url');
    console.log(urlParamsObj);
  } else {
    console.log('Nao ha parametros de url para serem salvos');
  }
}

function getDataFromCookies() {
  updateAnalyticsDataIdsWhenTheyGotSet();

  var userToken = getCookie(GLOBAL_COOKIES['USER_DATA_TOKEN']);
  var userDevice = getCookie(GLOBAL_COOKIES['USER_DATA_DEVICE']);
  var ip = getCookie(GLOBAL_COOKIES['USER_DATA_IP']);
  var location = getCookie(GLOBAL_COOKIES['USER_DATA_LOCATION']);
  var country = getCookie(GLOBAL_COOKIES['USER_DATA_COUNTRY']);

  GLOBAL_VARIABLES['user'].data.token = userToken;
  GLOBAL_VARIABLES['user'].data.device = userDevice;
  GLOBAL_VARIABLES['user'].data.ip = ip;
  GLOBAL_VARIABLES['user'].data.location = location;
  GLOBAL_VARIABLES['user'].data.country = country;

  var initialAccessedTime = getCookie(GLOBAL_COOKIES['USER_ACCESS_INITIAL_ACCESS']);
  var lastAccessedTime = getCookie(GLOBAL_COOKIES['USER_ACCESS_LAST_ACCESS']) || initialAccessedTime;
  var currentAccessedTime = getDateTime();

  GLOBAL_VARIABLES['user'].access.is_first_vist = checkIfisNewUser();
  GLOBAL_VARIABLES['user'].access.current_access_time = currentAccessedTime;
  GLOBAL_VARIABLES['user'].access.initial_access_time = initialAccessedTime;
  GLOBAL_VARIABLES['user'].access.last_access_time = lastAccessedTime;
  GLOBAL_VARIABLES['user'].access.minutes_since_last_access = getMinDiff(lastAccessedTime, currentAccessedTime);

  var maximumStep = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_MAXIMUM_STEP']);
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var productsDetailsArr = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_PRODUCTS_DETAILS']);
  var searchsMade = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_SEARCHS_MADE']);
  var viewdArticles = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_ARTICLES']);
  var viewdColections = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_COLLECTIONS']);
  var viewdProducts = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_PRODUCTS']);
  var visitedPagesArr = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VISITED_PAGES']);

  GLOBAL_VARIABLES['user'].behavior.maximum_step = maximumStep ? Number(maximumStep) : maximumStep;
  GLOBAL_VARIABLES['user'].behavior.orders = userOrders ? JSON.parse(userOrders) : [];
  GLOBAL_VARIABLES['user'].behavior.products_details = productsDetailsArr ? JSON.parse(productsDetailsArr) : [];
  GLOBAL_VARIABLES['user'].behavior.searchs_made = searchsMade ? JSON.parse(searchsMade) : [];
  GLOBAL_VARIABLES['user'].behavior.viewed_articles = viewdArticles ? JSON.parse(viewdArticles) : [];
  GLOBAL_VARIABLES['user'].behavior.viewed_collections = viewdColections ? JSON.parse(viewdColections) : [];
  GLOBAL_VARIABLES['user'].behavior.viewed_products = viewdProducts ? JSON.parse(viewdProducts) : [];
  GLOBAL_VARIABLES['user'].behavior.visited_pages = visitedPagesArr ? JSON.parse(visitedPagesArr) : [];

  var curPageData = getCurrentPageData();
  var urlParameters = getCookie(GLOBAL_COOKIES['SESSION_PARAMETERS']);
  var firedEventsArr = getCookie(GLOBAL_COOKIES['SESSION_FIRED_EVENTS']);

  GLOBAL_VARIABLES['session'].current_page.page_name = curPageData['page_name'];
  GLOBAL_VARIABLES['session'].current_page.page_function = curPageData['page_function'];
  GLOBAL_VARIABLES['session'].current_page.page_host = curPageData['page_host'];
  GLOBAL_VARIABLES['session'].url_parameters = urlParameters ? JSON.parse(urlParameters) : {};
  GLOBAL_VARIABLES['session'].fired_events = firedEventsArr ? JSON.parse(firedEventsArr) : [];
}

function updateAnalyticsDataIdsWhenTheyGotSet() {
  function getGaCookie() {
    var gaId = getCookie('_ga');

    if (gaId) {
      // console.log(`gaId was set: ${gaId}`)
      GLOBAL_VARIABLES['user'].data.ga_id = gaId;
    } else {
      setTimeout(getGaCookie, 300);
    }
  }

  function getFbCookie() {
    var fbId = getCookie('_fbp');

    if (fbId) {
      // console.log(`fbId was set: ${fbId}`)
      GLOBAL_VARIABLES['user'].data.fb_id = fbId;
    } else {
      setTimeout(getFbCookie, 300);
    }
  }

  function getClarityCookie() {
    var clarityId = getCookie('_clck');

    if (clarityId) {
      console.log(`clarityId was set: ${clarityId.split('|')[0]}`);
      GLOBAL_VARIABLES['user'].data.clarity_id = clarityId.split('|')[0];
    } else {
      setTimeout(getClarityCookie, 300);
    }
  }

  if (GLOBAL_VARIABLES['store'].pixel_settings.google_ua.fire_events || GLOBAL_VARIABLES['store'].pixel_settings.google_a4.fire_events) {
    getGaCookie();
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.facebook.fire_events) {
    getFbCookie();
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.clarity.fire_events) {
    getClarityCookie();
  }
}

function runPageAction() {
  var curPageData = getCurrentPageData();
  GLOBAL_VARIABLES['session'].current_page.page_name = curPageData['page_name'];
  GLOBAL_VARIABLES['session'].current_page.page_function = curPageData['page_function'];
  GLOBAL_VARIABLES['session'].current_page.page_host = curPageData['page_host'];
  GLOBAL_VARIABLES['session'].current_page.page_title = document.title;

  var hasVisitedPage = hasUserVisitedPage(curPageData['page_name']);
  console.log('\n\n');
  console.log('-------------------------------');
  console.log(`${curPageData['page_host']}: ${curPageData['page_name']} | ${hasVisitedPage}`);

  saveVisitedPages();

  if (curPageData['page_host'] === 'shopify') {
    GLOBAL_VARIABLES['session'].current_page.page_function();
  } else if (curPageData['page_host'] === 'yampi') {
    GLOBAL_VARIABLES['session'].current_page.page_function();
  }
}

function newVisitorActions() {
  console.log('Primeira visita do usuario');
  // var googleEvent = { event: GLOBAL_EVENTS['FIRST_VISIT'] }
  // fireGoogleEvent(eventName, eventObject)
  // fireFacebookEvent(GLOBAL_EVENTS['FIRST_VISIT'], {})
  fireInstigareFirstVisit();
}

function returningVisitorActions() {
  console.log(`Usuario retornou ao site apos [${GLOBAL_VARIABLES['user'].access.minutes_since_last_access} min]`);
  // var googleEvent = { event: GLOBAL_EVENTS['RETURNING_VISIT'] }
  // fireGoogleEvent(googleEvent)
  // fireFacebookEvent(GLOBAL_EVENTS['RETURNING_VISIT'], {})
  // updateCookie(GLOBAL_COOKIES['USER_ACCESS_LAST_ACCESS'], getDateTime())
}
