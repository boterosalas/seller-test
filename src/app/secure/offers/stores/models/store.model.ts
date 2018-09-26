
/**
 * Estructura de la respuesta del servidor de busqueda de tiendas
 */
export class StoreModel {
    constructor(
        public IdSeller?: any,
        public Name?: string,
        public Address?: string,
        public DaneCode?: string,
        public GotoCarrulla?: boolean,
        public GotoCatalogo?: boolean,
        public GotoExito?: boolean,
        public IsLogisticsExito?: boolean,
        public IsShippingExito?: boolean,
        public Nit?: string,
        public Rut?: string,
        public ContactName?: string,
        public Email?: string,
        public PhoneNumber?: string,
        public State?: string,
        public City?: string,
        public SincoDaneCode?: string
    ) { }
}

/**
 * Estructura de los datos que se comparten entre componentes para la información del arbol.
 * @export
 * @class IsLoadInformationForTree
 */
export class IsLoadInformationForTree {
    informationForTreeIsLoad: boolean;
    data = {
        getSellerCommissionCategory: [],
        allGetSellerCommissionCategory: []
    };
}
