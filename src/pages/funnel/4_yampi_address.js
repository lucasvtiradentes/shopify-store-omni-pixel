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
