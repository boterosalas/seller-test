// db.js
module.exports = function () {
  return Object.assign({},
    require('./mock/user.json'),
    require('./mock/orders/all-orders.json'),
    require('./mock/orders/orders-status.json'),
    require('./mock/orders/billing.json'),
    require('./mock/orders/in-devolution.json'),
    require('./mock/orders/pending-devolution.json'),
    require('./mock/guides/sendGuides.json'),
    require('./mock/orders/carrier.json'),
    require('./mock/support/support.json')
  );
};
