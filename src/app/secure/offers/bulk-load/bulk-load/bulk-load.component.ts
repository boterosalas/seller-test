import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatTableDataSource, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { LoadingService, Logger, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { ComponentsService, RoutesConst } from '@app/shared';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { BulkLoadService } from '../bulk-load.service';
import { FinishUploadInformationComponent } from '../finish-upload-information/finish-upload-information.component';
import { ModelOffers } from '../models/offers.model';
import { SupportService } from '@app/secure/support-modal/support.service';
import { CreateProcessDialogComponent } from '@app/shared/components/create-process-dialog/create-process-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalSendEmailComponent } from '../modal-send-email/modal-send-email.component';

export const OFFERS_HEADERS_EAN = 'EAN';
export const OFFERS_HEADERS_INVENTARIO = 'Inventario';
export const OFFERS_HEADERS_STOCK = 'Inventory';
export const OFFERS_HEADERS_STOCK_FR = 'Stock';
export const OFFERS_HEADERS_PRECIO = 'Precio';
export const OFFERS_HEADERS_PRICE = 'Price';
export const OFFERS_HEADERS_PRICE_FR = 'Prix';
export const OFFERS_HEADERS_PRECIO_DESCUENTO = 'Precio con Descuento';
export const OFFERS_HEADERS_DISCOUNT_PRICE = 'Discounted Price';
export const OFFERS_HEADERS_DISCOUNT_PRICE_FR = 'Prix réduit';
export const OFFERS_HEADERS_FLETE = 'Costo de Flete Promedio';
export const OFFERS_HEADERS_SHIPPING = 'Average Freight Cost';
export const OFFERS_HEADERS_SHIPPING_FR = 'Coût moyen d\'envoie';
export const OFFERS_HEADERS_ENTREGA = 'Promesa de Entrega';
export const OFFERS_HEADERS_DELIVERY = 'Promise to Deliver';
export const OFFERS_HEADERS_DELIVERY_FR = 'Temps de livraison';
export const OFFERS_HEADERS_PERIODICIDAD = 'Periodicidad';
export const OFFERS_HEADERS_PERIODICITY = 'Periodicity';
export const OFFERS_HEADERS_PÉRIODICITÉ = 'Périodicité';
export const OFFERS_HEADERS_FREE_SHIPPING = 'Free Shipping';
export const OFFERS_HEADERS_FREE_SHIPPING_FR = 'Livraison gratuite';
export const OFFERS_HEADERS_ENVIOS_EXITO = 'Indicador Envíos Exito';
export const OFFERS_HEADERS_EXITO_INDICATOR = 'Successful Shipments Indicator';
export const OFFERS_HEADERS_EXITO_INDICATOR_FR = 'Indicateur d\'expédition Éxito';
export const OFFERS_HEADERS_COTIZADOR = 'Cotizador de Flete';
export const OFFERS_HEADERS_FREIGHT = 'Freight Quotation';
export const OFFERS_HEADERS_FREIGHT_FR = 'Cotation du fret';
export const OFFERS_HEADERS_GARANTIA = 'Garantia';
export const OFFERS_HEADERS_WARRANTY = 'Warranty';
export const OFFERS_HEADERS_WARRANTY_FR = 'Garantie';
export const OFFERS_HEADERS_LIGICAEXITO = 'FulFillment';
export const OFFERS_HEADERS_EXITO_LOGISTIC = 'Exito Logistics';
export const OFFERS_HEADERS_EXITO_LOGISTIC_FR = 'Logistique Éxito';
export const OFFERS_HEADERS_ACTIALIZACION_INVENTARIO = 'Actualizacion de Inventario';
export const OFFERS_HEADERS_UPDATE_STOCK = 'Inventory Update';
export const OFFERS_HEADERS_UPDATE_STOCK_FR = 'Mise à Jour du Stock';
export const OFFERS_HEADERS_EAN_COMBO = 'Combo EAN';
export const OFFERS_HEADERS_EAN_COMBO_ES = 'Ean combo';
export const OFFERS_HEADERS_CANTIDAD_COMBO = 'Cantidad en combo';
export const OFFERS_HEADERS_AMOUNT_COMBO = 'Quantity in combo';
export const OFFERS_HEADERS_AMOUNT_COMBO_FR = 'Bundle stock';
export const OFFERS_HEADERS_MONEDA = 'Tipo de moneda';
export const OFFERS_HEADERS_CURRENCY = 'Currency';
export const OFFERS_HEADERS_CURRENCY_FR = 'Type de monnaie';
export const OFFERS_HEADERS_DIRECCION = 'Dirección de Recogida';
export const OFFERS_HEADERS_ADDRESS = 'Pick up address';
export const OFFERS_HEADERS_ADDRESS_FR = 'Adresse de collecte';
export const OFFERS_HEADERS_CODIGO_DANE = 'Ciudad de Recogida';
export const OFFERS_HEADERS_DANECODE = 'Pick up city';
export const OFFERS_HEADERS_DANECODE_FR = 'Ville de collecte';
export const OFFERS_HEADERS_SKU_ES = 'SKU Vendedor';
export const OFFERS_HEADERS_SKU_EN = 'SKU Seller';
export const OFFERS_HEADERS_SKU_FR = 'Vendeur SKU';
export const OFFERS_HEADERS_PARENT_REF_ES = 'Referencia Padre';
export const OFFERS_HEADERS_PARENT_REF_EN = 'Parent Reference';
export const OFFERS_HEADERS_PARENT_REF_FR = 'Parent Reference';

// log component
const log = new Logger('BulkLoadComponent');
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-bulk-load',
  templateUrl: './bulk-load.component.html',
  styleUrls: ['./bulk-load.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BulkLoadComponent implements OnInit, OnDestroy {

  public paginator: any;

  /* Información del usuario*/
  public user: any;

  /* Creo el elemento que se empleara para la tabla*/
  public dataSource: MatTableDataSource<ModelOffers>;

  /*  Variable que almacena el numero de elementos de la tabla*/
  public numberElements: number;

  /* Número de órdenes cargadas*/
  public orderListLength: boolean;

  /* Objeto que contendra los datos del excel*/
  public arrayInformation: Array<ModelOffers>;

  /* Objeto que contendra los datos del excel y servira para realizar el envio de la información*/
  public arrayInformationForSend: Array<{}>;

  /* Variable que se emplea para el proceso de la carga de excel, se indica 501 por que se cuenta la primera fila que contiene los titulos*/
  public limitRowExcel: number;

  /* Número de filas cargadas*/
  public countRowUpload: number;

  /* Numero de errores*/
  public countErrors: number;

  /* Lista de logs*/
  public listLog: Array<any>;

  /* Nombre del archivo cargado*/
  public fileName: any;

  /* Sort para la tabla*/
  public sort: any;

  public arrayNecessaryData: Array<any>;

  public EanArray: any = [];

  public listErrorStatus: any = [];

  public ListError: any;

  public intervalTime = 2000;

  public language: any;

  public sendData: any;

  dialogRef: MatDialogRef<ModalSendEmailComponent>;

  // Validación de las regex
  validateRegex: any;

  offertRegex = {
    formatNumber: '',
    promiseDelivery: '',
    periodicity: '',
    warranty: '',
    price: '',
    address: '',
    daneCode: '',
    atleastonealphanumeric: '',
    referenceProduct: ''
  };


  /* Input file que carga el archivo*/
  @ViewChild('fileUploadOption', { static: false }) inputFileUpload: any;
  @ViewChild('dialogContent', { static: false }) content: TemplateRef<any>;


  constructor(
    public componentService: ComponentsService,
    public bulkLoadService: BulkLoadService,
    public dialog: MatDialog,
    public userService: UserLoginService,
    private router: Router,
    public userParams: UserParametersService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    public SUPPORT: SupportService,
    private cdr: ChangeDetectorRef,
    private languageService: TranslateService,


  ) {
    this.user = {};
    this.arrayInformation = [];
    this.arrayInformationForSend = [];
    this.listLog = [];
    this.arrayNecessaryData = [];
    this.orderListLength = true;
    this.numberElements = 0;
    this.limitRowExcel = 1048576;
    this.countRowUpload = 0;
    this.countErrors = 0;
    this.fileName = '';
  }

  /**
   * @memberof BulkLoadComponent
   */
  ngOnInit() {
    this.validateFormSupport();
    this.verifyProccesOffert();
    this.selectLanguage();
    this.language = localStorage['culture_current'];

  }

  selectLanguage() {
    this.languageService.onLangChange.subscribe((e: Event) => {
      this.language = e['lang'];
    });
  }

  /**
   * @memberof BulkLoadComponent
   */
  resetUploadFIle() {
    this.inputFileUpload.nativeElement.value = '';
  }

  /**
   * @memberof BulkLoadComponent
   */
  resetVariableUploadFile() {
    this.listLog = [];
    this.countErrors = 0;
    this.countRowUpload = 0;
    this.arrayInformation = [];
    this.arrayInformationForSend = [];
    this.orderListLength = true;
    this.numberElements = 0;
    this.fileName = '';
    this.arrayNecessaryData = [];
    this.finishProcessUpload();
  }

  /**
   * Funcionalidad que permite capturar los datos del excel.
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof BulkLoadComponent
   */
  readFileUpload(evt: any): Promise<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.loadingService.viewSpinner();

      let data: any;
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      // tslint:disable-next-line:curly
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        try {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { raw: true, type: 'binary', sheetRows: this.limitRowExcel });
          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          /* save data */
          if (ws && ws !== null && ws !== undefined) {
            data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
            log.debug(data);
            resolve(data);
          } else {
            reject(e);
          }
        } catch (e) {
          log.info(e);
          reject(e);
        }
      };
      reader.readAsBinaryString(target.files[0]);
    });
  }

  /**
   * Método que permite detectar el input file
   * @param {*} evt
   * @memberof BulkLoadComponent
   */
  onFileChange(evt: any) {
    /*1. Limpio las variables empleadas en el proceso de carga.*/
    this.resetVariableUploadFile();
    /*2. Capturo los datos del excel*/
    this.readFileUpload(evt).then(data => {
      /*3. Valido los datos del excel*/
      this.validateDataFromFile(data, evt);
      this.resetUploadFIle();
    }, err => {
      this.loadingService.closeSpinner();
      this.resetVariableUploadFile();
      this.resetUploadFIle();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.accpet_min'), 4000);
    });
  }

  /**
   * Metodo que se encarga de validar los datos del excel
   * @param {any} res
   * @param {*} file
   * @memberof BulkLoadComponent
   */
  validateDataFromFile(res: any, file: any) {
    if (res.length > 1) {
      let contEmptyRow = 0;
      this.EanArray = [];
      let shipMethodAux;
      let shipMethod = false;
      for (let i = 0; i < res[0].length; i++) {
        res[0][i] = !!res[0][i] ? res[0][i].toString().trim() : res[0][i];
      }

      for (let i = 0; i < res.length; i++) {
        shipMethodAux = 0;
        this.arrayNecessaryData.push([]);
        let priceDiscountIndex = 0;
        let priceIndex = 0;
        for (let j = 0; j < res[0].length; j++) {

          if (res[0][j] === OFFERS_HEADERS_EAN ||
            res[0][j] === OFFERS_HEADERS_INVENTARIO ||
            res[0][j] === OFFERS_HEADERS_STOCK ||
            res[0][j] === OFFERS_HEADERS_PRECIO ||
            res[0][j] === OFFERS_HEADERS_PRICE ||
            res[0][j] === OFFERS_HEADERS_PRECIO_DESCUENTO ||
            res[0][j] === OFFERS_HEADERS_DISCOUNT_PRICE ||
            res[0][j] === OFFERS_HEADERS_FLETE ||
            res[0][j] === OFFERS_HEADERS_SHIPPING ||
            res[0][j] === OFFERS_HEADERS_ENTREGA ||
            res[0][j] === OFFERS_HEADERS_DELIVERY ||
            res[0][j] === OFFERS_HEADERS_PERIODICIDAD ||
            res[0][j] === OFFERS_HEADERS_PERIODICITY ||
            res[0][j] === OFFERS_HEADERS_FREE_SHIPPING ||
            res[0][j] === OFFERS_HEADERS_ENVIOS_EXITO ||
            res[0][j] === OFFERS_HEADERS_EXITO_INDICATOR ||
            res[0][j] === OFFERS_HEADERS_COTIZADOR ||
            res[0][j] === OFFERS_HEADERS_FREIGHT ||
            res[0][j] === OFFERS_HEADERS_GARANTIA ||
            res[0][j] === OFFERS_HEADERS_WARRANTY ||
            res[0][j] === OFFERS_HEADERS_LIGICAEXITO ||
            res[0][j] === OFFERS_HEADERS_EXITO_LOGISTIC ||
            res[0][j] === OFFERS_HEADERS_ACTIALIZACION_INVENTARIO ||
            res[0][j] === OFFERS_HEADERS_UPDATE_STOCK ||
            res[0][j] === OFFERS_HEADERS_EAN_COMBO ||
            res[0][j] === OFFERS_HEADERS_EAN_COMBO_ES ||
            res[0][j] === OFFERS_HEADERS_CANTIDAD_COMBO ||
            res[0][j] === OFFERS_HEADERS_AMOUNT_COMBO ||
            res[0][j] === OFFERS_HEADERS_MONEDA ||
            res[0][j] === OFFERS_HEADERS_CURRENCY ||
            res[0][j] === OFFERS_HEADERS_DIRECCION ||
            res[0][j] === OFFERS_HEADERS_ADDRESS ||
            res[0][j] === OFFERS_HEADERS_CODIGO_DANE ||
            res[0][j] === OFFERS_HEADERS_DANECODE ||
            res[0][j] === OFFERS_HEADERS_STOCK_FR ||
            res[0][j] === OFFERS_HEADERS_PRICE_FR ||
            res[0][j] === OFFERS_HEADERS_DISCOUNT_PRICE_FR ||
            res[0][j] === OFFERS_HEADERS_SHIPPING_FR ||
            res[0][j] === OFFERS_HEADERS_DELIVERY_FR ||
            res[0][j] === OFFERS_HEADERS_FREE_SHIPPING_FR ||
            res[0][j] === OFFERS_HEADERS_EXITO_INDICATOR_FR ||
            res[0][j] === OFFERS_HEADERS_FREIGHT_FR ||
            res[0][j] === OFFERS_HEADERS_WARRANTY_FR ||
            res[0][j] === OFFERS_HEADERS_EXITO_LOGISTIC_FR ||
            res[0][j] === OFFERS_HEADERS_UPDATE_STOCK_FR ||
            res[0][j] === OFFERS_HEADERS_AMOUNT_COMBO_FR ||
            res[0][j] === OFFERS_HEADERS_CURRENCY_FR ||
            res[0][j] === OFFERS_HEADERS_ADDRESS_FR ||
            res[0][j] === OFFERS_HEADERS_DANECODE_FR ||
            res[0][j] === OFFERS_HEADERS_SKU_ES ||
            res[0][j] === OFFERS_HEADERS_SKU_EN ||
            res[0][j] === OFFERS_HEADERS_SKU_FR ||
            res[0][j] === OFFERS_HEADERS_PARENT_REF_ES ||
            res[0][j] === OFFERS_HEADERS_PARENT_REF_EN ||
            res[0][j] === OFFERS_HEADERS_PARENT_REF_FR
          ) {
            this.arrayNecessaryData[i].push(res[i][j]);
          }
          if (
            res[0][j] === OFFERS_HEADERS_ENVIOS_EXITO || res[0][j] === OFFERS_HEADERS_EXITO_INDICATOR || res[0][j] === OFFERS_HEADERS_EXITO_INDICATOR_FR ||
            res[0][j] === OFFERS_HEADERS_COTIZADOR || res[0][j] === OFFERS_HEADERS_FREIGHT || res[0][j] === OFFERS_HEADERS_FREIGHT_FR ||
            res[0][j] === OFFERS_HEADERS_FREE_SHIPPING || res[0][j] === OFFERS_HEADERS_FREE_SHIPPING_FR || 
            res[0][j] === OFFERS_HEADERS_LIGICAEXITO || res[0][j] === OFFERS_HEADERS_EXITO_LOGISTIC || res[0][j] === OFFERS_HEADERS_EXITO_LOGISTIC_FR) {
            if (res[i][j]==='1') {
              shipMethodAux++;
            }
            if (shipMethodAux>1) {
              shipMethod = true;
            }
          }
          if (res[0][j] === OFFERS_HEADERS_PRECIO || res[0][j] === OFFERS_HEADERS_PRICE_FR ||
            res[0][j] === OFFERS_HEADERS_PRICE) {
            priceIndex = j;
          }
          if (res[0][j] === OFFERS_HEADERS_PRECIO_DESCUENTO || res[0][j] === OFFERS_HEADERS_DISCOUNT_PRICE_FR ||
            res[0][j] === OFFERS_HEADERS_DISCOUNT_PRICE) {
            priceDiscountIndex = j;
          }

        }

        if (i) {
          let price = res[i][priceDiscountIndex];
          let priceError = 'DiscountPrice';
          if (!price) {
            price = res[i][priceIndex];
            priceError = 'Price';
          }
          this.EanArray.push({
            ean: res[i][res[0].indexOf('EAN')],
            price: price,
            index: i,
            error: priceError
          });
        }
      }

      const numCol: any = this.arrayNecessaryData[0].length;

      for (let i = 0; i < this.arrayNecessaryData.length; i++) {
        let contEmptycell = 0;
        let rowEmpty = false;
        for (let j = 0; j < numCol; j++) {

          if (this.arrayNecessaryData[i][j] === undefined || this.arrayNecessaryData[i][j] === null ||
            this.arrayNecessaryData[i][j] === ' ' || this.arrayNecessaryData[i][j] === '') {
            contEmptycell += 1;
            if (contEmptycell === numCol) {
              contEmptyRow += 1;
              rowEmpty = true;
            }
          }
        }
        /*Validación si hay fila vacia */
        if (rowEmpty) {
          /*Si hay fila vacia esta se remueve y se devuelve la iteración un paso */
          this.arrayNecessaryData.splice(i, 1);
          i--;
        }
      }

      if (this.arrayNecessaryData.length === 1) {
        this.loadingService.closeSpinner();
        this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), this.languageService.instant('actions.accpet_min'), 10000);
      } else {


        if (this.arrayNecessaryData[0].includes('EAN') && (this.arrayNecessaryData[0].includes('Inventario') || this.arrayNecessaryData[0].includes('Inventory') || this.arrayNecessaryData[0].includes('Stock')) &&
          (this.arrayNecessaryData[0].includes('Precio') || this.arrayNecessaryData[0].includes('Prix') || this.arrayNecessaryData[0].includes('Price'))) {


          const iVal = {
            iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
            iInv: this.validateSubTitle(this.arrayNecessaryData, 'Inventory', 'Inventario', 'Stock'),
            iPrecio: this.validateSubTitle(this.arrayNecessaryData, 'Price', 'Precio', 'Prix'),
            iPrecDesc: this.validateSubTitle(this.arrayNecessaryData, 'Discounted Price', 'Precio con Descuento', 'Prix réduit'),
            iCostFletProm: this.validateSubTitle(this.arrayNecessaryData, 'Average Freight Cost', 'Costo de Flete Promedio', 'Coût moyen d\'envoie'),
            iPromEntrega: this.validateSubTitle(this.arrayNecessaryData, 'Promise to Deliver', 'Promesa de Entrega', 'Temps de livraison'),
            iPeriodicity: this.validateSubTitle(this.arrayNecessaryData, 'Periodicity', 'Periodicidad', 'Périodicité'),
            iFreeShiping: this.validateSubTitle(this.arrayNecessaryData, 'Free Shipping', 'Free Shipping', 'Livraison gratuite'),
            iIndEnvExito: this.validateSubTitle(this.arrayNecessaryData, 'Successful Shipments Indicator', 'Indicador Envíos Exito', 'Indicateur d\'expédition Éxito'),
            iCotFlete: this.validateSubTitle(this.arrayNecessaryData, 'Freight Quotation', 'Cotizador de Flete', 'Cotation du fret'),
            iGarantia: this.validateSubTitle(this.arrayNecessaryData, 'Warranty', 'Garantia', 'Garantie'),
            iLogisticaExito: this.validateSubTitle(this.arrayNecessaryData, 'Exito Logistics', 'FulFillment', 'Logistique Éxito'),
            iActInventario: this.validateSubTitle(this.arrayNecessaryData, 'Inventory Update', 'Actualizacion de Inventario', 'Mise à Jour du Stock'),
            iEanCombo: this.validateSubTitle(this.arrayNecessaryData, 'Combo EAN', 'Ean combo', 'Ean combo'),
            iCantidadCombo: this.validateSubTitle(this.arrayNecessaryData, 'Quantity in combo', 'Cantidad en combo', 'Bundle stock'),
            iAddress: this.validateSubTitle(this.arrayNecessaryData, 'Pick up address', 'Dirección de Recogida', 'Adresse de collecte'),
            iDaneCode: this.validateSubTitle(this.arrayNecessaryData, 'Pick up city', 'Ciudad de Recogida', 'Ville de collecte'),
            iSellerSku: this.validateSubTitle(this.arrayNecessaryData, 'SKU Seller', 'SKU Vendedor', 'Vendeur SKU'),
            iReference: this.validateSubTitle(this.arrayNecessaryData, 'Parent Reference', 'Referencia Padre', 'Parent Reference')
          };
          //Elimina las filas 1 y 2 que son de titulos
          this.arrayNecessaryData.splice(1, 2);

          if (this.arrayNecessaryData.length > this.limitRowExcel) {
            this.loadingService.closeSpinner();
            this.componentService
              .openSnackBar(this.languageService.instant('secure.offers.bulk_upload.bulk_upload.exceeds_limits'), this.languageService.instant('actions.accpet_min'), 10000);
          }else if (shipMethod) {
            this.loadingService.closeSpinner();
            this.componentService
              .openSnackBar(this.languageService.instant('secure.offers.bulk_upload.bulk_upload.duplicated_shipping'), this.languageService.instant('actions.accpet_min'), 10000);
          } else {
            this.fileName = file.target.files[0].name;
            this.createTable(this.arrayNecessaryData, iVal, numCol);
          }
        } else {
          this.loadingService.closeSpinner();
          this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.formt_invalid'), this.languageService.instant('actions.accpet_min'), 10000);
        }
      }
    } else {
      this.loadingService.closeSpinner();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), this.languageService.instant('actions.accpet_min'), 10000);
    }
  }


  /**
   * @param {any} array
   * @param {string} titleEn
   * @param {string} titleEs
   * @param {string} titleFr
   * Funcion que permite valida la cabecera del archivo de carga masiva;
   * captura y retorna el valor con la cabecera existente
   *
   */

  validateSubTitle(array: any, titleEn: string, titleEs: string, titleFR: string) {
    if (array[0].indexOf(titleEs) > 0) {
      return array[0].indexOf(titleEs);
    } else if (array[0].indexOf(titleEn) > 0) {
      return array[0].indexOf(titleEn);
    } else if (array[0].indexOf(titleFR) > 0) {
      return array[0].indexOf(titleFR);
    }
  }

  /**
   * funcion para validar precios del combo
   *
   * @param {string} ean
   * @param {*} price
   * @param {*} iVal
   * @param {*} cantidadCombo
   * @returns {boolean}
   * @memberof BulkLoadComponent
   */
  validExistEan(ean: string, price: any, iVal: any, cantidadCombo: any): boolean {
    let exist = false;
    this.EanArray.forEach(element => {
      element.iVal = iVal;
      if (ean === element.ean) {
        exist = true;
        try {
          element.totalPrice += (parseFloat(price) * parseFloat(cantidadCombo));
        } catch (e) {
          console.error(this.languageService.instant('secure.offers.bulk_upload.bulk_upload.no_number'), e);
        }
      }
      // si viene vacio o alguna letra lo convierte a numero 0 para queno explote.
      if (!element.totalPrice) {
        element.totalPrice = 0;
      }
    });
    return exist;
  }

  /**
   * Método que se encarga de crear la tabla.
   *
   * @param {any} res
   * @memberof BulkLoadComponent
   */
  createTable(res: any, iVal: any, numCol: any) {
    for (let i = 0; i < res.length; i++) {
      let errorInCell = false;
      if (i !== 0 && i > 0) {
        for (let j = 0; j < numCol; j++) {

          // Validación de nuevos campos COMBO
          if (j === iVal.iEanCombo) {
            let priceCombo = res[i][iVal.iPrecDesc];
            if (!priceCombo) {
              priceCombo = res[i][iVal.iPrecio];
            }
            const fast = this.validExistEan(res[i][iVal.iEanCombo], priceCombo, iVal, res[i][iVal.iCantidadCombo]);
            // ERROR: ya que contiene ean combo pero no cantidad en combo.
            if (res[i][iVal.iEanCombo] && !res[i][iVal.iCantidadCombo]) {
              this.countErrors += 1;
              const row = i + 1, column = j + 1;
              const itemLog = {
                row: this.arrayInformation.length,
                column: j,
                type: 'NumberFormat',
                columna: column,
                fila: row,
                positionRowPrincipal: i,
                dato: 'ComboQuantity'
              };
              this.listLog.push(itemLog);
              errorInCell = true;
            } else if ((res[i][iVal.iEAN] && res[i][iVal.iEanCombo] === res[i][iVal.iEAN]) || !fast && res[i][iVal.iEanCombo]) {
              // ERROR: ya que el ean de combo es el mismo ean.
              this.countErrors += 1;
              const row = i + 1, column = j + 1;
              const itemLog = {
                row: this.arrayInformation.length,
                column: j,
                type: fast ? 'InvalidEanCombo' : 'InvalidExistEan',
                columna: column,
                msg: res[i][iVal.iEanCombo],
                fila: row,
                positionRowPrincipal: i,
                dato: 'EanCombo'
              };

              this.listLog.push(itemLog);
              errorInCell = true;

            }
          }

          if (res[i][j] !== undefined && res[i][j] !== '' && res[i][j] !== null) {
            if (j !== iVal.iEAN && j !== iVal.iPromEntrega) {
              if (j === iVal.iFreeShiping || j === iVal.iIndEnvExito || j === iVal.iCotFlete || j === iVal.iLogisticaExito || j === iVal.iActInventario) {

                const isBoolean = this.validFormat(res[i][j], 'boolean');

                if (!isBoolean && isBoolean === false) {
                  this.countErrors += 1;

                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'BoleanFormat',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iFreeShiping ? 'IsFreeShipping' : j === iVal.iIndEnvExito ? 'IsEnviosExito' : j === iVal.iCotFlete ? 'IsFreightCalculator' : j === iVal.iLogisticaExito ? 'IsLogisticsExito' : j === iVal.iActInventario ? 'IsUpdatedStock' : null
                  };

                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else if (j === iVal.iCurrency) {
                const isCurrency = this.validFormat(res[i][j], 'currency');
                if (!isCurrency && isCurrency === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'InvalidFormatCurrency',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iCurrency ? 'Currency' : null
                  };

                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else if (j === iVal.iPeriodicity) {
                const iPeriodicity = this.validFormat(res[i][j], 'formatPeriodicity');
                if (!iPeriodicity && iPeriodicity === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'InvalidFormatPeriodicity',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iPeriodicity ? 'Periodicity' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else if (j === iVal.iAddress) {
                const isAddress = this.validFormat(res[i][j], 'address');
                if (!isAddress && isAddress === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'InvalidFormatAddress',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iAddress ? 'Address' : null
                  };

                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else if (j === iVal.iDaneCode) {
                const isDaneCode = this.validFormat(res[i][j], 'daneCode');
                if (!isDaneCode && isDaneCode === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'InvalidFormatDaneCode',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iDaneCode ? 'DaneCode' : null
                  };

                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              } else if (j === iVal.iSellerSku) {
                const isSellerSku = this.validFormat(res[i][j], 'atleastonealphanumeric');
                if (!isSellerSku && isSellerSku === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'InvalidSellerSku',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iSellerSku ? 'SellerSku' : null
                  };

                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else if (j === iVal.iReference) {
                const isReference = this.validFormat(res[i][j], 'referenceProduct');
                if (!isReference && isReference === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'InvalidReference',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iReference ? 'Reference' : null
                  };

                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else if (j === iVal.iGarantia) {
                const iGarantia = this.validFormat(res[i][j], 'greaterWarranty');
                if (!iGarantia && iGarantia === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'ThanZero',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iGarantia ? 'Warranty' : null
                  };

                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else if (j === iVal.iPrecio || j === iVal.iPrecDesc) {

                const isGreaterThanZero = this.validFormat(res[i][j], 'greaterThanZero');

                if (!isGreaterThanZero && isGreaterThanZero === false) {

                  this.countErrors += 1;

                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'LessThanZero',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iPrecio ? 'Price' : j === iVal.iPrecDesc ? 'DiscountPrice' : null
                  };

                  this.listLog.push(itemLog);
                  errorInCell = true;

                }
                const correctVal = this.validPrice(res[i][j], res[i][iVal.iCurrency]);
                if (!correctVal) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'LessThanZero',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iPrecio ? 'Price' : j === iVal.iPrecDesc ? 'DiscountPrice' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else if (j === iVal.iCostFletProm) {
                const correctVal = this.validPrice(res[i][j], res[i][iVal.iCurrency]);
                if (!correctVal) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'LessThanZero',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: 'AverageFreightCost'
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }

              } else {
                const onlyNumber = this.validFormat(res[i][j], 'alphanumeric');
                if (onlyNumber === false && !onlyNumber) {

                  this.countErrors += 1;

                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'NumberFormat',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iInv ? 'Stock' : j === iVal.iCantidadCombo ? 'ComboQuantity' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;

                }
              }
            } else if (j === iVal.iPromEntrega) {

              const validFormatPromEntrega = this.validFormat(res[i][j], 'formatPromEntrega');
              if (!validFormatPromEntrega && validFormatPromEntrega === false) {

                this.countErrors += 1;

                const row = i + 1, column = j + 1;

                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'InvalidFormatPromEntrega',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'PromiseDelivery'
                };

                this.listLog.push(itemLog);
                errorInCell = true;

              }
            }
          } else if ((j === iVal.iInv && !res[i][iVal.iEanCombo]) || j === iVal.iPrecio) {
            if (res[i][j] === undefined || res[i][j] === '' || res[i][j] === null) {
              this.countErrors += 1;
              const row = i + 1, column = j + 1;

              const itemLog = {
                row: this.arrayInformation.length,
                column: j,
                type: 'dateNotFound',
                columna: column,
                fila: row,
                positionRowPrincipal: i,
                dato: j === iVal.iInv ? 'Stock' : j === iVal.iPrecio ? 'Price' : null
              };

              this.listLog.push(itemLog);
              errorInCell = true;
            }
          } else if ((j === iVal.iEAN && !res[i][iVal.iReference])) {
            if (res[i][j] === undefined || res[i][j] === '' || res[i][j] === null) {
              this.countErrors += 1;
              const row = i + 1, column = j + 1;

              const itemLog = {
                row: this.arrayInformation.length,
                column: j,
                type: 'dateNotFound',
                columna: column,
                fila: row,
                positionRowPrincipal: i,
                dato: j === iVal.iEAN ? 'Ean' : null
              };

              this.listLog.push(itemLog);
              errorInCell = true;
            }
          } else {
            log.info('Dato cargado correctamente');
          }
        }
      }

      if (errorInCell) {
        this.addRowToTable(res, i, iVal);
        errorInCell = false;
      }

      this.addInfoTosend(res, i, iVal);
    }
    this.validatePrices();

    this.orderListLength = this.arrayInformationForSend.length === 0 ? true : false;

    if (this.countErrors === 0) {
      this.sendJsonOffer(0);
    }
  }

  validPrice(price: any, currency: any) {
    if (currency === 'COP') {
      const regex = new RegExp(this.offertRegex.price);
      return !!regex.test(price);
    } else {
      const regex = new RegExp(this.offertRegex.formatNumber);
      return regex.test(price);
    }
  }

  /**
   * Valida el precio del producto combo con sus componentes.
   *
   * @memberof BulkLoadComponent
   */
  validatePrices(): void {
    this.EanArray.forEach(element => {
      let exist = false;
      let priceMF = element.price;
      try {
        priceMF = parseFloat(element.price);
      } catch (e) {
        console.error(e);
      }
      if (priceMF !== element.totalPrice && element.price && element.totalPrice) {
        this.arrayInformation.forEach(error => {
          if (error.EAN === element.ean) {
            exist = true;
          }
        });

        const itemLog = {
          row: this.arrayInformation.length,
          column: element.index + 1,
          columna: element.index + 1,
          type: 'InvalidPriceCombo',
          fila: element.iVal.iPrecio,
          positionRowPrincipal: element.index,
          dato: element.error
        };
        // InvalidPriceOfferCombo DiscountPrice
        this.listLog.push(itemLog);

        if (!exist) {
          this.countErrors++;
          this.addRowToTable(this.arrayNecessaryData, element.index, element.iVal);
        }
      }
    });
  }

  /**
   * Método que Almacena los  Registros cargados y que se emplearan para realizar el envio
   * @param {any} res
   * @param {any} index
   * @memberof BulkLoadComponent
   */
  addInfoTosend(res: any, index: any, iVal: any) {
    const newObjectForSend = {
      EAN: res[index][iVal.iEAN],
      Stock: res[index][iVal.iInv],
      Price: res[index][iVal.iPrecio],
      DiscountPrice: res[index][iVal.iPrecDesc],
      AverageFreightCost: res[index][iVal.iCostFletProm],
      PromiseDelivery: res[index][iVal.iPromEntrega],
      Periodicity: res[index][iVal.iPeriodicity],
      IsFreeShipping: res[index][iVal.iFreeShiping],
      IsEnviosExito: res[index][iVal.iIndEnvExito],
      IsFreightCalculator: res[index][iVal.iCotFlete],
      Warranty: res[index][iVal.iGarantia],
      IsLogisticsExito: res[index][iVal.iLogisticaExito] ? res[index][iVal.iLogisticaExito] : '0',
      IsUpdatedStock: res[index][iVal.iActInventario] ? res[index][iVal.iActInventario] : '0',
      ComboQuantity: res[index][iVal.iCantidadCombo] ? res[index][iVal.iCantidadCombo] : '',
      EanCombo: res[index][iVal.iEanCombo] ? res[index][iVal.iEanCombo] : '',
      Currency: res[index][iVal.iCurrency] ? res[index][iVal.iCurrency] : 'COP',
      Address: res[index][iVal.iAddress],
      DaneCode: res[index][iVal.iDaneCode],
      SellerSku: res[index][iVal.iSellerSku],
      Reference: res[index][iVal.iReference]
      // Currency: 'COP'
    };
    this.arrayInformationForSend.push(newObjectForSend);
  }

  /**
   * Método que permite almacenar los registros de errores que se visualizaran en la tabla
   * @param {any} res
   * @param {any} index
   * @memberof BulkLoadComponent
   */
  addRowToTable(res: any, index: any, iVal: any) {
    /* elemento que contendra la estructura del excel y permitra agregarlo a la variable final que contendra todos los datos del excel */
    const newObject: ModelOffers = {
      EAN: res[index][iVal.iEAN],
      Stock: res[index][iVal.iInv],
      Price: res[index][iVal.iPrecio],
      DiscountPrice: res[index][iVal.iPrecDesc],
      AverageFreightCost: res[index][iVal.iCostFletProm],
      PromiseDelivery: res[index][iVal.iPromEntrega],
      Periodicity: res[index][iVal.iPeriodicity],
      IsFreeShipping: res[index][iVal.iFreeShiping],
      IsEnviosExito: res[index][iVal.iIndEnvExito],
      IsFreightCalculator: res[index][iVal.iCotFlete],
      Warranty: res[index][iVal.iGarantia],
      IsLogisticsExito: res[index][iVal.iLogisticaExito] ? res[index][iVal.iLogisticaExito] : '0',
      IsUpdatedStock: res[index][iVal.iActInventario] ? res[index][iVal.iActInventario] : '0',
      ComboQuantity: res[index][iVal.iCantidadCombo] ? res[index][iVal.iCantidadCombo] : '',
      EanCombo: res[index][iVal.iEanCombo] ? res[index][iVal.iEanCombo] : '',
      Currency: res[index][iVal.iCurrency] ? res[index][iVal.iCurrency] : '',
      Address: res[index][iVal.iAddress],
      DaneCode: res[index][iVal.iDaneCode],
      SellerSku: res[index][iVal.iSellerSku],
      Reference: res[index][iVal.iReference],
      errorRow: false
    };

    this.arrayInformation.push(newObject);
  }

  /**
   * Método que termina de armar los datos para la tabla.
   * @memberof BulkLoadComponent
   */
  finishProcessUpload() {
    /* almaceno el numero de filas cargadas correctamente */
    this.countRowUpload = this.arrayInformationForSend.length;
    /* opción para visualizar el contenedor de no se ha cargado información */
    this.orderListLength = this.arrayInformationForSend.length === 0 ? true : false;
    /* Creo el elemento que permite pintar la tabla */
    const data = JSON.stringify(this.arrayInformation);
    this.dataSource = new MatTableDataSource(JSON.parse(data));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.numberElements = this.dataSource.data.length;
    this.loadingService.closeSpinner();
  }

  /**
   * Funcionalidad para limpiar los errores seleccionados en la tabla
   * @memberof BulkLoadComponent
   */
  setErrrorColumns() {
    for (let index = 0; index < this.arrayInformation.length; index++) {
      this.arrayInformation[index].errorEan = false;
      this.arrayInformation[index].errorStock = false;
      this.arrayInformation[index].errorPrice = false;
      this.arrayInformation[index].errorDiscountPrice = false;
      this.arrayInformation[index].errorAverageFreightCost = false;
      this.arrayInformation[index].errorPromiseDelivery = false;
      this.arrayInformation[index].errorPeriodicity = false;
      this.arrayInformation[index].errorIsFreeShipping = false;
      this.arrayInformation[index].errorIsEnviosExito = false;
      this.arrayInformation[index].errorIsFreightCalculator = false;
      this.arrayInformation[index].errorWarranty = false;
      this.arrayInformation[index].errorIsLogisticsExito = false;
      this.arrayInformation[index].errorIsUpdatedStock = false;
      this.arrayInformation[index].errorEanCombo = false;
      this.arrayInformation[index].errorComboQuantity = false;
      this.arrayInformation[index].errorCurrency = false;
      this.arrayInformation[index].errorAddress = false;
      this.arrayInformation[index].errorDaneCode = false;
      this.arrayInformation[index].errorRow = false;
      this.arrayInformation[index].errorSellerSku = false;
      this.arrayInformation[index].errorReference = false;
    }
  }

  /**
   * Funcionalidad para seleccionar el error del log en la tabla
   * @param {*} item
   * @memberof BulkLoadComponent
   */
  selectErrorLog(item: any) {
    this.setErrrorColumns();
    log.info(item);
    this.arrayInformation[item.row]['error' + item.dato] = true;
    this.arrayInformation[item.row].errorRow = true;
    const data = JSON.stringify(this.arrayInformation);
    this.dataSource = new MatTableDataSource(JSON.parse(data));

    /* ubico el indice de la paginación en la posición inicial */
    this.paginator.pageIndex = 0;

    /* seteo el paginador de la tabla */
    this.dataSource.paginator = this.paginator;

    /* capturo el item seleccionado por el usuairio */
    const currentItem = item.row + 1;

    const indexPage = this.paginator.pageSize;

    /* Metodo para calcular la posicion del elemento seleccionado por el usuario en la lista de errores,
    recibe la ubicación del item y el numero de paginas que el usuario tiene aplicadas. con estos datos se calcula donde esta el registro */
    this.paginator.pageIndex = Math.ceil((currentItem / indexPage)) - 1;

    /* seteo los valores a la tabla */
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Método que permite realizar el envío del json cargado del excel
   * @memberof BulkLoadComponent
   */
  sendJsonInformation() {
    this.arrayInformationForSend.splice(0, 1);
    this.loadingService.viewSpinner();
    this.bulkLoadService.setOffers(this.arrayInformationForSend)
      .subscribe(
        (result: any) => {
          if (result.status === 200 || result.status === 201) {
            const data = result;
            log.info(data);
            if (data.body.successful !== 0 || data.body.error !== 0) {
              this.openDialogSendOrder(data);
            } else if (data.body.successful === 0 && data.body.error === 0) {
              this.modalService.showModal('errorService');
            }
          } else {
            this.modalService.showModal('errorService');
          }
          // this.resetVariableUploadFile();
          this.loadingService.closeSpinner();
        }
      );
  }


  /**
   * Funcionalidad para desplegar el
   * modal que permite visualizar la lista de
   * mensajes que retorna el back con los errores o registros correctos.
   * @param {any} res
   * @memberof BulkLoadComponent
   */
  openDialogSendOrder(res: any): void {
    const dialogRef = this.dialog.open(FinishUploadInformationComponent, {
      width: '95%',
      data: {
        response: res,
        responseDiferent: false
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
    });
  }

  /**
   * @method validFormat
   * @param inputtxt
   * @param validation
   * @description Metodo para validar el formato de las celdas enviadas del excel
   * @memberof BulkLoadComponent
   */
  validFormat(inputtxt: any, validation?: string) {
    let valueReturn: boolean;
    // const formatNumber = /^[0-9]+$/;
    const eanRegex = /^([A-Za-z0-9]{0,16})$/;
    // const formatPromEntrega = /^0*[1-9]\d?\s[a]{1}\s0*[1-9]\d?$/;
    // const formatCurrency = /^(COP|USD)$/;

    if (inputtxt === undefined) {
      valueReturn = false;
    } else if (inputtxt !== undefined) {
      inputtxt = inputtxt.trim();
      switch (validation) {
        case 'alphanumeric':
          if ((inputtxt.match(this.offertRegex.formatNumber))) {
            valueReturn = true;
          } else {
            if ((inputtxt.match(eanRegex))) {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          }
          break;
        case 'boolean':
          if ((inputtxt.match(this.offertRegex.formatNumber))) {
            if (inputtxt === '1' || inputtxt === '0') {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          } else {
            valueReturn = false;
          }
          break;
        case 'greaterThanZero':
          if ((inputtxt.match(this.offertRegex.formatNumber))) {
            const num = parseInt(inputtxt, 10);
            if (num > 0) {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          } else {
            valueReturn = false;
          }
          break;
        case 'greaterWarranty':
          if ((inputtxt.match(this.offertRegex.warranty))) {
            const num = parseInt(inputtxt, 10);
            if (num >= 0) {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          } else {
            valueReturn = false;
          }
          break;
        case 'formatPromEntrega':
          if ((inputtxt.match(this.offertRegex.promiseDelivery))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatPeriodicity':
          if ((inputtxt.match(this.offertRegex.periodicity))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'address':
          if ((inputtxt.match(this.offertRegex.address))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'daneCode':
          if ((inputtxt.match(this.offertRegex.daneCode))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'atleastonealphanumeric':
          if ((inputtxt.match(this.offertRegex.atleastonealphanumeric))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'referenceProduct':
          if ((inputtxt.match(this.offertRegex.referenceProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
      }
    }
    return valueReturn;
  }

  /*---------------------------------------- Metodos para descargar formato ----------------------------------------*/
  /**
   * Método para descargar el formato de excel para carga masiva
   * @param {any} form
   * @memberof BulkLoadComponent
   */

  /* Massive offer load*/
  downloadFormatMassiveOfferLoad(culture: any) {
    if (culture === 'ES') {
      const emptyFile = [{
        'EAN': undefined,
        'Inventario': undefined,
        'Precio': undefined,
        'Precio con Descuento': undefined,
        'Costo de Flete Promedio': undefined,
        'Promesa de Entrega': undefined,
        'Free Shipping': undefined,
        'Indicador Envíos Exito': undefined,
        'Actualizacion de Inventario': undefined,
        'Cotizador de Flete': undefined,
        'Garantia': undefined,
        'Ean combo': undefined,
        'Cantidad en combo': undefined,
        'Tipo de moneda': undefined,
        'Dirección de Recogida': undefined,
        'Ciudad de Recogida': undefined
      }];
      log.info(emptyFile);
      this.exportAsExcelFile(emptyFile, 'Formato de Carga de Ofertas');
    }
  }

  /* Massive offer load Internacional English*/
  downloadFormatMassiveOfferLoadInternational(culture: any) {
    if (culture === 'US') {
      const emptyFile = [{
        'EAN': undefined,
        'Stock': undefined,
        'Price': undefined,
        'Discount Price': undefined,
        'Shipping Cost': undefined,
        'Delivery Terms': undefined,
        'Free Shipping': undefined,
        'Envios Exito Indicator': undefined,
        'Stock Update': undefined,
        'Freight Calculator': undefined,
        'Warranty': undefined,
        'Ean combo': undefined,
        'Amount in combo': undefined,
        'Currency': undefined,
        'Pick up address': undefined,
        'Pick up city': undefined,
      }];
      log.info(emptyFile);
      this.exportAsExcelFile(emptyFile, 'Offer upload format');
    }
  }

  /* Massive offer load Internacional lenguaje FRANCES*/
  downloadFormatMassiveOfferLoadInternational_FR(culture: any) {
    if (culture === 'FR') {
      const emptyFile = [{
        'EAN': undefined,
        'Stock': undefined,
        'Prix': undefined,
        'Prix réduit': undefined,
        'Coût moyen d\'envoie': undefined,
        'Temps de livraison': undefined,
        'Livraison gratuite': undefined,
        'Indicateur d\'expédition Éxito': undefined,
        'Mise à Jour du Stock': undefined,
        'Cotation du fret': undefined,
        'Garantie': undefined,
        'Ean combo': undefined,
        'Bundle stock': undefined,
        'Type de monnaie': undefined,
        'Adresse de collecte': undefined,
        'Collection City': undefined,
      }];
      log.info(emptyFile);
      this.exportAsExcelFile(emptyFile, 'Offrir le format de téléchargement');
    }
  }

  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof BulkLoadComponent
   */
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'Ofertas': worksheet }, SheetNames: ['Ofertas'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
   * Método que genera el dato json en el formato que emplea excel  idioma ingles
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof BulkLoadComponent
   */
  exportAsExcelFileInternational(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'Offerts': worksheet }, SheetNames: ['Offerts'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    this.saveAsExcelFileInternational(excelBuffer, excelFileName);
  }

  /**
   * Método que genera el dato json en el formato que emplea excel Internacional idioma frances
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof BulkLoadComponent
   */
  exportAsExcelFileInternational_FR(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'Offres': worksheet }, SheetNames: ['Offres'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    this.saveAsExcelFileInternational_FR(excelBuffer, excelFileName);
  }

  /**
   * Método que permite generar el excel con los datos pasados.
   * @param {*} buffer
   * @param {string} fileName
   * @memberof BulkLoadComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  /**
   * Método que permite generar el excel con los datos pasados en ingles para Internacional
   *
   * @param {*} buffer
   * @param {string} fileName
   * @memberof BulkLoadComponent
   */
  saveAsExcelFileInternational(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  /**
   * Método que permite generar el excel con los datos pasados en ingles para Internacional
   *
   * @param {*} buffer
   * @param {string} fileName
   * @memberof BulkLoadComponent
   */
  saveAsExcelFileInternational_FR(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  /**
   * Método que permite dar el formato correcto al archivo excel generado
   * @param {*} s
   * @returns
   * @memberof BulkLoadComponent
   */
  s2ab(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  // Funcion para cargar datos de regex
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'ofertas' || data.Module === 'transversal' || data.Module === 'productos');
      for (const val in this.offertRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.offertRegex[val] = element && `${element.Value}`;
        }
      }
    });
  }

  /**
   * Funcion para enviar la informacion luego de que pasa las validacion del front
   *
   * @memberof BulkLoadComponent
   */
  sendJsonOffer(approval: number) {
    if (approval !== 1) {
      this.arrayInformationForSend.splice(0, 1);
    }
    this.arrayInformationForSend.forEach(element => {
      // Validacion para que siempre se envie la promesa de entrega # a #.
      if (element['PromiseDelivery']) {
        const promiseSplited = (element['PromiseDelivery'].split(/\s(a|-|to)\s/));
        const convertPromise = promiseSplited[0] + ' a ' + promiseSplited[2];
        element['PromiseDelivery'] = convertPromise;
      }
      if (element['EAN']) {
        element['OfferByReference'] = false;
      } else if (!element['EAN'] && element['Reference']) {
        element['OfferByReference'] = true;
      } else {
        element['OfferByReference'] = false;
      }
    });
    this.sendData = {
      'PriceApproval': approval,
      'ListOffers': this.arrayInformationForSend
    };
    this.bulkLoadService.setOffers(this.sendData)
      .subscribe(
        (result: any) => {
          if (result) {
            if ((result.data.successful === result.data.totalProcess) && (result.data.error === 0)) {
              this.openModal(1, null);
            } else {
              const { offerNotifyViewModels } = result.data;
              this.openModal(3, offerNotifyViewModels);
            }
          }
          // this.resetVariableUploadFile();
          this.loadingService.closeSpinner();
        }
      );
  }

  /**
   * Funcion para verificar el status de la carga, se llama en dos veces una con la carga inicial y la otra cuando se sube un archivo
   *
   * @memberof BulkLoadComponent
   */
  verifyProccesOffert() {
    this.loadingService.viewSpinner();
    this.arrayInformationForSend.splice(0, 1);
    this.bulkLoadService.verifyStatusBulkLoad().subscribe((res) => {
      try {
        if (res && res.status === 200) {
          const { status, checked } = res.body.data;
          if ((status === 1 || status === 4) && checked !== 'true') {
            const statusCurrent = 1;
            setTimeout(() => { this.openModal(statusCurrent, null); });
          } else if (status === 2 && checked !== 'true') {
            setTimeout(() => { this.openModal(status, null); });
          } else if (status === 3 && checked !== 'true') {
            const response = res.body.data.response;
            if (response) {
              this.listErrorStatus = JSON.parse(response).Data.OfferNotify;
            } else {
              this.listErrorStatus = null;
            }
            setTimeout(() => { this.openModal(status, this.listErrorStatus); });
          } else {
            this.loadingService.closeSpinner();
          }
        }
      } catch {
        this.loadingService.viewSpinner();
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Abre un dialogo para mostrar el estados de la carga de batch
   *
   * @param {number} status
   * @memberof BulkLoadComponent
   */
  openModal(type: number, listError: any) {
    this.loadingService.closeSpinner();
    if (this.arrayInformationForSend.length > 0) {
      this.calculateIntervalTime();
    } else {
      this.intervalTime = 6000;
    }
    const data = {
      successText: this.languageService.instant('secure.products.Finish_upload_product_information.successful_upload'),
      failText: this.languageService.instant('secure.products.Finish_upload_product_information.error_upload'),
      processText: this.languageService.instant('secure.products.Finish_upload_product_information.upload_progress'),
      initTime: 500,
      intervalTime: this.intervalTime,
      listError: listError,
      typeStatus: type,
      responseDiferent: false
    };
    this.cdr.detectChanges();
    const dialog = this.dialog.open(FinishUploadInformationComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      disableClose: type === 1,
      data: data
    });
    const dialogIntance = dialog.componentInstance;
    dialogIntance.request = this.bulkLoadService.verifyStatusBulkLoad();
    dialogIntance.processFinish$.subscribe((val) => {
      dialog.disableClose = false;
    });
    this.configDialog(dialog);
  }

  configDialog(dialog: any) {
    const dialogComponent = dialog.componentInstance;
    dialogComponent.confirmation = () => {
      this.dialog.closeAll();
      this.sendJsonOffer(1);
    };
  }
  /**
   * Calcula el tiempo del intervalo para realizar la consultado (consulta iterativa recursiva) el promedio de rango 0.012 ~ 0.018
   *
   * @memberof BulkLoadComponent
   */
  calculateIntervalTime() {
    const sizeFile = this.arrayInformationForSend.length;
    if (sizeFile > 100) {
      this.intervalTime = 7 * (sizeFile * 10);
    } else {
      this.intervalTime = 6000;
    }

  }

  /**
   * funcion para abrir el modal de envio de correo de ofertas
   *
   * @memberof BulkLoadComponent
   */
  requestMail(productType: string) {
    this.dialogRef = this.dialog.open(ModalSendEmailComponent, {
      data: { productType }
    });
  }

  /**
   * destruye el compomente y cierra el modal
   *
   * @memberof BulkLoadComponent
   */
  ngOnDestroy() {
    this.loadingService.closeSpinner();
    this.dialog.closeAll();
  }
}
