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
     * @param {string} [showMenuProduction] Mostrar en produccion.
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
    Administrador: 1
};

const showAll = false;


/**
 * Actualizado: 29-01-2019 - lecheverry. 01-03-2019 jbanguera
 * @version 1.1 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de ordenes o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de ordenes que posee menus:
 * 1. Todas.
 * 2. Por enviar.
 * 3. Enviadas.
 * 4. Cargar guias
 * 5. Facturación electronica.
 */
export const orderModule = 'ÓRDENES', allName = 'Todas', toSendName = 'Por enviar', sendedName = 'Enviadas', onlineBillName = 'Factura Electrónica', dashboardName = 'Dashboard', guideChargesName = 'Cargar guías', bulkLoadBilling = 'Carga masiva de Facturas', billingSeller = 'Facturación vendedor';
export const readFunctionality = 'Consultar';
export const downloadFunctionality = 'Descargar';
export const updateFunctionality = 'Editar';
export const loadFunctionality = 'Cargar';
export const createFunctionality = 'Crear';
export const visualizeFunctionality = 'Visualizar';
export const enableFunctionality = 'Habilitar';
export const disableFunctionality = 'Deshabilitar';
export const vacationFunctionality = 'Vacaciones';
export const cancelVacacionFunctionality = 'Cancelar Vacaciones';
export const deleteFunctionality = 'Eliminar';
export const attachmentFunctionality = 'Adjuntar';
export const sendFunctionality = 'Enviar';
export const marketFuncionality = 'Marcar';
export const offerFuncionality = 'Ofertar';
export const idSended = '170';
export const idToSend = '35';
export const acceptFuncionality = 'Aceptar';
export const refuseFuncionality = 'Rechazar';
export const editException = 'Editar Excepción';
export const readException = 'Consultar excepción';

const OrdersModule = new ModuleModel(orderModule, showAll, orderModule.toLowerCase(), [
    // 1. Todas (Rol vendedor - Consultar, Descargar).
    new MenuModel(allName, showAll, allName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality), // Descargar.
        new FunctionalitiesModel(attachmentFunctionality, showAll, attachmentFunctionality), // Adjuntar.
        new FunctionalitiesModel(sendFunctionality, showAll, sendFunctionality), // Enviar.
        new FunctionalitiesModel(marketFuncionality, showAll, marketFuncionality) // Marcar.
    ], RoutesConst.sellerCenterOrders),
    // 2. Todas (Rol administrador - Consultar)
    new MenuModel(allName, showAll, allName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality), // Visualizar.
    ], RoutesConst.sellerCenterOrders),
    // 3. Por enviar (Rol vendedor - Consultar, Descargar).
    new MenuModel(toSendName, showAll, toSendName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality), // Descargar.
        new FunctionalitiesModel(attachmentFunctionality, showAll, attachmentFunctionality), // Adjuntar.
        new FunctionalitiesModel(sendFunctionality, showAll, sendFunctionality), // Enviar.
        new FunctionalitiesModel(marketFuncionality, showAll, marketFuncionality) // Marcar.
    ], RoutesConst.sellerCenterIntOrdersState + '/' + idToSend, idToSend),
    // 4. Por enviar (Rol administrador - Consultar).
    new MenuModel(toSendName, showAll, toSendName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality), // Visualizar.
    ], RoutesConst.sellerCenterIntOrdersState + '/' + idToSend, idToSend),
    // 5. Enviadas (Rol vendedor - Consultar, Descargar).
    new MenuModel(sendedName, showAll, sendedName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality), // Descargar.
        new FunctionalitiesModel(attachmentFunctionality, showAll, attachmentFunctionality), // Adjuntar.
        new FunctionalitiesModel(sendFunctionality, showAll, sendFunctionality), // Enviar.
        new FunctionalitiesModel(marketFuncionality, showAll, marketFuncionality) // Marcar.
    ], RoutesConst.sellerCenterIntOrdersState + '/' + idSended, idSended),
    // 6. Enviadas (Rol administrador - Consultar)
    new MenuModel(sendedName, showAll, sendedName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality), // Visualizar.
    ], RoutesConst.sellerCenterIntOrdersState + '/' + idSended, idSended),
    // 7. Cargar guias (Cargar, Descargar).
    new MenuModel(guideChargesName, showAll, guideChargesName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(loadFunctionality, showAll, loadFunctionality), // Cargar
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality), // Descargar.
    ], RoutesConst.sellerCenterIntOrderLoadGuide),
    new MenuModel(onlineBillName, showAll, onlineBillName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality), // Descargar.
        new FunctionalitiesModel(attachmentFunctionality, showAll, attachmentFunctionality), // Adjuntar.
        new FunctionalitiesModel(sendFunctionality, showAll, sendFunctionality) // Enviar.
    ], RoutesConst.sellerCenterIntOrderBillingOrders),
    new MenuModel(bulkLoadBilling, showAll, bulkLoadBilling.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(loadFunctionality, showAll, loadFunctionality) // Cargar
    ], RoutesConst.sellerCenterIntBulkLoadBilling),
    // 13. Facturación vendedor admin
    new MenuModel(billingSeller, showAll, billingSeller.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality), // Descargar.
    ], RoutesConst.sellerCenterIntBillingPayments),
]);

