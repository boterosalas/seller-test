/* 3rd party components */
import { Component, ViewChild, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource, MatDialog, MatSort, MatSidenav, MatPaginator } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as FileSaver from 'file-saver';

/* our own custom components */
import { BulkLoadProductService } from '../bulk-load-product.service';
import { FinishUploadProductInformationComponent } from '../finish-upload-product-information/finish-upload-product-information.component';
import { ModelProduct, AbaliableLoadModel } from '../models/product.model';
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
const log = new Logger('BulkLoadProductComponent');
const EXCEL_EXTENSION = '.xlsx';

/**
 * Component que permite realizar la carga de guías, consta de tres componentes mas
 * FinishUploadProductInformationComponent
 * TableLoadComponent
 * TableErrorsComponent
 * Estos componentes se emplean para separar
 * el comportamiento de la carga de guías, se
 * emplea "TableErrorsComponent" para visualizar la
 * lista de errores capturados al momento de subir el archivo excel.
 * se emplea "TableLoadComponent" para visualizar la lista de datos
 * con errores en una tabla y visualizar el total de registros correctos
 * y se emplea "FinishUploadProductInformationComponent" para desplegar un modal
 * donde se visualicen los logs generados por el back al momento de envíar
 * las guías. en FinishUploadProductInformationComponent se permite generar un excel
 * con el log obtenido.
 */
