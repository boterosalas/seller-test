// 3rd party components
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

// our own custom components
import { UserInformation, ComponentsService } from '@app/shared';
import {Logger, UserParametersService } from '@app/core';


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
  public limitLengthHistorical: any = 0;

  /**
   * Creates an instance of DownloadBillingpayModalComponent.
   * @param {MatDialogRef<DownloadBillingpayModalComponent>} dialogRef
   * @param {DownloadHistoricalService} DownloadHistoricalService
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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Capturo el limite de registros indicados por el usuario
    this.limitLengthHistorical = data.limit;
  }

  /**
   * @memberof DownloadHistoricalModalComponent
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
   * @memberof DownloadHistoricalModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * @method createForm
   * @description Funcionalidad para crear el formulario
   * @memberof DownloadHistoricalModalComponent
   */
  createForm() {
    this.myform = new FormGroup({
      email: new FormControl({ disabled: false }, [
        Validators.required,
        Validators.email
      ])
    });
  }


}