/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de ofertas un menu o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de ofertas que posee menus:
 * 1. Listado de ofertas.
 * 2. Carga masiva.
 * 3. Histórico de ofertas. (Tipo vendedor)
 * 4. Histórico de ofertas. (Tipo Administrador)
 * 4. listado de ofertas. (Tipo Administrador)
 */
export const offersModule = 'OFERTAS', offerListName = 'Listado de Ofertas', offerListNameAdmin = 'Listado de Ofertas', bulkLoadName = 'Carga Masiva de Ofertas', bulkLoadHistoryName = 'Histórico de Carga de Ofertas', bulkLoadHistoryNameAdmin = 'Histórico de Carga de ofertas', citiesCoverageName = 'Ciudades con Cobertura', quoteOffert = 'Cotizador';
const OffersModule = new ModuleModel(offersModule, showAll, offersModule.toLowerCase(), [
    // 1. Listado de ofertas.
    new MenuModel(offerListName, showAll, offerListName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality) // Editar
    ], RoutesConst.sellerCenterIntOfersList),
    // 2. Carga masiva.
    new MenuModel(bulkLoadName, showAll, bulkLoadName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(loadFunctionality, showAll, loadFunctionality) // Cargar
    ], RoutesConst.sellerCenterIntOferBulkLoad),
    // 3. Histórico de ofertas. (Tipo vendedor)
    new MenuModel(bulkLoadHistoryName, showAll, bulkLoadHistoryName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality)// Descargar
    ], RoutesConst.sellerCenterIntOferHistoricalBulkLoad),
    // 4. Histórico de ofertas. (Tipo Administrador)
    new MenuModel(bulkLoadHistoryNameAdmin, showAll, bulkLoadHistoryNameAdmin.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality) // Descargar
    ], RoutesConst.sellerCenterIntOferHistoricalBulkLoadAdmin),
    // 5. Listado de ofertas. (Tipo Administrador)
    new MenuModel(offerListNameAdmin, showAll, offerListNameAdmin.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
    ], RoutesConst.sellerCenterIntOfersListAdmin),
    new MenuModel(citiesCoverageName, showAll, citiesCoverageName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality) // Editar
    ], RoutesConst.sellerCenterIntOfferCitiesCoverage),
    // 6. Cotizador (Vendedor solo nacional)
    new MenuModel(quoteOffert, showAll, quoteOffert.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(deleteFunctionality, showAll, deleteFunctionality), // Eliminar
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality) // Agregar
    ], RoutesConst.sellerCenterIntOfferQuoting),
]);

/**
 * Actualizado: 25/11/2019
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de ofertas un menu o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de devoluciones que posee menus:
 * 1. Listado cancelaciones admin
 * 2. Listado cancelaciones vendedor
 */
