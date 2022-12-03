function shopifyArticle() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);

  var curArticleUrl = window.location.pathname;
  var viewdArticles = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_ARTICLES']);
  var viewedArticlesArr = viewdArticles ? JSON.parse(viewdArticles) : [];
  var hasViewedArticle = viewedArticlesArr.indexOf(curArticleUrl) > -1;
  if (!hasViewedArticle) {
    console.log(`Salvando primeira vista a artigo: ${curArticleUrl}`);
    var finalArr = viewedArticlesArr.concat([curArticleUrl]);
    updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_ARTICLES'], JSON.stringify(finalArr));
    GLOBAL_VARIABLES['user'].behavior.viewed_articles = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_ARTICLES']));
  }

  var articleObj = getArticleObj();
  console.log(`Article: ${articleObj.title}`);
  console.log(articleObj);
}

function getArticleObj() {
  var LVT_article_title = document.querySelector('div > h3').innerText;

  return {
    title: LVT_article_title
  };
}
