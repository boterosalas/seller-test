import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';

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
  public has: string;
  public have: string;
  public errors: string;
  public error: string;
  public name: string;
  public errorsFrauds = []; 

  /**
   * Creates an instance of FinishUploadProductInformationComponent.
   * @param {MatDialogRef<FinishUploadProductInformationComponent>} dialogRef
   * @param {*} data
   * @memberof FinishUploadProductInformationComponent
   */
  constructor(
    public dialogRef: MatDialogRef<FinishUploadProductInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private languageService: TranslateService
  ) {

    this.response = data.response;
    if (this.response && this.response.data.response) {
      this.errorsFrauds = JSON.parse(this.response.data.response);
    }
    this.has = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.has');
    this.have = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.have');
    this.errors = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.errors');
    this.error = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.error');
    this.name = this.languageService.instant('secure.products.create_product_unit.list_products.product_name');
  }

  /**
   * Método para cerrar el modal
   * @memberof FinishUploadProductInformationComponent
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


}