export const devolutionsModule = 'DEVOLUCIONES', pendingName = 'Solicitudes pendientes', devolutionName = 'En devolución', validationName = 'En validación', historicDevolution = 'Historico de devoluciones', listCancelOrders = 'Listado de cancelaciones';
const DevolutionsModule = new ModuleModel(devolutionsModule, showAll, devolutionsModule.toLowerCase(), [
    // 1. Listado cancelaciones admin
    new MenuModel(listCancelOrders, showAll, listCancelOrders.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
    ], RoutesConst.sellerCenterListCancelOrders),
    // 2. Listado cancelaciones vendedor
    new MenuModel(listCancelOrders, showAll, listCancelOrders.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(acceptFuncionality, showAll, acceptFuncionality), // Aceptar.
        new FunctionalitiesModel(refuseFuncionality, showAll, refuseFuncionality), // Rechazar.
    ], RoutesConst.sellerCenterListCancelOrders)
]);


/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de productos o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de productos que posee menus:
 * 1. Creación unitaria.
 * 2. Creacion unitaria admin.
 * 3. Carga masiva de productos.
 * 4. Carga masiva Moderacion Seller Internacional
 * 5. Moderación.
 * 6. Listado de productos Admin
 * 7. Listado de productos Seller
 * 7. Estados de productos Seller
 */
export const productsModule = 'PRODUCTOS', unitaryCreateName = 'Creación Unitaria', bulkLoadProductName = 'Carga Masiva', moderateName = 'Moderación', listProductsName = 'Listado de productos', productsPending = 'Productos pendientes';
const ProductsModule = new ModuleModel(productsModule, showAll, productsModule.toLowerCase(), [
    // 1. Creación unitaria vendedor.
    new MenuModel(unitaryCreateName, showAll, unitaryCreateName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality), // Crear
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.
    ], RoutesConst.sellerCenterIntCreateUnutaryProduct),
    // 2. Creación unitaria administrador.
    new MenuModel(unitaryCreateName, showAll, unitaryCreateName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality), // Crear
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.
    ], RoutesConst.sellerCenterIntCreateUnutaryProduct),
    // 3. Carga masiva de productos administrador.
    new MenuModel(bulkLoadProductName, showAll, bulkLoadProductName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(loadFunctionality, showAll, loadFunctionality) // Cargar
    ], RoutesConst.sellerCenterIntProductBulkLoad),
    // 4. Carga masiva de productos vendedor.
    new MenuModel(bulkLoadProductName, showAll, bulkLoadProductName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(loadFunctionality, showAll, loadFunctionality) // Cargar
    ], RoutesConst.sellerCenterIntProductBulkLoad),
    // 5. Moderación.
    new MenuModel(moderateName, showAll, moderateName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(loadFunctionality, showAll, loadFunctionality) // Cargar
    ], RoutesConst.sellerCenterProductModerationBulkLoad),
    // 6. Listado de productos. (Tipo vendedor)
    new MenuModel(listProductsName, showAll, listProductsName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(offerFuncionality, showAll, offerFuncionality), // Ofertar
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar
    ], RoutesConst.sellerCenterIntListProducts),
    // 7. Listado de productos. (Tipo administrador)
    new MenuModel(listProductsName, showAll, listProductsName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(deleteFunctionality, showAll, deleteFunctionality), // Eliminar
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar
    ], RoutesConst.sellerCenterIntListProducts),
    // 8. Estados de productos Seller
    new MenuModel(productsPending, showAll, productsPending.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.
    ], RoutesConst.sellerCenterIntPendingProducts)
]);

/**
 * Actualizado: 29-01-2019 - lecheverry.
 * @version 1.0 (Creación del archivo).
 *
 * Para incluir un menu en el modulo de facturación o funcionalidad en algun menu ya creado. por favor actualizar este objeto la version y fechas.
 *
 * Modulo de facturación que posee menus:
 * 1. Detalle de Pagos.
 * 2. Resumen de Pagos.
 */