@Component({
  selector: 'app-bulk-load-product',
  templateUrl: './bulk-load-product.component.html',
  styleUrls: ['./bulk-load-product.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BulkLoadProductComponent implements OnInit, LoggedInCallback, Callback {

  public paginator: any;

  /* Información del usuario*/
  public user: any;

  /* Nombre del archivo cargado*/
  public fileName: any;

  /* Sort para la tabla*/
  public sort: any;

  /*Variable para almacenar los datos de la limitacion de carga */
  public dataAvaliableLoads: AbaliableLoadModel;

  /*  Variable que almacena el numero de elementos de la tabla*/
  public numberElements: number;

  /* Variable que se emplea para el proceso de la carga de excel, se indica 501 por que se cuenta la primera fila que contiene los titulos*/
  public limitRowExcel: number;

  /* Número de filas cargadas*/
  public countRowUpload: number;

  /* Numero de errores*/
  public countErrors: number;

  /* Número de órdenes cargadas*/
  public orderListLength: boolean;

  /* Creo el elemento que se empleara para la tabla*/
  public dataSource: MatTableDataSource<ModelProduct>;

  /* Objeto que contendra los datos del excel*/
  public arrayInformation: Array<ModelProduct>;

  /* Objeto que contendra los datos del excel y servira para realizar el envio de la información*/
  public arrayInformationForSend: Array<{}>;

  /* Lista de logs*/
  public listLog: Array<any>;

  public arrayNecessaryData: Array<any>;


  /* Input file que carga el archivo*/
  @ViewChild('fileUploadOption') inputFileUpload: any;

  /**
   * Creates an instance of BulkLoadProductComponent.
   * @param {ComponentsService} componentService
   * @param {BulkLoadProductService} BulkLoadProductService
   * @param {MatDialog} dialog
   * @param {ShellComponent} shellComponent
   * @memberof BulkLoadProductComponent
   */
  constructor(
    public componentService: ComponentsService,
    public BulkLoadProductS: BulkLoadProductService,
    public dialog: MatDialog,
    public shellComponent: ShellComponent,
    public userService: UserLoginService,
    private router: Router,
    public userParams: UserParametersService
  ) {
    this.user = {};
    this.arrayInformation = [];
    this.arrayInformationForSend = [];
    this.listLog = [];
    this.arrayNecessaryData = [];
    this.orderListLength = true;
    this.limitRowExcel = 1048576;
    this.numberElements = 0;
    this.countRowUpload = 0;
    this.countErrors = 0;
    this.fileName = '';
  }

  /**
   * @memberof BulkLoadProductComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  /**
   * @method isLoggedIn
   * @description Metodo para validar si el usuario esta logeado
   * @param {string} message
   * @param {boolean} isLoggedIn
   * @memberof BulkLoadProductComponent
   */
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
    } else if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    }

  }

  /**
   * @method callback
   * @description Metodo necesario para recibir el callback de getDataUser()
   * @memberof BulkLoadProductComponent
   */
  callback() { }

  /**
   * @method getDataUser
   * @description Metodo para ir al servicio de userParams y obtener los datos del usuario
   * @memberof BulkLoadProductComponent
   */
  getDataUser() {
    this.userParams.getUserData(this);
  }

  /**
   * @method callbackWithParam
   * @description metodo que se ejecuta en el callback de getDataUser().
   * Es utilizado para almacenar los datos del usuario en una variable y luego validar
   * si es Administrador o Vendedor.
   * @param userData
   * @memberof BulkLoadProductComponent
   */
  callbackWithParam(userData: any) {
    this.user = userData;
    if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
    } else {
      this.getAvaliableLoads();
    }
  }

  /**
   * @method getAvaliableLoads
   * @description Metodo que consume el servicio de productos y obtiene cuantas cargas se pueden realizar
   */
  getAvaliableLoads() {
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    this.BulkLoadProductS.getAmountAvailableLoads().subscribe(
      (result: any) => {
        if (result.status === 200 && result.body) {
          const response = result.body;
          this.dataAvaliableLoads = response;
        } else {
          this.shellComponent.modalComponent.showModal('errorService');
        }
        this.shellComponent.loadingComponent.closeLoadingSpinner();
      }
    );
  }

  /**
   * @memberof BulkLoadProductComponent
   */
  resetUploadFIle() {
    this.inputFileUpload.nativeElement.value = '';
  }

  /**
   * @memberof BulkLoadProductComponent
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
  * Método que permite detectar el input file
  * @param {*} evt
  * @memberof BulkLoadProductComponent
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
   * Funcionalidad que permite capturar los datos del excel.
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof BulkLoadProductComponent
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
          const ws: XLSX.WorkSheet = wb.Sheets['Productos'];
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
  * Metodo que se encarga de validar los datos del excel
  * @param {any} res
  * @param {*} file
  * @memberof BulkLoadProductComponent
  */
  validateDataFromFile(res, file: any) {

    if (this.dataAvaliableLoads.amountAvailableLoads <= 0) {
      this.shellComponent.loadingComponent.closeLoadingSpinner();
      this.componentService.openSnackBar('Has llegado  al limite de carga por el día de hoy', 'Aceptar', 10000);
    } else if (this.dataAvaliableLoads.amountAvailableLoads > 0) {
      if (res.length > 1) {
        let contEmptyRow = 0;

        for (let i = 0; i < res.length; i++) {

          this.arrayNecessaryData.push([]);

          for (let j = 0; j < res[0].length; j++) {

            if (res[0][j] !== '' && res[0][j] !== null && res[0][j] !== undefined) {
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

          if (rowEmpty) {
            this.arrayNecessaryData.splice(i, 1);
            i--;
          }

        }

        const numberRegister = this.arrayNecessaryData.length - 1;

        if (this.arrayNecessaryData.length === 2 && contEmptyRow === 1) {
          this.shellComponent.loadingComponent.closeLoadingSpinner();
          this.componentService.openSnackBar('El archivo seleccionado no posee información', 'Aceptar', 10000);
        } else {
          if (this.arrayNecessaryData[0].includes('EAN') && this.arrayNecessaryData[0].includes('Tipo de Producto') && this.arrayNecessaryData[0].includes('Categoria')) {
            const iVal = {
              iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
              iNombreProd: this.arrayNecessaryData[0].indexOf('Nombre del producto'),
              iCategoria: this.arrayNecessaryData[0].indexOf('Categoria'),
              iMarca: this.arrayNecessaryData[0].indexOf('Marca'),
              iModelo: this.arrayNecessaryData[0].indexOf('Modelo'),
              iDetalles: this.arrayNecessaryData[0].indexOf('Detalles'),
              iDescripcion: this.arrayNecessaryData[0].indexOf('Descripcion'),
              iMetaTitulo: this.arrayNecessaryData[0].indexOf('Meta Titulo'),
              iMetaDescripcion: this.arrayNecessaryData[0].indexOf('Meta Descripcion'),
              iPalabrasClave: this.arrayNecessaryData[0].indexOf('Palabras Clave'),
              iAltoDelEmpaque: this.arrayNecessaryData[0].indexOf('Alto del empaque'),
              ilargoDelEmpaque: this.arrayNecessaryData[0].indexOf('Largo del empaque'),
              iAnchoDelEmpaque: this.arrayNecessaryData[0].indexOf('Ancho del empaque'),
              iPesoDelEmpaque: this.arrayNecessaryData[0].indexOf('Peso del empaque'),
              iSkuShippingSize: this.arrayNecessaryData[0].indexOf('skuShippingsize'),
              iAltoDelProducto: this.arrayNecessaryData[0].indexOf('Alto del producto'),
              iLargoDelProducto: this.arrayNecessaryData[0].indexOf('Largo del producto'),
              iAnchoDelProducto: this.arrayNecessaryData[0].indexOf('Ancho del producto'),
              iPesoDelProducto: this.arrayNecessaryData[0].indexOf('Peso del producto'),
              iVendedor: this.arrayNecessaryData[0].indexOf('Vendedor'),
              iTipoDeProducto: this.arrayNecessaryData[0].indexOf('Tipo de Producto'),
              iURLDeImagen1: this.arrayNecessaryData[0].indexOf('URL de Imagen 1'),
              iURLDeImagen2: this.arrayNecessaryData[0].indexOf('URL de Imagen 2'),
              iURLDeImagen3: this.arrayNecessaryData[0].indexOf('URL de Imagen 3'),
              iURLDeImagen4: this.arrayNecessaryData[0].indexOf('URL de Imagen 4'),
              iURLDeImagen5: this.arrayNecessaryData[0].indexOf('URL de Imagen 5'),
              iModificacionImagen: this.arrayNecessaryData[0].indexOf('Modificacion Imagen'),
              iParentReference: this.arrayNecessaryData[0].indexOf('Referencia Padre'),
              iSonReference: this.arrayNecessaryData[0].indexOf('Referencia Hijo'),
            };

            if (numberRegister > this.dataAvaliableLoads.amountAvailableLoads) {
              this.shellComponent.loadingComponent.closeLoadingSpinner();
              this.componentService.openSnackBar('El archivo contiene mas activos de los permitidos por el día de hoy', 'Aceptar', 10000);
            } else if (numberRegister > this.dataAvaliableLoads.maximumAvailableLoads) {
              this.shellComponent.loadingComponent.closeLoadingSpinner();
              this.componentService.openSnackBar('El número de registros supera los ' + this.dataAvaliableLoads.maximumAvailableLoads + ', no se permite esta cantidad', 'Aceptar', 10000);
            } else {
              this.fileName = file.target.files[0].name;
              this.createTable(this.arrayNecessaryData, iVal, numCol);
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
  }

  /**
  * Método que se encarga de crear la tabla
  * @param {any} res
  * @memberof BulkLoadProductComponent
  */
  createTable(res, iVal, numCol) {

    for (let i = 0; i < res.length; i++) {
      let variant = false;
      let errorInCell = false;
      if (i !== 0 && i > 0) {
        for (let j = 0; j < numCol; j++) {
          if (res[i][j] !== undefined && res[i][j] !== '' && res[i][j] !== null) {
            if (j === iVal.iEAN) {
              const validFormatEan = this.validFormat(res[i][j], 'ean');
              if (!validFormatEan && validFormatEan === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iTipoDeProducto) {
              if (res[i][j] === 'Variante') {
                variant = true;
              } else if (res[i][j] !== 'Variante' && res[i][j] !== 'Estandar') {
                const validFormatCategory = this.validFormat(res[i][j], 'category');
                if (!validFormatCategory && validFormatCategory === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'invalidFormat',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              }
            } else if (j === iVal.iModificacionImagen) {
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
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iNombreProd) {
              const isFormatNameProd = this.validFormat(res[i][j], 'nameProd');
              if (!isFormatNameProd && isFormatNameProd === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iCategoria) {
              const isNumeric = this.validFormat(res[i][j], 'greaterThanZero');
              if (!isNumeric && isNumeric === false) {
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
                errorInCell = true;
              }
            } else if (j === iVal.iMarca || j === iVal.iMetaTitulo || j === iVal.iMetaDescripcion || j === iVal.iPalabrasClave) {
              const allChars = this.validFormat(res[i][j], 'formatAllChars');
              if (!allChars && allChars === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iModelo || j === iVal.iDetalles) {
              const limitChars = this.validFormat(res[i][j], 'formatlimitChars');
              if (!limitChars && limitChars === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iVendedor) {
              const formatSeller = this.validFormat(res[i][j], 'formatSeller');
              if (!formatSeller && formatSeller === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iURLDeImagen1 || j === iVal.iURLDeImagen2 || j === iVal.iURLDeImagen3 || j === iVal.iURLDeImagen4 || j === iVal.iURLDeImagen5) {
              const validFormatImg = this.validFormat(res[i][j], 'formatImg');
              if (!validFormatImg && validFormatImg === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iskuShippingsize) {
              const validFormatSku = this.validFormat(res[i][j], 'formatSku');
              if (!validFormatSku && validFormatSku === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iAltoDelEmpaque || j === iVal.ilargoDelEmpaque || j === iVal.iAltoDelProducto || j === iVal.iLargoDelProducto) {
              const validFormatPackage = this.validFormat(res[i][j], 'formatPackage');
              if (!validFormatPackage && validFormatPackage === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iDescripcion) {
              const validFormatDesc = this.validFormat(res[i][j], 'formatDescription');
              if (!validFormatDesc && validFormatDesc === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else {
              const extraFields = this.validFormat(res[i][j]);
              if (extraFields === false && !extraFields) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            }
          } else if (j === iVal.iEAN || j === iVal.iTipoDeProducto || j === iVal.iCategoria) {
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
              };
              this.listLog.push(itemLog);
              errorInCell = true;
            }
          } else if (variant === true) {
            if (j === iVal.iParentReference || j === iVal.iSonReference) {
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
                  dato: res[0][j]
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (iVal.iParentReference === -1 || iVal.iSonReference === -1) {
              this.shellComponent.loadingComponent.closeLoadingSpinner();
              this.componentService.openSnackBar('Se ha presentado un error al cargar la información', 'Aceptar', 4000);
              return;
            }
          }
        }
      }

      if (errorInCell) {
        this.addRowToTable(res, i, iVal, variant);
        errorInCell = false;
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
  * @memberof BulkLoadProductComponent
  */
  addInfoTosend(res, i, iVal) {
    const regex = new RegExp('"', 'g');
    const newObjectForSend = {
      Ean: res[i][iVal.iEAN] ? res[i][iVal.iEAN].trim() : null,
      Name: res[i][iVal.iNombreProd] ? res[i][iVal.iNombreProd].trim() : null,
      Category: res[i][iVal.iCategoria] ? res[i][iVal.iCategoria].trim() : null,
      Brand: res[i][iVal.iMarca] ? res[i][iVal.iMarca].trim() : null,
      Model: res[i][iVal.iModelo] ? res[i][iVal.iModelo].trim() : null,
      Details: res[i][iVal.iDetalles] ? res[i][iVal.iDetalles].trim() : null,
      Description: res[i][iVal.iDescripcion] ? res[i][iVal.iDescripcion].trim().replace(regex, '\'') : null,
      MetaTitle: res[i][iVal.iMetaTitulo] ? res[i][iVal.iMetaTitulo].trim() : null,
      MetaDescription: res[i][iVal.iMetaDescripcion] ? res[i][iVal.iMetaDescripcion].trim() : null,
      KeyWords: res[i][iVal.iPalabrasClave] ? res[i][iVal.iPalabrasClave].trim() : null,
      PackageHeight: res[i][iVal.iAltoDelEmpaque] ? res[i][iVal.iAltoDelEmpaque].trim() : null,
      PackageLength: res[i][iVal.ilargoDelEmpaque] ? res[i][iVal.ilargoDelEmpaque].trim() : null,
      PackageWidth: res[i][iVal.iAnchoDelEmpaque] ? res[i][iVal.iAnchoDelEmpaque].trim() : null,
      PackageWeight: res[i][iVal.iPesoDelEmpaque] ? res[i][iVal.iPesoDelEmpaque].trim() : null,
      SkuShippingSize: res[i][iVal.iSkuShippingSize] ? res[i][iVal.iSkuShippingSize].trim() : null,
      ProductHeight: res[i][iVal.iAltoDelProducto] ? res[i][iVal.iAltoDelProducto].trim() : null,
      ProductLength: res[i][iVal.iLargoDelProducto] ? res[i][iVal.iLargoDelProducto].trim() : null,
      ProductWidth: res[i][iVal.iAnchoDelProducto] ? res[i][iVal.iAnchoDelProducto].trim() : null,
      ProductWeight: res[i][iVal.iPesoDelProducto] ? res[i][iVal.iPesoDelProducto].trim() : null,
      Seller: res[i][iVal.iVendedor] ? res[i][iVal.iVendedor].trim() : null,
      ProductType: res[i][iVal.iTipoDeProducto] ? res[i][iVal.iTipoDeProducto].trim() : null,
      ImageUrl1: res[i][iVal.iURLDeImagen1] ? res[i][iVal.iURLDeImagen1].trim() : null,
      ImageUrl2: res[i][iVal.iURLDeImagen2] ? res[i][iVal.iURLDeImagen2].trim() : null,
      ImageUrl3: res[i][iVal.iURLDeImagen3] ? res[i][iVal.iURLDeImagen3].trim() : null,
      ImageUrl4: res[i][iVal.iURLDeImagen4] ? res[i][iVal.iURLDeImagen4].trim() : null,
      ImageUrl5: res[i][iVal.iURLDeImagen5] ? res[i][iVal.iURLDeImagen5].trim() : null,
      ModifyImage: res[i][iVal.iModificacionImagen] ? res[i][iVal.iModificacionImagen].trim() : null,
      features: []
    };

    if (i > 0 && i !== 0) {
      for (let j = 0; j < res.length; j++) {
        for (let k = 0; k < res[0].length; k++) {
          const newFeatures = {};
          if (k !== iVal.iEAN &&
            k !== iVal.iNombreProd &&
            k !== iVal.iCategoria &&
            k !== iVal.iMarca &&
            k !== iVal.iModelo &&
            k !== iVal.iDetalles &&
            k !== iVal.iDescripcion &&
            k !== iVal.iMetaTitulo &&
            k !== iVal.iMetaDescripcion &&
            k !== iVal.iPalabrasClave &&
            k !== iVal.iAltoDelEmpaque &&
            k !== iVal.ilargoDelEmpaque &&
            k !== iVal.iAnchoDelEmpaque &&
            k !== iVal.iPesoDelEmpaque &&
            k !== iVal.iSkuShippingSize &&
            k !== iVal.iAltoDelProducto &&
            k !== iVal.iLargoDelProducto &&
            k !== iVal.iAnchoDelProducto &&
            k !== iVal.iPesoDelProducto &&
            k !== iVal.iVendedor &&
            k !== iVal.iTipoDeProducto &&
            k !== iVal.iURLDeImagen1 &&
            k !== iVal.iURLDeImagen2 &&
            k !== iVal.iURLDeImagen3 &&
            k !== iVal.iURLDeImagen4 &&
            k !== iVal.iURLDeImagen5 &&
            k !== iVal.iModificacionImagen) {
            newFeatures['key'] = res[0][k];
            newFeatures['value'] = res[i][k];
            newObjectForSend.features.push(newFeatures);
          }
        }
      }
    }
    this.arrayInformationForSend.push(newObjectForSend);
  }

  /**
  * Método que permite almacenar los registros de errores que se visualizaran en la tabla
  * @param {any} res
  * @param {any} index
  * @memberof BulkLoadProductComponent
  */
  addRowToTable(res, index, iVal, variant) {
    /* elemento que contendra la estructura del excel y permitra agregarlo a la variable final que contendra todos los datos del excel */
    const newObject: ModelProduct = {
      Ean: res[index][iVal.iEAN],
      Name: res[index][iVal.iNombreProd],
      Category: res[index][iVal.iCategoria],
      Brand: res[index][iVal.iMarca],
      Model: res[index][iVal.iModelo],
      Details: res[index][iVal.iDetalles],
      Description: res[index][iVal.iDescripcion],
      MetaTitle: res[index][iVal.iMetaTitulo],
      MetaDescription: res[index][iVal.iMetaDescripcion],
      KeyWords: res[index][iVal.iPalabrasClave],
      PackageHeight: res[index][iVal.iAltoDelEmpaque],
      PackageLength: res[index][iVal.ilargoDelEmpaque],
      PackageWidth: res[index][iVal.iAnchoDelEmpaque],
      PackageWeight: res[index][iVal.iPesoDelEmpaque],
      SkuShippingSize: res[index][iVal.iSkuShippingSize],
      ProductHeight: res[index][iVal.iAltoDelProducto],
      ProductLength: res[index][iVal.iLargoDelProducto],
      ProductWidth: res[index][iVal.iAnchoDelProducto],
      ProductWeight: res[index][iVal.iPesoDelProducto],
      Seller: res[index][iVal.iVendedor],
      ProductType: res[index][iVal.iTipoDeProducto],
      ParentReference: res[index][iVal.iParentReference],
      SonReference: res[index][iVal.iSonReference],
      ImageUrl1: res[index][iVal.iURLDeImagen1],
      ImageUrl2: res[index][iVal.iURLDeImagen2],
      ImageUrl3: res[index][iVal.iURLDeImagen3],
      ImageUrl4: res[index][iVal.iURLDeImagen4],
      ImageUrl5: res[index][iVal.iURLDeImagen5],
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
      errorColumn10: false,
      errorColumn11: false,
      errorColumn12: false,
      errorColumn13: false,
      errorColumn14: false,
      errorColumn15: false,
      errorColumn16: false,
      errorColumn17: false,
      errorColumn18: false,
      errorColumn19: false,
      errorColumn20: false,
      errorColumn21: false,
      errorColumn22: false,
      errorColumn23: false,
      errorColumn24: false,
      errorColumn25: false,
      errorColumn26: false,
      errorColumn27: false,
      errorColumn28: false,
      isVariant: variant
    };

    this.arrayInformation.push(newObject);
  }

  /**
  * Método que termina de armar los datos para la tabla.
  * @memberof BulkLoadProductComponent
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
  * @memberof BulkLoadProductComponent
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
      this.arrayInformation[index].errorColumn11 = false;
      this.arrayInformation[index].errorColumn12 = false;
      this.arrayInformation[index].errorColumn13 = false;
      this.arrayInformation[index].errorColumn14 = false;
      this.arrayInformation[index].errorColumn15 = false;
      this.arrayInformation[index].errorColumn16 = false;
      this.arrayInformation[index].errorColumn17 = false;
      this.arrayInformation[index].errorColumn18 = false;
      this.arrayInformation[index].errorColumn19 = false;
      this.arrayInformation[index].errorColumn20 = false;
      this.arrayInformation[index].errorColumn21 = false;
      this.arrayInformation[index].errorColumn22 = false;
      this.arrayInformation[index].errorColumn23 = false;
      this.arrayInformation[index].errorColumn24 = false;
      this.arrayInformation[index].errorColumn25 = false;
      this.arrayInformation[index].errorColumn26 = false;
      this.arrayInformation[index].errorColumn27 = false;
      this.arrayInformation[index].errorColumn28 = false;
      this.arrayInformation[index].errorRow = false;
    }
  }

  /**
  * Funcionalidad para seleccionar el error del log en la tabla
  * @param {*} item
  * @memberof BulkLoadProductComponent
  */
  selectErrorLog(item: any) {
    this.setErrrorColumns();
    if (item.dato) {
      if (item.dato === 'Referencia Padre') {
        this.arrayInformation[item.row]['errorColumn27'] = true;
      } else if (item.dato === 'Referencia Hijo') {
        this.arrayInformation[item.row]['errorColumn28'] = true;
      }
    } else {
      this.arrayInformation[item.row]['errorColumn' + item.columna] = true;
    }


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
  * @memberof BulkLoadProductComponent
  */
  sendJsonInformation() {
    this.arrayInformationForSend.splice(0, 1);
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    // call to the bulk load product service
    this.BulkLoadProductS.setProducts(this.arrayInformationForSend)
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const data = result;
            log.info(data);
            if (data.body.successful !== 0 || data.body.error !== 0) {
              this.openDialogSendOrder(data);
              this.getAvaliableLoads();
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
  * @memberof BulkLoadProductComponent
  */
  openDialogSendOrder(res): void {
    const dialogRef = this.dialog.open(FinishUploadProductInformationComponent, {
      width: '95%',
      data: {
        response: res
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
    });
  }

  /*---------------------------------------- Metodos para validar el formato de los campos ----------------------------------------*/

  /**
   * @method validFormat
   * @param inputtxt
   * @param validation
   * @description Metodo para validar el formato de las celdas enviadas del excel
   * @memberof BulkLoadProductComponent
   */
  validFormat(inputtxt: any, validation?: string) {
    let valueReturn: boolean;
    const filterNumber = /^[0-9]+$/;
    const formatEan = /^(IZ[0-9]{5,11})$|^([0-9]{7,13})$/;
    const formatNameProd = /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ+\-\,\.\s]{1,60}$/;
    const formatAllChars = /^[\w\W\s\d]{1,200}$/;
    const formatlimitChars = /^[\w\W\s\d]{1,29}$/;
    const formatImg = /\bJPG$|\bjpg$/;
    const formatSkuShippingSize = /^[1-5]{1}$/;
    const formatExtraFields = /^[a-zA-Z0-9ñÑ\s+\-\,\.\_\/\#\(\)]{1,200}$/;
    const formatPackage = /^([0-9]{1,7})(\,[0-9]{1,2})$|^([0-9]{1,10})$/;
    const formatDesc = /^((?!<script>|<SCRIPT>).)*$/igm;
    if (inputtxt === undefined) {
      valueReturn = false;
    } else if (inputtxt !== undefined) {
      inputtxt = inputtxt.trim();
      switch (validation) {
        case 'ean':
          if ((inputtxt.match(formatEan))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'nameProd':
          if ((inputtxt.match(formatNameProd))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'numeric':
          if ((inputtxt.match(filterNumber))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatAllChars':
          if ((inputtxt.match(formatAllChars))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatlimitChars':
          if ((inputtxt.match(formatlimitChars))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatSeller':
          if (inputtxt === 'Marketplace') {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatImg':
          if ((inputtxt.match(formatImg))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatSku':
          if ((inputtxt.match(formatSkuShippingSize))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatPackage':
          if ((inputtxt.match(formatPackage))) {
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
        case 'formatDescription':
          if ((inputtxt.match(formatDesc))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'boolean':
          if ((inputtxt.match(filterNumber))) {
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
          if ((inputtxt.match(filterNumber))) {
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
        case 'category':
          if (inputtxt === 'Estandar' || inputtxt === 'Variante') {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        default:
          if ((inputtxt.match(formatExtraFields))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
      }
    }
    return valueReturn;
  }
  /*---------------------------------------- Fin Metodos para validar el formato de los campos ----------------------------------------*/

  /*---------------------------------------- Metodos para descargar formato ----------------------------------------*/
  /**
  * Método para descargar el formato de excel para carga masiva
  * @param {any} form
  * @memberof BulkLoadProductComponent
  */
  /* Massive offer load*/
  downloadFormatMassiveOfferLoad() {
    const emptyFile = [{
      'EAN': undefined,
      'Nombre del producto': undefined,
      'Categoria': undefined,
      'Marca': undefined,
      'Modelo': undefined,
      'Detalles': undefined,
      'Descripcion': undefined,
      'Meta Titulo': undefined,
      'Meta Descripcion': undefined,
      'Palabras Clave': undefined,
      'Alto del empaque': undefined,
      'Largo del empaque': undefined,
      'Ancho del empaque': undefined,
      'Peso del empaque': undefined,
      'skuShippingsize': undefined,
      'Alto del producto': undefined,
      'Largo del producto': undefined,
      'Ancho del producto': undefined,
      'Peso del producto': undefined,
      'Vendedor': undefined,
      'Tipo de Producto': undefined,
      'URL de Imagen 1': undefined,
      'URL de Imagen 2': undefined,
      'URL de Imagen 3': undefined,
      'URL de Imagen 4': undefined,
      'URL de Imagen 5': undefined,
      'Modificacion Imagen': undefined
    }];
    log.info(emptyFile);
    this.exportAsExcelFile(emptyFile, 'Formato de Carga Masiva de Productos');
  }

  /**
  * Método que genera el dato json en el formato que emplea excel para.
  * @param {any[]} json
  * @param {string} excelFileName
  * @memberof BulkLoadProductComponent
  */
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'Productos': worksheet }, SheetNames: ['Productos'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
  * Método que permite generar el excel con los datos pasados.
  * @param {*} buffer
  * @param {string} fileName
  * @memberof BulkLoadProductComponent
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
  * @memberof BulkLoadProductComponent
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
