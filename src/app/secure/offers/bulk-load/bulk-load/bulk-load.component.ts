/* 3rd party components */
import { Component, ViewChild, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource, MatDialog, MatSort, MatSidenav, MatPaginator } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as FileSaver from 'file-saver';

/* our own custom components */
import { BulkLoadService } from '../bulk-load.service';
import { FinishUploadInformationComponent } from '../finish-upload-information/finish-upload-information.component';
import { ModelOffers } from '../models/offers.model';
import {
  Logger,
  ComponentsService,
  LoggedInCallback,
  Callback,
  UserLoginService,
  UserParametersService,
  RoutesConst
} from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';
import { Router } from '@angular/router';

/* log component */
const log = new Logger('BulkLoadComponent');
const EXCEL_EXTENSION = '.xlsx';

/**
 * Component que permite realizar la carga de guías, consta de tres componentes mas
 * FinishUploadInformationComponent
 * TableLoadComponent
 * TableErrorsComponent
 * Estos componentes se emplean para separar
 * el comportamiento de la carga de guías, se
 * emplea "TableErrorsComponent" para visualizar la
 * lista de errores capturados al momento de subir el archivo excel.
 * se emplea "TableLoadComponent" para visualizar la lista de datos
 * con errores en una tabla y visualizar el total de registros correctos
 * y se emplea "FinishUploadInformationComponent" para desplegar un modal
 * donde se visualicen los logs generados por el back al momento de envíar
 * las guías. en FinishUploadInformationComponent se permite generar un excel
 * con el log obtenido.
 */
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
export class BulkLoadComponent implements OnInit, LoggedInCallback, Callback {

  public paginator: any;

  /* Información del usuario*/
  public user: any;

  /* Creo el elemento que se empleara para la tabla*/
  public dataSource: MatTableDataSource<ModelOffers>;

  /*  Variable que almacena el numero de elementos de la tabla*/
  public numberElements = 0;

  /* Número de órdenes cargadas*/
  public orderListLength = true;

  /* Objeto que contendra los datos del excel*/
  public arrayInformation: Array<ModelOffers> = [];

  /* Objeto que contendra los datos del excel y servira para realizar el envio de la información*/
  public arrayInformationForSend: Array<{}> = [];

  /* Variable que se emplea para el proceso de la carga de excel, se indica 501 por que se cuenta la primera fila que contiene los titulos*/
  public limitRowExcel = 1048576;

  /* Número de filas cargadas*/
  public countRowUpload = 0;

  /* Numero de errores*/
  public countErrors = 0;

  /* Lista de logs*/
  public listLog = [];

  /* Nombre del archivo cargado*/
  public fileName: any = '';

  /* Sort para la tabla*/
  public sort: any;

  public arrayNecessaryData: Array<any> = [];
  public arrayCorrectData: Array<any> = [];

  /* Input file que carga el archivo*/
  @ViewChild('fileUploadOption') inputFileUpload: any;

  /**
   * Creates an instance of BulkLoadComponent.
   * @param {ComponentsService} componentService
   * @param {BulkLoadService} BulkLoadService
   * @param {MatDialog} dialog
   * @param {ShellComponent} shellComponent
   * @memberof BulkLoadComponent
   */
  constructor(
    public componentService: ComponentsService,
    public bulkLoadService: BulkLoadService,
    public dialog: MatDialog,
    public shellComponent: ShellComponent,
    public userService: UserLoginService,
    private router: Router,
    public userParams: UserParametersService
  ) {
    this.user = {};
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

  callback() { }

  getDataUser() {
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
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
    this.arrayCorrectData = [];
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
      this.shellComponent.loadingComponent.viewLoadingSpinner();

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
          /* const wsname: string = wb.SheetNames[0]; */
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
      this.shellComponent.loadingComponent.closeLoadingSpinner();
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
  validateDataFromFile(res, file: any) {
    if (res.length > 1) {
      let contEmptyRow = 0;

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
            res[0][j] === 'Garantia') {
            this.arrayNecessaryData[i].push(res[i][j]);
          }

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
        if (!rowEmpty) {
          this.arrayCorrectData.push(this.arrayNecessaryData[i]);
        }
      }

      if (this.arrayCorrectData.length === 1) {
        this.shellComponent.loadingComponent.closeLoadingSpinner();
        this.componentService.openSnackBar('El archivo seleccionado no posee información', 'Aceptar', 10000);
      } else {
        if (this.arrayCorrectData[0].includes('EAN') && this.arrayCorrectData[0].includes('Inventario') &&
          this.arrayCorrectData[0].includes('Precio')) {
          const iVal = {
            iEAN: this.arrayCorrectData[0].indexOf('EAN'),
            iInv: this.arrayCorrectData[0].indexOf('Inventario'),
            iPrecio: this.arrayCorrectData[0].indexOf('Precio'),
            iPrecDesc: this.arrayCorrectData[0].indexOf('Precio con Descuento'),
            iCostFletProm: this.arrayCorrectData[0].indexOf('Costo de Flete Promedio'),
            iPromEntrega: this.arrayCorrectData[0].indexOf('Promesa de Entrega'),
            iFreeShiping: this.arrayCorrectData[0].indexOf('Free Shipping'),
            iIndEnvExito: this.arrayCorrectData[0].indexOf('Indicador Envios Exito'),
            iCotFlete: this.arrayCorrectData[0].indexOf('Cotizador de Flete'),
            iGarantia: this.arrayCorrectData[0].indexOf('Garantia')
          };
          if (this.arrayCorrectData.length > this.limitRowExcel) {
            this.shellComponent.loadingComponent.closeLoadingSpinner();
            this.componentService
              .openSnackBar('El número de registros supera los 1,048,576, no se permite esta cantidad', 'Aceptar', 10000);
          } else {
            this.fileName = file.target.files[0].name;
            this.createTable(this.arrayCorrectData, iVal, numCol);
          }
        } else {
          this.shellComponent.loadingComponent.closeLoadingSpinner();
          this.componentService.openSnackBar('El formato seleccionado es invalido', 'Aceptar', 10000);
        }
      }
    } else {
      this.shellComponent.loadingComponent.closeLoadingSpinner();
      this.componentService.openSnackBar('El archivo seleccionado no posee información', 'Aceptar', 10000);
    }
  }

