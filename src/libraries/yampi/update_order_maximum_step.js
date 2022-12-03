function updateOrderMaximumStep(curStep, curToken) {
  var userOrders = getCookie(GLOBAL_COOKIES['USER_BEHAVIOR_ORDERS']);
  var curOrders = userOrders ? JSON.parse(userOrders) : [];
  var orderIndex = getOrderIndexFromToken(curToken);

  addMaximumFunnelStep(curStep);

  if (curOrders[orderIndex].maximum_step < curStep) {
    console.log(`Primeira vez na etapa ${curStep}`);
    var newOrder = curOrders[orderIndex];
    newOrder.maximum_step = curStep;
    updateOrderFromToken(curToken, newOrder);
    GLOBAL_VARIABLES['user'].behavior.orders[orderIndex].maximum_step = curStep;
    return true;
  } else {
    console.log(`Ja esteve na etapa ${curStep} anteriormente`);
    return false;
  }
}
