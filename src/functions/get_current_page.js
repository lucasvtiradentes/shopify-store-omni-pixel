function getCurrentPageData() {
  var hostname = window.location.hostname;
  var pathname = window.location.pathname;

  var currentPage = '';
  var currentPageFunction = '';
  var currentHost = '';

  if (pathname === '/') {
    currentPage = 'home';
    currentPageFunction = shopifyHome;
    currentHost = 'shopify';
  } else if (pathname.search('products') > -1) {
    currentPage = 'product';
    currentPageFunction = shopifyProduct;
    currentHost = 'shopify';
  } else if (pathname.search('cart') > -1) {
    currentPage = 'cart';
    currentPageFunction = shopifyCart;
    currentHost = 'shopify';
  } else if (pathname.search('/collections/all') > -1) {
    currentPage = 'all_products';
    currentPageFunction = shopifyProducts;
    currentHost = 'shopify';
  } else if (pathname.search('/collections/') > -1) {
    currentPage = 'collection';
    currentPageFunction = shopifyCollection;
    currentHost = 'shopify';
  } else if (pathname.search('/collections') > -1) {
    currentPage = 'all_collections';
    currentPageFunction = shopifyCollections;
    currentHost = 'shopify';
  } else if (pathname.search('/search') > -1) {
    currentPage = 'search';
    currentPageFunction = shopifySearch;
    currentHost = 'shopify';
  } else if (pathname.search(`${GLOBAL_VARIABLES['store'].shopify_store.blog_url}/`) > -1) {
    currentPage = 'article';
    currentPageFunction = shopifyArticle;
    currentHost = 'shopify';
  } else if (pathname.search(GLOBAL_VARIABLES['store'].shopify_store.blog_url) > -1) {
    currentPage = 'blog';
    currentPageFunction = shopifyBlog;
    currentHost = 'shopify';
  } else if (pathname.search(GLOBAL_VARIABLES['store'].shopify_store.tracking_url) > -1) {
    currentPage = 'tracking';
    currentPageFunction = shopifyTracking;
    currentHost = 'shopify';
  } else if (pathname.search(GLOBAL_VARIABLES['store'].shopify_store.contact_url) > -1) {
    currentPage = 'contact';
    currentPageFunction = shopifyContact;
    currentHost = 'shopify';
  } else if (pathname.search('/finalization') > -1) {
    currentPage = 'purchase';
    currentPageFunction = yampiPurchase;
    currentHost = 'yampi';
  } else if (pathname.search('/payment') > -1) {
    currentPage = 'payment';
    currentPageFunction = yampiPayment;
    currentHost = 'yampi';
  } else if (pathname.search('/address') > -1) {
    currentPage = 'address';
    currentPageFunction = yampiAddress;
    currentHost = 'yampi';
  } else if (hostname === GLOBAL_VARIABLES['store'].shopify_store.checkout_url) {
    currentPage = 'checkout';
    currentPageFunction = yampiCheckout;
    currentHost = 'yampi';
  } else {
    currentPage = 'other';
    currentPageFunction = function () {
      console.log('Outra pagina');
    };
    currentHost = 'outra';
  }

  return {
    page_name: currentPage,
    page_host: currentHost,
    page_function: currentPageFunction
  };
}
