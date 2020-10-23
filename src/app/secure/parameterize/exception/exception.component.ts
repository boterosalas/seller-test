import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoadingService, Logger } from '@app/core';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { EndpointService } from '@app/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { ComponentsService } from '@app/shared';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ModalResultLoadExceptionComponent } from './modal-result-load-exception/modal-result-load-exception.component';
import { FinishUploadInformationComponent } from '@app/secure/offers/bulk-load/finish-upload-information/finish-upload-information.component';
import { ExceptionBrandService } from '@app/secure/offers/stores/tree/components/exception-brand/exception-brand.service';
import * as moment from 'moment';

const log = new Logger('BulkLoadProductComponent');
const EXCEL_EXTENSION = '.xlsx';



@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss']
})
export class ExceptionComponent implements OnInit, OnDestroy {



  disabledBtn = true;
  public url: string;
  currentStoreSelect: StoreModel = new StoreModel(0, '');

  activeException: Boolean = false;

  public listLog: Array<any>;
  public countErrors: number;
  public countRowUpload: number;
  public arrayInformation: Array<any>;
  public arrayInformationForSend: Array<{}>;
  public orderListLength: boolean;
  public numberElements: number;
  public fileName: any;
  public arrayNecessaryData: Array<any>;
  public dataSource: MatTableDataSource<any>;
  public limitRowExcel: number;
  public paginator: any;
  public sort: any;
  public iVal: any;
  public data: any;
  public listErrorStatus: any;

  public exceptionRegex = {
    ean: '',
    number: '',
    validateDate: '',
    hours: '',
    formatNumerHours: '',
    maxNumerOneHundred: '',
    maxTwoDigNinetyNine: '',
    numberAndPoint: ''
  };

  @ViewChild('fileUploadOption') inputFileUpload: any;

