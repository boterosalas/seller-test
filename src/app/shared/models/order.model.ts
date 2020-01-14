/**
 * Estructura de los datos para la tabla.
 * @export
 * @class Order
 */
export class Order {
  id: number;
  processedOrder: boolean;
  allowShipping: boolean;
  sendAllProduct: boolean;
  orderNumber?: string;
  idSeller: number;
  nameSeller?: string;
  nitSeller?: string;
  idChannel: number;
  channel?: string;
  dateOrder: string;
  idStatusOrder: number;
  statusOrder?: string;
  costTotalOrder: number;
  costTotalShipping: number;
  commission: number;
  dateMaxDeliveryOrder: string;
  typeDespatchOrder?: string;
  identificationCard?: string;
  clientName?: string;
  clientTelephone?: string;
  clientAddress?: string;
  products?: (ProductsEntity)[] | Array<ProductsEntity>;
}

/**
 * Información del cliente
 * @export
 * @class InfoClient
 */
export class InfoClient {
  identificationCard?: string;
  clientName?: string;
  clientTelephone?: string;
  clientAddress?: string;
}

/**
 * Información del producto
 * @export
 * @class ProductsEntity
 */
export class ProductsEntity {
  idDetailProduct: number;
  idPicking: number;
  id: number;
  nameProduct?: string;
  productId?: string;
  sku?: number;
  ean?: string;
  checkProductToSend: boolean;
  reference?: string;
  idStatusProduct: number;
  statusProduct: string;
  quantity: number;
  costProduct: number;
  costShippingProduct: number;
  commission: number;
  dateMaxDeliveryProduct: string;
  typeDespatchProduct?: string;
  tracking?: string;
  carrier?: string;
  dateDelivery: string;
  enviosExito: boolean;
  fulfillment: boolean;
}

/**
 * Información de la categoría
 * @export
 * @class CategoryList
 */
export class CategoryList {
  root: string;
  name: string;
  id: string;
  buttonId: string;
  count: number;
}

/**
 * Información de la orden en estado pendiente
 * @export
 * @class Pending
 */
export class Pending {
  id: number;
  reasonReturn: string;
  orderNumber: string;
  dateOrder: string;
  dateRequest: string;
  dateMaxResponse: string;
  idSeller: number;
  nameSeller: string;
  nitSeller: string;
  idChannel: number;
  channel: string;
  idStatusOrder: number;
  statusOrder: string;
  costTotalOrder: string;
  costTotalShipping: string;
  commission: string;
  typeDespatchOrder: string;
  identificationCard?: string;
  clientName?: string;
  clientTelephone?: string;
  clientAddress?: string;
  products?: (Products)[] | Array<Products>;
}

/**
 * Información de los productos
 * @export
 * @class Products
 */
export class Products {
  idDetailProduct: number;
  reasonReturn: string;
  commentaryReturn: string;
  idPicking: number;
  id: number;
  nameProduct?: string;
  productId?: string;
  sku?: number;
  ean?: string;
  checkProductToSend: boolean;
  reference?: string;
  idStatusProduct: number;
  statusProduct: string;
  quantity: number;
  costProduct: number;
  costShippingProduct: number;
  commission: number;
  dateMaxDeliveryProduct: string;
  typeDespatchProduct?: string;
  tracking?: string;
  carrier?: string;
  dateDelivery: string;
  enviosExito: boolean;
  fulfillment: boolean;
}

/**
 * Estructura de la guía
 * @export
 * @class Guide
 */
export class Guide {
  carrier: string;
  tracking: string;
}

/**
 * Estructura de la carga de guía
 * @export
 * @class LoadGuide
 */
export class LoadGuide {
  orderNumber: number;
  sku: string;
  quantity: number;
  carrier: string;
  tracking: string;
  errorRow: boolean;
  errorColumn1: boolean;
  errorColumn2: boolean;
  errorColumn3: boolean;
  errorColumn4: boolean;
  errorColumn5: boolean;
}

/**
 * Estructura para las transportadoras
 * @export
 * @class Carries
 */
export class Carries {
  active: boolean;
  created: string;
  id: number;
  name: string;
}

/**
 * Estructura para los datos de las órdenes de facturaicón/Pagos
 * @export
 * @class Billing
 */
export class Billing {
  id: number;
  idBillingPicking?: number;
  idSeller: number;
  billingNumber: string;
  orderNumber?: string;
  payOrderNumber?: string;
  concept: string;
  paymentDate: string;
  commission: number;
  billingTotal: number;
  detail?: (DetailEntity)[] | Array<DetailEntity>;
  fulfillmentDetail?: DetailFulfillment | null;
  paginationToken: string;
}