export const billingModule = 'FACTURACIÓN', paidName = 'Detalle de Pagos', paymentSummary = 'Resumen de Pagos';
const BillingModule = new ModuleModel(billingModule, showAll, billingModule.toLowerCase(), [
    // 1. Detalle de Pagos.
    new MenuModel(paidName, showAll, paidName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality)
    ], RoutesConst.sellerCenterIntBillingPayments),
    // 2. Resumen de Pagos
    new MenuModel(paymentSummary, showAll, paymentSummary.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality)
    ], RoutesConst.sellerCenterIntPaymentSummary)
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
export const sellerModule = 'VENDEDORES', registerName = 'Registrar Nuevo', administrateName = 'Administrar', agreementName = 'Acuerdos', sellerListName = 'Listado de Vendedores', uploadAgreement = 'Cargar Acuerdos', manageAgreement = 'Administrar Acuerdos';
const SellerModule = new ModuleModel(sellerModule, showAll, sellerModule.toLowerCase(), [
    // 1. Registrar Nuevo.
    new MenuModel(registerName, showAll, registerName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality) // Crear
    ], RoutesConst.sellerCenterIntSellerRegister),
    // 2. Administrar.
    new MenuModel(administrateName, showAll, administrateName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality) // Editar
    ], RoutesConst.sellerCenterIntSellerManage),
    // 3. Acuerdos.
    new MenuModel(agreementName, showAll, agreementName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality), // Visualizar
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality) // Descargar
    ], RoutesConst.sellerCenterIntSellerAgreements),
    // 4. Listado de Vendedores.
    new MenuModel(sellerListName, showAll, sellerListName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality), // Visualizar
        new FunctionalitiesModel(enableFunctionality, showAll, enableFunctionality), // Habilitar
        new FunctionalitiesModel(disableFunctionality, showAll, disableFunctionality), // Deshabilitar
        new FunctionalitiesModel(vacationFunctionality, showAll, vacationFunctionality), // vacaciones
        new FunctionalitiesModel(cancelVacacionFunctionality, showAll, cancelVacacionFunctionality) // Cancelar vacaciones
    ], RoutesConst.sellerCenterIntSellerList),
    // 5. Cargar acuerdos -contratos- anexos
    new MenuModel(uploadAgreement, showAll, uploadAgreement.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality), // Visualizar
        new FunctionalitiesModel(enableFunctionality, showAll, enableFunctionality), // Habilitar
        new FunctionalitiesModel(disableFunctionality, showAll, disableFunctionality), // Deshabilitar
        new FunctionalitiesModel(loadFunctionality, showAll, loadFunctionality) // Cargar
    ], RoutesConst.sellerCenterIntUploadAgreement),
    // 6. Administar acuerdos -contratos- anexos
    new MenuModel(manageAgreement, showAll, manageAgreement.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality), // Visualizar
        new FunctionalitiesModel(enableFunctionality, showAll, enableFunctionality), // Habilitar
        new FunctionalitiesModel(loadFunctionality, showAll, loadFunctionality) // Cargar
    ], RoutesConst.sellerCenterIntManageAgreement)
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
export const documentModule = 'DOCUMENTACIÓN', apiName = 'Api', apiAngularName = 'App Angular', apiAdminName = 'Api', apiAngularAdminName = 'App Angular';
const DocumentModule = new ModuleModel(documentModule, showAll, documentModule.toLowerCase(), [
    // 1. Api administrador.
    new MenuModel(apiName, showAll, apiName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality) // Consultar.
    ], 'http://sellercenter.api.exito.com.s3-website-us-east-1.amazonaws.com/'),
    // 2. App Angular administrador.
    new MenuModel(apiAngularName, showAll, apiAngularName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality) // Consultar.
    ], 'http://sellercenter.frontdoc.exito.com.co.s3-website-us-east-1.amazonaws.com/'),
    // 3. Api vendedor.
    new MenuModel(apiAdminName, false, apiAdminName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, false, readFunctionality) // Consultar.
    ], 'http://sellercenter.api.exito.com.s3-website-us-east-1.amazonaws.com/'),
    // 4. App Angular vendedor.
    new MenuModel(apiAngularAdminName, false, apiAngularAdminName.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, false, readFunctionality) // Consultar.
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
 * 3. Arbol de categorias.
 * 4. Perfiles.
 * 5. Marcas.
 */
