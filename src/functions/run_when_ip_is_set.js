function runWhenGetUserIp(cbFunction) {
  var url = 'https://myip.wtf/json';

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cbFunction({
        ip: data.YourFuckingIPAddress,
        location: data.YourFuckingLocation,
        country: data.YourFuckingCountryCode
      });
    });
}
