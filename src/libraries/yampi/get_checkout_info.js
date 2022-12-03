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