export const paramModule = 'PARAMETRIZACIÓN', quoteName = 'Cotizador', transportName = 'transportadora', zonesName = 'zonas', specsName = 'Especificaciones', categoriesTreeName = 'Asignar comisión', profileName = 'Perfiles', categoryName = 'Árbol de categorías', brandName = 'Marcas', portName = 'Parametrizar Centros de Acopio', exception = 'Excepción por comisión';
const ParamModule = new ModuleModel(paramModule, showAll, paramModule.toLowerCase(), [
    // 1. Cotizador.
    new MenuModel(quoteName, showAll, quoteName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(`${readFunctionality} ${transportName}`, showAll, `${readFunctionality} ${transportName}`), // Consultar transportadora.
        new FunctionalitiesModel(`${createFunctionality} ${transportName}`, showAll, `${createFunctionality} ${transportName}`), // Crear transportadora.
        new FunctionalitiesModel(`${updateFunctionality} ${transportName}`, showAll, `${updateFunctionality} ${transportName}`), // Editar transportadora.
        new FunctionalitiesModel(`${deleteFunctionality} ${transportName}`, showAll, `${deleteFunctionality} ${transportName}`), // Eliminar transportador.
        new FunctionalitiesModel(`${readFunctionality} ${zonesName}`, showAll, `${readFunctionality} ${zonesName}`), // Consultar zonas.
        new FunctionalitiesModel(`${createFunctionality} ${zonesName}`, showAll, `${createFunctionality} ${zonesName}`), // Crear zonas.
        new FunctionalitiesModel(`${updateFunctionality} ${zonesName}`, showAll, `${updateFunctionality} ${zonesName}`), // Editar zonas.
        new FunctionalitiesModel(`${deleteFunctionality} ${zonesName}`, showAll, `${deleteFunctionality} ${zonesName}`) // Eliminar zonas.
    ], RoutesConst.sellerCenterIntOfferQuoting),
    // 2. Especificaciones.
    new MenuModel(specsName, showAll, specsName.toLowerCase(), ProfileTypes.Administrador, [
        // TODO: Funcionalidades.
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar
        new FunctionalitiesModel(deleteFunctionality, showAll, deleteFunctionality), // Eliminar
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality) // Agregar
    ], RoutesConst.sellerCenterIntParamSpecs),
    // 3. Arbol de Comisiones (Comisiones).
    new MenuModel(categoriesTreeName, showAll, categoriesTreeName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.,
        new FunctionalitiesModel(readException, showAll, readException), // Consultar excepcion.
        new FunctionalitiesModel(editException, showAll, editException), // Editar excepción.,
    ], RoutesConst.sellerCenterIntOferTreeCategory),
    // 4. Perfiles.
    new MenuModel(profileName, showAll, profileName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality) // Agregar.
    ], RoutesConst.sellerCenterIntSellerProfiles),
    // 5. Marcas.
    new MenuModel(brandName, showAll, brandName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality) // Agregar.
    ], RoutesConst.sellerCenterIntParamBrand),
    // 6. Árbol de categorías
    new MenuModel(categoryName, showAll, categoryName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality), // Crear.
        new FunctionalitiesModel(deleteFunctionality, showAll, deleteFunctionality) // Eliminar.,
    ], RoutesConst.sellerCenterIntCategoryTree),
    // 7. Parametrizar Centros de Acopio
    new MenuModel(portName, showAll, portName.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality) // Crear.
    ], RoutesConst.sellerCenterIntPort),
    new MenuModel(exception, showAll, exception.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(updateFunctionality, showAll, updateFunctionality), // Editar.
        new FunctionalitiesModel(createFunctionality, showAll, createFunctionality) // Crear.
    ], RoutesConst.sellerCenterIntException)
]);

