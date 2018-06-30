export const defaultVersion = {
    prefix: 'v',
    number: 1
};

export const endpoints = {
    v1: {
        // Login auth 0
        login: 'oauth/token',
        logout: 'oauth/logout',
        userInformation: 'userinfo',
        recovery: 'recoverypassword',
        // orders
        searchOrders: 'orders/search?idSeller={sellerId}&limit={limit}',
        carries: 'carrier/getall',
        sendAllGuides: 'orders/products',
        downloadOrder: 'orders/exportorders',
        sendAllProductInOrder: 'orders/{orderId}/products',
        sendProductInOrder: 'orders/{orderId}/products/{idDetailProduct}',
        inDevolution: 'inDevolution',
        searchPendingDevolution: 'reversionrequest/search?idSeller={sellerId}&limit={limit}',
        pendingDevolution: 'reversionrequest/search{stringParams}',
        recordProcesSedOrder: 'orders/recordprocessedorder',
        getallordersbysellerwithouttracking: 'orders/getallordersbysellerwithouttracking{stringParam}',
        getBilling: 'financials/getbilling{stringParams}',
        searchBilling: 'financials/getbilling?idSeller={sellerId}&limit={limit}',
        acceptDevolution: 'orders/acceptDevolution',
        refuseOrAcceptDevolution: 'reversionrequest/requestacceptordenied',
        supporMessage: 'support/createsupport',
        getreasonsrejection: 'reversionrequest/getreasonsrejection{stringParams}',
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
