function getCurCollection(allCollections) {
  if (!allCollections) {
    return '_';
  }

  var ignoredCollections = GLOBAL_VARIABLES['store'].shopify_store.ignored_collections;
  var fixedIgnoredCollections = ignoredCollections.map(convertCollectionToFixedCollection);

  var onlyValidCollectionsArr = allCollections.filter(function (item) {
    return fixedIgnoredCollections.indexOf(item) === -1;
  });

  var curFixedCollection = onlyValidCollectionsArr.length > 0 ? onlyValidCollectionsArr[0] : '#';
  var curCollection = onlyValidCollectionsArr.length > 0 ? convertFixedCollectionToCollection(onlyValidCollectionsArr[0]) : '#';

  return {
    curFixedCollection,
    curCollection
  };
}

function convertCollectionToFixedCollection(col) {
  var finalCol = col.toLowerCase();
  finalCol = finalCol.replace(' ', '_');
  return `#${finalCol}`;
}

function convertFixedCollectionToCollection(fixCol) {
  var finalCol = fixCol.toUpperCase();
  finalCol = finalCol.replace('_', ' ');
  finalCol = finalCol.replace('#', '');
  return finalCol;
}
