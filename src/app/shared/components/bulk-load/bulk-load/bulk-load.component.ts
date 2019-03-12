import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Logger, ModalService, LoadingService } from '@app/core';
import { ConfigBulkLoad, Event, TypeEvents } from '../models/bulk-load.model';
import { CommonService } from '@app/shared/services/common.service';
import * as XLSX from 'xlsx';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SendModerationFormatModalService } from '@app/secure/products/bulk-load-product-moderation/send-moderation-format-modal/send-moderation-format-modal.service';
import { BulkLoadProductService } from '@app/secure/products/bulk-load-product/bulk-load-product.service';
import { ErrorDialogComponent, TypeDialog } from '../../dialogs/error-dialog.component';

const log = new Logger('BulkLoadComponent(shared)');

@Component({
  selector: 'app-bulk-load',
  templateUrl: './bulk-load.component.html',
  styleUrls: ['./bulk-load.component.scss'],
})
export class BulkLoadComponent implements OnInit {

  /**
   * Se inicializan las variables a usar en el componente.
   * initComponent: Boolean, activa el componente despues de que toda la data requerida para el funcionamiento de esta, este correcta.
   *
   * @memberof BulkLoadComponent
   */
  nameResponse = 'Validacion';
  nameEan = 'EAN';
  nameReason = 'Motivo';
  nameComment = 'Observacion';
  nameId = 'Id';
  nameIdpw = 'idpw';
  approved = 'Aprobado';
  rejected = 'Rechazado';
  positionModerate = {};
  dataToSend = [];
  limitRowExcel = 1048576;
  fileName = ' ';
  countRowUpload = 0;
  listLog = null;
  initComponent = false;
  regexList = [];
  errorData = { Description: '', Column: 0, Row: 0 };
  showErrorView = false;
  errorsPosition = [this.nameEan, this.nameResponse, this.nameReason, this.nameComment];
  showPrincipalContain = true;
  typeDialog = new TypeDialog();

  /** Mensajes con errores */
  ErrorMsgEan = 'El ean es obligatorio'; // Contiene el error en español de EAN.
  ErrorMsgResponse = 'La validación es obligatoria';
  ErrorMsgReason = 'El Motivo es obligatorio si la Validación es "Rechazado"'; // Contiene el error en español del Motivo.

  /** Variables para almacenar las regex */
  regexEan: string;
  msgErrorEan: string;
  regexResponse: string;
  msgErrorResponse: string;
  regexComment: string;
  msgErrorComment: string;
  regexReason: string;
  msgErrorReason: string;
  counterErrors = 0;

  @Input() config: ConfigBulkLoad = {
    title: 'CARGA MASIVA',
    mainContentTpl: null
  };

  @Input() disabledLoad: boolean;

  @ViewChild('fileUploadInput') fileUploadInput: ElementRef;
  @Output() event: EventEmitter<Event> = new EventEmitter();
  public progressStatus = false;


  constructor(private commonService: CommonService,
    public dialog: MatDialog,
    public BulkLoadProductS: BulkLoadProductService,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private moderationService: SendModerationFormatModalService) {
  }

  ngOnInit(): void {
    this.getRegex();
    this.verifyStateCharge();
    this.commonService.chargeAgain.subscribe(data => {
      this.closeActualDialog();
      this.verifyStateCharge();
    });
  }

  /**
   * Valida las regex que obtiene del servicio y que son necesarias para el funcionamiento del componente.
   * EAN, Validacion. Motivo, Descripcion.
   *
   * @param {*} data
   * @memberof BulkLoadComponent
   */
  public validateRegex(data: any): void {
    for (let i = 0; i < data.length; i++) {
      switch (data[i].Identifier) {
        case this.commonService.nameRegexEan:
          this.regexEan = data[i].Value;
          this.msgErrorEan = data[i].ErrorMessage;
          break;
        case this.commonService.nameRegexResponse:
          this.regexResponse = data[i].Value;
          this.msgErrorResponse = data[i].ErrorMessage;
          break;
        case this.commonService.nameRegexComment:
          this.regexComment = data[i].Value;
          this.msgErrorComment = data[i].ErrorMessage;
          break;
        case this.commonService.nameRegexReason:
          this.regexReason = data[i].Value;
          this.msgErrorReason = data[i].ErrorMessage;
          break;
      }
    }
  }

