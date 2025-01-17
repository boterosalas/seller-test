import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FAKE, FinishUploadInformation } from '@app/shared';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


/**
 * Component Modal que permite visualizar la lista de erores recibidos y exportarlos a un archivo tipo excel
 */
@Component({
  selector: 'app-finish-upload-information',
  templateUrl: './finish-upload-information.component.html',
  styleUrls: ['./finish-upload-information.component.scss']
})

/**
 * FinishUploadInformationComponent
 */
export class FinishUploadInformationComponent {

  public response: FinishUploadInformation;
    request: any;

  /**
   * Creates an instance of FinishUploadInformationComponent.
   * @param {MatDialogRef<FinishUploadInformationComponent>} dialogRef
   * @param {*} data
   * @memberof FinishUploadInformationComponent
   */
  constructor(
    public dialogRef: MatDialogRef<FinishUploadInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.response = data.response;

    this.response = this.response || FAKE.FAKESUCCESFINISHUPLOADINFORMATION;
  }


  /**
   * Método para cerrar el modal
   * @memberof FinishUploadInformationComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }


  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof FinishUploadInformationComponent
   */
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
   * Método que permite dar el formato correcto al archivo excel generado
   * @param {*} s
   * @returns
   * @memberof FinishUploadInformationComponent
   */
  s2ab(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    // tslint:disable-next-line:no-bitwise
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
    return buf;
  }

  /**
   * Método que permite generar el excel con los datos pasados.
   * @param {*} buffer
   * @param {string} fileName
   * @memberof FinishUploadInformationComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
