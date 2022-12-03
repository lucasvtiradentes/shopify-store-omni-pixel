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
