import { CategoryList } from '@app/shared/models/order.model';

export class RoutesConst {
    static readonly home: any = 'home';
    static readonly login: any = 'login';
    static readonly myProfile: any = 'myprofile';
    static readonly logout: any = 'logout';
    static readonly jwttokens: any = 'jwttokens';
    static readonly useractivity: any = 'useractivity';
    static readonly forgotPassword: any = 'forgotPassword';
    static readonly confirmRegistration: any = 'confirmRegistration';
    static readonly newPassword: any = 'newPassword';
    static readonly error: any = 'error';
    static readonly securehome: any = 'securehome';

    static readonly seller: any = 'seller-center';
    static readonly orders: any = 'ordenes';
    static readonly offers: any = 'ofertas';
    static readonly sellers: any = 'vendedores';
    static readonly billing: any = 'billing';
    static readonly shipmentsExito: any = 'envios-exito';
    static readonly products: any = 'products';

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
    static readonly sellerManage: any = 'administrar';
    static readonly shipmentsExitoHist: any = 'historico';
    static readonly shipmentsExitoOffice: any = 'despacho';
    static readonly shipmentsExitoPending: any = 'pendientes';
    static readonly shipmentsExitoReports: any = 'reportes';
    static readonly productBulkLoad: any = 'carga-masiva';
    static readonly quoting: any = 'cotizador';

    static readonly homeLogin: any = RoutesConst.home + '/' + RoutesConst.login;
    static readonly homeForgotPassword: any = RoutesConst.home + '/' + RoutesConst.forgotPassword;
    static readonly homeConfirmRegistration: any = RoutesConst.home + '/' + RoutesConst.confirmRegistration;
    static readonly homeNewPassword: any = RoutesConst.home + '/' + RoutesConst.newPassword;

    static readonly secureSeller: any = RoutesConst.securehome + '/' + RoutesConst.seller;

    static readonly sellerCenterOrders: any = RoutesConst.secureSeller + '/' + RoutesConst.orders;
    static readonly sellerCenterOffers: any = RoutesConst.secureSeller + '/' + RoutesConst.offers;
    static readonly sellerCenterSellers: any = RoutesConst.secureSeller + '/' + RoutesConst.sellers;
    static readonly sellerCenterBilling: any = RoutesConst.secureSeller + '/' + RoutesConst.billing;
    static readonly sellerCenterShipmentsExito: any = RoutesConst.secureSeller + '/' + RoutesConst.shipmentsExito;
    static readonly sellerCenterMyProfile: any = RoutesConst.securehome + '/' + RoutesConst.myProfile;
    static readonly sellerCenterLogout: any = RoutesConst.securehome + '/' + RoutesConst.logout;
    static readonly sellerCenterJwttokens: any = RoutesConst.securehome + '/' + RoutesConst.jwttokens;
    static readonly sellerCenterUserActivity: any = RoutesConst.securehome + '/' + RoutesConst.useractivity;
    static readonly sellerCenterProducts: any = RoutesConst.securehome + '/' + RoutesConst.products;

    static readonly sellerCenterIntOrderLoadGuide: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderLoadGuide;
    static readonly sellerCenterIntOrdersState: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.ordersState;
    static readonly sellerCenterIntOrderInDevolution: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInDevolution;
    static readonly sellerCenterIntOrderInValidation: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInValidation;
    static readonly sellerCenterIntOrderInPendingDevolution: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInPendingDevolution;

    static readonly sellerCenterIntOfersList: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferList;
    static readonly sellerCenterIntOferBulkLoad: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferBulkLoad;
    static readonly sellerCenterIntOferTreeCategory: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferTreeCategory;
    static readonly sellerCenterIntOfferQuoting: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.quoting;

    static readonly sellerCenterIntProductBulkLoad: any = RoutesConst.sellerCenterProducts + '/' + RoutesConst.productBulkLoad;

    static readonly sellerCenterIntBillingPayments: any = RoutesConst.sellerCenterBilling + '/' + RoutesConst.billingPayments;

    static readonly sellerCenterIntSellerRegister: any = RoutesConst.sellerCenterSellers + '/' + RoutesConst.sellerRegister;
    static readonly sellerCenterIntSellerManage: any = RoutesConst.sellerCenterSellers + '/' + RoutesConst.sellerManage;

    static readonly sellerCenterIntShipmentsExitoHist: any = RoutesConst.sellerCenterShipmentsExito + '/' + RoutesConst.shipmentsExitoHist;
    static readonly sellerCenterIntShipmentsExitoOffice: any = RoutesConst.sellerCenterShipmentsExito + '/' + RoutesConst.shipmentsExitoOffice;
    static readonly sellerCenterIntShipmentsExitoPending: any = RoutesConst.sellerCenterShipmentsExito + '/' + RoutesConst.shipmentsExitoPending;
    static readonly sellerCenterIntShipmentsExitoReports: any = RoutesConst.sellerCenterShipmentsExito + '/' + RoutesConst.shipmentsExitoReports;

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
