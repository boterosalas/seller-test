
/**
 * Estructura de la respuesta del servidor de busqueda de tiendas
 */
export class StoreModel {
    constructor(
        public IdSeller?: number,
        public Name?: string,
        public Address?: string,
        public DaneCode?: string,
        public GotoCarrulla?: boolean,
        public GotoCatalogo?: boolean,
        public GotoExito?: boolean,
        public IsLogisticsExito?: boolean,
        public IsShippingExito?: boolean,
        public Nit?: string
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
