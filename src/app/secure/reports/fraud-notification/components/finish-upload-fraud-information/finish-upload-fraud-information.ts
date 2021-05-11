import { Component, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component Modal que permite visualizar la lista de erores recibidos y exportarlos a un archivo tipo excel
 */
@Component({
  selector: 'app-finish-upload-fraud-information',
  templateUrl: './finish-upload-fraud-information.component.html',
  styleUrls: ['./finish-upload-fraud-information.component.scss']
})

/**
 * FinishUploadFraudInformationComponent
 */
export class FinishUploadFraudInformationComponent implements AfterViewInit {

  public response: any;
  public responseErrors: any;
  public has: string;
  public have: string;
  public errors: string;
  public error: string;
  public name: string;

  /**
   * Creates an instance of FinishUploadFraudInformationComponent.
   * @param {MatDialogRef<FinishUploadFraudInformationComponent>} dialogRef
   * @param {*} data
   * @memberof FinishUploadFraudInformationComponent
   */
  constructor(
    public dialogRef: MatDialogRef<FinishUploadFraudInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private languageService: TranslateService
  ) {

    this.response = data.response;
    if(this.response.body.data.status !== 1 ) {
      this.responseErrors = JSON.parse(data.response.body.data.response);
    }
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
   * @memberof FinishUploadFraudInformationComponent
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
