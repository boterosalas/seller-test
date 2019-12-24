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
    static readonly dashboard: any = 'dashboard';
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
    static readonly orderHistoricalDevolution: any = 'historico-devoluciones';
    static readonly orderInBillingOrders: any = 'factura-electronica';
    static readonly oferList: any = 'listado-ofertas';
    static readonly oferListAdmin: any = 'listado-ofertas-admin';
    static readonly oferBulkLoad: any = 'carga-masiva';
    static readonly oferHistoricalBulkLoad: any = 'historico-carga-ofertas';
    static readonly oferHistoricalBulkLoadAdmin: any = 'historico-carga-ofertas-admin';
    static readonly oferTreeCategory: any = 'arbol-categorias';
    static readonly billingPayments: any = 'pagos';
    static readonly sellerRegister: any = 'registrar';
    static readonly sellerManage: any = 'administrar';
    static readonly sellerAgreement: any = 'acuerdos';
    static readonly sellerProfiles: any = 'perfiles';
    static readonly sellerList: any = 'lista';
    static readonly shipmentsExitoHist: any = 'historico';
    static readonly shipmentsExitoOffice: any = 'despacho';
    static readonly shipmentsExitoPending: any = 'pendientes';
    static readonly shipmentsExitoReports: any = 'reportes';
    static readonly productBulkLoad: any = 'carga-masiva';
    static readonly productModerationBulkLoad: any = 'moderacion-producto';
    static readonly quoting: any = 'cotizador';
    static readonly createUnutaryProduct: any = 'creacion-unitaria';
    static readonly paramSpecifications: any = 'especificaciones';
    static readonly paramBrands: any = 'marcas';
    static readonly listProducts: any = 'listado-productos';
    static readonly categoryTree: any = 'category-tree';
    static readonly reportOffertAdmin: any = 'category-tree';


    /* Support Center */
    static readonly sellerSupportCenter: any = 'support-center';

    static readonly homeLogin: any = RoutesConst.home + '/' + RoutesConst.login;
    static readonly homeForgotPassword: any = RoutesConst.home + '/' + RoutesConst.forgotPassword;
    static readonly homeConfirmRegistration: any = RoutesConst.home + '/' + RoutesConst.confirmRegistration;
    static readonly homeNewPassword: any = RoutesConst.home + '/' + RoutesConst.newPassword;

    static readonly secureSeller: any = RoutesConst.securehome + '/' + RoutesConst.seller;


    // Support Center DetaiTicket
    static readonly sellerCenterCases: any = RoutesConst.secureSeller + '/' + RoutesConst.sellerSupportCenter;
    static readonly sellerCenterCasesDetail: any = RoutesConst.secureSeller + '/' + RoutesConst.sellerSupportCenter + '/:idCase';

    static readonly sellerCenterIntDashboard: any = RoutesConst.secureSeller + '/' + RoutesConst.dashboard;
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
    static readonly sellerCenterIntParamSpecs: any = RoutesConst.securehome + '/' + RoutesConst.paramSpecifications;
    static readonly sellerCenterIntParamBrand: any = RoutesConst.securehome + '/' + RoutesConst.paramBrands;

    static readonly sellerCenterIntOrderLoadGuide: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderLoadGuide;
    static readonly sellerCenterIntOrdersState: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.ordersState;
    static readonly sellerCenterIntOrderInDevolution: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInDevolution;
    static readonly sellerCenterIntOrderInValidation: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInValidation;
    static readonly sellerCenterIntOrderInPendingDevolution: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInPendingDevolution;
    static readonly sellerCenterIntOrderBillingOrders: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInBillingOrders;
    static readonly sellerCenterIntOrderHistoricalDevolution: any = RoutesConst.sellerCenterOrders + '/' + RoutesConst.orderInPendingDevolution;

    static readonly sellerCenterIntOfersList: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferList;
    static readonly sellerCenterIntOfersListAdmin: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferListAdmin;
    static readonly sellerCenterIntOferBulkLoad: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferBulkLoad;
    static readonly sellerCenterIntOferHistoricalBulkLoad: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferHistoricalBulkLoad;
    static readonly sellerCenterIntOferHistoricalBulkLoadAdmin: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferHistoricalBulkLoadAdmin;
    static readonly sellerCenterIntOferTreeCategory: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.oferTreeCategory;
    static readonly sellerCenterIntOfferQuoting: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.quoting;
    static readonly sellerCenterIntOfferReportOffert: any = RoutesConst.sellerCenterOffers + '/' + RoutesConst.reportOffertAdmin;

    static readonly sellerCenterIntProductBulkLoad: any = RoutesConst.sellerCenterProducts + '/' + RoutesConst.productBulkLoad;
    static readonly sellerCenterProductModerationBulkLoad: any = RoutesConst.sellerCenterProducts + '/' + RoutesConst.productModerationBulkLoad;
    static readonly sellerCenterIntCreateUnutaryProduct: any = RoutesConst.sellerCenterProducts + '/' + RoutesConst.createUnutaryProduct;
    static readonly sellerCenterIntListProducts: any = RoutesConst.sellerCenterProducts + '/' + RoutesConst.listProducts;


    static readonly sellerCenterIntBillingPayments: any = RoutesConst.sellerCenterBilling + '/' + RoutesConst.billingPayments;

    static readonly sellerCenterIntSellerRegister: any = RoutesConst.sellerCenterSellers + '/' + RoutesConst.sellerRegister;
    static readonly sellerCenterIntSellerManage: any = RoutesConst.sellerCenterSellers + '/' + RoutesConst.sellerManage;
    static readonly sellerCenterIntSellerAgreements: any = RoutesConst.sellerCenterSellers + '/' + RoutesConst.sellerAgreement;
    static readonly sellerCenterIntSellerProfiles: any = RoutesConst.sellerCenterSellers + '/' + RoutesConst.sellerProfiles;
    static readonly sellerCenterIntSellerList: any = RoutesConst.sellerCenterSellers + '/' + RoutesConst.sellerList;
    static readonly sellerCenterIntCategoryTree: any = RoutesConst.securehome + '/' + RoutesConst.categoryTree;

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
            name: 'menu.Por enviar',
            id: '35',
            buttonId: 'for-send-orders',
            count: 13
        },
        {
            root: RoutesConst.sellerCenterIntOrdersState,
            name: 'menu.Enviadas',
            id: '170',
            buttonId: 'send-orders',
            count: 15
        }
    ];
}
