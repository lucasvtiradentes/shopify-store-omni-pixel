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
