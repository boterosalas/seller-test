import { CategoryList } from '../models/order';

export class RoutesConst {
    static readonly home: any = 'home';
    static readonly login: any = 'login';
    static readonly myProfile: any = 'myprofile';
    static readonly logout: any = 'logout';
    static readonly jwttokens: any = 'jwttokens';
    static readonly useractivity: any = 'useractivity';
    static readonly securehome: any = 'securehome';
    static readonly seller: any = 'seller-center';
    static readonly orders: any = 'ordenes';
    static readonly ofers: any = 'ofertas';
    static readonly sellers: any = 'vendedores';
    static readonly billing: any = 'billing';
    static readonly shipmentsExito: any = 'envios-exito';
    static readonly secureSeller: any = 'securehome/seller-center';

    static readonly ordersState: any = 'estado';
    static readonly orderLoadGuide: any = 'cargar-guia';
    static readonly orderInDevolution: any = 'en-devolucion';
    static readonly orderInValidation: any = 'en-validacion';
    static readonly orderInPendingDevolution: any = 'solicitudes-pendientes';
    static readonly oferList: any = 'listado-ofertas';
    static readonly oferBulkLoad: any = 'carga-masiva';
    static readonly oferTreeCategory: any = 'arbol-categorias';
    static readonly billingPayments: any = 'pagos';
    static readonly sellerRegister: any = 'registrar';
    static readonly shipmentsExitoHistorical: any = 'historico';
    static readonly shipmentsExitoOffice: any = 'despacho';
    static readonly shipmentsExitoPending: any = 'pendientes';
    static readonly shipmentsExitoReports: any = 'reportes';

    static readonly sellerCenterUrls: any = {
        'orders': RoutesConst.secureSeller + '/' + RoutesConst.orders,
        'ofers': RoutesConst.secureSeller + '/' + RoutesConst.ofers,
        'sellers': RoutesConst.secureSeller + '/' + RoutesConst.sellers,
        'billing': RoutesConst.secureSeller + '/' + RoutesConst.billing,
        'shipmentsExito': RoutesConst.secureSeller + '/' + RoutesConst.shipmentsExito,
        'myProfile': RoutesConst.securehome + '/' + RoutesConst.myProfile,
        'logout': RoutesConst.securehome + '/' + RoutesConst.logout,
        'jwttokens': RoutesConst.securehome + '/' + RoutesConst.jwttokens,
        'useractivity': RoutesConst.securehome + '/' + RoutesConst.useractivity
    };

    static readonly sellerCenterUrlsInt: any = {
        'orderLoadGuide': RoutesConst.sellerCenterUrls.orders + '/' + RoutesConst.orderLoadGuide,
        'ordersState': RoutesConst.sellerCenterUrls.orders + '/' + RoutesConst.ordersState,
        'orderInDevolution': RoutesConst.sellerCenterUrls.orders + '/' + RoutesConst.orderInDevolution,
        'orderInValidation': RoutesConst.sellerCenterUrls.orders + '/' + RoutesConst.orderInValidation,
        'orderInPendingDevolution': RoutesConst.sellerCenterUrls.orders + '/' + RoutesConst.orderInPendingDevolution,

        'ofersList': RoutesConst.sellerCenterUrls.ofers + '/' + RoutesConst.oferList,
        'oferBulkLoad': RoutesConst.sellerCenterUrls.ofers + '/' + RoutesConst.oferBulkLoad,
        'oferTreeCategory': RoutesConst.sellerCenterUrls.ofers + '/' + RoutesConst.oferTreeCategory,

        'billingPayments': RoutesConst.sellerCenterUrls.billing + '/' + RoutesConst.billingPayments,

        'sellerRegister': RoutesConst.sellerCenterUrls.sellers + '/' + RoutesConst.sellerRegister,

        'shipmentsExitoHistorical': RoutesConst.sellerCenterUrls.shipmentsExito + '/' + RoutesConst.shipmentsExitoHistorical,
        'shipmentsExitoOffice': RoutesConst.sellerCenterUrls.shipmentsExito + '/' + RoutesConst.shipmentsExitoOffice,
        'shipmentsExitoPending': RoutesConst.sellerCenterUrls.shipmentsExito + '/' + RoutesConst.shipmentsExitoPending,
        'shipmentsExitoReports': RoutesConst.sellerCenterUrls.shipmentsExito + '/' + RoutesConst.shipmentsExitoReports,
    };

    /**
     * Lista de categorías para los menus
     * @static
     * @type {Array<CategoryList>}
     * @memberof Const
     */
    static readonly CATEGORYLIST: Array<CategoryList> = [
        {
            root: RoutesConst.sellerCenterUrls.orders,
            id: '',
            name: 'Todas',
            buttonId: 'allOrders',
            count: 2
        },
        {
            root: RoutesConst.sellerCenterUrlsInt.ordersState,
            name: 'Por enviar',
            id: '35',
            buttonId: 'for-send-orders',
            count: 13
        },
        {
            root: RoutesConst.sellerCenterUrlsInt.ordersState,
            name: 'Enviadas',
            id: '170',
            buttonId: 'send-orders',
            count: 15
        }
    ];
}
