function shopifyCollection() {
  var isFirstVisitAtStep = addMaximumFunnelStep(0);

  var collectionObj = getCollectionObj();
  console.log(`Colecao: ${collectionObj.collection_name}`);
  console.log(collectionObj);

  var curCollectionUrl = window.location.pathname;
  var viewdCollections = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_COLLECTIONS']);
  var viewedCollectionsArr = viewdCollections ? JSON.parse(viewdCollections) : [];
  var hasViewedCollection = viewedCollectionsArr.indexOf(curCollectionUrl) > -1;
  if (!hasViewedCollection) {
    console.log(`Salvando primeira vista a colecao: ${curCollectionUrl}`);
    var finalArr = viewedCollectionsArr.concat([curCollectionUrl]);
    updateCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_COLLECTIONS'], JSON.stringify(finalArr));
    GLOBAL_VARIABLES['user'].behavior.viewed_collections = JSON.parse(getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_VIEWED_COLLECTIONS']));

    fireUAViewItemList(collectionObj);
    fireGA4ViewItemList(collectionObj);
    fireGadsDynamicRmkViewItemList(collectionObj);
  }
}

function getCollectionObj() {
  var collection_name = document.querySelector('div > div > h3').innerText;
  var collection_fixed_name = collection_name.replace(new RegExp(' ', 'g'), '_');
  var collection_products = getProductsInfo(LVT_collection);

  var collection = {
    collection_name,
    collection_fixed_name,
    collection_products
  };

  return collection;
}
