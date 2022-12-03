function shopifySearch() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);

  var search_obj = getSearchObj();

  var curSearchTerm = search_obj.search_term;
  var searchsMade = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_SEARCHS_MADE']);
  var searchsMadeArr = searchsMade ? JSON.parse(searchsMade) : [];
  var hasViewedArticle = searchsMadeArr.indexOf(curSearchTerm) > -1;
  if (!hasViewedArticle) {
    console.log(`Salvando primeira pesquisa: ${curSearchTerm}`);
    var finalArr = searchsMadeArr.concat([curSearchTerm]);
    updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_SEARCHS_MADE'], JSON.stringify(finalArr));
    GLOBAL_VARIABLES['user'].behavior.searchs_made = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_SEARCHS_MADE']));

    fireGA4Search(search_obj);
    fireFacebookSearch(search_obj);
    fireTikTokSearch(search_obj);
  }

  console.log('search');
  console.log(search_obj);
}

function getSearchObj() {
  var search_term = document.querySelector('#Search').value;

  var searchObj = {
    search_products: getProductsInfo(LVT_search),
    search_term
  };

  return searchObj;
}
