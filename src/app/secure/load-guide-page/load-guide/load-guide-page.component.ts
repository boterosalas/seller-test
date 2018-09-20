import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { LoadingService, LoggedInCallback, Logger, UserLoginService, UserParametersService } from '@app/core';
import { ComponentsService, LoadGuide, RoutesConst } from '@app/shared';
import * as XLSX from 'xlsx';

import { DownloadFormatComponent } from '../download-format/download-format.component';
import { FinishUploadInformationComponent } from '../finish-upload-information/finish-upload-information.component';
import { LoadGuideService } from '../load-guide.service';

// log component
const log = new Logger('LoadGuideComponent');

/**
 * Component que permite realizar la carga de guías, consta de tres componentes mas
 * FinishUploadInformationComponent
 * TableLoadComponent
 * TableErrorsComponent
 * Estos componentes se emplean para separar el comportamiento de la carga de guías, se emplea "TableErrorsComponent"
 *  para visualizar la lista de errores capturados al momento de subir el archivo excel. se emplea "TableLoadComponent"
 *  para visualizar la lista de datos con errores en una tabla y visualizar el total de registros correctos y se emplea
 * "FinishUploadInformationComponent" para desplegar un modal donde se visualicen los logs generados por el back al momento
 * de envíar las guías. en FinishUploadInformationComponent se permite generar un excel con el log obtenido.
 */
