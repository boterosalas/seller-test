import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { UserParametersService } from '@app/core/aws-cognito';
import { Logger } from '@app/core/util/logger.service';
import { ComponentsService } from '@shared/services/components.service';

import { SupportService } from './support.service';
import { UserInformation } from '@app/shared';
import { LoadingService } from '@app/core/global/loading/loading.service';
import { BasicInformationService } from '../products/create-product-unit/basic-information/basic-information.component.service';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { File } from '@app/shared/components/upload-button/configuration.model';
import { ACCEPT_TYPE } from '@app/shared/models';

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
  public regexNoSpaces = /((?!\s+)^[\s\S]*)$/;
  validateRegex: any;

  response = {
    id: null,
    description: null,
    attachments: new Array<Attachment>()
  };
  accepts = [
    ACCEPT_TYPE.APPLICATION_XML,
    ACCEPT_TYPE.IMAGE_PNG,
    ACCEPT_TYPE.IMAGE_JPEG,
    ACCEPT_TYPE.PDF,
    ACCEPT_TYPE.VIDEO_AVI,
    ACCEPT_TYPE.VIDEO_3GP,
    ACCEPT_TYPE.VIDEO_MOV,
    ACCEPT_TYPE.VIDEO_WMV,
    ACCEPT_TYPE.VIDEO_MPG,
    ACCEPT_TYPE.VIDEO_MPEG,
    ACCEPT_TYPE.VIDEO_MP4
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SupportModalComponent>,
    public COMPONENT: ComponentsService,
    public SUPPORT: SupportService,
    public userParams: UserParametersService,
    public loadingService: LoadingService,
    private languageService: TranslateService,
  ) { }

  /**
   * @memberof SupportModalComponent
   */
  ngOnInit() {
    this.getInfoSeller();
  }

  public getInfoSeller(): void {
    this.userParams.getUserData().then(data => {
      this.user = data;
      this.valdiateFormSupport();
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
    this.myform = new FormGroup({
      nit: new FormControl(user.sellerNit, Validators.compose([Validators.required])),
      caseMarketplaceName: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.instant('nameCaseOrders'))])),
      account: new FormControl(user.sellerName, Validators.compose([Validators.required])),
      emailContact: new FormControl(user.sellerEmail, Validators.compose([Validators.required, Validators.email])),
      typeOfRequirement: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.instant('descriptionOrders'))])),
      contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.instant('contactOrders'))])),
      reason: new FormControl('', Validators.compose([Validators.required])),
      subCategory: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  /**
   * Obtiene la regex de Dynamo
   *
   * @memberof SupportModalComponent
   */
  public valdiateFormSupport(): void {
    const param = ['orders', null];
    this.SUPPORT.getRegexFormSupport(param).subscribe(res => {
      this.validateRegex = JSON.parse(res.body.body);
      this.createForm(this.user);
    });

  }

  public instant(name: string): string {
    if (this.validateRegex && this.validateRegex.Data.length) {
      for (let i = 0; i < this.validateRegex.Data.length; i++) {
        if (this.validateRegex.Data[i].Identifier === name) {
          return this.validateRegex.Data[i].Value;
        }
      }
      return null;
    }
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
      contact: form.value.contact.trim(),
      description: form.value.description.trim(),
      emailContact: form.value.emailContact,
      caseMarketplaceName: form.value.caseMarketplaceName,
      account: this.user.sellerName,
      nit: this.user.sellerNit,
      reason: form.value.reason,
      typeOfRequirement: form.value.typeOfRequirement.trim(),
      caseOrigin: 'Sitio web marketplace',
      caseMarketplaceOwner: 'Soporte MarketPlace',
      attachedFile: this.response.attachments,
    };
    this.loadingService.viewSpinner();
    this.SUPPORT.sendSupportMessage(this.user['access_token'], messageSupport).subscribe((res: any) => {
      this.loadingService.closeSpinner();
      this.COMPONENT.openSnackBar(this.languageService.instant('secure.support_modal.ts_send_msj'), this.languageService.instant('actions.accpet_min'), 10000);
      debugger
      this.onNoClick();
    }, err => {
      this.loadingService.closeSpinner();
      this.COMPONENT.openSnackBar(this.languageService.instant('secure.support_modal.ts_error_msj_support'), this.languageService.instant('actions.accpet_min'), 10000);
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

  onFileChange(files: Array<File>) {
    from(files)
      .pipe(
        map(
          (file: File): Attachment => ({
            name: file.name,
            type: file.type,
            base64: file.base64
          })
        ),
        toArray()
      )
      .subscribe(
        (attachments: Array<Attachment>) =>
          (this.response.attachments = attachments)
      );
  }
}

interface Attachment {
  name: String;
  type: String;
  base64: String;
}