  constructor(
    private emitterSeller: EventEmitterSeller,
    private loadingService: LoadingService,
    private api: EndpointService,
    public SUPPORT: SupportService,
    private languageService: TranslateService,
    public componentService: ComponentsService,
    private exceptionBrandService: ExceptionBrandService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.selectSeller();
    this.validateFormSupport();
    this.verifyExceptLoad();
    this.url = this.api.get('uploadMasiveUpload');
  }
  /**
   * funcion para verificcar es estado de la carga por usuario logeado
   *
   * @memberof ExceptionComponent
   */
  verifyExceptLoad() {
    this.exceptionBrandService.verifyStatusBulkLoad().subscribe((res) => {
      try {
        if (res && res.status === 200) {
          const { status, checked } = res.body.data;
          if ((status === 1 || status === 4) && checked === 'true') {
            const statusCurrent = 1;
            setTimeout(() => { this.openModalStatus(statusCurrent, null); });
          } else if (status === 2 && checked === 'true') {
            setTimeout(() => { this.openModalStatus(status, null); });
          } else if (status === 3 && checked === 'true') {
            const response = res.body.data.response;
            if (response) {
              this.listErrorStatus = response.ListError;
            } else {
              this.listErrorStatus = null;
            }
            setTimeout(() => { this.openModalStatus(status, this.listErrorStatus); });
          } else {
            this.loadingService.closeSpinner();
          }
        }
      } catch {
        this.loadingService.viewSpinner();
      }
    });
  }
  /**
   * funcion para seleccionar a un vendedor en especifico
   *
   * @memberof ExceptionComponent
   */
  selectSeller() {
    this.loadingService.viewSpinner();
    this.emitterSeller.eventSearchSeller.subscribe(data => {
      if (data) {
        this.currentStoreSelect = data;
        this.activeException = true;
        this.disabledBtn = false;
      }
      this.loadingService.closeSpinner();
    });
  }
  /**
   * funcion para leer el archivo cargado
   *
   * @param {*} evt
   * @memberof ExceptionComponent
   */
  onFileChange(evt: any) {
    /*1. Limpio las variables empleadas en el proceso de carga.*/
    this.resetVariableUploadFile();
    /*2. Capturo los datos del excel*/
    this.readFileUpload(evt).then(data => {
      this.loadingService.viewSpinner();
      /*3. Valido los datos del excel*/
      this.validateDataFromFile(data, evt);
      this.resetUploadFIle();
    }, err => {
      this.loadingService.closeSpinner();
      this.resetVariableUploadFile();
      this.resetUploadFIle();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), 'Aceptar', 4000);
    });
  }
  /**
   * funcion para limpiar las variables de carga del archivo
   *
   * @memberof ExceptionComponent
   */
  resetVariableUploadFile() {
    /*Limpio las variables empleadas para visualizar los resultados de la carga*/
    this.listLog = [];
    this.countErrors = 0;
    this.countRowUpload = 0;
    this.arrayInformation = [];
    this.arrayInformationForSend = [];
    this.orderListLength = true;
    this.numberElements = 0;
    this.fileName = '';
    this.arrayNecessaryData = [];
  }
  /**
   * funcion para leer el archivo cargado
   *
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof ExceptionComponent
   */
  readFileUpload(evt: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingService.viewSpinner();
      let data: any;
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { raw: true, type: 'binary', sheetRows: this.limitRowExcel });
          let ws: XLSX.WorkSheet;

          if (wb.Sheets && wb.Sheets['Hoja1']) {
            ws = wb.Sheets['Hoja1'];
          }

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


  resetUploadFIle() {
    this.inputFileUpload.nativeElement.value = '';
  }

  validateDataFromFile(res: any, file: any) {
    if (res.length > 1) {
      let contEmptyRow = 0;
      /*Se hace iteración en todas las filas del excel*/
      for (let i = 0; i < res.length; i++) {
        /*Se crea un nuevo objeto por cada fila que traiga el excel*/
        this.arrayNecessaryData.push([]);
        /*Se hace iteración en todas las columnas que tenga una fila del excel*/
        for (let j = 0; j < res[0].length; j++) {
          /*Se valida si la primera celda de cada columna si tenga dato, si no tiene no se tendra en cuenta*/
          if (res[0][j] !== '' && res[0][j] !== null && res[0][j] !== undefined) {
            /*Se insertan los datos de la celda en el objeto creato anteriormente dentro del arreglo de datos necesarios, solo si el la primera celda de toda la columna trae datos*/
            this.arrayNecessaryData[i].push(res[i][j]);
          }
        }
      }

      /*Constante para almacenar cuantas columnas tienes el archivo de excel*/
      const numCol: any = this.arrayNecessaryData[0].length;

      /*Se hace iteración en el arreglo dependiendo del número de filas*/
      for (let i = 0; i < this.arrayNecessaryData.length; i++) {
        /*Variable para contar cuantas celdas vacias tiene una fila*/
        let contEmptycell = 0;
        /*Variable para decir si una fila esta vacia*/
        let rowEmpty = false;

        /*Iteracion de 0 hasta el número de columnas */
        for (let j = 0; j < numCol; j++) {
          /*Validación para saber si una celda esta vacia*/
          if (this.arrayNecessaryData[i][j] === undefined || this.arrayNecessaryData[i][j] === null ||
            this.arrayNecessaryData[i][j] === ' ' || this.arrayNecessaryData[i][j] === '') {
            /*Si hay celdas vacias se empiezan a contar*/
            contEmptycell += 1;
            /*Validación si el número de celdas vacias es igual al número de columnas*/
            if (contEmptycell === numCol) {
              /*Se empiezan a contar las filas vacias*/
              contEmptyRow += 1;
              /*Se confirma que hay una fila vacia*/
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

      /*Variable para contar el número de registros que esta en el excel, se resta 1 porque no se tiene en cuenta la primera fila que es la fila de titulos */
      const numberRegister = this.arrayNecessaryData.length - 1;
      /*
      * if valido si el excel solo trae 2 registros y hay 1 vacio
      * else if se valida que el documento tenga en los titulos o primera columna nos datos, EAN, Tipo de Productoo y Categoria
      * else si no lo tiene significa que el formato es invalido y manda un error*/
      if ((res.length - contEmptyRow) === 1) {
        this.loadingService.closeSpinner();
        this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
      } else {
        if (this.arrayNecessaryData[0].includes('PLU') && this.arrayNecessaryData[0].includes('EAN') && this.arrayNecessaryData[0].includes('ID Vendedor') && this.arrayNecessaryData[0].includes('Fecha inicial') && this.arrayNecessaryData[0].includes('Fecha final') && this.arrayNecessaryData[0].includes('Comisión')) {
          this.iVal = {
            iPLU: this.arrayNecessaryData[0].indexOf('PLU'),
            iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
            iIDVendedor: this.arrayNecessaryData[0].indexOf('ID Vendedor'),
            iFechaInicial: this.arrayNecessaryData[0].indexOf('Fecha inicial'),
            iFechaFinal: this.arrayNecessaryData[0].indexOf('Fecha final'),
            iComision: this.arrayNecessaryData[0].indexOf('Comisión')
          };
        }

        this.fileName = file.target.files[0].name;
        this.createTable(this.arrayNecessaryData, this.iVal, numCol);
      }

    } else {
      this.loadingService.closeSpinner();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
    }
  }
  /**
   * funcion verificar cada columna del excel y lo valida con las diferentes regex
   *
   * @param {*} res
   * @param {*} iVal
   * @param {*} numCol
   * @memberof ExceptionComponent
   */
  createTable(res: any, iVal: any, numCol: any) {
    for (let i = 0; i < res.length; i++) {
      let errorInCell = false;
      if (i !== 0 && i > 0) {
        for (let j = 0; j < numCol; j++) {
          if (res[i][j] !== undefined && res[i][j] !== '' && res[i][j] !== null) {
            if (j === iVal.iPLU) {
              const validFormatPLU = this.validFormat(res[i][j], 'PLU');
              if (!validFormatPLU && validFormatPLU === false) {
                this.countErrors += 1;
                const row = i + 1,
                  column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'PLU',
                  message: 'El campo debe de ser numérico'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iEAN) {
              const validFormatEan = this.validFormat(res[i][j], 'EAN');
              if (!validFormatEan && validFormatEan === false) {
                this.countErrors += 1;
                const row = i + 1,
                  column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Ean',
                  message: 'El campo debe de tener entre 5 y 16 dígitos'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iIDVendedor) {
              const validFormatIDVendedor = this.validFormat(res[i][j], 'IdVendedor');
              if (!validFormatIDVendedor && validFormatIDVendedor === false) {
                this.countErrors += 1;
                const row = i + 1,
                  column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'ID Vendedor',
                  message: 'El campo debe de ser numérico'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iComision) {
              const validFormatComision = this.validateComision(res[i][j], 'iComision');
              if (!validFormatComision && validFormatComision === false) {
                this.countErrors += 1;
                const row = i + 1,
                  column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Comision',
                  message: 'En el campo de comisión debe recibir un número de 0 a 100 y debe recibir decimales hasta dos dígitos, separados por un punto (00.00)'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iFechaInicial) {
              const validFormatFechaInicial = this.validateFecha(res[i][j], 'iFechaInicial');
              if (!validFormatFechaInicial && validFormatFechaInicial === false) {
                this.countErrors += 1;
                const row = i + 1,
                  column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Fecha Inicio',
                  message: 'El formato de fecha debe recibir esta estructura (aaaa/mm/dd hh:ss)'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iFechaFinal) {
              const validFormatFechaFinal = this.validateFecha(res[i][j], 'iFechaFinal');
              if (!validFormatFechaFinal && validFormatFechaFinal === false) {
                this.countErrors += 1;
                const row = i + 1,
                  column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Fecha final',
                  message: 'El formato de fecha debe recibir esta estructura (aaaa/mm/dd hh:ss)'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            }
          } else {
            this.countErrors += 1;
            const row = i + 1, column = j + 1;
            const itemLog = {
              row: this.arrayInformation.length,
              column: j,
              type: 'dateNotFound',
              columna: column,
              fila: row,
              positionRowPrincipal: i,
              dato: j === iVal.iPLU ? 'PLU' : j === iVal.iEAN ? 'EAN' : j === iVal.iIDVendedor ? 'ID Vendedor' : j === iVal.iFechaInicial ? 'Fecha inicial' : j === iVal.iFechaFinal ? 'Fecha final' : j === iVal.iComision ? 'Comisión' : null,
              message: 'El campo no puede estar vacío'
            };
            this.listLog.push(itemLog);
            errorInCell = true;
          }
        }
      }
      // if (errorInCell) {
      //   this.addRowToTable(res, i, iVal);
      // }
      errorInCell = false;
      this.addInfoTosend(res, i, iVal, errorInCell);
    }
    // if (this.listLog.length > 0) {
    //   this.setDataDialog();
    // } else {
      this.arrayInformationForSend.splice(0, 1);
      this.exceptionBrandService.sendDataJsonReadExcel(this.arrayInformationForSend).subscribe(results => {
        if (results) {
          const body = JSON.parse(results.body);
          if (body) {
            if (body.Data !== false) {
              this.openModalStatus(1, null);
            } else {
              const itemLog = {
                type: 'errorBack',
                dato: 'validación',
                message: body.Message
              };
              this.listLog.push(itemLog);
              this.countErrors += 1;
              this.setDataDialog();
            }
          } else {
            this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
              duration: 3000,
            });
          }
        } else {
          this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
            duration: 3000,
          });
        }
      });
    // }
  }
  /**
   * funcion para validar el formato
   *
   * @param {*} inputtxt
   * @param {string} [validation]
   * @returns
   * @memberof ExceptionComponent
   */
  validFormat(inputtxt: any, validation?: string) {
    let valueReturn: boolean;

    if (inputtxt === undefined) {
      valueReturn = false;
    } else if (inputtxt !== undefined) {
      inputtxt = inputtxt.trim();
      switch (validation) {
        case 'EAN':
          if ((inputtxt.match(this.exceptionRegex.ean))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'PLU':
          if ((inputtxt.match(this.exceptionRegex.number))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'IdVendedor':
          if ((inputtxt.match(this.exceptionRegex.number))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        default:
          break;
      }
    }
    return valueReturn;
  }
  /**
   * funcion para validar la comision
   *
   * @param {*} inputtxt
   * @param {string} [validation]
   * @returns
   * @memberof ExceptionComponent
   */
  public validateComision(inputtxt: any, validation?: string) {
    let valueReturn: boolean;
    inputtxt = (inputtxt.toString()).trim();
    if (inputtxt.match(this.exceptionRegex.numberAndPoint)) {
      const validateFloat = inputtxt.toString().includes('.');
      if (validateFloat) {
        const valueNumericInt = inputtxt.split('.');
        if ((valueNumericInt[0].match(this.exceptionRegex.maxNumerOneHundred))) {
          if (parseInt(valueNumericInt[0], 0) === 100) {
            if (parseInt(valueNumericInt[1], 0) === 0) {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          } else {
            if ((valueNumericInt[1].match(this.exceptionRegex.maxTwoDigNinetyNine))) {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          }
        } else {
          valueReturn = false;
        }
      } else {
        if ((inputtxt.match(this.exceptionRegex.maxNumerOneHundred))) {
          valueReturn = true;
        } else {
          valueReturn = false;
        }
      }
    } else {
      valueReturn = false;
    }
    return valueReturn;
  }
  /**
   * funcion para validar la fecha y la hora
   *
   * @param {*} inputtxt
   * @param {string} [validation]
   * @returns
   * @memberof ExceptionComponent
   */
  public validateFecha(inputtxt: any, validation?: string) {
    let valueReturn: boolean;
    inputtxt.trim();
    if (inputtxt.match(this.exceptionRegex.formatNumerHours)) {
      const valueDateAndHours = inputtxt.split(' ');
      if (valueDateAndHours[1] === undefined) {
        valueReturn = false;
      } else {
        if (valueDateAndHours[0].match(this.exceptionRegex.validateDate)) {
          if (valueDateAndHours[1].match(this.exceptionRegex.hours)) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
        } else {
          valueReturn = false;
        }
      }
    } else {
      valueReturn = false;
    }
    return valueReturn;
  }
  /**
   * funcion para almacenar la informacion carga del archivo del excel en array
   *
   * @param {*} res
   * @param {*} index
   * @param {*} iVal
   * @memberof ExceptionComponent
   */
  addRowToTable(res: any, index: any, iVal: any) {
    const newObject: any = {
      PLU: res[index][iVal.iPLU],
      EAN: res[index][iVal.iEAN],
      IDVendedor: res[index][iVal.iIDVendedor],
      fechaInicial: res[index][iVal.iFechaInicial],
      fechaFinal: res[index][iVal.iFechaFinal],
      comision: res[index][iVal.iComision],
    };
    this.arrayInformation.push(newObject);
  }
  /**
   * funcion para almacenar la informacion carga del archivo del excel en array
   *
   * @param {*} res
   * @param {*} i
   * @param {*} iVal
   * @param {boolean} [errorInCell=false]
   * @memberof ExceptionComponent
   */
  addInfoTosend(res: any, i: any, iVal: any, errorInCell: boolean = false) {
    const newObjectForSend = {
      IdVTEX: res[i][iVal.iPLU] ? res[i][iVal.iPLU].trim() : null,
      EAN: res[i][iVal.iEAN] ? res[i][iVal.iEAN].trim() : null,
      SellerId: res[i][iVal.iIDVendedor] ? res[i][iVal.iIDVendedor].trim() : null,
      InitialDate: res[i][iVal.iFechaInicial] ? res[i][iVal.iFechaInicial].trim() : null,
      FinalDate: res[i][iVal.iFechaFinal] ? res[i][iVal.iFechaFinal].trim() : null,
      Commission: res[i][iVal.iComision] ? res[i][iVal.iComision].trim() : null,
    };
    this.arrayInformationForSend.push(newObjectForSend);
  }
  /**
   * funcion para llamar el modal de errores en el front (no llega al back)
   *
   * @memberof ExceptionComponent
   */
  public setDataDialog(): void {
    this.loadingService.closeSpinner();
    this.data = { listErrors: this.listLog, countErrors: this.countErrors, data: this.arrayInformationForSend, fileName: this.fileName };
    const dialog = this.dialog.open(ModalResultLoadExceptionComponent, {
      width: '60%',
      minWidth: '20%',
      data: this.data
    });
    dialog.afterClosed().subscribe(result => {
      this.clearListFiles();
    });
  }
  /**
   * funcion para mostar el modal de estado de carga
   *
   * @param {number} type
   * @param {*} listError
   * @memberof ExceptionComponent
   */
  openModalStatus(type: number, listError: any) {
    this.loadingService.closeSpinner();
    const intervalTime = 6000;
    const data = {
      successText: this.languageService.instant('secure.products.Finish_upload_product_information.successful_upload'),
      failText: this.languageService.instant('secure.products.Finish_upload_product_information.error_upload'),
      processText: this.languageService.instant('secure.products.Finish_upload_product_information.upload_progress'),
      initTime: 500,
      intervalTime: intervalTime,
      listError: listError,
      typeStatus: type,
      showExport: false,
      responseDiferent: true
    };
    const dialog = this.dialog.open(FinishUploadInformationComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      disableClose: type === 1,
      data: data
    });
    const dialogIntance = dialog.componentInstance;
    dialogIntance.request = this.exceptionBrandService.verifyStatusBulkLoad();
    dialogIntance.processFinish$.subscribe((val) => {
      dialog.disableClose = false;
      this.clearListFiles();
    });
    dialog.afterClosed().subscribe(result => {
      this.clearListFiles();
    });
  }
  /**
   * funcion para limpiar las variables de carga de archivos
   *
   * @memberof ExceptionComponent
   */
  clearListFiles() {
    this.listLog = [];
    this.countErrors = 0;
    this.countRowUpload = 0;
    this.arrayInformation = [];
    this.arrayInformationForSend = [];
    this.orderListLength = true;
    this.numberElements = 0;
    this.fileName = '';
    this.arrayNecessaryData = [];
  }

  /**
   * funcion para consultar las regex en la base de datos
   *
   * @memberof ExceptionComponent
   */
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataRegex = JSON.parse(res.body.body);
      dataRegex = dataRegex.Data.filter(data => data.Module === 'transversal' || data.Module === 'productos');
      for (const val in this.exceptionRegex) {
        if (!!val) {
          const element = dataRegex.find(regex => regex.Identifier === val.toString());
          this.exceptionRegex[val] = element && `${element.Value}`;
        }
      }
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
