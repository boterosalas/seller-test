import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Logger } from '@app/core';
import { ConfigBulkLoad, Event, TypeEvents } from '../models/bulk-load.model';
import { CommonService } from '@app/shared/services/common.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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
  @ViewChild('fileUploadInput') fileUploadInput: ElementRef;
  @Output() event: EventEmitter<Event> = new EventEmitter();

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getRegex();
  }

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

  public getRegex(): void {
    this.commonService.getAllRegex().subscribe(result => {
      if (result.status === 200) {
        this.validateRegex(JSON.parse(result.body.body).Data);
        this.initializePositions();
        this.initComponent = true;
      }
    }, error => {
      log.error(error);
    });
  }

  public initializePositions(): void {
    this.positionModerate[this.nameEan] = 0;
    this.positionModerate[this.nameResponse] = 0;
    this.positionModerate[this.nameReason] = 0;
    this.positionModerate[this.nameComment] = 0;
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
    this.readFileUpload(e).then(data => {
      this.fileName = e.target.files[0].name;
      this.dataToSend = [];
      this.counterErrors = 0;
      this.verifyModerationDataFromExcel(data);
      this.resetUploadFIle();
    }, error => {
      log.error('Error al cargar archivo de validación de productos');
    });
  }

  public validateHeaders(data: any): void {
    for (let i = 0; i < data.length; i++) {
      if (data[i] === this.nameEan) {
        this.positionModerate[this.nameEan] = i;
      } else if (data[i] === this.nameResponse) {
        this.positionModerate[this.nameResponse] = i;
      } else if (data[i] === this.nameComment) {
        this.positionModerate[this.nameComment] = i;
      } else if (data[i] === this.nameReason) {
        this.positionModerate[this.nameReason] = i;
      }
    }
  }

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
    }
    errorObject.Row = row;
    return errorObject;
  }


  public verifyModerationDataFromExcel(data: any): void {
    this.validateHeaders(data[0]);
    for (let i = 1; i < data.length; i++) {
      const validaData = { Ean: 0, Response: '', Reason: '', Comment: '', Errors: [] };

      /** Posee doble if para darle un mejor manejo a los mensajes de error  */
      /** Valida si tiene ean y concuerda con la regex */
      if (data[i][this.positionModerate[this.nameEan]]) {
        validaData.Ean = data[i][this.positionModerate[this.nameEan]];
        if (!data[i][this.positionModerate[this.nameEan]].match(this.regexEan)) {
          validaData.Errors.push(this.getError(i, this.nameEan, false, this.nameEan)); // Error el ean no es valido
        }
      } else {
        validaData.Errors.push(this.getError(i, this.nameEan, true, this.nameEan)); // Error no posee ean
      }

      /** Valida si tiene validacion y concuerda con la regex */
      if (data[i][this.positionModerate[this.nameResponse]]) {
        validaData.Response = data[i][this.positionModerate[this.nameResponse]];
        if (!data[i][this.positionModerate[this.nameResponse]].match(this.regexResponse)) {
          validaData.Errors.push(this.getError(i, this.nameResponse, false, this.nameResponse)); // Error la validacion no es valida
        }
      } else {
        validaData.Errors.push(this.getError(i, this.nameResponse, true, this.nameResponse)); // Error no posee validacion
      }
      /** Valida si tiene motivo y si la validacion fue rechazada y concuerda con la regex */
      if (this.rejected === data[i][this.positionModerate[this.nameResponse]] && data[i][this.positionModerate[this.nameReason]]) {
        validaData.Reason = data[i][this.positionModerate[this.nameReason]];
        if (!data[i][this.positionModerate[this.nameReason]].match(this.regexReason)) {
          validaData.Errors.push(this.getError(i, this.nameReason, false, this.nameReason)); // Error el motivo no es valida
        }
      } else if (this.rejected === data[i][this.positionModerate[this.nameResponse]] && !data[i][this.positionModerate[this.nameReason]]) {
        validaData.Errors.push(this.getError(i, this.nameReason, true, this.nameReason)); // Error no posee motivo a pesar de que fue rechazado 'this.rejected'
      }

      /** Valida la observacion y si concuerda con la regex */
      if (data[i][this.positionModerate[this.nameComment]]) {
        validaData.Comment = data[i][this.positionModerate[this.nameComment]];
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

  public sendDataToValidate(): void {
    this.showPrincipalContain = true;
    // AQUI VA EL SERVICIO PARA GUARDAR LOS DATOS QUE SON:
    this.dataToSend = this.dataToSend;
  }

  /**
   * Simula el evento click del input tipo file.
   */
  fileUploadInputClick() {
    const el: HTMLElement = this.fileUploadInput.nativeElement as HTMLElement;
    el.click();
  }

}
