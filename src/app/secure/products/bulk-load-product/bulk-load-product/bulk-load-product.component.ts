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
   *Creates an instance of BulkLoadProductComponent.
   * @param {ComponentsService} componentService
   * @param {BulkLoadProductService} BulkLoadProductS
   * @param {MatDialog} dialog
   * @param {ShellComponent} shellComponent
   * @param {UserLoginService} userService
   * @param {Router} router
   * @param {UserParametersService} userParams
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
    /*Se le asigna valor a todas las variables*/
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
    /*Se llama el metodo que valida si se encuentra logeado, este metodo hace un callback y llama el metodo isLoggedIn()*/
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
    /*Valida si esta logeado*/
    if (isLoggedIn) {
      /*Se llama el metodo que obtiene los datos del usuario logeado*/
      this.getDataUser();
    } else if (!isLoggedIn) {
      /*Si no esta logeado se redirecciona al home*/
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
    /*Se llama el metodo que se encarga de obtener los datos del usuario, este hace un callback que llama el metodo callbackWithParam()*/
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
    /*Se le asigna a la variable los datos del usario*/
    this.user = userData;
    /*Se valida si el usuario es vendedor o administrador*/
    if (this.user.sellerProfile === 'seller') {
      /*Si es vendedor se redirecciona a la vista de ordenes*/
      this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
    } else {
      /*se llama el metodo para obtener la cantidad de cargas disponibles*/
      this.getAvaliableLoads();
    }
  }

  /**
   * @method getAvaliableLoads
   * @description Metodo que consume el servicio de productos y obtiene cuantas cargas se pueden realizar
   */
  getAvaliableLoads() {
    /*Se muestra el loading*/
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    /*Se llama el metodo que consume el servicio de las cargas permitidas por día y se hace un subscribe*/
    this.BulkLoadProductS.getAmountAvailableLoads().subscribe(
      (result: any) => {
        /*se valida que el status de la respuesta del servicio sea 200 y traiga datos*/
        if (result.status === 200 && result.body) {
          /*Se guardan los datos en una variable*/
          this.dataAvaliableLoads = result.body;
        } else {
          /*si el status es diferente de 200 y el servicio devolvio datos se muestra el modal de error*/
          this.shellComponent.modalComponent.showModal('errorService');
        }
        /*Se oculta el loading*/
        this.shellComponent.loadingComponent.closeLoadingSpinner();
      }
    );
  }

  /**
   * @memberof BulkLoadProductComponent
   */
  resetUploadFIle() {
    /*Limpio el input file*/
    this.inputFileUpload.nativeElement.value = '';
  }

  /**
   * @memberof BulkLoadProductComponent
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
    /*Se llama el metodo que finaliza la carga*/
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
    return new Promise((resolve, reject) => {
      this.shellComponent.loadingComponent.viewLoadingSpinner();
      let data: any;
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
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
    /*
    *if Valido si la cantidad de carga permitidas por día es menor o igual a 0
    *else if Valido que la cantidad de cargas permitidas por día sea mayor a 0
    */
    if (this.dataAvaliableLoads.amountAvailableLoads <= 0) {
      this.shellComponent.loadingComponent.closeLoadingSpinner();
      this.componentService.openSnackBar('Has llegado  al limite de carga por el día de hoy', 'Aceptar', 10000);
    } else if (this.dataAvaliableLoads.amountAvailableLoads > 0) {
      /*
      * if Valido que el excel tenga mas de 1 registro (por lo general el primer registro son los titulos)
      * else el archino no tiene datos y no lo deja continuar*/
      if (res.length > 1) {
        /*Variable para controlar cuantas filas vacias hay*/
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
        if (this.arrayNecessaryData.length === 2 && contEmptyRow === 1) {
          this.shellComponent.loadingComponent.closeLoadingSpinner();
          this.componentService.openSnackBar('El archivo seleccionado no posee información', 'Aceptar', 10000);
        } else {
          if (this.arrayNecessaryData[0].includes('EAN') && this.arrayNecessaryData[0].includes('Tipo de Producto') && this.arrayNecessaryData[0].includes('Categoria')) {
            /*Constante en donse se guardara la posicion en que se encuentran los datos necesarios para la carga*/
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
              iSize: this.arrayNecessaryData[0].indexOf('Talla'),
              iColor: this.arrayNecessaryData[0].indexOf('Color'),
              iHexColourCodePDP: this.arrayNecessaryData[0].indexOf('hexColourCodePDP'),
              iHexColourName: this.arrayNecessaryData[0].indexOf('hexColourName'),
              iLogisticExito: this.arrayNecessaryData[0].indexOf('Logistica Exito')
            };

            /*
            * if si el número de registros es mayor al número de cargas permitidas no lo deja continuar
            * else if si el número de registros es mayor al maximo de cargas permitidas no lo deja continuar
            * else se obtiene el nombre del archivo y se llama la funcion de crear tabla
            */
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
      let isModifyImage = false;
      let errorInCell = false;
      if (i !== 0 && i > 0) {
        for (let j = 0; j < numCol; j++) {
          if (res[i][j] !== undefined && res[i][j] !== '' && res[i][j] !== null) {
            if (j === iVal.iEAN) {
              const validFormatEan = this.validFormat(res[i][j], 'ean');
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
                  dato: 'Ean'
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
                    type: 'invalidFormatProduct',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: 'ProductType'
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
                  positionRowPrincipal: i,
                  dato: 'ModifyImage'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              } else {
                if (res[i][j] === '1') {
                  isModifyImage = true;
                }
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
                  positionRowPrincipal: i,
                  dato: 'Name'
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
                  positionRowPrincipal: i,
                  dato: 'Category'
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
                  positionRowPrincipal: i,
                  dato: j === iVal.iMarca ? 'Brand' : j === iVal.iMetaTitulo ? 'MetaTitle' : j === iVal.iMetaDescripcion ? 'MetaDescription' : j === iVal.iPalabrasClave ? 'KeyWords' : null
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
                  positionRowPrincipal: i,
                  dato: j === iVal.iModelo ? 'Model' : j === iVal.iDetalles ? 'Details' : null
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
                  positionRowPrincipal: i,
                  dato: 'Seller'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iURLDeImagen1 || j === iVal.iURLDeImagen2 || j === iVal.iURLDeImagen3 || j === iVal.iURLDeImagen4 || j === iVal.iURLDeImagen5) {
              if (j === iVal.iURLDeImagen1 && isModifyImage === true && isModifyImage) {
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
                    dato: j === iVal.iURLDeImagen1 ? 'ImageUrl1' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              } else {
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
                    positionRowPrincipal: i,
                    dato: j === iVal.iURLDeImagen1 ? 'ImageUrl1' : j === iVal.iURLDeImagen2 ? 'ImageUrl2' : j === iVal.iURLDeImagen3 ? 'ImageUrl3' : j === iVal.iURLDeImagen4 ? 'ImageUrl4' : j === iVal.iURLDeImagen5 ? 'ImageUrl5' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
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
                  positionRowPrincipal: i,
                  dato: 'SkuShippingSize'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (
              j === iVal.iAltoDelEmpaque || j === iVal.ilargoDelEmpaque || j === iVal.iAnchoDelEmpaque || j === iVal.iPesoDelEmpaque ||
              j === iVal.iAltoDelProducto || j === iVal.iLargoDelProducto || j === iVal.iAnchoDelProducto || j === iVal.iPesoDelProducto) {
              const validFormatPackage = this.validFormat(res[i][j].replace('.', ','), 'formatPackage');
              if (!validFormatPackage && validFormatPackage === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: j === iVal.iAltoDelEmpaque ? 'PackageHeight' : j === iVal.ilargoDelEmpaque ? 'PackageLength' : j === iVal.iAnchoDelEmpaque ? 'PackageWidth' : j === iVal.iPesoDelEmpaque ? 'PackageWeight'
                    : j === iVal.iAltoDelProducto ? 'ProductHeight' : j === iVal.iLargoDelProducto ? 'ProductLength' : j === iVal.iAnchoDelProducto ? 'ProductWidth' : j === iVal.iPesoDelProducto ? 'ProductWeight' : null
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
                  positionRowPrincipal: i,
                  dato: 'Description'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iLogisticExito) {
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
                  dato: 'LogisticExito'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (variant === true) {
              if (iVal.iParentReference === -1 || iVal.iSonReference === -1) {
                this.shellComponent.loadingComponent.closeLoadingSpinner();
                this.componentService.openSnackBar('Se ha presentado un error al cargar la información', 'Aceptar', 4000);
                return;
              } else if (j === iVal.iParentReference || j === iVal.iSonReference) {
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
                    dato: j === iVal.iParentReference ? 'ParentReference' : j === iVal.iSonReference ? 'SonReference' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                } else {
                  const validFormat = this.validFormat(res[i][j], 'formatAllChars');
                  if (!validFormat && validFormat === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: j === iVal.iParentReference ? 'ParentReference' : j === iVal.iSonReference ? 'SonReference' : null
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                }
              }

              if (res[i][j] !== undefined && res[i][j] !== '' && res[i][j] !== null) {
                if (j === iVal.iSize) {
                  const validFormatSize = this.validFormat(res[i][j], 'size');
                  if (!validFormatSize && validFormatSize === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: 'Size'
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                } else if (j === iVal.iColor) {
                  const validColor = this.validFormat(res[i][j], 'color');
                  if (!validColor && validColor === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: 'Color'
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                } else if (j === iVal.iHexColourCodePDP) {
                  const validColor = this.validFormat(res[i][j], 'colorPDP');
                  if (!validColor && validColor === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: 'HexColourCodePDP'
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                } else if (j === iVal.iHexColourName) {
                  const validColorName = this.validFormat(res[i][j], 'colorName');
                  if (!validColorName && validColorName === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: 'HexColourName'
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                }
              }
            } else {
              const extraFields = this.validFormat(res[i][j]);
              if (extraFields === false && !extraFields) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormatExtraField',
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
                dato: j === iVal.iEAN ? 'Ean' : j === iVal.iTipoDeProducto ? 'ProductType' : j === iVal.iCategoria ? 'Category' : null
              };
              this.listLog.push(itemLog);
              errorInCell = true;
            }
          }
        }
      }

      if (errorInCell) {
        this.addRowToTable(res, i, iVal, variant);
        errorInCell = false;
      }

      this.addInfoTosend(res, i, iVal, variant);
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
  addInfoTosend(res, i, iVal, variant?) {
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
      PackageHeight: res[i][iVal.iAltoDelEmpaque] ? res[i][iVal.iAltoDelEmpaque].trim().replace('.', ',') : null,
      PackageLength: res[i][iVal.ilargoDelEmpaque] ? res[i][iVal.ilargoDelEmpaque].trim().replace('.', ',') : null,
      PackageWidth: res[i][iVal.iAnchoDelEmpaque] ? res[i][iVal.iAnchoDelEmpaque].trim().replace('.', ',') : null,
      PackageWeight: res[i][iVal.iPesoDelEmpaque] ? res[i][iVal.iPesoDelEmpaque].trim().replace('.', ',') : null,
      SkuShippingSize: res[i][iVal.iSkuShippingSize] ? res[i][iVal.iSkuShippingSize].trim() : null,
      ProductHeight: res[i][iVal.iAltoDelProducto] ? res[i][iVal.iAltoDelProducto].trim().replace('.', ',') : null,
      ProductLength: res[i][iVal.iLargoDelProducto] ? res[i][iVal.iLargoDelProducto].trim().replace('.', ',') : null,
      ProductWidth: res[i][iVal.iAnchoDelProducto] ? res[i][iVal.iAnchoDelProducto].trim().replace('.', ',') : null,
      ProductWeight: res[i][iVal.iPesoDelProducto] ? res[i][iVal.iPesoDelProducto].trim().replace('.', ',') : null,
      Seller: res[i][iVal.iVendedor] ? res[i][iVal.iVendedor].trim() : null,
      ProductType: res[i][iVal.iTipoDeProducto] ? res[i][iVal.iTipoDeProducto].trim() : null,
      ImageUrl1: res[i][iVal.iURLDeImagen1] ? res[i][iVal.iURLDeImagen1].trim() : null,
      ImageUrl2: res[i][iVal.iURLDeImagen2] ? res[i][iVal.iURLDeImagen2].trim() : null,
      ImageUrl3: res[i][iVal.iURLDeImagen3] ? res[i][iVal.iURLDeImagen3].trim() : null,
      ImageUrl4: res[i][iVal.iURLDeImagen4] ? res[i][iVal.iURLDeImagen4].trim() : null,
      ImageUrl5: res[i][iVal.iURLDeImagen5] ? res[i][iVal.iURLDeImagen5].trim() : null,
      ModifyImage: res[i][iVal.iModificacionImagen] ? res[i][iVal.iModificacionImagen].trim() : null,
      Fulfillment: res[i][iVal.iLogisticExito] ? res[i][iVal.iLogisticExito] : '0',
      features: []
    };

    if (variant && variant === true) {
      newObjectForSend['ParentReference'] = res[i][iVal.iParentReference] ? res[i][iVal.iParentReference].trim() : null;
      newObjectForSend['SonReference'] = res[i][iVal.iSonReference] ? res[i][iVal.iSonReference].trim() : null;
      newObjectForSend['Size'] = res[i][iVal.iSize] ? res[i][iVal.iSize].trim() : null;
      newObjectForSend['Color'] = res[i][iVal.iColor] ? res[i][iVal.iColor].trim() : null;
      newObjectForSend['HexColourCodePDP'] = res[i][iVal.iHexColourCodePDP] ? res[i][iVal.iHexColourCodePDP].trim() : null;
      newObjectForSend['HexColourName'] = res[i][iVal.iHexColourName] ? res[i][iVal.iHexColourName].trim() : null;
    }

    if (i > 0 && i !== 0) {
      for (let j = i; j < res.length; j++) {
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
            k !== iVal.iModificacionImagen &&
            k !== iVal.iLogisticExito
          ) {
            if (variant && variant === true) {
              if (k !== iVal.iParentReference &&
                k !== iVal.iSonReference &&
                k !== iVal.iSize &&
                k !== iVal.iColor &&
                k !== iVal.iHexColourCodePDP &&
                k !== iVal.iHexColourName) {
                if (res[i][k] !== null && res[i][k] !== undefined && res[i][k] !== '') {
                  newFeatures['key'] = res[0][k].trim();
                  newFeatures['value'] = res[i][k].trim();
                  newObjectForSend.features.push(newFeatures);
                }
              }
            } else if (!variant && variant === false) {
              if (res[i][k] !== null && res[i][k] !== undefined && res[i][k] !== '') {
                newFeatures['key'] = res[0][k].trim();
                newFeatures['value'] = res[i][k].trim();
                newObjectForSend.features.push(newFeatures);
              }
            }

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
      PackageHeight: res[index][iVal.iAltoDelEmpaque] ? res[index][iVal.iAltoDelEmpaque].replace('.', ',') : null,
      PackageLength: res[index][iVal.ilargoDelEmpaque] ? res[index][iVal.ilargoDelEmpaque].replace('.', ',') : null,
      PackageWidth: res[index][iVal.iAnchoDelEmpaque] ? res[index][iVal.iAnchoDelEmpaque].replace('.', ',') : null,
      PackageWeight: res[index][iVal.iPesoDelEmpaque] ? res[index][iVal.iPesoDelEmpaque].replace('.', ',') : null,
      SkuShippingSize: res[index][iVal.iSkuShippingSize],
      ProductHeight: res[index][iVal.iAltoDelProducto] ? res[index][iVal.iAltoDelProducto].replace('.', ',') : null,
      ProductLength: res[index][iVal.iLargoDelProducto] ? res[index][iVal.iLargoDelProducto].replace('.', ',') : null,
      ProductWidth: res[index][iVal.iAnchoDelProducto] ? res[index][iVal.iAnchoDelProducto].replace('.', ',') : null,
      ProductWeight: res[index][iVal.iPesoDelProducto] ? res[index][iVal.iPesoDelProducto].replace('.', ',') : null,
      Seller: res[index][iVal.iVendedor],
      ProductType: res[index][iVal.iTipoDeProducto],
      Size: res[index][iVal.iSize],
      Color: res[index][iVal.iColor],
      HexColourCodePDP: res[index][iVal.iHexColourCodePDP],
      HexColourName: res[index][iVal.iHexColourName],
      ParentReference: res[index][iVal.iParentReference],
      SonReference: res[index][iVal.iSonReference],
      ModifyImage: res[index][iVal.iModificacionImagen],
      LogisticExito: res[index][iVal.iLogisticExito] ? res[index][iVal.iLogisticExito] : '0',
      ImageUrl1: res[index][iVal.iURLDeImagen1],
      ImageUrl2: res[index][iVal.iURLDeImagen2],
      ImageUrl3: res[index][iVal.iURLDeImagen3],
      ImageUrl4: res[index][iVal.iURLDeImagen4],
      ImageUrl5: res[index][iVal.iURLDeImagen5],
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
      this.arrayInformation[index].errorEan = false;
      this.arrayInformation[index].errorName = false;
      this.arrayInformation[index].errorCategory = false;
      this.arrayInformation[index].errorBrand = false;
      this.arrayInformation[index].errorModel = false;
      this.arrayInformation[index].errorDetails = false;
      this.arrayInformation[index].errorDescription = false;
      this.arrayInformation[index].errorMetaTitle = false;
      this.arrayInformation[index].errorMetaDescription = false;
      this.arrayInformation[index].errorKeyWords = false;
      this.arrayInformation[index].errorPackageHeight = false;
      this.arrayInformation[index].errorPackageLength = false;
      this.arrayInformation[index].errorPackageWidth = false;
      this.arrayInformation[index].errorPackageWeight = false;
      this.arrayInformation[index].errorSkuShippingSize = false;
      this.arrayInformation[index].errorProductHeight = false;
      this.arrayInformation[index].errorProductLength = false;
      this.arrayInformation[index].errorProductWidth = false;
      this.arrayInformation[index].errorProductWeight = false;
      this.arrayInformation[index].errorSeller = false;
      this.arrayInformation[index].errorProductType = false;
      this.arrayInformation[index].errorImageUrl1 = false;
      this.arrayInformation[index].errorImageUrl2 = false;
      this.arrayInformation[index].errorImageUrl3 = false;
      this.arrayInformation[index].errorImageUrl4 = false;
      this.arrayInformation[index].errorImageUrl5 = false;
      this.arrayInformation[index].errorParentReference = false;
      this.arrayInformation[index].errorSonReference = false;
      this.arrayInformation[index].errorModifyImage = false;
      this.arrayInformation[index].errorRow = false;
      this.arrayInformation[index].errorSize = false;
      this.arrayInformation[index].errorColor = false;
      this.arrayInformation[index].errorHexColourCodePDP = false;
      this.arrayInformation[index].errorHexColourName = false;
      this.arrayInformation[index].errorLogisticExito = false;
    }
  }

  /**
  * Funcionalidad para seleccionar el error del log en la tabla
  * @param {*} item
  * @memberof BulkLoadProductComponent
  */
  selectErrorLog(item: any) {
    this.setErrrorColumns();
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
    const formatSize = /^[^\s]{1,10}$/;
    const formatHexPDP = /^[a-zA-Z0-9]{1,6}$/;
    const formatlimitCharsSixty = /^[\w\W\s\d]{1,60}$/;

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
        case 'size':
          if ((inputtxt.match(formatSize))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'color':
          if (inputtxt === 'Beige' || inputtxt === 'Negro' ||
            inputtxt === 'Blanco' || inputtxt === 'Azul' ||
            inputtxt === 'Amarillo' || inputtxt === 'Cafe' ||
            inputtxt === 'Gris' || inputtxt === 'Verde' ||
            inputtxt === 'Naranja' || inputtxt === 'Rosa' ||
            inputtxt === 'Morado' || inputtxt === 'Rojo' ||
            inputtxt === 'Plata' || inputtxt === 'Dorado' ||
            inputtxt === 'MultiColor') {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'colorPDP':
          if ((inputtxt.match(formatHexPDP))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'colorName':
          if ((inputtxt.match(formatlimitCharsSixty))) {
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
