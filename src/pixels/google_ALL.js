var GLOBAL_EVENTS = {
  PAGE_VIEW: 'LVT_pageview',
  VIEW_PRODUCT: 'LVT_product',
  ADD_TO_CART: 'LVT_add_to_cart',
  VIEW_CART: 'LVT_view_cart',
  VIEW_CHECKOUT: 'LVT_checkout',
  ADD_ADDRESS_INFO: 'LVT_address',
  ADD_PAYMENT_INFO: 'LVT_payment',
  PURCHASE: 'LVT_purchase',

  FIRST_VISIT: 'LVT_first_visitor',
  RETURNING_VISIT: 'LVT_returning_visitor',

  SEARCH: 'LVT_search',
  ARTICLE: 'LVT_article',
  BLOG: 'LVT_blog',
  HOME: 'LVT_home',
  TRACKING: 'LVT_tracking',
  COLLECTION: 'LVT_collection',
  ALL_COLLECTIONS: 'LVT_all_collections',
  ALL_PRODUCTS: 'LVT_all_products'
};

function addGooglePixelFunction() {
  var allScripts = document.querySelectorAll('script'); // head >
  var hasGtag = false;
  for (var x = 0; x < allScripts.length; x++) {
    var src = allScripts[x].getAttribute('src');
    if (!src) {
      continue;
    }

    var isGtag = src.search('https://www.googletagmanager.com/gtag/js') > -1;
    if (isGtag) {
      console.log(`gtag encontrado ${src}`);
      hasGtag = true;
      break;
    }
  }

  var googlePixelsArr = [];
  if (GLOBAL_VARIABLES['store'].pixel_settings.google_a4.fire_events) {
    googlePixelsArr.push(GLOBAL_VARIABLES['store'].pixel_settings.google_a4.pixels);
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.google_ua.fire_events) {
    googlePixelsArr.push(GLOBAL_VARIABLES['store'].pixel_settings.google_ua.pixels);
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.google_ads.fire_events) {
    googlePixelsArr.push(
      GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels.map(function (px) {
        return px.pixel;
      })
    );
  }

  if (!hasGtag && googlePixelsArr.length > 0) {
    var pixelToGtag = googlePixelsArr[0][0];

    var googleScript = document.createElement('script');
    googleScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${pixelToGtag}`);
    googleScript.setAttribute('type', 'text/javascript');
    googleScript.setAttribute('async', '');
    document.head.appendChild(googleScript);

    var commomPixelConfig = {
      transport_type: 'beacon'
      // 'send_page_view': false
    };

    var allConfigTags = '';

    if (GLOBAL_VARIABLES['store'].pixel_settings.google_ua.fire_events) {
      for (var x = 0; x < GLOBAL_VARIABLES['store'].pixel_settings.google_ua.pixels.length; x++) {
        var curPixel = GLOBAL_VARIABLES['store'].pixel_settings.google_ua.pixels[x];
        if (isGooglePixelAlreadySet(curPixel)) {
          continue;
        }
        GLOBAL_VARIABLES['session'].active_pixels.push(`GUA_${curPixel}`);
        allConfigTags = allConfigTags + '\n' + `gtag('config', '${curPixel}', ${JSON.stringify(commomPixelConfig)})`;
      }
    }

    if (GLOBAL_VARIABLES['store'].pixel_settings.google_a4.fire_events) {
      for (var x = 0; x < GLOBAL_VARIABLES['store'].pixel_settings.google_a4.pixels.length; x++) {
        var curPixel = GLOBAL_VARIABLES['store'].pixel_settings.google_a4.pixels[x];
        if (isGooglePixelAlreadySet(curPixel)) {
          continue;
        }
        GLOBAL_VARIABLES['session'].active_pixels.push(`GA4_${curPixel}`);
        allConfigTags = allConfigTags + '\n' + `gtag('config', '${curPixel}', ${JSON.stringify(commomPixelConfig)})`;
      }
    }

    if (GLOBAL_VARIABLES['store'].pixel_settings.google_ads.fire_events) {
      commomPixelConfig = Object.assign(commomPixelConfig, { allow_enhanced_conversions: true });

      for (var x = 0; x < GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels.length; x++) {
        var curPixel = GLOBAL_VARIABLES['store'].pixel_settings.google_ads.pixels[x].pixel;
        if (isGooglePixelAlreadySet(curPixel)) {
          continue;
        }
        GLOBAL_VARIABLES['session'].active_pixels.push(`GADS_${curPixel}`);
        allConfigTags = allConfigTags + '\n' + `gtag('config', '${curPixel}', ${JSON.stringify(commomPixelConfig)})`;
      }
    }

    var gtagContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      ${allConfigTags}
    `;

    var gtagScript = document.createElement('script');
    gtagScript.setAttribute('type', 'text/javascript');
    gtagScript.innerHTML = gtagContent;
    document.head.appendChild(gtagScript);
  }
}

function isGooglePixelAlreadySet(pixelName) {
  if (!window.dataLayer) {
    return false;
  }

  for (var x = 0; x < window.dataLayer.length; x++) {
    var curItem = window.dataLayer[x];
    if (curItem) {
      if (curItem[1] === pixelName) {
        return true;
      }
    }
  }
}
