import { Component, OnInit, Input, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Logger } from "@app/core";
import { ComponentsService } from "@app/shared";
import * as XLSX from 'xlsx';

const log = new Logger('UploadFraudComponent');

@Component({
  selector: 'app-upload-fraud',
  templateUrl: './upload-fraud.component.html',
  styleUrls: ['./upload-fraud.component.scss']
})
export class UploadFraudComponent implements OnInit {

  accept = "*";
  @Input() files: File[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  lastFileAt: Date;
  maxSize = 7145728;
  lastInvalids: any;
  dataToSend: any;
  showProgress = false;
  validComboDrag = true;
  dragFiles = true;
  file = null;
  
  id: string;

  public uploadFraudBtn = true;

  public limitRowExcel: number;

  

  constructor(
    public componentService: ComponentsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploadFraudComponent>,
    ) {}

  ngOnInit() {}

  /**
   * funcion para transformar el PDF en formato 64 
   *
   * @memberof UploadFileComponent
   */
  sendFile() {
    const lengthFiles = document
      .getElementById(`${this.id}`)
      .getElementsByTagName("input")[0].files.length;
    let file = document.getElementById(`${this.id}`).getElementsByTagName("input")[0]
      .files[lengthFiles - 1];
      file = this.files[this.files.length - 1];
      const size = parseFloat(((file.size) / 1024 / 1024).toFixed(3));
    this.getBase64(file).then((dataFile) => {
      let splitb64File = dataFile.split('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,');
      let data = splitb64File[1];
      console.log(data);
    });
  }

    /**
   * Cierra la modal
   */

     public close(): void {
      this.dialogRef.close();
    }

  /**
   * funcion para pasar a 64 el archivo PDF 
   *
   * @param {*} file
   * @returns {*}
   * @memberof ModalLoadAgreementComponent
   */
  public getBase64(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Obitene la fecha actual
   *
   * @returns
   * @memberof LoadFileComponent
   */
  public getDate(): Date {
    return new Date();
  }

  /**
   * funcion para validar el boton de guardar
   *
   * @memberof UploadFileComponent
   */
  validateOneFile() {
    this.uploadFraudBtn=false;
  }
  /**
   * funcion para validar el boton de guardar
   *
   * @param {*} validate
   * @memberof UploadFileComponent
   */
  validateFormatInvalidate(validate: any) {
    this.uploadFraudBtn = true;
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


}
