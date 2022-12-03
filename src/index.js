function runTrackerWhenReady(_curStoreObj) {
  try {
    GLOBAL_VARIABLES['store'] = _curStoreObj;

    if (window.location.hostname.search(GLOBAL_VARIABLES['store'].shopify_store.store_url) === -1) {
      console.log('Nao esta no dominio da loja');
      return;
    } else {
      console.log(GLOBAL_VARIABLES);
    }

    if (!GLOBAL_VARIABLES['settings'].set_pixels_only_after_delay) {
      addPixelsToPage();
    }

    var isCartPage = window.location.pathname.search('cart') > -1;
    var skipCart = GLOBAL_VARIABLES['store'].shopify_store.skip_cart;

    if (isCartPage && skipCart) {
      initTracker();
    } else {
      console.log(`LVT FUNNEL - iniciando em ${GLOBAL_VARIABLES['settings'].initial_delay / 1000}s`);
      setTimeout(initTracker, GLOBAL_VARIABLES['settings'].initial_delay);
    }
  } catch (e) {
    console.log(`ERRO NO IM TRACKER: ${e.message}`);
  }
}

function initTracker() {
  var hasLocationDataSaved = getCookie(GLOBAL_COOKIES['USER_DATA_IP']) !== undefined;
  console.log('LVT FUNNEL - iniciado');

  if (hasLocationDataSaved) {
    console.log('Ja tem dados de cookies salvos');
    if (GLOBAL_VARIABLES['settings'].set_pixels_only_after_delay) {
      addPixelsToPage();
    }
    getDataFromCookies();
    returningVisitorActions();
    runPageAction();
  } else {
    console.log('Nao tem dados de cookies salvos');

    runWhenGetUserIp(function (ipData) {
      console.log(`Dados de localizacao obtidos: ${ipData.country}`);

      updateCookie(GLOBAL_COOKIES['USER_DATA_IP'], ipData.ip);
      updateCookie(GLOBAL_COOKIES['USER_DATA_LOCATION'], ipData.location);
      updateCookie(GLOBAL_COOKIES['USER_DATA_COUNTRY'], ipData.country);

      var isBrazil = ipData.country === 'BR';

      if (GLOBAL_VARIABLES['settings'].run_tracker_only_for_brazilians && !isBrazil) {
        console.log('Resto do funil desativado pois nao e do Brasil');
      } else {
        if (GLOBAL_VARIABLES['settings'].set_pixels_only_after_delay) {
          addPixelsToPage();
        }
        saveInitialInfoCookies();
        getDataFromCookies();
        newVisitorActions();
        runPageAction();
      }
    });
  }
}

function addPixelsToPage() {
  addFbPixelFunction();
  addTiktokPixelFunction();
  addGooglePixelFunction();
  addClarityPixelFunction();
}

function saveInitialInfoCookies() {
  updateCookie(GLOBAL_COOKIES['USER_DATA_TOKEN'], generateToken());
  updateCookie(GLOBAL_COOKIES['USER_DATA_DEVICE'], detectDevice());

  updateCookie(GLOBAL_COOKIES['USER_ACCESS_INITIAL_ACCESS'], getDateTime());
  updateCookie(GLOBAL_COOKIES['USER_ACCESS_LAST_ACCESS'], getDateTime());

  var urlParamsObj = getQueryParams();

  if (Object.keys(urlParamsObj).length > 0) {
    updateCookie(GLOBAL_COOKIES['SESSION_PARAMETERS'], JSON.stringify(urlParamsObj));
    console.log('Salvando parametros de url');
    console.log(urlParamsObj);
  } else {
    console.log('Nao ha parametros de url para serem salvos');
  }
}

