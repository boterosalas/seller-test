export const defaultVersion = {
    prefix: 'v',
    number: 1
};

export const endpoints = {
    v1: {
          // orders
          searchOrders: 'https://5x9qrupiba.execute-api.us-east-1.amazonaws.com/SearchOrders?idSeller={sellerId}&limit={limit}',
          carries: 'https://2he495iasj.execute-api.us-east-1.amazonaws.com/Carries',
          sendAllGuides: 'https://tew99ut1y2.execute-api.us-east-1.amazonaws.com/SendAllGuides',
          downloadOrder: 'https://z0vz1c608a.execute-api.us-east-1.amazonaws.com/DownloadOrder',
          sendAllProductInOrder: 'https://nnsfw2fjr7.execute-api.us-east-1.amazonaws.com/SendAllProductInOrder/{orderId}',
          sendProductInOrder:  'https://89qu0cyz29.execute-api.us-east-1.amazonaws.com/SendProductInOrder/{orderId}/{idDetailProduct}',
          inDevolution: 'inDevolution',
          searchPendingDevolution: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch?idSeller={sellerId}&limit={limit}',
          pendingDevolution: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch/search{stringParams}',
          recordProcesSedOrder: 'https://4nu4lf5m80.execute-api.us-east-1.amazonaws.com/RecordProcesSedOrder',
          getallordersbysellerwithouttracking: 'https://cbihc9u6fa.execute-api.us-east-1.amazonaws.com/GetAllOrdersBySellerWithoutTracking{stringParam}',
          getBilling: 'financials/getbilling{stringParams}',
          searchBilling: 'financials/getbilling?idSeller={sellerId}&limit={limit}',
          acceptDevolution: 'orders/acceptDevolution',
          refuseOrAcceptDevolution: 'reversionrequest/requestacceptordenied',
          supporMessage: 'https://iqbs3e9dyb.execute-api.us-east-1.amazonaws.com/CreateSupport',
          getreasonsrejection:  'https://g7n20mhxc4.execute-api.us-east-1.amazonaws.com/ReasonsRejection{stringParams}',
          // shipments
          getShipmentById: 'service/shipping/{id}',
          listShipments: 'service/shipping/list/state/{state}/from/{from}/to/{take}/order/{sort}/carrier/{carrier}/',
          pickupShipment: 'service/shipping/pickup',
          // servicios para el arbol de categorías
          getAllSellers: 'https://5m0vgt1hi5.execute-api.us-east-1.amazonaws.com/GetAllSellers',
          // servicio empleado para obtener las comisiones de un usuario o todas las comisiones
          getSellerCommissionCategory: 'https://0dk55lff0l.execute-api.us-east-1.amazonaws.com/SellerCommissionCategory',
    }
};
