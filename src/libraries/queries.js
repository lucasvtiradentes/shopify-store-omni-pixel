function getQueryParams() {
  var queryObj = {};

  var queryLength = window.location.search.length;

  if (queryLength > 0) {
    var queriesUrl = window.location.search.replace('?', '');
    var query_entries = queriesUrl.split('&');

    for (var x = 0; x < query_entries.length; x++) {
      var row = query_entries[x];
      var rowArr = row.split('=');
      if (rowArr.length === 2) {
        var key = rowArr[0];
        var value = decodeURI(rowArr[1]);
        queryObj[key] = decodeURI(value);
      }
    }
  }

  return queryObj;
}

function objectToQuery(objToConvert) {
  var totalQuery = '';
  var objKeys = Object.keys(objToConvert);
  var objValues = Object.values(objToConvert);

  for (var x = 0; x < objKeys.length; x++) {
    var curKey = objKeys[x];
    var curValue = objValues[x];
    var curRow = curKey + '=' + curValue;

    if (totalQuery === '') {
      totalQuery = curRow;
    } else {
      totalQuery = totalQuery + '&' + curRow;
    }
  }

  return totalQuery;
}