  /**
  * Método que se encarga de crear la tabla
  * @param {any} res
  * @memberof BulkLoadComponent
  */
  createTable(res, iVal, numCol) {

    for (let i = 0; i < res.length; i++) {

      let isErrorNumber = false;
      let isErrorData = false;
      let isErrorBoolean = false;
      let isLessThanZero = false;
      let invalidFormatPromEntrega = false;

      if (i !== 0 && i > 0) {
        for (let j = 0; j < numCol; j++) {

          if (res[i][j] !== undefined && res[i][j] !== '' && res[i][j] !== null) {

            if (j !== iVal.iEAN && j !== iVal.iPromEntrega) {

              if (j === iVal.iFreeShiping || j === iVal.iIndEnvExito || j === iVal.iCotFlete) {

                const isBoolean = this.isBoolean(res[i][j]);

                if (!isBoolean && isBoolean === false) {

                  this.countErrors += 1;

                  const row = i + 1, column = j + 1;

                  // tslint:disable-next-line:no-shadowed-variable
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'BoleanFormat',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i
                  };

                  this.listLog.push(itemLog);
                  isErrorBoolean = true;
                }

              } else if (j === iVal.iPrecio || j === iVal.iPrecDesc || j === iVal.iGarantia) {

                const isGreaterThanZero = this.isGreaterThanZero(res[i][j]);

                if (!isGreaterThanZero && isGreaterThanZero === false) {

                  this.countErrors += 1;

                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'LessThanZero',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i
                  };

                  this.listLog.push(itemLog);
                  isLessThanZero = true;

                }
              } else {
                const onlyNumber = this.alphanumeric(res[i][j]);
                if (onlyNumber === false && !onlyNumber) {

                  this.countErrors += 1;

                  const row = i + 1, column = j + 1;

                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'NumberFormat',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i
                  };

                  this.listLog.push(itemLog);
                  isErrorNumber = true;

                }
              }
            } else if (j === iVal.iPromEntrega) {

              const validFormatPromEntrega = this.validFormatPromEntrega(res[i][j]);

              if (!validFormatPromEntrega && validFormatPromEntrega === false) {

                this.countErrors += 1;

                const row = i + 1, column = j + 1;

                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'InvalidFormatPromEntrega',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };

                this.listLog.push(itemLog);
                invalidFormatPromEntrega = true;

              }
            }
          } else if (j === iVal.iEAN || j === iVal.iInv || j === iVal.iPrecio) {
            if (res[i][j] === undefined || res[i][j] === '' || res[i][j] === null) {
              this.countErrors += 1;

              const row = i + 1, column = j + 1;

              const itemLog = {
                row: this.arrayInformation.length,
                column: j,
                type: 'dateNotFound',
                columna: column,
                fila: row,
                positionRowPrincipal: i
              };

              this.listLog.push(itemLog);
              isErrorData = true;
            }

          } else {
            log.info('Dato cargado correctamente');
          }
        }
      }

      if (isErrorData || isErrorNumber || isErrorBoolean || isLessThanZero || invalidFormatPromEntrega) {

        this.addRowToTable(res, i, iVal);
        isErrorData = false;
        isErrorNumber = false;
        isErrorBoolean = false;
        isLessThanZero = false;
        invalidFormatPromEntrega = false;

      }

      this.addInfoTosend(res, i, iVal);
    }

    this.orderListLength = this.arrayInformationForSend.length === 0 ? true : false;

    if (this.countErrors === 0) {
      this.sendJsonInformation();
    }

  }

  /**
  * Método que Almacena los  Registros cargados y que se emplearan para realizar el envio
  * @param {any} res
  * @param {any} index
  * @memberof BulkLoadComponent
  */
  addInfoTosend(res, index, iVal) {

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
      Warranty: res[index][iVal.iGarantia]
    };
    this.arrayInformationForSend.push(newObjectForSend);
  }

  /**
  * Método que permite almacenar los registros de errores que se visualizaran en la tabla
  * @param {any} res
  * @param {any} index
  * @memberof BulkLoadComponent
  */
  addRowToTable(res, index, iVal) {
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
      errorRow: false,
      errorColumn1: false,
      errorColumn2: false,
      errorColumn3: false,
      errorColumn4: false,
      errorColumn5: false,
      errorColumn6: false,
      errorColumn7: false,
      errorColumn8: false,
      errorColumn9: false,
      errorColumn10: false
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
    this.shellComponent.loadingComponent.closeLoadingSpinner();
  }

  /**
  * Funcionalidad para limpiar los errores seleccionados en la tabla
  * @memberof BulkLoadComponent
  */
  setErrrorColumns() {
    for (let index = 0; index < this.arrayInformation.length; index++) {
      this.arrayInformation[index].errorColumn1 = false;
      this.arrayInformation[index].errorColumn2 = false;
      this.arrayInformation[index].errorColumn3 = false;
      this.arrayInformation[index].errorColumn4 = false;
      this.arrayInformation[index].errorColumn5 = false;
      this.arrayInformation[index].errorColumn6 = false;
      this.arrayInformation[index].errorColumn7 = false;
      this.arrayInformation[index].errorColumn8 = false;
      this.arrayInformation[index].errorColumn9 = false;
      this.arrayInformation[index].errorColumn10 = false;
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
    switch (item.column) {
      case 0:
        this.arrayInformation[item.row].errorColumn1 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 1:
        this.arrayInformation[item.row].errorColumn2 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 2:
        this.arrayInformation[item.row].errorColumn3 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 3:
        this.arrayInformation[item.row].errorColumn4 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 4:
        this.arrayInformation[item.row].errorColumn5 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 5:
        this.arrayInformation[item.row].errorColumn6 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 6:
        this.arrayInformation[item.row].errorColumn7 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 7:
        this.arrayInformation[item.row].errorColumn8 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 8:
        this.arrayInformation[item.row].errorColumn9 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
      case 9:
        this.arrayInformation[item.row].errorColumn10 = true;
        this.arrayInformation[item.row].errorRow = true;
        break;
    }
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
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    this.bulkLoadService.setOffers(this.arrayInformationForSend)
      .subscribe(
        (result: any) => {
          if (result.status === 200) {
            const data = result;
            log.info(data);
            if (data.body.successful !== 0 || data.body.error !== 0) {
              this.openDialogSendOrder(data);
            } else if (data.body.successful === 0 && data.body.error === 0) {
              this.shellComponent.modalComponent.showModal('errorService');
            }
          } else {
            this.shellComponent.modalComponent.showModal('errorService');
          }
          this.resetVariableUploadFile();
          this.shellComponent.loadingComponent.closeLoadingSpinner();
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
  openDialogSendOrder(res): void {
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
  * Método para identificar si un string solo contiene números
  * @param {any} inputtxt
  * @returns
  * @memberof BulkLoadComponent
  */
  alphanumeric(inputtxt) {
    if (inputtxt === undefined) {
      return false;
    } else {
      const letterNumber = /^[0-9]+$/;
      if ((inputtxt.match(letterNumber))) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
  * Método para validar si es booleano el dato
  * @param {any} inputtxt
  * @returns
  * @memberof BulkLoadComponent
  */
  isBoolean(inputtxt) {
    if (inputtxt === undefined) {
      return false;
    } else {
      const filterNumbre = /^[0-9]+$/;
      if ((inputtxt.match(filterNumbre))) {
        if (inputtxt === '1' || inputtxt === '0') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  /**
  * Método para validar si es mayor a 0
  * @param {any} inputtxt
  * @returns
  * @memberof BulkLoadComponent
  */
  isGreaterThanZero(inputtxt) {
    if (inputtxt === undefined) {
      return false;
    } else {
      const filterNumbre = /^[0-9]+$/;
      if ((inputtxt.match(filterNumbre))) {
        // tslint:disable-next-line:radix
        const num = parseInt(inputtxt);
        if (num > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  /**
  * Metodo para validar formato de la promesa de entrega
  * @param inputtxt
  */
  validFormatPromEntrega(inputtxt) {
    if (inputtxt === undefined) {
      return false;
    } else {
      const format = /^0*[1-9]\d?\s[a]{1}\s0*[1-9]\d?$/;
      if ((inputtxt.match(format))) {
        return true;
      } else {
        return false;
      }
    }
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
      'Garantia': undefined
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