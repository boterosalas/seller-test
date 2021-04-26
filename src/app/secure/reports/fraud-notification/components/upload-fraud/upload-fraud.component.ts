import { Component, OnInit, Input, Inject, ViewChild, EventEmitter, TemplateRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { EndpointService, LoadingService, Logger, ModalService } from "@app/core";
import { ShellComponent } from "@app/core/shell";
import { ComponentsService } from "@app/shared";
import { TranslateService } from "@ngx-translate/core";
import * as XLSX from 'xlsx';
import { FraudNotificationService } from "../../fraud-notification.service";
import { FinishUploadFraudInformationComponent } from "../finish-upload-fraud-information/finish-upload-fraud-information";
import { FinishUploadProductInformationComponent } from "../finish-upload-product-information/finish-upload-product-information.component";

const log = new Logger('UploadFraudComponent');

@Component({
  selector: 'app-upload-fraud',
  templateUrl: './upload-fraud.component.html',
  styleUrls: ['./upload-fraud.component.scss']
})
export class UploadFraudComponent implements OnInit {

  public uploadAgreementBtn = true;
  public clearTable = new EventEmitter<any>();

  accept = '*';
  files: File[] = [];
  filesExcel: File[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  lastFileAt: Date;
  maxSize = 7145728;
  lastInvalids: any;
  dataToSend: any;
  showProgress = false;
  validComboDrag = true;
  validComboDragExcel = true;
  dragFiles = true;
  file = null;
  fileExcel = false;
  notExcel = false;
  initialState = true;
  arraySend = [];

  ListError =[];

  public url:string;

  public agreementRegex = {
    number: '',
  };

  disableSend = false;
  // Boleano para mostrar modal de carga o info de confirmacion
  prepareSend = true;

  public limitRowExcel: number;

  public arrayNecessaryData: Array<any>;
  public iVal: any;
  public fileName: any;
  public fileSize: any;

  /* Input file que carga el archivo*/
  @ViewChild('fileUploadOption', { static: false }) inputFileUpload: any;
  @ViewChild('dialogContent', {static: false}) content: TemplateRef<any>;

  bodyToSend: any;
  arrayTosendExcel: any[];

  checkIfDoneCharge: any = null;

  /* Mirar el estado del progreso de la carga*/
  public progressStatus = false;

  constructor(
    public dialogRef: MatDialogRef<UploadFraudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    public componentService: ComponentsService,
    private languageService: TranslateService,
    private shellComponent: ShellComponent,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    public _fraud:FraudNotificationService,
    private modalService: ModalService,
    private api: EndpointService,
    private router: Router

  ) { }

  ngOnInit() {
    this.setIntervalStatusCharge();
    this.url = this.api.get('downloadTemplateFrauds');
  }
  


  /**
   * Funcion para cerrar modal
   * @memberof ModalBulkloadAgreementComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Funcion para pasar a 64 el archivo PDF y poder enviarlo al servicio
   * @param {*} file
   * @returns {*}
   * @memberof ModalBulkloadAgreementComponent
   */
  public getBase64(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Funcionalidad que permite capturar los datos del excel.
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof ModalBulkloadAgreementComponent
   */
  readFileUpload(evt: any): Promise<any> {
    return new Promise((resolve, reject) => {
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

  /**
   * Metodo que se encarga de validar los datos del excel
   * @param {*} res
   * @param {*} file
   * @memberof ModalBulkloadAgreementComponent
   */
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


      /*
      * if valido si el excel solo trae 2 registros y hay 1 vacio
      * else if se valida que el documento tenga en los titulos o primera columna nos datos ID Seller
      * else si no lo tiene significa que el formato es invalido y manda un error*/
      if (this.arrayNecessaryData.length === 1) {
        this.loadingService.closeSpinner();
        this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
      } else {
        
        if (  this.arrayNecessaryData[0].includes('PLU') && this.arrayNecessaryData[0].includes('EAN') && 
        this.arrayNecessaryData[0].includes('Fecha del pedido ') &&
        this.arrayNecessaryData[0].includes('Número del pedido') && this.arrayNecessaryData[0].includes('Nombre del producto') &&
        this.arrayNecessaryData[0].includes('Cantidad') &&
        this.arrayNecessaryData[0].includes('Nombre del Vendedor') && this.arrayNecessaryData[0].includes('Estado del pedido') && this.arrayNecessaryData[0].includes('ID Seller')) {
          const iVal = {
            iFechaPedido: this.arrayNecessaryData[0].indexOf('Fecha del pedido '),
            iNumeroOrden: this.arrayNecessaryData[0].indexOf('Número del pedido'),
            iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
            iPLU: this.arrayNecessaryData[0].indexOf('PLU'),
            iNombreProducto: this.arrayNecessaryData[0].indexOf('Nombre del producto'),
            iCantidad: this.arrayNecessaryData[0].indexOf('Cantidad'),
            iIDVendedor: this.arrayNecessaryData[0].indexOf('ID Seller'),
            iNombreVendedor: this.arrayNecessaryData[0].indexOf('Nombre del Vendedor'),
            iEstado: this.arrayNecessaryData[0].indexOf('Estado del pedido'),
            iNumeroEnvio: this.arrayNecessaryData[0].indexOf('Número de la guía'),
            iCompania: this.arrayNecessaryData[0].indexOf('Transportadora'),
            iFechaEnvio: this.arrayNecessaryData[0].indexOf('Fecha de la guía'),
          };
          if (this.arrayNecessaryData.length > this.limitRowExcel) {
            this.loadingService.closeSpinner();
            this.componentService
              .openSnackBar(this.languageService.instant('secure.offers.bulk_upload.bulk_upload.exceeds_limits'), this.languageService.instant('actions.accpet_min'), 10000);
          } else {
            this.fileName = file.target.files[0].name;
            this.initialState = false;
            this.fileExcel = true;
            this.notExcel = false;
            for (let i = 0; i < res.length; i++) {
              this.addInfoTosend(this.arrayNecessaryData, i , iVal)
            }
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
   * Cierra la modal
   */

   public close(): void {
    this.dialogRef.close();
  }


  /**
   * Metodo para obtener fecha
   * @returns {Date}
   * @memberof ModalBulkloadAgreementComponent
   */
  public getDate(): Date {
    return new Date();
  }

  /**
   * Limpio las variables empleadas para visualizar los resultados de la carga
   * @memberof ModalBulkloadAgreementComponent
   */
  resetVariableUploadFile() {
    this.fileName = '';
    this.arrayNecessaryData = [];
  }

  /**
   * Limpio el input file
   * @memberof ModalBulkloadAgreementComponent
   */
  resetUploadFIle() {
    this.inputFileUpload.nativeElement.value = '';
  }

  /**
   * Método que permite detectar el input file
   * @param {*} evt
   * @memberof ModalBulkloadAgreementComponent
   */
  onFileChange(evt: any) {
    /*1. Limpio las variables empleadas en el proceso de carga.*/
    this.resetVariableUploadFile();
    /*2. Capturo los datos del excel*/
    this.readFileUpload(evt).then(data => {
      /*3. Valido los datos del excel*/
      this.validateDataFromFile(data, evt);
      this.resetUploadFIle();
      this.initialState = false;
      this.fileExcel = true;
      this.notExcel = false;
    }, err => {
      this.fileExcel = false;
      this.notExcel = true;
      this.initialState = false;
      this.loadingService.closeSpinner();
      this.resetVariableUploadFile();
      this.resetUploadFIle();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.accpet_min'), 4000);
    });
  }


  /**
   * MEtodo para enviar la data de carga de acuerdos al back
   * @memberof ModalBulkloadAgreementComponent
   */
  sendDataBulkLoadAgreement() {
    this.loadingService.viewSpinner();
            
  /**Elimina la fila de titulos */
  this.arraySend.splice(0,3);

  let fileName = this.fileName.split('.xls');

    let sendData = {
      FileName: fileName[0],
      Data: this.arraySend
    }
    
    this._fraud.registersFrauds(sendData).subscribe((result: any) => {
        if (result.data.status === 1) {
          this.setIntervalStatusCharge();
          this.dialogRef.close(false);
          this.shellComponent.eventEmitterOrders.getClear();
          this.loadingService.closeSpinner();
      } else {
        this.loadingService.closeSpinner();
        this.openDialogSendOrder(result);
        this.dialogRef.close(false);
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
        DateOrder: res[index][iVal.iFechaPedido],
        OrderNumber: parseFloat(res[index][iVal.iNumeroOrden]),
        EAN: res[index][iVal.iEAN],
        PLU: parseFloat(res[index][iVal.iPLU]),
        ProductName: res[index][iVal.iNombreProducto],
        Quantity: parseInt(res[index][iVal.iCantidad]),
        IdSeller: parseInt(res[index][iVal.iIDVendedor]),
        SellerName: res[index][iVal.iNombreVendedor],
        Status: res[index][iVal.iEstado],
        ShipmentNumber: parseFloat(res[index][iVal.iNumeroEnvio]),
        ShippingCompany: res[index][iVal.iCompania],
        ShipmentDate: res[index][iVal.iFechaEnvio],
        
      }
      
      this.arraySend.push(newObjectForSend);

    }


  /**
   * Metodo para consultar el estado de la carga
   * @memberof ModalBulkloadAgreementComponent
   */
  setIntervalStatusCharge() {
    clearInterval(this.checkIfDoneCharge);
    this.checkIfDoneCharge = setInterval(() => this._fraud.getStatusFrauds().subscribe((res: any) => {
      if(res.body.data.status !== 1) {
        this.verifyStateCharge(res);
      }
    }), 7000);
  }

  /**
   * Metodo para consultar el estado de la carga y abrir modal
   * @param {*} [result]
   * @memberof ModalBulkloadAgreementComponent
   */
  verifyStateCharge(result?: any) {
    if (result.body.data.checked === 'true') {
      clearInterval(this.checkIfDoneCharge);
    } else if (result.body.data.status === 1 || result.body.data.status === 4) {
      result.body.data.status = 1;
      if (!this.progressStatus) {
        this.openDialogFrauds(result);
      }
      this.progressStatus = true;
      this.loadingService.closeSpinner();
    } else if (result.body.data.status === 0) {
      clearInterval(this.checkIfDoneCharge);
      this.closeActualDialog();
      this.loadingService.closeSpinner();
    } else if (result.body.data.status === 2) {
      clearInterval(this.checkIfDoneCharge);
      this.closeActualDialog();
      this.openDialogFrauds(result);
      this.loadingService.closeSpinner();
      this.router.navigateByUrl("/UploadFraudComponent", { skipLocationChange: true }).then(() => {
            this.router.navigate(["/securehome/seller-center/ofertas/fraud-notification"]);
      });
    } else if (result.body.data.status === 3) {
      this.closeActualDialog();
      clearInterval(this.checkIfDoneCharge);
      const resultBody = JSON.parse(result.body.data.Response);
      if (resultBody.Errors.length > 0) {
        this.openDialogFrauds(result);
      }
      this.loadingService.closeSpinner();
    }
  }

  /**
   * Metodo para abrir modal con errores
   * @param {*} res
   * @memberof ModalBulkloadAgreementComponent
   */
  openDialogSendOrder(res: any): void {

    const dialogRef = this.dialog.open(FinishUploadProductInformationComponent, {
      width: '95%',
      data: {
        response: res,
        responseDiferent : false
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
    });
  }

  /**
   * Metodo para abrir modal ok
   * @param {*} res
   * @memberof ModalBulkloadAgreementComponent
   */
  openDialogFrauds(res: any): void {

    const dialogRef = this.dialog.open(FinishUploadFraudInformationComponent, {
      width: '95%',
      data: {
        response: res,
        responseDiferent : false
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
    });
  }

  /**
   * Metodo para cerrar el modal
   * @memberof ModalBulkloadAgreementComponent
   */
  public closeActualDialog(): void {
    if (this.progressStatus) {
      this.dialog.closeAll();
    }
  }


  /**
   * Metodo para desytruir el componente
   * @memberof ModalBulkloadAgreementComponent
   */
  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  
}
