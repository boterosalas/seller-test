/* our own custom components */
import {environment} from './../../../environments/environment';
import {Order, Billing, FinishUploadInformation, Pending, OrderDevolutionsModel} from '../../components/shared/models/order';

/**
 * Información falsa para las pruebas o cuando se corre el comando ng test de Angular
 * @export
 * @class FAKE
 */
export class FAKE {
  /**
   * Estructura vacia para los datos de un usuario
   * @static
   * @type {*}
   * @memberof FAKE
   */
  static readonly FAKEUSER: any = {
    login: false,
    nickname: 'FAKE USER',
    name: 'FAKE USER',
    role: 0,
    last_name: 'FAKE USER',
    email: 'FAKE USER',
    email_verified: '',
    picture: 'FAKE USER',
    access_token: 'FAKE USER',
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
   * @memberof FAKE
   */
  static readonly FAKEORDER: Order =
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
   * Estructura vacia para una orden de facturación
   *
   * @static
   * @type {Order}
   * @memberof FAKE
   */
  static readonly FAKEORDERBILLING: Billing =
    {
      id: 0,
      idBillingPicking: 0,
      idSeller: 0,
      billingNumber: '',
      orderNumber: '',
      payOrderNumber: '',
      concept: '',
      paymentDate: '',
      commission: 0,
      billingTotal: 0,
      paginationToken: '',
      detail: [{
        id: 0,
        idBillingDetailPicking: 0,
        detailName: '',
        ean: '',
        quantity: 0,
        commission: 0,
        price: 0,
      }]
    };


  /**
   * Estructura vacia para una orden de facturación
   * @static
   * @type {FinishUploadInformation}
   * @memberof FAKE
   */
  static readonly FAKESUCCESFINISHUPLOADINFORMATION: FinishUploadInformation =
    {
      totalProcess: 2,
      error: 2,
      successful: 0,
      listError: [
        {
          orderNumber: '668180045',
          sku: 'MK00000003056916',
          message: 'El sku no existe para la orden'
        },
        {
          orderNumber: '668370000',
          sku: 'MK00000003295166',
          message: 'La orden no existe'
        }
      ]
    };

  /**
   * Estructura vacia para una orden de facturación
   * @static
   * @type {Order}
   * @memberof FAKE
   */

  static readonly FAKEPENDINGDEVOLUTION: OrderDevolutionsModel = {
    'id': '',
    'idSeller': 0,
    'reversionRequestId': '',
    'orderNumber': '',
    'reversionRequestStatusId': 0,
    'clientObservation': '',
    'reversionRequestStatus': '',
    'reversionRequestTypeId': 0,
    'reversionRequestType': '',
    'reversionRequestReasonId': 0,
    'reversionRequestReason': '',
    'creationDate': '',
    'maximumDeliveryDate': '',
    'orderDate': '',
    'typeReturnId': 0,
    'typeReturn': '',
    'clientName': '',
    'identificationCard': '',
    'clientAddress': '',
    'clientTelephone': '',
    'sellerObservationReversionRequestRefuse': null,
    'sacObservationReversionRequestRefuse': null,
    'sellerObservationReceiptRefuse': null,
    'sacObservationReceiptRefuse': null,
    'reversionRequestDetailViewModel': {
      'reversionRequestDetailId': '',
      'detailSubOrderMarketplaceId': '',
      'productName': '',
      'sku': '',
      'reference': ' ',
      'requestedAmount': 0,
      'reverseAmount': 0
    }
  };
}
