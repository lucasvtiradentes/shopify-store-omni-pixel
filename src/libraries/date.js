function getDateInfo() {
  var dateObj = new Date();

  dateObj.setHours(dateObj.getHours() + 0);
  var currentDate = dateObj.toLocaleDateString('pt-BR');
  var currentHour = dateObj.getHours().toString().length == 1 ? '0' + dateObj.getHours() : dateObj.getHours();
  var currentMinute = dateObj.getMinutes().toString().length == 1 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
  var currentTime = currentHour + ':' + currentMinute;

  var dateObj = {};
  dateObj.currentDate = currentDate;
  dateObj.currentTime = currentTime;

  return dateObj;
}

function getDateTime() {
  return `${getDateInfo().currentDate} ${getDateInfo().currentTime}`;
}

function getMinDiff(date1, date2) {
  if (!date1 || !date2) {
    return undefined;
  }

  const [day1, month1, year1] = date1
    .toString()
    .split(' ')[0]
    .split('/')
    .map((item) => Number(item));
  const [hour1, minutes1] = date1
    .toString()
    .split(' ')[1]
    .split(':')
    .map((item) => Number(item));
  const datetime1 = new Date(year1, month1 - 1, day1, hour1, minutes1, 0, 0);

  const [day2, month2, year2] = date2
    .toString()
    .split(' ')[0]
    .split('/')
    .map((item) => Number(item));
  const [hour2, minutes2] = date2
    .toString()
    .split(' ')[1]
    .split(':')
    .map((item) => Number(item));
  const datetime2 = new Date(year2, month2 - 1, day2, hour2, minutes2, 0, 0);

  let minDiff = ((Number(datetime2) - Number(datetime1)) / 60 / 1000).toFixed(0);
  return Number(minDiff);
}
