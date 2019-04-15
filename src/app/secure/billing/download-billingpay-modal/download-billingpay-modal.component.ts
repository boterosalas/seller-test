// 3rd party components
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

// our own custom components
import { UserInformation, ComponentsService } from '@app/shared';
import { Logger, UserParametersService, LoadingService } from '@app/core';
import { BillingService } from '../billing.service';
// import { DownloadBillingPayService } from './download-billingpay.service';


@Component({
  selector: 'app-download-billingpay-modal',
  templateUrl: './download-billingpay-modal.component.html',
  styleUrls: ['./download-billingpay-modal.component.scss']
})

export class DownloadBillingpayModalComponent implements OnInit {

  // Formulario para realizar la busqueda
  public myform: FormGroup;

  // user info
  public user: UserInformation;

  // Limite de registros para descargar
  public limitLengthBillingpay: any = 0;

  /**
   * Creates an instance of DownloadBillingpayModalComponent.
   * @param {MatDialogRef<DownloadBillingpayModalComponent>} dialogRef
   * @param {DownloadBillingpayService} DownloadBillingpayService
   * @param {ComponentsService} componentsService
   * @param {FormBuilder} fb
   * @param {*} data
   * @memberof DownloadBillingpayModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<DownloadBillingpayModalComponent>,
    public componentsService: ComponentsService,
    private fb: FormBuilder,
    public userParams: UserParametersService,
    public billService: BillingService,
    private loadingService: LoadingService,
    // public downloadBillingpayService: DownloadBillingPayService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Capturo el limite de registros indicados por el usuario
    this.limitLengthBillingpay = data.limit;
  }

  /**
   * @memberof DownloadBillingpayModalComponent
   */
  ngOnInit() {
    this.createForm();
    this.getDataUser();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.myform.controls['email'].setValue(this.user.sellerEmail);
  }

  /**
   * @method onNoClick
   * @description Funcionalidad para cerrar el modal
   * @memberof DownloadBillingpayModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * @method createForm
   * @description Funcionalidad para crear el formulario
   * @memberof DownloadBillingpayModalComponent
   */
  createForm() {
    this.myform = new FormGroup({
      email: new FormControl({ disabled: false }, [
        Validators.required,
        Validators.email
      ])
    });
  }

   /**
   * @method downloadHistorical
   * @description Método para realizar la descarga de los pagos
   * @param {any} form
   * @memberof DownloadBillingPayModalComponent
   */
  downloadPay(form: any) {
    const email = form.get('email').value;
    this.loadingService.viewSpinner();
    this.billService.downloadBillingPay(email)
    .subscribe(
      res => {
        this.loadingService.closeSpinner();
          if (res != null) {
            this.componentsService.openSnackBar('Se ha realizado la descarga de los pagos correctamente, revisa tu correo electrónico',
              'Cerrar', 10000);
          } else {
            this.componentsService.openSnackBar('Se ha presentado un error al realizar la descarga de los pagos', 'Cerrar', 5000);
          }
          this.onNoClick();
        },
        err => {
          this.componentsService.openSnackBar('Se ha presentado un error al realizar la descarga de los pagos', 'Cerrar', 5000);
          this.onNoClick();
        }
      );
  }
}