function getDataFromCookies() {
  updateAnalyticsDataIdsWhenTheyGotSet();

  var userToken = getCookie(GLOBAL_COOKIES['USER_DATA_TOKEN']);
  var userDevice = getCookie(GLOBAL_COOKIES['USER_DATA_DEVICE']);
  var ip = getCookie(GLOBAL_COOKIES['USER_DATA_IP']);
  var location = getCookie(GLOBAL_COOKIES['USER_DATA_LOCATION']);
  var country = getCookie(GLOBAL_COOKIES['USER_DATA_COUNTRY']);

  GLOBAL_VARIABLES['user'].data.token = userToken;
  GLOBAL_VARIABLES['user'].data.device = userDevice;
  GLOBAL_VARIABLES['user'].data.ip = ip;
  GLOBAL_VARIABLES['user'].data.location = location;
  GLOBAL_VARIABLES['user'].data.country = country;

  var initialAccessedTime = getCookie(GLOBAL_COOKIES['USER_ACCESS_INITIAL_ACCESS']);
  var lastAccessedTime = getCookie(GLOBAL_COOKIES['USER_ACCESS_LAST_ACCESS']) || initialAccessedTime;
  var currentAccessedTime = getDateTime();

  GLOBAL_VARIABLES['user'].access.is_first_vist = checkIfisNewUser();
  GLOBAL_VARIABLES['user'].access.current_access_time = currentAccessedTime;
  GLOBAL_VARIABLES['user'].access.initial_access_time = initialAccessedTime;
  GLOBAL_VARIABLES['user'].access.last_access_time = lastAccessedTime;
  GLOBAL_VARIABLES['user'].access.minutes_since_last_access = getMinDiff(lastAccessedTime, currentAccessedTime);

  var maximumStep = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_MAXIMUM_STEP']);
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var productsDetailsArr = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_PRODUCTS_DETAILS']);
  var searchsMade = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_SEARCHS_MADE']);
  var viewdArticles = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_ARTICLES']);
  var viewdColections = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_COLLECTIONS']);
  var viewdProducts = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_PRODUCTS']);
  var visitedPagesArr = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VISITED_PAGES']);

  GLOBAL_VARIABLES['user'].behavior.maximum_step = maximumStep ? Number(maximumStep) : maximumStep;
  GLOBAL_VARIABLES['user'].behavior.orders = userOrders ? JSON.parse(userOrders) : [];
  GLOBAL_VARIABLES['user'].behavior.products_details = productsDetailsArr ? JSON.parse(productsDetailsArr) : [];
  GLOBAL_VARIABLES['user'].behavior.searchs_made = searchsMade ? JSON.parse(searchsMade) : [];
  GLOBAL_VARIABLES['user'].behavior.viewed_articles = viewdArticles ? JSON.parse(viewdArticles) : [];
  GLOBAL_VARIABLES['user'].behavior.viewed_collections = viewdColections ? JSON.parse(viewdColections) : [];
  GLOBAL_VARIABLES['user'].behavior.viewed_products = viewdProducts ? JSON.parse(viewdProducts) : [];
  GLOBAL_VARIABLES['user'].behavior.visited_pages = visitedPagesArr ? JSON.parse(visitedPagesArr) : [];

  var curPageData = getCurrentPageData();
  var urlParameters = getCookie(GLOBAL_COOKIES['SESSION_PARAMETERS']);
  var firedEventsArr = getCookie(GLOBAL_COOKIES['SESSION_FIRED_EVENTS']);

  GLOBAL_VARIABLES['session'].current_page.page_name = curPageData['page_name'];
  GLOBAL_VARIABLES['session'].current_page.page_function = curPageData['page_function'];
  GLOBAL_VARIABLES['session'].current_page.page_host = curPageData['page_host'];
  GLOBAL_VARIABLES['session'].url_parameters = urlParameters ? JSON.parse(urlParameters) : {};
  GLOBAL_VARIABLES['session'].fired_events = firedEventsArr ? JSON.parse(firedEventsArr) : [];
}

function updateAnalyticsDataIdsWhenTheyGotSet() {
  function getGaCookie() {
    var gaId = getCookie('_ga');

    if (gaId) {
      // console.log(`gaId was set: ${gaId}`)
      GLOBAL_VARIABLES['user'].data.ga_id = gaId;
    } else {
      setTimeout(getGaCookie, 300);
    }
  }

  function getFbCookie() {
    var fbId = getCookie('_fbp');

    if (fbId) {
      // console.log(`fbId was set: ${fbId}`)
      GLOBAL_VARIABLES['user'].data.fb_id = fbId;
    } else {
      setTimeout(getFbCookie, 300);
    }
  }

  function getClarityCookie() {
    var clarityId = getCookie('_clck');

    if (clarityId) {
      console.log(`clarityId was set: ${clarityId.split('|')[0]}`);
      GLOBAL_VARIABLES['user'].data.clarity_id = clarityId.split('|')[0];
    } else {
      setTimeout(getClarityCookie, 300);
    }
  }

  if (GLOBAL_VARIABLES['store'].pixel_settings.google_ua.fire_events || GLOBAL_VARIABLES['store'].pixel_settings.google_a4.fire_events) {
    getGaCookie();
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.facebook.fire_events) {
    getFbCookie();
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.clarity.fire_events) {
    getClarityCookie();
  }
}

function runPageAction() {
  var curPageData = getCurrentPageData();
  GLOBAL_VARIABLES['session'].current_page.page_name = curPageData['page_name'];
  GLOBAL_VARIABLES['session'].current_page.page_function = curPageData['page_function'];
  GLOBAL_VARIABLES['session'].current_page.page_host = curPageData['page_host'];
  GLOBAL_VARIABLES['session'].current_page.page_title = document.title;

  var hasVisitedPage = hasUserVisitedPage(curPageData['page_name']);
  console.log('\n\n');
  console.log('-------------------------------');
  console.log(`${curPageData['page_host']}: ${curPageData['page_name']} | ${hasVisitedPage}`);

  saveVisitedPages();

  if (curPageData['page_host'] === 'shopify') {
    GLOBAL_VARIABLES['session'].current_page.page_function();
  } else if (curPageData['page_host'] === 'yampi') {
    GLOBAL_VARIABLES['session'].current_page.page_function();
  }
}

function newVisitorActions() {
  console.log('Primeira visita do usuario');
  // var googleEvent = { event: GLOBAL_EVENTS['FIRST_VISIT'] }
  // fireGoogleEvent(eventName, eventObject)
  // fireFacebookEvent(GLOBAL_EVENTS['FIRST_VISIT'], {})
  fireInstigareFirstVisit();
}

function returningVisitorActions() {
  console.log(`Usuario retornou ao site apos [${GLOBAL_VARIABLES['user'].access.minutes_since_last_access} min]`);
  // var googleEvent = { event: GLOBAL_EVENTS['RETURNING_VISIT'] }
  // fireGoogleEvent(googleEvent)
  // fireFacebookEvent(GLOBAL_EVENTS['RETURNING_VISIT'], {})
  // updateCookie(GLOBAL_COOKIES['USER_ACCESS_LAST_ACCESS'], getDateTime())
}
