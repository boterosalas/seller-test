import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService, UserParametersService } from '@app/core';
import { DownloadProductsComponent } from '@app/secure/products/list-products/download-products/download-products.component';
import { DialogData } from '@app/secure/support-modal/support-modal.component';
import { UserInformation } from '@app/shared';

@Component({
  selector: 'app-download-report-list-cancels',
  templateUrl: './download-report-list-cancels.component.html',
  styleUrls: ['./download-report-list-cancels.component.scss']
})
export class DownloadReportListCancelsComponent implements OnInit {

  public user: UserInformation;
  formListPending: FormGroup;
  public filtersList: any;

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
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
    this.formListPending = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onNoClickOk(): void {
    this.dialogRef.close(true);
  }

  sendExportDevolution() {
    this.loadingService.viewSpinner();
    this.filtersList = this.data;
    const dataToSend = {
      typeReport: 1,
      email: this.formListPending.controls.email.value,
      filtersReport: this.filtersList
    };
    console.log('dataToSend: ', dataToSend);
    // this.productsService.sendEmailExportProducts(dataToSend).subscribe((res: any) => {
    //   if (res != null) {
    //     if (res.data === true) {
    //       this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.ok'), this.languageService.instant('actions.close'), 10000);
    //       this.onNoClick();
    //       this.loadingService.closeSpinner();
    //     } else {
    //       this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
    //       this.loadingService.closeSpinner();
    //     }
    //   } else {
    //     this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
    //     this.loadingService.closeSpinner();
    //   }
    // }, err => {
    //   this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
    //   this.loadingService.closeSpinner();
    //   this.onNoClick();
    // });
  }

}
