function generateToken() {
  var tokenLength = 15;
  var a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  var b = [];

  for (var i = 0; i < tokenLength; i++) {
    var j = (Math.random() * (a.length - 1)).toFixed(0);
    b[i] = a[j];
  }

  var finalToken = b.join('');
  return finalToken;
}
