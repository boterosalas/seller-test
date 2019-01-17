import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { UserParametersService } from '@app/core/aws-cognito';
import { Logger } from '@app/core/util/logger.service';
import { ComponentsService } from '@shared/services/components.service';

import { SupportService } from './support.service';
import { UserInformation } from '@app/shared';

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
  public user: UserInformation;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SupportModalComponent>,
    public COMPONENT: ComponentsService,
    public SUPPORT: SupportService,
    public userParams: UserParametersService
  ) { }

  /**
   * @memberof SupportModalComponent
   */
  ngOnInit() {
    this.userParams.getUserData().then(data => {
      this.user = data;
      this.createForm(data);
    });
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
  createForm(user: any) {
    this.myform = this.fb.group({
      nit: new FormControl(user.sellerNit, Validators.compose([Validators.required])),
      caseMarketplaceName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(120), Validators.minLength(1)])),
      account: new FormControl(user.sellerName, Validators.compose([Validators.required])),
      emailContact: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      typeOfRequirement: new FormControl('', Validators.compose([Validators.required])),
      reason: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(2000), Validators.minLength(1)])),
      contact: new FormControl('', Validators.compose([Validators.required])),
    });
  }


  /**
   * Método para realizar el envío de los datos capturados
   * @param {any} form
   * @memberof SupportModalComponent
   */
  sendSupportMessage(form: any) {
    // Envió el mensaje de soporte. luego de retornar el servicio correctamente,
    // me pasan el id del soporte para asociar el archivo adjunto a la orden y poder realizar el envió
    const messageSupport = {
      contact: form.value.contact,
      description: form.value.description,
      emailContact: form.value.emailContact,
      caseMarketplaceName: form.value.caseMarketplaceName,
      account: this.user.sellerName,
      nit: this.user.sellerNit,
      reason: form.value.reason,
      typeOfRequirement: form.value.typeOfRequirement,
      caseOrigin: 'Sitio web marketplace',
      caseMarketplaceOwner: 'Soporte MarketPlace'
    };
    this.SUPPORT.sendSupportMessage(this.user['access_token'], messageSupport).subscribe((res: any) => {
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
    this.createForm(this.user);
  }
}
