import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { LoadingService, Logger, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { ComponentsService, RoutesConst } from '@app/shared';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { BulkLoadService } from '../bulk-load.service';
import { FinishUploadInformationComponent } from '../finish-upload-information/finish-upload-information.component';
import { ModelOffers } from '../models/offers.model';

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
export class BulkLoadComponent implements OnInit {

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

  /* Input file que carga el archivo*/
  @ViewChild('fileUploadOption') inputFileUpload: any;


  constructor(
    public componentService: ComponentsService,
    public bulkLoadService: BulkLoadService,
    public dialog: MatDialog,
    public userService: UserLoginService,
    private router: Router,
    public userParams: UserParametersService,
    private loadingService: LoadingService,
    private modalService: ModalService
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
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
    } else if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    }

  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'administrator') {
      this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
    }
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
          const ws: XLSX.WorkSheet = wb.Sheets['Ofertas'];
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
      this.componentService.openSnackBar('Se ha presentado un error al cargar la información', 'Aceptar', 4000);
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

      for (let i = 0; i < res.length; i++) {

        this.arrayNecessaryData.push([]);

        for (let j = 0; j < res[0].length; j++) {

          if (res[0][j] === 'EAN' ||
            res[0][j] === 'Inventario' ||
            res[0][j] === 'Precio' ||
            res[0][j] === 'Precio con Descuento' ||
            res[0][j] === 'Costo de Flete Promedio' ||
            res[0][j] === 'Promesa de Entrega' ||
            res[0][j] === 'Free Shipping' ||
            res[0][j] === 'Indicador Envios Exito' ||
            res[0][j] === 'Cotizador de Flete' ||
            res[0][j] === 'Garantia' ||
            res[0][j] === 'Logistica Exito' ||
            res[0][j] === 'Actualizacion de Inventario' ||
            res[0][j] === 'Ean combo' ||
            res[0][j] === 'Cantidad en combo') {
            this.arrayNecessaryData[i].push(res[i][j]);
          }

        }

        if (i) {
          let price = res[i][this.arrayNecessaryData[0].indexOf('Precio con Descuento')];
          let priceError = 'DiscountPrice';
          if (!price) {
            price = res[i][this.arrayNecessaryData[0].indexOf('Precio')];
            priceError = 'Price';
          }
          this.EanArray.push({
            ean: res[i][this.arrayNecessaryData[0].indexOf('EAN')],
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
        this.componentService.openSnackBar('El archivo seleccionado no posee información', 'Aceptar', 10000);
      } else {
        if (this.arrayNecessaryData[0].includes('EAN') && this.arrayNecessaryData[0].includes('Inventario') &&
          this.arrayNecessaryData[0].includes('Precio')) {
          const iVal = {
            iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
            iInv: this.arrayNecessaryData[0].indexOf('Inventario'),
            iPrecio: this.arrayNecessaryData[0].indexOf('Precio'),
            iPrecDesc: this.arrayNecessaryData[0].indexOf('Precio con Descuento'),
            iCostFletProm: this.arrayNecessaryData[0].indexOf('Costo de Flete Promedio'),
            iPromEntrega: this.arrayNecessaryData[0].indexOf('Promesa de Entrega'),
            iFreeShiping: this.arrayNecessaryData[0].indexOf('Free Shipping'),
            iIndEnvExito: this.arrayNecessaryData[0].indexOf('Indicador Envios Exito'),
            iCotFlete: this.arrayNecessaryData[0].indexOf('Cotizador de Flete'),
            iGarantia: this.arrayNecessaryData[0].indexOf('Garantia'),
            iLogisticaExito: this.arrayNecessaryData[0].indexOf('Logistica Exito'),
            iActInventario: this.arrayNecessaryData[0].indexOf('Actualizacion de Inventario'),
            iEanCombo: this.arrayNecessaryData[0].indexOf('Ean combo'),
            iCantidadCombo: this.arrayNecessaryData[0].indexOf('Cantidad en combo')
          };
          if (this.arrayNecessaryData.length > this.limitRowExcel) {
            this.loadingService.closeSpinner();
            this.componentService
              .openSnackBar('El número de registros supera los 1,048,576, no se permite esta cantidad', 'Aceptar', 10000);
          } else {
            this.fileName = file.target.files[0].name;
            this.createTable(this.arrayNecessaryData, iVal, numCol);
          }
        } else {
          this.loadingService.closeSpinner();
          this.componentService.openSnackBar('El formato seleccionado es invalido', 'Aceptar', 10000);
        }
      }
    } else {
      this.loadingService.closeSpinner();
      this.componentService.openSnackBar('El archivo seleccionado no posee información', 'Aceptar', 10000);
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
          console.error('El precio del producto no es un numero', e);
        }
      }
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
            } else if (res[i][iVal.iEanCombo] === res[i][iVal.iEAN] || !fast && res[i][iVal.iEanCombo]) {
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

              } else if (j === iVal.iPrecio || j === iVal.iPrecDesc || j === iVal.iGarantia) {

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
                    dato: j === iVal.iPrecio ? 'Price' : j === iVal.iPrecDesc ? 'DiscountPrice' : j === iVal.iGarantia ? 'Warranty' : null
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
                    dato: j === iVal.iCostFletProm ? 'AverageFreightCost' : j === iVal.iInv ? 'Stock' : j === iVal.iCantidadCombo ? 'ComboQuantity' : null
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
          } else if (j === iVal.iEAN || (j === iVal.iInv && !res[i][iVal.iEanCombo]) || j === iVal.iPrecio) {
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
                dato: j === iVal.iEAN ? 'Ean' : j === iVal.iInv ? 'Stock' : j === iVal.iPrecio ? 'Price' : null
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
      this.sendJsonInformation();
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
      IsFreeShipping: res[index][iVal.iFreeShiping],
      IsEnviosExito: res[index][iVal.iIndEnvExito],
      IsFreightCalculator: res[index][iVal.iCotFlete],
      Warranty: res[index][iVal.iGarantia],
      IsLogisticsExito: res[index][iVal.iLogisticaExito] ? res[index][iVal.iLogisticaExito] : '0',
      IsUpdatedStock: res[index][iVal.iActInventario] ? res[index][iVal.iActInventario] : '0',
      ComboQuantity: res[index][iVal.iCantidadCombo] ? res[index][iVal.iCantidadCombo] : '',
      EanCombo: res[index][iVal.iEanCombo] ? res[index][iVal.iEanCombo] : '',
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
      IsFreeShipping: res[index][iVal.iFreeShiping],
      IsEnviosExito: res[index][iVal.iIndEnvExito],
      IsFreightCalculator: res[index][iVal.iCotFlete],
      Warranty: res[index][iVal.iGarantia],
      IsLogisticsExito: res[index][iVal.iLogisticaExito] ? res[index][iVal.iLogisticaExito] : '0',
      IsUpdatedStock: res[index][iVal.iActInventario] ? res[index][iVal.iActInventario] : '0',
      ComboQuantity: res[index][iVal.iCantidadCombo] ? res[index][iVal.iCantidadCombo] : '',
      EanCombo: res[index][iVal.iEanCombo] ? res[index][iVal.iEanCombo] : '',
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
      this.arrayInformation[index].errorIsFreeShipping = false;
      this.arrayInformation[index].errorIsEnviosExito = false;
      this.arrayInformation[index].errorIsFreightCalculator = false;
      this.arrayInformation[index].errorWarranty = false;
      this.arrayInformation[index].errorIsLogisticsExito = false;
      this.arrayInformation[index].errorIsUpdatedStock = false;
      this.arrayInformation[index].errorEanCombo = false;
      this.arrayInformation[index].errorComboQuantity = false;
      this.arrayInformation[index].errorRow = false;
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
          if (result.status === 200) {
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
          this.resetVariableUploadFile();
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
        response: res
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
    const formatNumber = /^[0-9]+$/;
    const formatPromEntrega = /^0*[1-9]\d?\s[a]{1}\s0*[1-9]\d?$/;
    if (inputtxt === undefined) {
      valueReturn = false;
    } else if (inputtxt !== undefined) {
      inputtxt = inputtxt.trim();
      switch (validation) {
        case 'alphanumeric':
          if ((inputtxt.match(formatNumber))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'boolean':
          if ((inputtxt.match(formatNumber))) {
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
          if ((inputtxt.match(formatNumber))) {
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
        case 'formatPromEntrega':
          if ((inputtxt.match(formatPromEntrega))) {
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
  downloadFormatMassiveOfferLoad() {
    const emptyFile = [{
      'EAN': undefined,
      'Inventario': undefined,
      'Precio': undefined,
      'Precio con Descuento': undefined,
      'Costo de Flete Promedio': undefined,
      'Promesa de Entrega': undefined,
      'Free Shipping': undefined,
      'Indicador Envios Exito': undefined,
      'Cotizador de Flete': undefined,
      'Garantia': undefined,
      'Ean combo': undefined,
      'Cantidad en combo': undefined
    }];
    log.info(emptyFile);
    this.exportAsExcelFile(emptyFile, 'Formato de Carga de Ofertas');
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

}
