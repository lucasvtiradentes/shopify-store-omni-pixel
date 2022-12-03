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