export const reclaModule = 'RECLAMACIONES', listreclamaciones = 'Listar Reclamaciones';
const ReclaModule = new ModuleModel(reclaModule, showAll, reclaModule.toLowerCase(), [
    new MenuModel(listreclamaciones, showAll, listreclamaciones.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
    ], RoutesConst.sellerCenterCases),
    new MenuModel(listreclamaciones, showAll, listreclamaciones.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
    ], RoutesConst.sellerCenterCases)
]);

/**
 * Actualizado: 14/08/2019 - jbanguera.
 * @version 1.0 (Creación del archivo).
 * Modulo de documentación que posee menus:
 * 1. Reporte de ofertas.
 */

export const reportModule = 'REPORTES', reportOffertAdmin = 'Reporte de ofertas', reportErrorsVtex = 'Reporte de errores en VTEX', reportCommission = 'Reporte de comisiones', reportDispersion = 'Reporte cobros pendientes MPI';
const ReportModule = new ModuleModel(reportModule, showAll, reportModule.toLowerCase(), [
    new MenuModel(reportOffertAdmin, showAll, reportOffertAdmin.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality) // Descargar
    ], RoutesConst.sellerCenterIntOfferReportOffert),
    new MenuModel(reportErrorsVtex, showAll, reportErrorsVtex.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality) // Descargar
    ], RoutesConst.sellerCenterIntReportsErrorsVtex),
    new MenuModel(reportCommission, showAll, reportCommission.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality) // Descargar
    ], RoutesConst.sellerCenterIntReportsCommission),
    new MenuModel(reportDispersion, showAll, reportDispersion.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(downloadFunctionality, showAll, downloadFunctionality) // Descargar
    ], RoutesConst.sellerCenterIntReportsDispersion)]);


/**
 * Actualizado: 14/08/2019 - iTarazona.
 * @version 1.0 (Creación del archivo).
 * Modulo de calificacion que posee menus:
 * 1. Listado de calificacion.
 */

export const calificationModule = 'CALIDAD', listCalification = 'Calificación de Vendedores', consultIndicators = 'Consultar Indicadores';
const CalificationModule = new ModuleModel(calificationModule, showAll, calificationModule.toLowerCase(), [
    new MenuModel(listCalification, showAll, listCalification.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
    ], RoutesConst.sellerCenterIntListCalification),
    new MenuModel(consultIndicators, showAll, consultIndicators.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
    ], RoutesConst.sellerCenterIntConsultIndicators)],
    );


export const dispersionModule = 'DISPERSION', summaryPaymentAdmin = 'Resumen de pagos', detailPaymentAdmin = 'Detalle de dispersión';
const DispersionModule = new ModuleModel(dispersionModule, showAll, dispersionModule.toLowerCase(), [
    new MenuModel(summaryPaymentAdmin, showAll, summaryPaymentAdmin.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
    ], RoutesConst.sellerCenterIntDispersionSummary),
    new MenuModel(detailPaymentAdmin, showAll, detailPaymentAdmin.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
    ], RoutesConst.sellerCenterIntDispersionDetail)]);

export const schoolExitoModule = 'Escuela Exito', listSchoolExito = 'Escuela Exito';
const SchoolExitoModule = new ModuleModel(schoolExitoModule, showAll, schoolExitoModule.toLowerCase(), [
    new MenuModel(listSchoolExito, showAll, listSchoolExito.toLowerCase(), ProfileTypes.Administrador, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality),
    ], RoutesConst.sellerCenterIntSchoolExito),
    new MenuModel(listSchoolExito, showAll, listSchoolExito.toLowerCase(), ProfileTypes.Vendedor, [
        new FunctionalitiesModel(readFunctionality, showAll, readFunctionality), // Consultar.
        new FunctionalitiesModel(visualizeFunctionality, showAll, visualizeFunctionality),
    ], RoutesConst.sellerCenterIntSchoolExito)
]);

export const Modules = [
    OrdersModule, OffersModule, ProductsModule, BillingModule, DevolutionsModule, DocumentModule, ParamModule, SellerModule, ReclaModule, ReportModule, CalificationModule, DispersionModule, SchoolExitoModule
]; // Lista de modelo, menus a mostrar.