  /**
   * Funcion para obtener las regex del servicio para luego ser validadas y almacenadas en variables para la manipulacion de estas.
   *
   * @memberof BulkLoadComponent
   */
  public getRegex(): void {
    this.commonService.getAllRegex().subscribe(result => {
      if (result.status === 200) {
        this.validateRegex(JSON.parse(result.body.body).Data);
        this.initializePositions();
        this.initComponent = true;
      }
    }, error => {
      log.error(error, 'regex');
    });
  }

  /**
   * Iniciaizacion de variables que almacenan la posicion de las cabeceras necesarias para la manipulacion de informacion.
   *
   * @memberof BulkLoadComponent
   */
  public initializePositions(): void {
    this.positionModerate[this.nameEan] = -1;
    this.positionModerate[this.nameResponse] = -1;
    this.positionModerate[this.nameReason] = -1;
    this.positionModerate[this.nameComment] = -1;
    this.positionModerate[this.nameId] = -1;
  }
  /**
   * Emite un evento cuando se quiere descargar el formato.
   */
  downloadFile() {
    this.event.emit({
      type: TypeEvents.download
    });
  }

  /**
   * Emite un evento cuando se quiere importar el formato.
   */
  uploadFile() {
    this.event.emit({
      type: TypeEvents.upload
    });
    log.debug('importFile');
  }

