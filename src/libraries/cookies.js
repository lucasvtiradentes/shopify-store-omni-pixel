function deleteCookie(name) {
  var cookieDomain = GLOBAL_VARIABLES['store'].shopify_store.store_url;
  document.cookie = name + '=; Max-Age=0; path=/; domain=' + cookieDomain;
}

function saveCookie(cookieName, cookieValue) {
  var cookieDomain = GLOBAL_VARIABLES['store'].shopify_store.store_url;

  var daysToExpire = GLOBAL_VARIABLES['settings'].cookies_expiration_days;
  var expirationTime = daysToExpire * (24 * 60 * 60);

  expirationTime = expirationTime * 1000;
  var date = new Date();
  var dateTimeNow = date.getTime();
  date.setTime(dateTimeNow + expirationTime);
  var date = date.toUTCString();

  document.cookie = cookieName + '=' + cookieValue + '; SameSite=None; Secure; expires=' + date + '; path=/; domain=.' + cookieDomain; // location.hostname.replace(/^www\./i, "")
}

function updateCookie(name, value) {
  deleteCookie(name);
  saveCookie(name, value);
}

function getCookie(name) {
  var cookies = document.cookie.split(';');
  var toReturn;

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(name + '=') === 0) {
      toReturn = cookie.substring((name + '=').length, cookie.length);
    }
  }

  return toReturn;
}

function getLVTCookies() {
  var pairs = document.cookie.split(';');
  var cookies = {};
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    cookies[(pair[0] + '').trim()] = unescape(pair.slice(1).join('='));
  }

  var LVTCookies = Object.keys(cookies).filter(function (coo) {
    return coo.search('__LVT') > -1;
  });

  return LVTCookies;
}

function deleteAllLVTCookies() {
  var LVTCookies = getLVTCookies();
  LVTCookies.forEach(function (coo) {
    deleteCookie(coo);
  });
}
