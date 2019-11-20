import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';

const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-modal-errors',
  templateUrl: './modal-errors.component.html',
  styleUrls: ['./modal-errors.component.scss']
})
export class ModalErrorsComponent implements AfterViewInit {

  public response: any;
  public has: string;
  public have: string;
  public errors: string;
  public error: string;
  public name: string;

  /**
   * Creates an instance of ModalErrorsComponent.
   * @param {MatDialogRef<ModalErrorsComponent>} dialogRef
   * @param {*} data
   * @memberof ModalErrorsComponent
   */
  constructor(
    public dialogRef: MatDialogRef<ModalErrorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private languageService: TranslateService
  ) {

    this.response = data.response;
    this.has = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.has');
    this.have = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.have');
    this.errors = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.errors');
    this.error = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.error');
    this.name = this.languageService.instant('secure.products.create_product_unit.list_products.product_name');
  }

  ngAfterViewInit() {
    if ( !!this.response.productNotifyViewModel && this.response.productNotifyViewModel.length > 0) {
      this.response.productNotifyViewModel.map(element => {
        element.ProductName = !!element.ProductName ? element.ProductName : !!element.productName ? element.productName : null;
        element.Ean = !!element.Ean ? element.Ean : !!element.ean ? element.ean : null;
      });
      this.cd.detectChanges();
    }
  }

  /**
   * Método para cerrar el modal
   * @memberof ModalErrorsComponent
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
   * @memberof ModalErrorsComponent
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
   * @memberof ModalErrorsComponent
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
   * @memberof ModalErrorsComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
