export const defaultVersion = {
  prefix: 'v',
  number: 1
};

export const endpoints = {
  // Endpoints QA
  stage: {
    v1: {
      // orders
      searchOrders: 'https://5x9qrupiba.execute-api.us-east-1.amazonaws.com/SearchOrders?idSeller={sellerId}&limit={limit}',
      carries: 'https://2he495iasj.execute-api.us-east-1.amazonaws.com/Carries',
      sendAllGuides: 'https://tew99ut1y2.execute-api.us-east-1.amazonaws.com/SendAllGuides',
      downloadOrder: 'https://z0vz1c608a.execute-api.us-east-1.amazonaws.com/DownloadOrder',
      sendAllProductInOrder: 'https://nnsfw2fjr7.execute-api.us-east-1.amazonaws.com/SendAllProductInOrder/{orderId}',
      sendProductInOrder: 'https://89qu0cyz29.execute-api.us-east-1.amazonaws.com/SendProductInOrder/{orderId}/{idDetailProduct}',
      searchPendingDevolution: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch?idSeller={sellerId}&limit={limit}',
      pendingDevolution: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch?{stringParams}',
      acceptOrDeniedDevolution: 'https://v1kfqoa8yd.execute-api.us-east-1.amazonaws.com/RequestAcceptOrDenied',
      recordProcesSedOrder: 'https://4nu4lf5m80.execute-api.us-east-1.amazonaws.com/RecordProcesSedOrder',
      getallordersbysellerwithouttracking: 'https://cbihc9u6fa.execute-api.us-east-1.amazonaws.com/GetAllOrdersBySellerWithoutTracking{stringParam}',
      getBilling: 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing{stringParams}',
      searchBilling: 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing?idSeller={sellerId}&limit={limit}',
      // Support message
      supporMessage: 'https://iqbs3e9dyb.execute-api.us-east-1.amazonaws.com/CreateSupport',
      getreasonsrejection: 'https://g7n20mhxc4.execute-api.us-east-1.amazonaws.com/ReasonsRejection{stringParams}',
      // shipments
      getShipmentById: 'service/shipping/{id}',
      listShipments: 'service/shipping/list/state/{state}/from/{from}/to/{take}/order/{sort}/carrier/{carrier}/',
      pickupShipment: 'service/shipping/pickup',
      // servicios para el arbol de categorías
      getAllSellers: 'https://5m0vgt1hi5.execute-api.us-east-1.amazonaws.com/GetAllSellers',
      // servicio empleado para obtener las comisiones de un usuario o todas las comisiones
      getSellerCommissionCategory: 'https://0dk55lff0l.execute-api.us-east-1.amazonaws.com/SellerCommissionCategory/{params}',
      // Register Seller Name
      registerSeller: 'https://5a1c7n6t70.execute-api.us-east-1.amazonaws.com/RegisterSeller/',
      validateSellerNit: 'https://5avfpnwghf.execute-api.us-east-1.amazonaws.com/ValidateSellerNit/{params}',
      validateSellerEmail: 'https://iye9w7rlsg.execute-api.us-east-1.amazonaws.com/ValidateSellerEmail/{params}',
      validateSellerName: 'https://4gxrzfojb9.execute-api.us-east-1.amazonaws.com/ValidateSellerName/{params}',
      // Cities and States services
      getCities: 'https://u9rxwf1i19.execute-api.us-east-1.amazonaws.com/Cities/{params}',
      getStates: 'https://vppc3gie2i.execute-api.us-east-1.amazonaws.com/States',
      // Offers
      getOffers: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer/{params}',
      patchOffers: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer',
      // Products
      products: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/',
    },
  },
  // Endpoints production
  prod: {
    v1: {
      // orders
      searchOrders: 'https://ldixrz8no2.execute-api.us-east-1.amazonaws.com/searchorders-pdn?idSeller={sellerId}&limit={limit}',
      carries: 'https://q8sree00sb.execute-api.us-east-1.amazonaws.com/carrier-pdn',
      sendAllGuides: 'https://vaf1d3c2ic.execute-api.us-east-1.amazonaws.com/sendallguides-pdn',
      downloadOrder: 'https://az3ophrruj.execute-api.us-east-1.amazonaws.com/downloadorder-pdn',
      sendAllProductInOrder: 'https://5zu3684z6e.execute-api.us-east-1.amazonaws.com/sendallproductsinorder-pdn/{orderId}',
      sendProductInOrder: 'https://dc042g38t8.execute-api.us-east-1.amazonaws.com/sendproductinorder-pdn/{orderId}/{idDetailProduct}',
      searchPendingDevolution: 'https://5nkjhkfsm2.execute-api.us-east-1.amazonaws.com/reversionrequest-pdn?idSeller={sellerId}&limit={limit}',
      pendingDevolution: 'https://5nkjhkfsm2.execute-api.us-east-1.amazonaws.com/reversionrequest-pdn/search{stringParams}', // PENDIENTE
      recordProcesSedOrder: 'https://cfa1kdi5yj.execute-api.us-east-1.amazonaws.com/recordproccessedorder-pdn',
      getallordersbysellerwithouttracking: 'https://e06ayaf6s9.execute-api.us-east-1.amazonaws.com/getallordersbysellerwithouttracking-pdn{stringParam}',
      // Billing Mock
      getBilling: 'http://localhost:3000/financials/getbilling{stringParams}',
      searchBilling: 'http://localhost:3000/financials/getbilling?idSeller={sellerId}&limit={limit}',
      refuseOrAcceptDevolution: 'http://localhost:3000/reversionrequest/requestacceptordenied',
      // Support message
      supporMessage: 'https://7bvbe7k6n8.execute-api.us-east-1.amazonaws.com/createsupport-pdn',
      getreasonsrejection: 'https://m9rdnx8wog.execute-api.us-east-1.amazonaws.com/reasonrejection-pdn{stringParams}',
      // shipments
      getShipmentById: 'service/shipping/{id}',
      listShipments: 'service/shipping/list/state/{state}/from/{from}/to/{take}/order/{sort}/carrier/{carrier}/',
      pickupShipment: 'service/shipping/pickup',
      // servicios para el arbol de categorías
      getAllSellers: 'https://0zhu6q42zl.execute-api.us-east-1.amazonaws.com/getallsellers-pdn',
      getSellerCommissionCategory: 'https://lp04fcggo3.execute-api.us-east-1.amazonaws.com/sellercommissioncategory-pdn/{params}',
      // Register seller services
      registerSeller: 'https://x2vflz270c.execute-api.us-east-1.amazonaws.com/registerseller-pdn/',
      validateSellerNit: 'https://ce8fuvj37h.execute-api.us-east-1.amazonaws.com/validatesellernit-pdn/{params}',
      validateSellerEmail: 'https://ejn1rdfov9.execute-api.us-east-1.amazonaws.com/validateselleremail-pdn',
      validateSellerName: 'https://z0exz5y0f6.execute-api.us-east-1.amazonaws.com/validatesellername-pdn',
      // Cities and States services
      getCities: 'https://lcdy1iepcf.execute-api.us-east-1.amazonaws.com/cities-pdn/{params}',
      getStates: 'https://yz3bm0grtf.execute-api.us-east-1.amazonaws.com/states-pdn',
      // Offers
      getOffers: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn/{params}',
      patchOffers: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn'
    }
  }
};
