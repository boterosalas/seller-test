import { RoutesConst } from '@app/shared';

/**
 * Clase con la estructura de datos del modulo.
 *
 * @export
 * @class ModuleModel
 */
export class ModuleModel {
    NameModule: string;
    ShowModule: boolean;
    NameModuleBack: string;
    Menus: MenuModel[];

    /**
     * Cuanto se crea una instancia del modelo de modulos.
     * @param {string} nameModule Nombre del modulo.
     * @param {boolean} showModule Variable para mostrar o no el modulo. Usada en el menu lateral y horizontal.
     * @param {string} nameModuleBack Nombre del modulo en back o guardado en base de datos.
     * @param {MenuModel[]} menus Lista de menus que posee el modulo.
     * @memberof ModuleModel
     */
    constructor(
        nameModule: string,
        showModule: boolean,
        nameModuleBack: string,
        menus: MenuModel[]) {
        this.NameModule = nameModule;
        this.ShowModule = showModule;
        this.NameModuleBack = nameModuleBack;
        this.Menus = menus;
    }
}

/**
 * Clase con la estructura de datos del menu.
 *
 * @export
 * @class MenuModel
 */
export class MenuModel {
    NameMenu: string;
    ShowMenu: boolean;
    NameMenuBack: string;
    ProfileType: number;
    Functionalities: FunctionalitiesModel[];
    UrlRedirect: string;
    Id: string;
    ShowMenuProduction = true;

    /**
     * Cuanto se crea una instancia del modelo de menus.
     * @param {string} nameMenu Nombre del menu.
     * @param {boolean} showMenu Variable para mostrar o no el menu. usado en el menu lateral y horizontal, o para ingresar a las componentes.
     * @param {string} nameMenuBack Nombre del menu en back para mapearlo.
     * @param {number} profileType Tipo del perfil (mirar constante de ProfileTypes).
     * @param {FunctionalitiesModel[]} functionalities Lista de funcionalidades.
     * @param {string} urlRedirect Url que muestra el componente (mirar constante de RoutesConst).
     * @param {string} [id] id del menu.
     * @memberof MenuModel
     */
    constructor(
        nameMenu: string,
        showMenu: boolean,
        nameMenuBack: string,
        profileType: number,
        functionalities: FunctionalitiesModel[],
        urlRedirect: string,
        id?: string,
        showMenuProduction?: boolean
    ) {
        this.NameMenu = nameMenu;
        this.ShowMenu = showMenu;
        this.NameMenuBack = nameMenuBack;
        this.ProfileType = profileType;
        this.Functionalities = functionalities;
        this.UrlRedirect = urlRedirect;
        this.Id = id;
        this.ShowMenuProduction = showMenuProduction === false ? false : true;
    }
}

/**
 * Clase con la estructura de datos de las funcionalidades.
 *
 * @export
 * @class MenuModel
 */
export class FunctionalitiesModel {
    NameFunctionality: string;
    ShowFunctionality: boolean;
    nameFunctionalityBack: string;

    /**
     * Cuanto se crea una instancia del modelo de funcionalidades.
     * @param {string} nameFunctionality Nombre de la funcionalidad.
     * @param {boolean} showFunctionality Mostrar o no la funcionalidad en los componentes.
     * @param {string} nameFunctionalityBack Nombre de la funcionalidad en back para mapearlo
     * @memberof FunctionalitiesModel
     */
    constructor(
        nameFunctionality: string,
        showFunctionality: boolean,
        nameFunctionalityBack: string
    ) {
        this.NameFunctionality = nameFunctionality;
        this.ShowFunctionality = showFunctionality;
        this.nameFunctionalityBack = nameFunctionalityBack;
    }
}

// 1, Administrador 0. Vendedor.
export const ProfileTypes = {
    Vendedor: 0,
    Administrador: 1,
    Todos: 2
};

const showAll = true;


/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de ordenes o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de ordenes que posee menus:
 * 1. Todas.
 * 2. Por enviar.
 * 3. Enviadas.
 * 4. Facturación electronica.
 */
