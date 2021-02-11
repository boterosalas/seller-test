import { Component, Inject, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-modal-bulkload-brands',
  templateUrl: './modal-bulkload-brands.component.html',
  styleUrls: ['./modal-bulkload-brands.component.scss']
})
export class ModalBulkloadBrandsComponent implements OnInit {

  public response: any;
  public productNotifyViewModel: any;
  public viewModel: any;


  constructor(
    public dialogRef: MatDialogRef<ModalBulkloadBrandsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.response = data.response;
  
  }

  ngOnInit() {
    if (this.response){
      this.productNotifyViewModel = this.response.body.Data.Response;
      if (this.productNotifyViewModel) {
        this.viewModel = JSON.parse(this.productNotifyViewModel);
      }
    }
  }


  /**
 * Método para cerrar el modal
 * @memberof ModalBulkloadBrandsComponent
 */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  verifyStateCharge() {
    this.dialogRef.close(true);
  }

  // Funcion para recargar la pagina.
  reloadPage() {
    window.location.reload();
  }


  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof ModalBulkloadBrandsComponent
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
   * @memberof ModalBulkloadBrandsComponent
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
   * @memberof ModalBulkloadBrandsComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
