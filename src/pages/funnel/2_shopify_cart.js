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