const OrdersModule = new ModuleModel('ÓRDENES', showAll, 'órdenes',
    [
        // 1. Todas (Consultar, Descargar).
        new MenuModel('Todas', showAll, 'todas', ProfileTypes.Vendedor, [
            new FunctionalitiesModel(
                'Consultar',
                showAll,
                'Consultar'
            ),
            new FunctionalitiesModel(
                'Descargar',
                showAll,
                'Descargar'
            )
        ], RoutesConst.sellerCenterOrders),
        // 2. Por enviar (Consultar, Descargar).
        new MenuModel('Por enviar', showAll, 'por enviar', ProfileTypes.Vendedor, [
            new FunctionalitiesModel(
                'Consultar',
                showAll,
                'Consultar'
            ),
            new FunctionalitiesModel(
                'Descargar',
                showAll,
                'Descargar'
            )
        ], RoutesConst.sellerCenterIntOrdersState, '35'),
        // 3. Enviadas (Consultar, Descargar).
        new MenuModel('Enviadas',
            showAll, 'enviadas', ProfileTypes.Vendedor, [
                new FunctionalitiesModel(
                    'Consultar',
                    showAll,
                    'Consultar'
                ),
                new FunctionalitiesModel(
                    'Descargar',
                    showAll,
                    'Descargar'
                )
            ], RoutesConst.sellerCenterIntOrdersState, '170'),
        // 4. Enviadas (Consultar, Descargar).
        new MenuModel('Factura electrónica', showAll, 'factura electrónica', ProfileTypes.Administrador, [
            new FunctionalitiesModel(
                'Consultar',
                showAll,
                'Consultar'
            ),
            new FunctionalitiesModel(
                'Descargar',
                showAll,
                'Descargar'
            )
        ], RoutesConst.sellerCenterIntOrderBillingOrders)
    ]
);

/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de ofertas o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de ofertas que posee menus:
 * 1. Listado de ofertas.
 * 2. Carga masiva.
 * 3. Histórico de ofertas. (Tipo vendedor)
 * 4. Histórico de ofertas. (Tipo Administrador)
 */
const OffersModule = new ModuleModel('OFERTAS', showAll, 'ofertas', [
    // 1. Listado de ofertas.
    new MenuModel('listado de Ofertas', showAll, 'listado de ofertas', ProfileTypes.Vendedor, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        ),
        new FunctionalitiesModel(
            'Editar',
            showAll,
            'Editar'
        )
    ], RoutesConst.sellerCenterIntOfersList),
    // 2. Carga masiva.
    new MenuModel('Carga Masiva', showAll, 'carga masiva', ProfileTypes.Vendedor, [
        new FunctionalitiesModel(
            'Cargar',
            showAll,
            'Cargar'
        )
    ], RoutesConst.sellerCenterIntOferBulkLoad),
    // 3. Histórico de ofertas. (Tipo vendedor)
    new MenuModel('Histórico de Carga de Ofertas', showAll, 'histórico de carga de ofertas', ProfileTypes.Vendedor, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        ),
        new FunctionalitiesModel(
            'Descargar',
            showAll,
            'Descargar'
        )
    ], RoutesConst.sellerCenterIntOferBulkLoad),
    // 4. Histórico de ofertas. (Tipo Administrador)
    new MenuModel('Histórico de Carga de Ofertas', showAll, 'histórico de carga de ofertas', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        ),
        new FunctionalitiesModel(
            'Descargar',
            showAll,
            'Descargar'
        )
    ], RoutesConst.sellerCenterIntOferHistoricalBulkLoadAdmin)
]);

/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de productos o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de productos que posee menus:
 * 1. Creación unitaria.
 * 2. Carga masiva de productos.
 * 3. Moderación.
 */
const ProductsModule = new ModuleModel('PRODUCTOS', showAll, 'productos', [
    // 1. Creación unitaria.
    new MenuModel('Creación Unitaria', showAll, 'creación unitaria', ProfileTypes.Vendedor, [
        new FunctionalitiesModel(
            'Crear',
            showAll,
            'Crear'
        )
    ], RoutesConst.sellerCenterIntCreateUnutaryProduct),
    // 2. Carga masiva de productos.
    new MenuModel('Carga masiva', showAll, 'carga masiva', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Cargar',
            showAll,
            'Cargar'
        )
    ], RoutesConst.sellerCenterIntProductBulkLoad),
    // 3. Moderación.
    new MenuModel('Moderación', showAll, 'moderación', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Cargar',
            showAll,
            'Cargar'
        )
    ], RoutesConst.sellerCenterProductModerationBulkLoad)
]);

/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de facturación o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de facturación que posee menus:
 * 1. Pagos.
 */
const BillingModule = new ModuleModel('FACTURACIÓN', showAll, 'facturación', [
    // 1. Pagos.
    new MenuModel('Pagos', showAll, 'pagos', ProfileTypes.Vendedor, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        )
    ], RoutesConst.sellerCenterIntBillingPayments)
]);

