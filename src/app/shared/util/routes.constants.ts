export class RoutesConst {
    static readonly home: any = 'home';
    static readonly login: any = 'login';
    static readonly securehome: any = 'securehome';
    static readonly seller: any = 'seller-center';
    static readonly orders: any = 'ordenes';
    static readonly sellers: any = 'vendedores';
    static readonly state: any = 'estado';

    static readonly sellerCenterUrls: any = {
        'secureSeller': RoutesConst.securehome + '/' + RoutesConst.seller,
        'orders': RoutesConst.securehome + '/' + RoutesConst.seller + '/' + RoutesConst.orders,
        'sellers': RoutesConst.securehome + '/' + RoutesConst.seller + '/' + RoutesConst.sellers,
        'ordersState': RoutesConst.securehome + '/' + RoutesConst.seller + '/' + RoutesConst.orders + '/' + RoutesConst.state,
    };
}
