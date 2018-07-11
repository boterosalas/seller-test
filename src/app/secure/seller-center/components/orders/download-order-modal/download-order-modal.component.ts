/* 3rd party components */
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Component, OnInit, Inject} from '@angular/core';

/* our own custom components */
import {environment} from '../../../../../environments/environment';
import {DownloadOrderService} from './download-order.service';
import { Logger } from '../../../utils/logger.service';
import { User } from '../../../../../shared/models/login.model';
import { UserService } from '../../../utils/services/common/user/user.service';
import { ComponentsService } from '../../../utils/services/common/components/components.service';

// log component
const log = new Logger('DownloadOrderComponent');

/**
 * Componente para realizar la descarga de las ordenes actuales del usuario, este componente permite capturar
 * el correo electronico del usuario, por defecto se emplea el correo de la cuenta del usuario. luego
 * de capturar el correo se consume un servicio web que permite enviar los filtros aplicados por
 * el usuario al momento de listar las ordenes, posteriormente se realiza el envió de un
 * correo con las ordenes aplicando los filtros obtenidos
 */
@Component({
  selector: 'app-download-order-modal',
  templateUrl: './download-order-modal.component.html',
  styleUrls: ['./download-order-modal.component.scss']
})

/**
 * DownloadOrderModalComponent
 */
export class DownloadOrderModalComponent implements OnInit {

  // Formulario para realizar la busqueda
  myform: FormGroup;
  // user info
  public user: User;
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
  constructor(public dialogRef: MatDialogRef<DownloadOrderModalComponent>,
              public downloadOrderService: DownloadOrderService,
              public userService: UserService,
              public componentsService: ComponentsService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    // capturo el limite de registros indicados por el usuario
    this.limitLengthOrder = data.limit;
  }

  /**
   * @memberof DownloadOrderModalComponent
   */
  ngOnInit() {
   // this.getDataUser();
  }

  /**
   * Funcionalidad encargada de traer la información del usuario que se encuentra almacenada en localstorage
   * @memberof DownloadOrderModalComponent
   */
  getDataUser() {
    this.user = this.userService.getUser();
    this.createForm();
    if (this.user.login === undefined) {
      this.userService.setUser([]);
    }
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
    this.myform = this.fb.group({
      'email': [{value: this.user.email, disabled: false}, Validators.compose([Validators.required, Validators.email])],
    });
  }

  /**
   * Método para realizar la descarga de las ordenes
   * @param {any} form
   * @memberof DownloadOrderModalComponent
   */
  downloadOrders(form) {
    log.info(form.value);
    log.info(this.downloadOrderService.getCurrentFilterOrders());
    const currentFiltersOrders = this.downloadOrderService.getCurrentFilterOrders();
    currentFiltersOrders.idSeller = this.user[environment.webUrl].sellerId;
    currentFiltersOrders.sellerName = this.user[environment.webUrl].name;
    currentFiltersOrders.email = form.get('email').value;

    this.downloadOrderService.downloadOrders(this.user, currentFiltersOrders).subscribe(res => {
      log.info(res);
      this.componentsService.openSnackBar('Se ha realizado la descarga de las ordenes correctamente, revisa tu correo electrónico',
        'Cerrar', 10000);
      this.onNoClick();
    }, err => {
      this.componentsService.openSnackBar('Se han presentado un error al realizar la descarga de las ordenes', 'Cerrar', 5000);
      this.onNoClick();
    });
  }
}
