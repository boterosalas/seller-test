/* 3rd party components */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_EXTENSION = '.xlsx';


/**
 * Component Modal que permite visualizar la lista de erores recibidos y exportarlos a un archivo tipo excel
 */
@Component({
  selector: 'app-finish-upload-product-information',
  templateUrl: './finish-upload-product-information.component.html',
  styleUrls: ['./finish-upload-product-information.component.scss']
})

/**
 * FinishUploadProductInformationComponent
 */
export class FinishUploadProductInformationComponent {

  public response: any;

  /**
   * Creates an instance of FinishUploadProductInformationComponent.
   * @param {MatDialogRef<FinishUploadProductInformationComponent>} dialogRef
   * @param {*} data
   * @memberof FinishUploadProductInformationComponent
   */
  constructor(
    public dialogRef: MatDialogRef<FinishUploadProductInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.response = data.response;
  }

  /**
   * Método para cerrar el modal
   * @memberof FinishUploadProductInformationComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof FinishUploadProductInformationComponent
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
   * @memberof FinishUploadProductInformationComponent
   */
  s2ab(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    // tslint:disable-next-line:curly
    for (let i = 0; i !== s.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  /**
   * Método que permite generar el excel con los datos pasados.
   * @param {*} buffer
   * @param {string} fileName
   * @memberof FinishUploadProductInformationComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}