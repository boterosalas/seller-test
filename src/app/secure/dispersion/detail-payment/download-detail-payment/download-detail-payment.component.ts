import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService, UserParametersService } from '@app/core';
import { DialogData } from '@app/secure/support-modal/support-modal.component';
import { ComponentsService, UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { DetailPaymentService } from '../detail-payment.service';

@Component({
  selector: 'app-download-detail-payment',
  templateUrl: './download-detail-payment.component.html',
  styleUrls: ['./download-detail-payment.component.scss']
})
export class DownloadDetailPaymentComponent implements OnInit {

  public user: UserInformation;
  myform: FormGroup;
  sellerData: any;

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    public componentsService: ComponentsService,
    private languageService: TranslateService,
    public detailPaymentService: DetailPaymentService,
    public dialogRef: MatDialogRef<DownloadDetailPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.sellerData = this.data;
  }

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

  /**
   * Funcion para realizar el exportable de detalle de pagos
   * @param {*} form
   * @memberof DownloadDetailPaymentComponent
   */
  sendExportDownloadDetailPayment() {
    const email = '?email=' + this.myform.get('email').value;
    this.loadingService.viewSpinner();
    const dataToSend = {
      SellerId: this.sellerData.dataSeller.IdSeller ? this.sellerData.dataSeller.IdSeller.toString() : null,
      DispersionFilter: this.sellerData ? this.sellerData.dataFilterTab1 : null,
      PaymentNew: this.sellerData ? this.sellerData.dataFilterTab2 : null
    };
    this.detailPaymentService.downloadDetailPayment(email, dataToSend).subscribe((res: any) => {
      const dataRes = res.body;
      if (dataRes != null) {
        if (dataRes.data === true) {
          this.componentsService.openSnackBar(this.languageService.instant('secure.dispersion.detail-payment.download_OK'), this.languageService.instant('actions.close'), 10000);
          this.onNoClick();
          this.loadingService.closeSpinner();
        } else {
          this.componentsService.openSnackBar(this.languageService.instant('secure.dispersion.detail-payment.download_KO'), this.languageService.instant('actions.close'), 5000);
          this.loadingService.closeSpinner();
        }
      } else {
        this.componentsService.openSnackBar(this.languageService.instant('secure.dispersion.detail-payment.download_KO'), this.languageService.instant('actions.close'), 5000);
        this.loadingService.closeSpinner();
      }
    }, err => {
      this.componentsService.openSnackBar(this.languageService.instant('secure.dispersion.detail-payment.download_KO'), this.languageService.instant('actions.close'), 5000);
      this.loadingService.closeSpinner();
      this.onNoClick();
    });
  }
}