@Component({
  selector: 'app-load-guide-page',
  templateUrl: './load-guide-page.component.html',
  styleUrls: ['./load-guide-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class LoadGuidePageComponent implements OnInit, LoggedInCallback {

  public paginator: any;

  // Información del usuario
  public user: any;
  // Creo el elemento que se empleara para la tabla
  public dataSource: MatTableDataSource<LoadGuide>;
  //  Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // Número de órdenes cargadas
  public orderListLength = true;
  // Objeto que contendra los datos del excel
  public arrayInformation: Array<LoadGuide> = [];
  // Objeto que contendra los datos del excel y servira para realizar el envio de la información
  public arrayInformationForSend: Array<{}> = [];
  // Variable que se emplea para el proceso de la carga de excel, se indica 501 por que se cuenta la primera fila que contiene los titulos
  public limitRowExcel = 502;
  // Número de filas cargadas
  public countRowUpload = 0;
  // Numero de errores
  public countErrors = 0;
  // Lista de logs
  public listLog = [];
  // Nombre del archivo cargado
  public fileName: any = '';
  // Sort para la tabla
  public sort: any;
  // Input file que carga el archivo
  @ViewChild('fileUploadOption') inputFileUpload: any;


  constructor(
    public componentService: ComponentsService,
    public loadGuideService: LoadGuideService,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    public userService: UserLoginService,
    private router: Router,
    public userParams: UserParametersService
  ) {
    this.user = {};
  }

  /**
   * @memberof LoadGuidePageComponent
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
   * @memberof LoadGuidePageComponent
   */
  resetUploadFIle() {
    // Limpio el input file
    this.inputFileUpload.nativeElement.value = '';
  }

  /**
   * @memberof LoadGuidePageComponent
   */
  resetVariableUploadFile() {
    // Limpio las variables empleadas para visualizar los resultados de la carga
    this.listLog = [];
    this.countErrors = 0;
    this.countRowUpload = 0;
    this.arrayInformation = [];
    this.arrayInformationForSend = [];
    this.orderListLength = true;
    this.numberElements = 0;
    this.fileName = '';
    // this.paginator.pageIndex = 0;
    this.finishProcessUpload();
  }

  /**
   * Desplegar el modal de descarga de formato
   * @memberof LoadGuidePageComponent
   */
  openModalDownloadFormat() {
    const dialogRef = this.dialog.open(DownloadFormatComponent, {
      height: '240px',
      width: '360px',
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
    });
  }

  /**
   * Funcionalidad que permite capturar los datos del excel.
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof LoadGuidePageComponent
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

          data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
          log.debug(data);
          resolve(data);
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
   * @memberof LoadGuidePageComponent
   */
  onFileChange(evt: any) {

    // 1. Limpio las variables empleadas en el proceso de carga.
    this.resetVariableUploadFile();
    // 2. Capturo los datos del excel
    this.readFileUpload(evt).then(data => {
      // 3. Valido los datos del excel
      this.validateDataFromFile(data, evt);
      this.resetUploadFIle();
    }, err => {
      this.loadingService.closeSpinner();
      this.resetVariableUploadFile();
      this.resetUploadFIle();
      this.componentService.openSnackBar('Se ha presentado un error al cargar la información', 'Aceptar', 4000);
    }).catch(err => {

    });
  }

  /**
   * Metodo que se encarga de validar los datos del excel
   * @param {any} res
   * @param {*} file
   * @memberof LoadGuidePageComponent
   */
  validateDataFromFile(res: any, file: any) {
    /* Elimino la posicion 0 que es la parte de titulo del excel */
    if (res.length !== 1 && res.length !== 0) {

      if (res.length === 2 && res[1][0] === undefined && res[1][1] === undefined &&
        res[1][2] === undefined && res[1][3] === undefined && res[1][4] === undefined) {
        this.loadingService.closeSpinner();
        this.componentService.openSnackBar('El archivo seleccionado no posee información', 'Aceptar', 10000);
      } else {
        // validación de los campos necesarios para el archivo
        if (res[0][0] === 'Orden' && res[0][1] === 'Sku' && res[0][2] === 'Cantidad' &&
          res[0][3] === 'Transportadora' && res[0][4] === 'Guía') {

          // validación para el número de registros
          if (res.length > this.limitRowExcel) {
            this.loadingService.closeSpinner();
            this.componentService.openSnackBar('El número de registros supera los 500, no se permite esta cantidad', 'Aceptar', 10000);
          } else {
            /* Funcionalidad que se necarga de cargar los datos del excel */
            this.fileName = file.target.files[0];
            this.fileName = this.fileName.name;
            res.splice(0, 1);
            this.createTable(res);
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
   * Método para identificar si un string solo contiene números
   * @param {any} inputtxt
   * @returns
   * @memberof LoadGuidePageComponent
   */
  alphanumeric(inputtxt: any) {
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
   * Método que se encarga de crear la tabla
   * @param {any} res
   * @memberof LoadGuidePageComponent
   */
  createTable(res: any) {
    // El array retornado por el excel es un array que indica en la primera posicion
    // El numero de filas, y cada fila posee los datos que obtuvo del excel.
    for (let index = 0; index < res.length; index++) {
      let isErrroNumber = false;
      let isErrorData = false;
      /* Recorro las columnas obtenidas */
      for (let j = 0; j < 5; j++) {

        /* Validación para los primeros tres campos que son numericos */
        if (j === 0 || j === 2) {
          // LLamo el método que permite validar si el string actual es solo númerico,
          // retorna false si contiene letras y true si solo es número
          const onlyNumber = this.alphanumeric(res[index][j]);
          /* si se obtiene true es por que el dato es un string */
          if (onlyNumber === false) {
            this.countErrors += 1;
            /* contadores para indicar en cual columna y fila esta el fallo */
            const row = index + 1, column = j + 1;
            const logger = {
              row: this.arrayInformation.length,
              column: j,
              type: 'NumberFormat',
              columna: column,
              fila: row,
              positionRowPrincipal: index
            };
            /* agrego el log a la lista de logs. */
            this.listLog.push(logger);
            isErrroNumber = true;


          }
        } else if (res[index][j] === undefined || res[index][j] === '') {

          this.countErrors += 1;
          /* contadores para indicar en cual columna y fila esta el fallo */
          const row = index + 1, column = j + 1;
          const logger = {
            row: this.arrayInformation.length,
            column: j,
            type: 'dateNotFound',
            columna: column,
            fila: row,
            positionRowPrincipal: index
          };
          /* agrego el log a la lista de logs. */
          this.listLog.push(logger);

          isErrorData = true;

        } else {
          log.info('Dato cargado correctamente');
        }

      }

      if (isErrorData || isErrroNumber) {
        // Agrego el registro para que se pueda visualizar en la tabla
        this.addRowToTable(res, index);
        isErrorData = false;
        isErrroNumber = false;
      }

      // Agrego todos los registros a una variable que sera empelada al momento de realizar el envío
      this.addInfoTosend(res, index);
    }

    /* almaceno el numero de filas cargadas correctamente */
    // this.countRowUpload = this.arrayInformationForSend.length;
    /* opción para visualizar el contenedor de no se ha cargado información */
    this.orderListLength = this.arrayInformationForSend.length === 0 ? true : false;

  }


  /**
   * Método que Almacena los  Registros cargados y que se emplearan para realizar el envio
   * @param {any} res
   * @param {any} index
   * @memberof LoadGuidePageComponent
   */
  addInfoTosend(res: any, index: any) {
    const newObjectForSend = {
      orderNumber: res[index][0],
      sku: res[index][1],
      quantity: res[index][2],
      carrier: res[index][3],
      tracking: res[index][4],
    };
    this.arrayInformationForSend.push(newObjectForSend);
  }

  /**
   * Método que permite almacenar los registros de errores que se visualizaran en la tabla
   * @param {any} res
   * @param {any} index
   * @memberof LoadGuidePageComponent
   */
  addRowToTable(res: any, index: any) {
    /* elemento que contendra la estructura del excel y permitra agregarlo a la variable final que contendra todos los datos del excel */
    const newObject: LoadGuide = {
      orderNumber: res[index][0],
      sku: res[index][1],
      quantity: res[index][2],
      carrier: res[index][3],
      tracking: res[index][4],
      errorRow: false,
      errorColumn1: false,
      errorColumn2: false,
      errorColumn3: false,
      errorColumn4: false,
      errorColumn5: false
    };

    this.arrayInformation.push(newObject);
  }

  /**
   * Método que termina de armar los datos para la tabla.
   * @memberof LoadGuidePageComponent
   */
  finishProcessUpload() {
    /* almaceno el numero de filas cargadas correctamente */
    this.countRowUpload = this.arrayInformationForSend.length;
    /* opción para visualizar el contenedor de no se ha cargado información */
    this.orderListLength = this.arrayInformationForSend.length === 0 ? true : false;
    // /* Creo el elemento que permite pintar la tabla */
    // this.arrayInformation.slice(0, 100)
    const data = JSON.stringify(this.arrayInformation);
    this.dataSource = new MatTableDataSource(JSON.parse(data));
    // this.dataSource.data = this.arrayInformation;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.numberElements = this.dataSource.data.length;
    this.loadingService.closeSpinner();
  }

  /**
   * Funcionalidad para limpiar los errores seleccionados en la tabla
   * @memberof LoadGuidePageComponent
   */
  setErrrorColumns() {
    for (let index = 0; index < this.arrayInformation.length; index++) {
      this.arrayInformation[index].errorColumn1 = false;
      this.arrayInformation[index].errorColumn2 = false;
      this.arrayInformation[index].errorColumn3 = false;
      this.arrayInformation[index].errorColumn4 = false;
      this.arrayInformation[index].errorColumn5 = false;
      this.arrayInformation[index].errorRow = false;
    }
  }

  /**
   * Funcionalidad para seleccionar el error del log en la tabla
   * @param {*} item
   * @memberof LoadGuidePageComponent
   */
  selectErrorLog(item: any) {
    this.setErrrorColumns();
    if (item.column === 0) {
      this.arrayInformation[item.row].errorColumn1 = true;
      this.arrayInformation[item.row].errorRow = true;
    } else if (item.column === 1) {
      this.arrayInformation[item.row].errorColumn2 = true;
      this.arrayInformation[item.row].errorRow = true;
    } else if (item.column === 2) {
      this.arrayInformation[item.row].errorColumn3 = true;
      this.arrayInformation[item.row].errorRow = true;
    } else if (item.column === 3) {
      this.arrayInformation[item.row].errorColumn4 = true;
      this.arrayInformation[item.row].errorRow = true;
    } else if (item.column === 4) {
      this.arrayInformation[item.row].errorColumn5 = true;
      this.arrayInformation[item.row].errorRow = true;
    }
    const data = JSON.stringify(this.arrayInformation);
    this.dataSource = new MatTableDataSource(JSON.parse(data));

    // ubico el indice de la paginación en la posición inicial
    this.paginator.pageIndex = 0;
    // seteo el paginador de la tabla
    this.dataSource.paginator = this.paginator;

    // capturo el item seleccionado por el usuairio
    const currentItem = item.row + 1;
    const indexPage = this.paginator.pageSize;
    // Metodo para calcular la posicion del elemento seleccionado por el usuario en la lista de errores,
    // recibe la ubicación del item y el numero de paginas que el usuario tiene aplicadas. con estos datos se calcula donde esta el registro
    this.paginator.pageIndex = Math.ceil((currentItem / indexPage)) - 1;
    // seteo los valores a la tabla
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Método que permite realizar el envío del json cargado del excel
   * @memberof LoadGuidePageComponent
   */
  sendJsonInformation() {

    const jsonToSend = {
      sellerId: this.user.sellerId,
      // dateTime: datePipe.transform(new Date(), 'yyyy/MM/dd'),
      listOrderTracking: this.arrayInformationForSend
    };
    this.loadGuideService.sendAllGuides(this.user, jsonToSend).subscribe(res => {
      this.openDialogSendOrder(res);

    }, err => {
      this.componentService.openSnackBar('Se ha presentado un error al enviar la guía', 'Aceptar', 10000);
    });
  }

  /**
   * Funcionalidad para desplegar el modal que permite visualizar la lista de mensajes
   * que retorna el back con los errores o registros correctos.
   * @param {any} res
   * @memberof LoadGuidePageComponent
   */
  openDialogSendOrder(res: any): void {
    this.loadingService.viewSpinner();
    const dialogRef = this.dialog.open(FinishUploadInformationComponent, {
      width: '95%',
      data: {
        response: res
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
      this.loadingService.closeSpinner();
    });
  }
}