/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de vendedores o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de vendedores que posee menus:
 * 1. Registrar Nuevo.
 * 2. Administrar.
 * 3. Acuerdos.
 * 4. Listado de Vendedores.
 */
const SellerModule = new ModuleModel('VENDEDORES', showAll, 'vendedores', [
    // 1. Registrar Nuevo.
    new MenuModel('Registrar Nuevo', showAll, 'registrar nuevo', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Crear',
            showAll,
            'Crear'
        )
    ], RoutesConst.sellerCenterIntSellerRegister),
    // 2. Administrar.
    new MenuModel('Administrar', showAll, 'administrar', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        ), new FunctionalitiesModel(
            'Editar',
            showAll,
            'Editar'
        )
    ], RoutesConst.sellerCenterIntSellerManage),
    // 3. Acuerdos.
    new MenuModel('Acuerdos', showAll, 'acuerdos', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        ), new FunctionalitiesModel(
            'Visualizar',
            showAll,
            'Visualizar'
        )
    ], RoutesConst.sellerCenterIntSellerManage),
    // 4. Listado de Vendedores.
    new MenuModel('Listado de Vendedores', showAll, 'listado de vendedores', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        ), new FunctionalitiesModel(
            'Visualizar',
            showAll,
            'Visualizar'
        ), new FunctionalitiesModel(
            'Habilitar',
            showAll,
            'Habilitar'
        )
    ], RoutesConst.sellerCenterIntSellerManage),
]);

/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de documentación o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de documentación que posee menus:
 * 1. Api administrador.
 * 2. App Angular administrador.
 * 3. Api vendedor.
 * 4. App Angular vendedor.
 */
const DocumentModule = new ModuleModel('Documentación', showAll, 'documentación', [
    // 1. Api administrador.
    new MenuModel('Api', showAll, 'api', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        )
    ], 'http://sellercenter.api.exito.com.s3-website-us-east-1.amazonaws.com/'),
    // 2. App Angular administrador.
    new MenuModel('App Angular', showAll, 'app angular', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        )
    ], 'http://sellercenter.frontdoc.exito.com.co.s3-website-us-east-1.amazonaws.com/'),
    // 3. Api vendedor.
    new MenuModel('Api', showAll, 'api', ProfileTypes.Vendedor, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        )
    ], 'http://sellercenter.api.exito.com.s3-website-us-east-1.amazonaws.com/'),
    // 4. App Angular vendedor.
    new MenuModel('App Angular', showAll, 'app angular', ProfileTypes.Vendedor, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        )
    ], 'http://sellercenter.frontdoc.exito.com.co.s3-website-us-east-1.amazonaws.com/'),
]);

/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de documentación o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de documentación que posee menus:
 * 1. Cotizador.
 * 2. Especificaciones.
 */
const ParamModule = new ModuleModel('Parametrización', showAll, 'parametrización', [
    // 1. Cotizador.
    new MenuModel('Cotizador', showAll, 'cotizador', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Consultar transportadora',
            showAll,
            'Consultar transportadora'
        ), new FunctionalitiesModel(
            'Crear transportadora',
            showAll,
            'Crear transportadora'
        ), new FunctionalitiesModel(
            'Editar transportadora',
            showAll,
            'Editar transportadora'
        ), new FunctionalitiesModel(
            'Eliminar transportadora',
            showAll,
            'Eliminar transportadora'
        ), new FunctionalitiesModel(
            'Consultar zonas',
            showAll,
            'Consultar zonas'
        ), new FunctionalitiesModel(
            'Crear zonas',
            showAll,
            'Crear zonas'
        ), new FunctionalitiesModel(
            'Editar zonas',
            showAll,
            'Editar zonas'
        ), new FunctionalitiesModel(
            'Eliminar zonas',
            showAll,
            'Eliminar zonas'
        )
    ], RoutesConst.sellerCenterIntOfferQuoting),
    // 2. Especificaciones.
    new MenuModel('Especificaciones', showAll, 'especificaciones', ProfileTypes.Administrador, [
        // TODO: Funcionalidades.
    ], 'TODO: url especificaciones', null, false),
    // 2. Especificaciones.
    new MenuModel('Arbol de Categorías', showAll, 'arbol de categorías', ProfileTypes.Administrador, [
        new FunctionalitiesModel(
            'Consultar',
            showAll,
            'Consultar'
        ), new FunctionalitiesModel(
            'Editar',
            showAll,
            'Editar'
        )
    ], RoutesConst.sellerCenterIntOferTreeCategory, null, false)
]);

export const Modules = [
    OrdersModule, OffersModule, ProductsModule, BillingModule, DocumentModule, ParamModule
];


