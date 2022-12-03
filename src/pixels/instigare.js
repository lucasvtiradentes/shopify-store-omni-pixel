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
