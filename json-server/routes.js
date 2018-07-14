// Personal urls
module.exports = function () {
  return {
    "/api/": "/",
    "/leo2707.auth0.com/oauth/token": "/token",
    "/leo2707.auth0.com/userinfo": "/userinfo",
    "/logout": "/logout",

    "/carrier/getall": "/carrier",
    "/orders/search?idSeller=:idSeller&limit=100&idStatusOrder=:idStatusOrder": "/orders-status?idSeller=:idSeller&idStatusOrder=:idStatusOrder",
    "/orders/search?idSeller=:idSeller&limit=100": "/allOrders?idSeller=:idSeller",
    "/orders/search?idSeller=:idSeller&limit=100&idChannel=:idChannel&dateOrderInitial=:dateOrderInitial": "/allOrders?idSeller=:idSeller&idChannel=:idChannel&dateOrderInitial=:dateOrderInitial",
    "/financials/getbilling?idSeller=:idSeller&limit=100": "/billing?idSeller=:idSeller",

    "/reversionrequest/search?idSeller=:idSeller&limit=100": "/pending-devolution?idSeller=:idSeller",
    "/reversionrequest/search?idSeller=:idSeller&limit=100&reversionRequestStatusId=:reversionRequestStatusId": "/pending-devolution?idSeller=:idSeller&reversionRequestStatusId=:reversionRequestStatusId",
    "/reversionrequest/getreasonsrejection": "/getreasonsrejection",

    "/inDevolution": "/in-devolution",
    "/orders/products": "/sendAllGuides",
    "/support/createsupport": "/sendSupportMessage"
  }
}
