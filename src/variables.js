window.GLOBAL_VARIABLES = {
  settings: {
    set_pixels_only_after_delay: true,
    run_tracker_only_for_brazilians: true,
    checkout_delay: 1500,
    initial_delay: 0,
    cookies_expiration_days: 60,
    session_duration_minutes: 15,
    version: '1.5',
    currency: 'BRL',
    cookies_prefix: '__LVT_'
  },
  store: {},
  session: {
    current_page: {},
    active_pixels: [],
    fired_events: {},
    url_parameters: {}
  },
  user: {
    access: {},
    behavior: {},
    data: {}
  }
};

var GLOBAL_COOKIES = {
  SESSION_PARAMETERS: 'session_parameters',
  SESSION_FIRED_EVENTS: 'session_fired_events',

  USER_ACCESS_INITIAL_ACCESS: 'access_initial_access_time',
  USER_ACCESS_LAST_ACCESS: 'access_last_access_time',

  USER_BEHAVIOR_VISITED_PAGES: 'behavior_visited',
  USER_BEHAVIOR_VIEWED_PRODUCTS: 'behavior_viewed_products',
  USER_BEHAVIOR_VIEWED_COLLECTIONS: 'behavior_viewed_collections',
  USER_BEHAVIOR_VIEWED_ARTICLES: 'behavior_viewed_articles',
  USER_BEHAVIOR_SEARCHS_MADE: 'behavior_searchs_made',
  USER_BEHAVIOR_MAXIMUM_STEP: 'behavior_maximum_step',
  USER_BEHAVIOR_PRODUCTS_DETAILS: 'behavior_products_details',
  USER_BEHAVIOR_ORDERS: 'behavior_orders',

  USER_DATA_DEVICE: 'data_device',
  USER_DATA_TOKEN: 'data_token',
  USER_DATA_IP: 'data_ip',
  USER_DATA_LOCATION: 'data_location',
  USER_DATA_COUNTRY: 'data_country'
};

for (const [key, value] of Object.entries(GLOBAL_COOKIES)) {
  GLOBAL_COOKIES[key] = `${GLOBAL_VARIABLES['settings'].cookies_prefix}${value}`;
}
