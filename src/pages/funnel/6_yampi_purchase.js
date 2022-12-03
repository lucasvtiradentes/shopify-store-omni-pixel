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