/**
 * Include in Billing
 * @export
 * @class DetailEntity
 */
export class DetailEntity {
  id: number;
  idBillingDetailPicking: number;
  detailName: string;
  ean: string;
  quantity: number;
  commission: number;
  price: number;
}

/**
 * Detalles relacionados a una factura con un concepto "Logistica Exito"
 * en el módulo de "billing".
 * Este módelo es incluido dentro de "Billing".
 *
 * @export
 * @class DetailFulfillment
 */
export class DetailFulfillment {
  totalStorage: number;
  totalMovement: number;
}

/**
 * Estructura empleada para el proceso luego de finalizar la carga de las guías
 * @export
 * @class FinishUploadInformation
 */
export class FinishUploadInformation {
  totalProcess: number;
  error: number;
  successful: number;
  listError?: (DetailFinishUploadInformation)[] | Array<DetailFinishUploadInformation>;
}

/**
 * DetailFinishUploadInformation
 * @export
 * @class DetailFinishUploadInformation
 */
export class DetailFinishUploadInformation {
  orderNumber: string;
  sku: string;
  message: string;
}

/**
 * Estructura para las órdenes pendientes
 * @export
 * @class PendingDevolutionsModel
 */
export class OrderDevolutionsModel {
  id: string;
  idSeller: number;
  reversionRequestId: string;
  orderNumber: string;
  reversionRequestStatusId: number;
  reversionRequestStatus: string;
  reversionRequestTypeId: number;
  reversionRequestType: string;
  reversionRequestReasonId: number;
  clientObservation: string;
  reversionRequestReason: string;
  creationDate: string;
  maximumDeliveryDate: string;
  orderDate: string;
  typeReturnId: number;
  typeReturn: string;
  clientName: string;
  identificationCard: string;
  clientAddress: string;
  clientTelephone: string;
  sellerObservationReversionRequestRefuse?: null;
  sacObservationReversionRequestRefuse?: null;
  sellerObservationReceiptRefuse?: null;
  sacObservationReceiptRefuse?: null;
  attachedEvidence?: null;
  reversionRequestDetailViewModel: ReversionRequestDetailViewModel;
}

/**
 * ReversionRequestDetailViewModel
 * @export
 * @class ReversionRequestDetailViewModel
 */
export class ReversionRequestDetailViewModel {
  reversionRequestDetailId: string;
  detailSubOrderMarketplaceId: string;
  productName: string;
  sku: string;
  reference: string;
  requestedAmount: number;
  reverseAmount: number;
  attachedEvidence: any;
}

/**
 * Estructura para la respuesta de la lista de opciones de reachazo
 * @export
 * @class reasonRejection
 */
export class ListReasonRejectionResponseEntity {
  idMotivoSolicitudReversion: string;
  nombreMotivoSolicitudReversion: string;
}

/**
 * Estructura empleada por la clase SearchFormEntity
 * @export
 * @class InformationToForm
 */
export class InformationToForm {
  reversionRequestStatusId: number;
}

/**
 * Entidad que se emplea en los formularios de las diferente tablas de la aplicación,
 * Permite indicar el titulo, el tipo de formulario y la información que se le desee pasar al formulario.
 * @export
 * @class SearchFormEntity
 */
export class SearchFormEntity {
  title: string;
  subtitle: string;
  type_form: string;
  btn_title: string;
  title_for_search: string;
  information: InformationToForm;
  count: string;
}

export interface HistoricalDevolutionEntity {
  id: string;
  idSeller: number;
  reversionRequestId: string;
  orderNumber: string;
  reversionRequestStatusId: number;
  reversionRequestStatus: string;
  reversionRequestTypeId: number;
  reversionRequestType: string;
  reversionRequestReasonId: number;
  reversionRequestReason: string;
  creationDate: string;
  maximumDeliveryDate: string;
  orderDate: string;
  typeReturnId: number;
  typeReturn: string;
  clientName: string;
  identificationCard: string;
  clientAddress: string;
  clientTelephone: string;
  clientObservation: null | string;
  sellerObservationReversionRequestRefuse: null | string;
  sacObservationReversionRequestRefuse: null | string;
  sellerObservationReceiptRefuse: null | string;
  sacObservationReceiptRefuse: null | string;
  reversionRequestDetailViewModel: ReversionRequestDetailViewModel;
}

export interface StateEntity {
  Id: number;
  Name: string;
}

export interface CitiesEntity {
  Id: number;
  Name: string;
  IdState: number;
  DaneCode: string;
  SincoDaneCode: string;
  Status?: boolean;
}
