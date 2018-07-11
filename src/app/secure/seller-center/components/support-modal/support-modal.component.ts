/* 3rd party components */
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

/* our own custom components */
import { SupportService } from './support.service';
import { environment } from '../../../../environments/environment';
import { Logger } from '../../utils/logger.service';
import { ComponentsService } from '../../utils/services/common/components/components.service';
import { UserService } from '../../utils/services/common/user/user.service';
import { User } from '../../../../shared/models/login.model';

// log component
const log = new Logger('SupportModalComponent');

/**
 * Component que permite desplegar un modal donde se solicitaran unos datos para realizar el envió del mensaje de soporte
 */
@Component({
  selector: 'app-support-modal',
  templateUrl: './support-modal.component.html',
  styleUrls: ['./support-modal.component.scss'],
  providers: [
    SupportService,
    ComponentsService
  ]
})

/**
 * SupportModalComponent
 */
export class SupportModalComponent implements OnInit {

  // Input file de la vista
  @ViewChild('fileInput') fileInput: ElementRef;
  //  Formulario para realizar la busqueda
  myform: FormGroup;
  // user info
  public user: User;
  // Url que se emplea para acceder a el atributo del usuario que se arma con un nombre de url
  public webUrl = environment.webUrl;

  /**
   * Creates an instance of SupportModalComponent.
   * @param {FormBuilder} fb
   * @param {MatDialogRef<SupportModalComponent>} dialogRef
   * @param {ComponentsService} COMPONENT
   * @param {SupportService} SUPPORT
   * @param {UserService} USER
   * @memberof SupportModalComponent
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SupportModalComponent>,
    public COMPONENT: ComponentsService,
    public SUPPORT: SupportService,
    public USER: UserService
  ) { }

  /**
   * @memberof SupportModalComponent
   */
  ngOnInit() {
    this.getDataUser();
  }

  /**
   * Funcionalidad encargada de traer la información del usuario que se encuentra almacenada en localstorage.
   * @memberof SupportModalComponent
   */
  getDataUser() {
    this.user = this.USER.getUser();
    this.createForm();
    if (this.user.login === undefined) {
      this.USER.setUser([]);
    }
  }

  /**
   * Funcionalidad para cerrar el modal actual de envio
   * @memberof SupportModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Método para crear el formulario
   * @memberof SupportModalComponent
   */
  createForm() {
    this.myform = this.fb.group({
      'nit': [this.user[this.webUrl].nit, Validators.compose([Validators.required])],
      'caseMarketplaceName': [null, Validators.compose([Validators.required, Validators.maxLength(120), Validators.minLength(1)])],
      'account': [this.user.name, Validators.compose([Validators.required])],
      'emailContact': [this.user.email, Validators.compose([Validators.required, Validators.email])],
      'typeOfRequirement': [null, Validators.compose([Validators.required])],
      'reason': [null, Validators.compose([Validators.required])],
      'description': [null, Validators.compose([Validators.required, Validators.maxLength(2000), Validators.minLength(1)])],
      'contact': [null, Validators.compose([Validators.required])],
    });
  }


  /**
   * Método para realizar el envío de los datos capturados
   * @param {any} form
   * @memberof SupportModalComponent
   */
  sendSupportMessage(form) {
    log.info(form);
    // Envió el mensaje de soporte. luego de retornar el servicio correctamente,
    // me pasan el id del soporte para asociar el archivo adjunto a la orden y poder realizar el envió
    const messageSupport = {
      contact: form.value.contact,
      description: form.value.description,
      emailContact: form.value.emailContact,
      caseMarketplaceName: form.value.caseMarketplaceName,
      account: form.value.account,
      nit: form.value.nit,
      reason: form.value.reason,
      typeOfRequirement: form.value.typeOfRequirement,
      caseOrigin: 'Sitio web marketplace'
    };
    this.SUPPORT.sendSupportMessage(this.user.access_token, messageSupport).subscribe((res: any) => {
      log.info(res);
      this.COMPONENT.openSnackBar('Se ha enviado tu mensaje de soporte.', 'Aceptar', 10000);
      this.onNoClick();
    }, err => {
      this.COMPONENT.openSnackBar('Se ha presentado un error al enviar el mensaje de soporte', 'Aceptar', 10000);
    });
  }

  /**
   * Método para limpiar el formulario
   * @memberof SupportModalComponent
   */
  clearForm() {
    this.myform.reset();
    this.createForm();
  }
}
