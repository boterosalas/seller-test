import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserInformation, ComponentsService } from '@app/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserParametersService, LoadingService } from '@app/core';
import { ListProductService } from '../list-products.service';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  data: any;
}


@Component({
  selector: 'app-download-products',
  templateUrl: './download-products.component.html',
  styleUrls: ['./download-products.component.scss']
})
export class DownloadProductsComponent implements OnInit {

  public user: UserInformation;
  myform: FormGroup;
  public filtersList: any;

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private productsService: ListProductService,
    public componentsService: ComponentsService,
    private languageService: TranslateService,
    public dialogRef: MatDialogRef<DownloadProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.getDataUser().then(data => {
      this.createForm();
    });
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  createForm() {
    const email = this.user.sellerEmail;
    this.myform = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onNoClickOk(): void {
    this.dialogRef.close(true);
  }

  /**
   * Metodo para enviar datos al servicio y descargar el reporte.
   * @memberof DownloadProductsComponent
   */
  sendExportProducts() {
    this.loadingService.viewSpinner();
    this.filtersList = this.data;
    const dataToSend = {
      email: this.myform.controls.email.value,
      filtersList: this.filtersList
    };
    this.productsService.sendEmailExportProducts(dataToSend).subscribe((res: any) => {
      console.log(res);
      if (res != null) {
        if (res.data === true) {
          this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.ok'), this.languageService.instant('actions.close'), 10000);
          this.onNoClick();
          this.loadingService.closeSpinner();
        } else {
          this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
          this.loadingService.closeSpinner();
        }
      } else {
        this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
        this.loadingService.closeSpinner();
      }
    }, err => {
      this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
      this.loadingService.closeSpinner();
      this.onNoClick();
    });
  }

  /**
   * Metodo para dar formato a la fecha dd-mm-yyyy
   * @param {*} date
   * @returns {*}
   * @memberof DownloadProductsComponent
   */
  public getDate(date: any): any {
    const day = this.addsZeroDate(date.getDate().toString());
    const months = this.addsZeroDate((date.getMonth() + 1).toString());
    const year = date.getFullYear();

    return day + '-' + months + '-' + year;
  }

  /**
   * Metodo para agregar 0 a la fecha
   * @param {*} param
   * @returns {*}
   * @memberof DownloadProductsComponent
   */
  public addsZeroDate(param: any): any {
    if (param.length < 2) {
      return '0' + param;
    }
    return param;
  }

}
