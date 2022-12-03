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
