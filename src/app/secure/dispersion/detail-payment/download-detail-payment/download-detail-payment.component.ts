import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { LoadingService, UserParametersService } from '@app/core';
import { DownloadCategoriesComponent } from '@app/secure/parameterize/category/categories/download-categories/download-categories.component';
import { ComponentsService, UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-download-detail-payment',
  templateUrl: './download-detail-payment.component.html',
  styleUrls: ['./download-detail-payment.component.scss']
})
export class DownloadDetailPaymentComponent implements OnInit {

  public user: UserInformation;
  myform: FormGroup;

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    public componentsService: ComponentsService,
    private languageService: TranslateService,
    public dialogRef: MatDialogRef<DownloadDetailPaymentComponent>,
  ) { }

  ngOnInit() {
    this.getDataUser().then(data => {
      this.createForm();
    });
  }

  /**
   * Metodo asincrono para traer informacion del usuario
   * @memberof DownloadDetailPaymentComponent
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Metodo para crear Formulario 
   * @memberof DownloadDetailPaymentComponent
   */
  createForm() {
    const email = this.user.sellerEmail;
    this.myform = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }

  /**
   * Metodo para cerrar modal
   * @memberof DownloadDetailPaymentComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  sendExportDownloadDetailPayment() {
    this.loadingService.viewSpinner();
    const dataToSend = {
      Email: this.myform.controls.email.value
    };
    // this.paramCategoriesService.downloadCategories(dataToSend).subscribe((res: any) => {
    //   const dataRes = JSON.parse(res.body);
    //   if (res != null) {
    //     if (dataRes.Data === true) {
    //       this.componentsService.openSnackBar(this.languageService.instant('secure.parametize.category.categories.btn_download_category_OK'), this.languageService.instant('actions.close'), 10000);
    //       this.onNoClick();
    //       this.loadingService.closeSpinner();
    //     } else {
    //       this.componentsService.openSnackBar(this.languageService.instant('secure.parametize.category.categories.btn_download_category_KO'), this.languageService.instant('actions.close'), 5000);
    //       this.loadingService.closeSpinner();
    //     }
    //   } else {
    //     this.componentsService.openSnackBar(this.languageService.instant('secure.parametize.category.categories.btn_download_category_KO'), this.languageService.instant('actions.close'), 5000);
    //     this.loadingService.closeSpinner();
    //   }
    // }, err => {
    //   this.componentsService.openSnackBar(this.languageService.instant('secure.parametize.category.categories.btn_download_category_KO'), this.languageService.instant('actions.close'), 5000);
    //   this.loadingService.closeSpinner();
    //   this.onNoClick();
    // });
  }
}
