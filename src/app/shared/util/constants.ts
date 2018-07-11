/* our own custom components */
import { CategoryList, Order } from '../models/order';
import { environment } from '../../environments/environment';

export class Const {
    static readonly home: any = 'home';
    static readonly login: any = 'login';
    static readonly securehome: any = 'securehome';
    static readonly seller: any = 'seller-center';
    static readonly orders: any = 'ordenes';
    static readonly sellers: any = 'vendedores';
    static readonly state: any = 'estado';

    static readonly sellerCenterUrls: any = {
        'secureSeller': Const.securehome + '/' + Const.seller,
        'orders': Const.securehome + '/' + Const.seller + '/' + Const.orders,
        'sellers': Const.securehome + '/' + Const.seller + '/' + Const.sellers,
        'ordersState': Const.securehome + '/' + Const.seller + '/' + Const.orders + '/' + Const.state,
    };

    /**
     * Lista de categorías para los menus
     * @static
     * @type {Array<CategoryList>}
     * @memberof Const
     */
    static readonly CATEGORYLIST: Array<CategoryList> = [
        {
            root: Const.sellerCenterUrls.orders,
            id: '',
            name: 'Todas',
            buttonId: 'allOrders',
            count: 2
        },
        {
            root: Const.sellerCenterUrls.ordersState,
            name: 'Por enviar',
            id: '35',
            buttonId: 'for-send-orders',
            count: 13
        },
        {
            root: Const.sellerCenterUrls.ordersState,
            name: 'Enviadas',
            id: '170',
            buttonId: 'send-orders',
            count: 15
        }
    ];

    /**
     * Estructura vacia para los datos de un usuario
     * @static
     * @type {*}
     * @memberof Const
     */
    static readonly EMPTYUSER: any = {
        login: false,
        nickname: '',
        name: '',
        role: 0,
        last_name: '',
        email: '',
        email_verified: '',
        picture: '',
        access_token: '',
        sub: '',
        updated_at: '',
        [`${environment.webUrl}`]: {
            name: '',
            nit: '',
            roles: [],
            sellerId: ''

        }
    };

    /**
     * Estructura vacia para una orden
     * @static
     * @type {Order}
     * @memberof Const
     */
    static readonly EMPTYORDER: Order =
        {
            id: 0,
            orderNumber: '',
            allowShipping: false,
            sendAllProduct: false,
            processedOrder: false,
            idSeller: 0,
            nameSeller: '',
            nitSeller: '',
            idChannel: 0,
            channel: '',
            dateOrder: '',
            idStatusOrder: 0,
            statusOrder: '',
            costTotalOrder: 0,
            costTotalShipping: 0,
            commission: 0,
            dateMaxDeliveryOrder: '',
            typeDespatchOrder: '',
            identificationCard: '',
            clientName: '',
            clientTelephone: '',
            clientAddress: '',
            products: [{
                id: 0,
                idDetailProduct: 0,
                idPicking: 0,
                nameProduct: '',
                productId: '',
                sku: 0,
                ean: '',
                checkProductToSend: false,
                reference: '',
                idStatusProduct: 0,
                statusProduct: '',
                quantity: 0,
                costProduct: 0,
                costShippingProduct: 0,
                commission: 0,
                dateMaxDeliveryProduct: '',
                typeDespatchProduct: '',
                tracking: '',
                carrier: '',
                dateDelivery: '',
                enviosExito: false,
                fulfillment: false
            }
            ]
        };


    /**
     * Estados para los productos de las ordenes
     * @static
     * @memberof Const
     */
    static readonly ProductAsignado = 35;
    static readonly ProductAprobadoDespacho = 45;
    static readonly ProductCancelado = 80;
    static readonly ProductEmpacado = 47;
    static readonly ProductEnProcesoDeEnvio = 170;
    static readonly ProductEntregado = 60;
    static readonly ProductFacturadoEnviado = 170;
    static readonly ProductPagadoCancelado = 120;
    static readonly ProductRechazadoDespacho = 55;
    static readonly ProductSinInventario = 185;
    static readonly ProductSinInventarioNotificado = 185;


    static readonly NameProductAsignado = 'Asignado';
    static readonly NameProductAprobadoDespacho = 'AprobadoDespacho';
    static readonly NameProductCancelado = 'Cancelado';
    static readonly NameProductEmpacado = 'Empacado';
    static readonly NameProductEnProcesoDeEnvio = 'EnProcesoDeEnvio';
    static readonly NameProductEntregado = 'Entregado';
    static readonly NameProductFacturadoEnviado = 'FacturadoEnviado';
    static readonly NameProductPagadoCancelado = 'PagadoCancelado';
    static readonly NameProductRechazadoDespacho = 'RechazadoDespacho';
    static readonly NameProductSinInventario = 'SinInventario';
    static readonly NameProductSinInventarioNotificado = 'SinInventarioNotificado';

    /**
     * Estados para las ordenes
     * @static
     * @memberof Const
     */
    static readonly OrderAsignado = 35;
    static readonly OrderEntregado = 60;
    static readonly OrderEnProcesoDeEnvio = 170;

    static readonly NameOrderAsignado = 'Asignado';
    static readonly NameOrderEntregado = 'Entregado';
    static readonly NameOrderEnProcesoDeEnvio = 'EnProcesoDeEnvio';


    /**
     * Estados para las ordenes y los productos en la app
     */
    static readonly AppProductEnviado = 'En envío';
    static readonly AppProductAsignado = 'Asignado';
    static readonly AppProductEntregado = 'Entregado';

    static readonly AppOrderEnviado = 'En envío';
    static readonly AppOrderAsignado = 'Asignado';
    static readonly AppOrderEntregado = 'Entregado';

    // Constantes para los estados de las solicitudes de devolución
    static readonly StatusInDevolution = 9;
    static readonly StatusPendingDevolution = 1;
    static readonly StatusInValidation = 4;


    // Constantes para los tipos de rechazo de solicitudes
    static readonly OrderPendingDevolution = 2;
    static readonly OrdersInDevolution = 4;
}
