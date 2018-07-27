import { CategoryList } from '../models/order.model';

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
    static readonly offers: any = 'ofertas';
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
    static readonly shipmentsExitoHist: any = 'historico';
    static readonly shipmentsExitoOffice: any = 'despacho';
    static readonly shipmentsExitoPending: any = 'pendientes';
    static readonly shipmentsExitoReports: any = 'reportes';

    static readonly sellerCenterOrders = RoutesConst.secureSeller + '/' + RoutesConst.orders;
    static readonly sellerCenterOffers = RoutesConst.secureSeller + '/' + RoutesConst.offers;
    static readonly sellerCenterSellers = RoutesConst.secureSeller + '/' + RoutesConst.sellers;
    static readonly sellerCenterBilling = RoutesConst.secureSeller + '/' + RoutesConst.billing;
    static readonly sellerCenterShipmentsExito = RoutesConst.secureSeller + '/' + RoutesConst.shipmentsExito;
    static readonly sellerCenterMyProfile = RoutesConst.securehome + '/' + RoutesConst.myProfile;
    static readonly sellerCenterLogout = RoutesConst.securehome + '/' + RoutesConst.logout;
    static readonly sellerCenterJwttokens = RoutesConst.securehome + '/' + RoutesConst.jwttokens;
    static readonly sellerCenterUserActivity = RoutesConst.securehome + '/' + RoutesConst.useractivity;

    static readonly sellerCenterIntOrderLoadGuide = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderLoadGuide;
    static readonly sellerCenterIntOrdersState = RoutesConst.sellerCenterOrders + '/' + RoutesConst.ordersState;
    static readonly sellerCenterIntOrderInDevolution = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInDevolution;
    static readonly sellerCenterIntOrderInValidation = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInValidation;
    static readonly sellerCenterIntOrderInPendingDevolution = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInPendingDevolution;

    static readonly sellerCenterIntOfersList = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferList;
    static readonly sellerCenterIntOferBulkLoad = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferBulkLoad;
    static readonly sellerCenterIntOferTreeCategory = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferTreeCategory;

    static readonly sellerCenterIntBillingPayments = RoutesConst.sellerCenterBilling + '/' + RoutesConst.billingPayments;

    static readonly sellerCenterIntSellerRegister = RoutesConst.sellerCenterSellers + '/' + RoutesConst.sellerRegister;

    static readonly sellerCenterIntShipmentsExitoHist = RoutesConst.sellerCenterShipmentsExito + '/' + RoutesConst.shipmentsExitoHist;
    static readonly sellerCenterIntShipmentsExitoOffice = RoutesConst.sellerCenterShipmentsExito + '/' + RoutesConst.shipmentsExitoOffice;
    static readonly sellerCenterIntShipmentsExitoPending = RoutesConst.sellerCenterShipmentsExito + '/' + RoutesConst.shipmentsExitoPending;
    static readonly sellerCenterIntShipmentsExitoReports = RoutesConst.sellerCenterShipmentsExito + '/' + RoutesConst.shipmentsExitoReports;

    /**
     * Lista de categorías para los menus
     * @static
     * @type {Array<CategoryList>}
     * @memberof Const
     */
    static readonly CATEGORYLIST: Array<CategoryList> = [
        {
            root: RoutesConst.sellerCenterOrders,
            id: '',
            name: 'Todas',
            buttonId: 'allOrders',
            count: 2
        },
        {
            root: RoutesConst.sellerCenterIntOrdersState,
            name: 'Por enviar',
            id: '35',
            buttonId: 'for-send-orders',
            count: 13
        },
        {
            root: RoutesConst.sellerCenterIntOrdersState,
            name: 'Enviadas',
            id: '170',
            buttonId: 'send-orders',
            count: 15
        }
    ];
}
