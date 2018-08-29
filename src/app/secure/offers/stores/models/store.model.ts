
/**
 * Estructura de la respuesta del servidor de busqueda de tiendas
 */
export class StoreModel {
    IdSeller: number;
    Name: string;

    constructor(IdSeller: number, Name: string) {
        this.IdSeller = IdSeller;
        this.Name = Name;
    }
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
