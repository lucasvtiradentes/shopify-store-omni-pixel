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