  /**
   * Funcionalidad que permite capturar los datos del excel.
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof BulkLoadProductComponent
   */
  readFileUpload(evt: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.loadingService.viewSpinner();
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
          const ws: XLSX.WorkSheet = wb.Sheets[Object.keys(wb.Sheets)[0]];
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
   * @memberof BulkLoadProductComponent
   */
  resetUploadFIle() {
    /*Limpio el input file*/
    this.fileUploadInput.nativeElement.value = '';
  }

  /**
   * Cuando cambia el input tupo file.
   *
   * @param e
   */
  fileUploadInputChanged(e: any) {
    log.debug('fileUploadInputChanged');
    this.showErrorView = false;
    this.showPrincipalContain = false;
    this.initializePositions();
    this.readFileUpload(e).then(data => {
      log.debug(data, data.length);
      this.fileName = e.target.files[0].name;
      this.dataToSend = [];
      this.counterErrors = 0;
      this.verifyModerationDataFromExcel(data);
      this.resetUploadFIle();
    }, error => {
      const msg = 'Error al cargar archivo de validación de productos';
      log.error(msg, error);
      this.showPrincipalContain = true;
      this.snackBar.open(msg, 'Cerrar', {
        duration: 3000
      });

      this.resetUploadFIle();
    });
  }

  /**
   * Funcion para obtener la cabecera del documento.
   *
   * @param {*} data
   * @memberof BulkLoadComponent
   */
  public validateHeaders(data: any): void {
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        if (this.validaTrim(data[i]) === this.nameEan) {
          this.positionModerate[this.nameEan] = i;
        } else if (this.validaTrim(data[i]) === this.nameResponse) {
          this.positionModerate[this.nameResponse] = i;
        } else if (this.validaTrim(data[i]) === this.nameComment) {
          this.positionModerate[this.nameComment] = i;
        } else if (this.validaTrim(data[i]) === this.nameReason) {
          this.positionModerate[this.nameReason] = i;
        } else if (this.validaTrim(data[i]) === this.nameId) {
          this.positionModerate[this.nameId] = i;
        }
      }
    }
  }

  /**
   * Funcion para obtener el error al validar la informacion ingresada en el excel
   *
   * @param {number} row
   * @param {string} errorLocated
   * @param {boolean} [isNull=false]
   * @param {string} value
   * @returns {*}
   * @memberof BulkLoadComponent
   */
  public getError(row: number, errorLocated: string, isNull: boolean = false, value: string): any {
    let errorObject: any;
    this.counterErrors++;
    switch (errorLocated) {
      case this.nameEan:
        if (isNull) {
          errorObject = {
            Column: this.positionModerate[this.nameEan],
            Description: this.ErrorMsgEan,
            Value: value
          };
        } else {
          errorObject = {
            Column: this.positionModerate[this.nameEan],
            Description: this.msgErrorEan,
            Value: value
          };
        }
        break;
      case this.nameResponse:
        if (isNull) {
          errorObject = {
            Column: this.positionModerate[this.nameResponse],
            Description: this.ErrorMsgResponse,
            Value: value
          };
        } else {
          errorObject = {
            Column: this.positionModerate[this.nameResponse],
            Description: this.msgErrorResponse,
            Value: value
          };
        }
        break;
      case this.nameReason:
        if (isNull) {
          errorObject = {
            Column: this.positionModerate[this.nameReason],
            Description: this.ErrorMsgReason,
            Value: value
          };
        } else {
          errorObject = {
            Column: this.positionModerate[this.nameReason],
            Description: this.msgErrorReason,
            Value: value
          };
        }
        break;
      case this.nameComment:
        errorObject = {
          Column: this.positionModerate[this.nameComment],
          Description: this.msgErrorComment,
          Value: value
        };
        break;
      case this.nameId:
        errorObject = {
          Column: this.positionModerate[this.nameId],
          Description: 'El ID es obligatorio',
          Value: value
        };
        break;
    }
    errorObject.Row = row;
    return errorObject;
  }

  /**
   * Funcion para realiza trim si posee valor
   *
   * @param {string} value
   * @returns {*}
   * @memberof BulkLoadComponent
   */
  public validaTrim(value: string): any {
    if (value) {
      return value.trim();
    }
    return value;
  }


  public verifyModerationDataFromExcel(data: any): void {
    this.validateHeaders(data[0]);
    for (let i = 1; i < data.length; i++) {
      const validaData = { Ean: '', Response: '', Reason: '', Comment: '', Errors: [], Idpw: '' };

      /** Posee doble if para darle un mejor manejo a los mensajes de error  */
      /** Valida si tiene ean y concuerda con la regex */
      if (data[i][this.positionModerate[this.nameEan]]) {
        validaData.Ean = this.validaTrim(data[i][this.positionModerate[this.nameEan]]);
        if (!this.validaTrim(data[i][this.positionModerate[this.nameEan]]).match(this.regexEan)) {
          validaData.Errors.push(this.getError(i, this.nameEan, false, this.nameEan)); // Error el ean no es valido
        }
      } else {
        validaData.Errors.push(this.getError(i, this.nameEan, true, this.nameEan)); // Error no posee ean
      }

      if (data[i][this.positionModerate[this.nameId]]) {
        validaData.Idpw = this.validaTrim(data[i][this.positionModerate[this.nameId]]);
      } else {
        validaData.Errors.push(this.getError(i, this.nameId, true, this.nameId)); // Error no posee ean
      }

      /** Valida si tiene validacion y concuerda con la regex */
      if (data[i][this.positionModerate[this.nameResponse]]) {
        validaData.Response = data[i][this.positionModerate[this.nameResponse]];
        if (!this.validaTrim(data[i][this.positionModerate[this.nameResponse]]).match(this.regexResponse)) {
          validaData.Errors.push(this.getError(i, this.nameResponse, false, this.nameResponse)); // Error la validacion no es valida
        }
      } else {
        validaData.Errors.push(this.getError(i, this.nameResponse, true, this.nameResponse)); // Error no posee validacion
      }
      /** Valida si tiene motivo y si la validacion fue rechazada y concuerda con la regex */
      if (this.rejected === this.validaTrim(data[i][this.positionModerate[this.nameResponse]]) && this.validaTrim(data[i][this.positionModerate[this.nameReason]])) {
        validaData.Reason = this.validaTrim(data[i][this.positionModerate[this.nameReason]]);
        if (!data[i][this.positionModerate[this.nameReason]].match(this.regexReason)) {
          validaData.Errors.push(this.getError(i, this.nameReason, false, this.nameReason)); // Error el motivo no es valida
        }
      } else if (this.rejected === data[i][this.positionModerate[this.nameResponse]] && !this.validaTrim(data[i][this.positionModerate[this.nameReason]])) {
        validaData.Errors.push(this.getError(i, this.nameReason, true, this.nameReason)); // Error no posee motivo a pesar de que fue rechazado 'this.rejected'
      }

      /** Valida la observacion y si concuerda con la regex */
      if (data[i][this.positionModerate[this.nameComment]]) {
        validaData.Comment = this.validaTrim(data[i][this.positionModerate[this.nameComment]]);
        if (!data[i][this.positionModerate[this.nameComment]].match(this.regexComment)) {
          validaData.Errors.push(this.getError(i, this.nameComment, false, this.nameComment)); // Error el motivo no es valida
        }
      }

      this.dataToSend.push(validaData);
    }
    if (this.counterErrors > 0) {
      this.showErrorView = true;
    } else {
      this.showPrincipalContain = true;
      this.sendDataToValidate();
    }
  }

  /**
   * Envia al servicio los datos procesados del excel.
   *
   * @memberof BulkLoadComponent
   */
  public sendDataToValidate(): void {
    this.showPrincipalContain = true;
    this.loadingService.viewSpinner();
    // AQUI VA EL SERVICIO PARA GUARDAR LOS DATOS QUE SON:
    if (this.dataToSend.length) {
      this.moderationService.sendModeration(this.dataToSend).subscribe((result: any) => {
        this.loadingService.closeSpinner();
        const errorsToShow = [];
        if (result) {
          if (result.data && result.data.error !== 0) {
            if (result.data.productNotifyViewModel.length) {
              result.data.productNotifyViewModel.forEach(element => {
                errorsToShow.push(
                  {
                    Name: element.ean,
                    Description: element.message
                  }
                );
              });
              this.openDialogSendOrderPopUp({ errors: errorsToShow, type: this.typeDialog.Error });
            }
            // Validar que los errores existan para poder mostrar el modal.
          } else if (result.data && result.data.error === 0) {
            this.verifyStateCharge(true);
          }

          if (result.message && !result.data) {
            this.snackBar.open(result.message, 'Cerrar', {
              duration: 3000
            });
          }
        } else {
          this.modalService.showModal('errorService');
          log.error('no respondio el servicio de moderacion con datos validos');
        }
      }, error => {
        log.error('no pudo guardar el archivo', error);
        this.loadingService.closeSpinner();
      });
    } else {
      this.loadingService.closeSpinner();
      this.snackBar.open('El archivo esta vacío', 'Cerrar', {
        duration: 3000
      });
    }
  }


  /**
   * Funcion para validar el estado de la carga masiva.
   *
   * @memberof BulkLoadComponent
   */
  public closeActualDialog(): void {
    if (this.progressStatus) {
      this.dialog.closeAll();
    }
  }

  /**
   * Obtiene por medio de un servicio el estado de la cargar y muestra el modal dependiendo de este.
   *
   * @memberof BulkLoadComponent
   */
  verifyStateCharge(verifyState: boolean = false) {
    const errorsToShow = [];
    this.progressStatus = false;
    this.BulkLoadProductS.getCargasMasivas().subscribe((result: any) => {
      // Convertimos el string que nos envia el response a JSON que es el formato que acepta
      try {

        // Verifica que el response sea un string para proceder a convertirlo a JSON
        if (result.body.data.response && typeof (result.body.data.response) === 'string') {
          result.body.data.response = JSON.parse(result.body.data.response);
        }

        // Verifica estados de la carga.
        // Estado 1 o 4 cuando la carga esta en progreso
        if (result.body.data.status === 1 || result.body.data.status === 4) {
          this.openDialogSendOrderPopUp({ type: this.typeDialog.Process });
          this.progressStatus = true;

          // Estado 2 cuando la carga es exitosa.
        } else if (result.body.data.status === 2 && (result.body.data.checked === 'false' || verifyState)) {

          this.openDialogSendOrderPopUp({ type: this.typeDialog.Success });

          // Estado 3 cuando la carga posee errores
        } else if (result.body.data.status === 3 && result.body.data.checked === 'false') {

          if (result.body.data.response && result.body.data.response.Error) {
            result.body.data.response.Error.forEach(element => {
              errorsToShow.push({
                Name: element.ean,
                Description: element.message
              });
            });
            this.openDialogSendOrderPopUp({ type: this.typeDialog.Error, errors: errorsToShow });

          } else {
            this.modalService.showModal('errorService');
            log.debug('Error no identificado al obtener los errores del servicio');
          }
        }
      } catch (e) {
        log.error('Error no identificado al obtener el estado de la carga', e);
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Funcion para validar abrir el modal de errores.
   *
   * @param {*} res
   * @memberof BulkLoadComponent
   */
  openDialogSendOrderPopUp(res: any): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '90%',
      disableClose: true,
      data: res,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.verifyStateCharge();
      }
    });
  }

  /**
   * Simula el evento click del input tipo file.
   */
  fileUploadInputClick() {
    const el: HTMLElement = this.fileUploadInput.nativeElement as HTMLElement;
    el.click();
  }

}
