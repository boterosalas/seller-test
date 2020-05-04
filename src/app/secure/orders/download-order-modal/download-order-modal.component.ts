import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Logger, UserParametersService, LoadingService } from '@app/core';
import { ComponentsService } from '@app/shared/services/components.service';

import { DownloadOrderService } from './download-order.service';
import { UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';

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
  // Inicializa el modal de tipo de financial
  public billingType = false;
  // loadingService: any;
  // filtros aplicados a la consulta
  public filter: any;

  public type: any;

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
    private languageService: TranslateService,
    private loadingService: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // capturo el limite de registros indicados por el usuario
    this.limitLengthOrder = data.limit;
    this.billingType = true ? data.billingType : false;
    this.filter = data.filter;
    this.type = data.type;
  }

  ngOnInit() {
    this.getDataUser().then(data => {
      this.createForm();
    });
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Funcionalidad para cerrar el modal.
   *
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
   * Método para realizar la descarga de las órdenes.
   *
   * @param {any} form
   * @memberof DownloadOrderModalComponent
   */
  downloadOrders(form: any) {
    log.info(this.downloadOrderService.getCurrentFilterOrders());
    const currentFiltersOrders = this.downloadOrderService.getCurrentFilterOrders();
    currentFiltersOrders.idSeller = this.user.sellerId;
    currentFiltersOrders.sellerName = this.user.sellerName;
    currentFiltersOrders.email = form.get('email').value;
    if (this.filter) {
      if (this.filter.dateOrderInitial) {
        currentFiltersOrders.dateOrderInitial = this.filter.dateOrderInitial;
      }
      if (this.filter.dateOrderFinal) {
        currentFiltersOrders.dateOrderFinal = this.filter.dateOrderFinal;
      }
      if (this.filter.idStatus) {
        currentFiltersOrders.idStatus = this.filter.idStatus;
      }
    }

    log.debug('parametros', currentFiltersOrders);
    if (!this.billingType) {
      this.downloadOrdersByService(currentFiltersOrders);
    } else {
      this.downBillingByService(currentFiltersOrders);
    }
  }

  /**
   * Metodo para enviar al back el correo por el cual desea obtener las facturas
   * @param currentFiltersOrders
   */
  downloadOrdersByService(currentFiltersOrders: any): void {
    this.loadingService.viewSpinner();
    this.downloadOrderService.downloadOrders(currentFiltersOrders).subscribe(res => {
      if (res != null) {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_download_order'), this.languageService.instant('actions.close'), 10000);
        this.loadingService.closeSpinner();
      } else {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_error_download'), this.languageService.instant('actions.close'), 5000);
        this.loadingService.closeSpinner();
      }
      this.onNoClick();
    }, err => {
      this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_error_download'), this.languageService.instant('actions.close'), 5000);
      this.loadingService.closeSpinner();
      this.onNoClick();
    });
  }


  downloadGuide(form: any) {
    const currentFiltersOrders = this.downloadOrderService.getCurrentFilterOrders();
    currentFiltersOrders.idSeller = this.user.sellerId;
    currentFiltersOrders.sellerName = this.user.sellerName;
    currentFiltersOrders.email = form.get('email').value;
    this.loadingService.viewSpinner();
    this.downloadOrderService.downloadGuides(currentFiltersOrders).subscribe(res => {
      if (res != null && res.data !== false) {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_download_guide'), this.languageService.instant('actions.close'), 10000);
        this.loadingService.closeSpinner();
      } else {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_error_download_guide'), this.languageService.instant('actions.close'), 5000);
        this.loadingService.closeSpinner();
      }
      this.onNoClick();
    }, err => {
      this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_error_download_guide'), this.languageService.instant('actions.close'), 5000);
      this.loadingService.closeSpinner();
      this.onNoClick();
    });
  }

  /**
   * Metodo para enviar al back el correo por el cual desea obtener las facturas
   * @param currentFiltersOrders
   */
  downBillingByService(currentFiltersOrders: any): void {
    this.loadingService.viewSpinner();
    this.downloadOrderService.downloadBilling(currentFiltersOrders).subscribe(res => {
      if (res != null) {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_download_order'), this.languageService.instant('actions.close'), 10000);
        this.loadingService.closeSpinner();
      } else {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_error_download'), this.languageService.instant('actions.close'), 5000);
        this.loadingService.closeSpinner();
      }
      this.onNoClick();
    }, err => {
      this.componentsService.openSnackBar(this.languageService.instant('secure.orders.download_order_modal.sn_error_download'), this.languageService.instant('actions.close'), 5000);
      this.loadingService.closeSpinner();
      this.onNoClick();
    });

  }
}
