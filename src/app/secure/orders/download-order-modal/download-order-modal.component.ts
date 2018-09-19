import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Logger, UserParametersService } from '@app/core';
import { ComponentsService } from '@app/shared/services/components.service';

import { DownloadOrderService } from './download-order.service';
import { UserInformation } from '@app/shared';

// log component
const log = new Logger('DownloadOrderComponent');

/**
 * Componente para realizar la descarga de las órdenes actuales del usuario, este componente permite capturar
 * el correo electronico del usuario, por defecto se emplea el correo de la cuenta del usuario. luego
 * de capturar el correo se consume un servicio web que permite enviar los filtros aplicados por
 * el usuario al momento de listar las órdenes, posteriormente se realiza el envió de un
 * correo con las órdenes aplicando los filtros obtenidos
 */
@Component({
  selector: 'app-download-order-modal',
  templateUrl: './download-order-modal.component.html',
  styleUrls: ['./download-order-modal.component.scss']
})
export class DownloadOrderModalComponent implements OnInit {

  // Formulario para realizar la busqueda
  myform: FormGroup;
  // user info
  public user: UserInformation;
  // Limite de registros para descargar
  public limitLengthOrder: any = 0;

  /**
   * Creates an instance of DownloadOrderModalComponent.
   * @param {MatDialogRef<DownloadOrderModalComponent>} dialogRef
   * @param {DownloadOrderService} DownloadOrderService
   * @param {UserService} userService
   * @param {ComponentsService} componentsService
   * @param {FormBuilder} fb
   * @param {*} data
   * @memberof DownloadOrderModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<DownloadOrderModalComponent>,
    public downloadOrderService: DownloadOrderService,
    public componentsService: ComponentsService,
    private fb: FormBuilder,
    public userParams: UserParametersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // capturo el limite de registros indicados por el usuario
    this.limitLengthOrder = data.limit;
  }

  /**
   * @memberof DownloadOrderModalComponent
   */
  ngOnInit() {
    this.getDataUser();
    this.createForm();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Funcionalidad para cerrar el modal
   * @memberof DownloadOrderModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Funcionalidad para crear el formulario
   * @memberof DownloadOrderModalComponent
   */
  createForm() {
    const email = this.user.sellerEmail;
    this.myform = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }

  /**
   * Método para realizar la descarga de las órdenes
   * @param {any} form
   * @memberof DownloadOrderModalComponent
   */
  downloadOrders(form) {
    log.info(this.downloadOrderService.getCurrentFilterOrders());
    const currentFiltersOrders = this.downloadOrderService.getCurrentFilterOrders();
    currentFiltersOrders.idSeller = this.user.sellerId;
    currentFiltersOrders.sellerName = this.user.sellerName;
    currentFiltersOrders.email = form.get('email').value;
    log.debug('parametros', currentFiltersOrders);
    this.downloadOrderService.downloadOrders(this.user, currentFiltersOrders).subscribe(res => {
      if (res != null) {
        this.componentsService.openSnackBar('Se ha realizado la descarga de las órdenes correctamente, revisa tu correo electrónico',
          'Cerrar', 10000);
      } else {
        this.componentsService.openSnackBar('Se han presentado un error al realizar la descarga de las órdenes', 'Cerrar', 5000);
      }
      this.onNoClick();
    }, err => {
      this.componentsService.openSnackBar('Se han presentado un error al realizar la descarga de las órdenes', 'Cerrar', 5000);
      this.onNoClick();
    });
  }
}
