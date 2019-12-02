import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { UserParametersService } from '@app/core/aws-cognito';
import { Logger } from '@app/core/util/logger.service';
import { ComponentsService } from '@shared/services/components.service';

import { SupportService } from './support.service';
import { UserInformation } from '@app/shared';
import { LoadingService } from '@app/core/global/loading/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';
import {
  map,
  toArray,
  groupBy,
  mergeMap,
  switchMap,
  filter
} from 'rxjs/operators';
import {
  File,
  TYPE_VALIDATION
} from '@app/shared/components/upload-button/configuration.model';
import { ACCEPT_TYPE } from '@app/shared/models';
import { CaseCategory } from '@app/shared/models/case-category';

// log component
const log = new Logger('SupportModalComponent');

/**
 * Component que permite desplegar un modal donde se solicitaran unos datos para realizar el envió del mensaje de soporte
 */
@Component({
  selector: 'app-support-modal',
  templateUrl: './support-modal.component.html',
  styleUrls: ['./support-modal.component.scss'],
  providers: [SupportService, ComponentsService]
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

  validations = [
    {
      type: TYPE_VALIDATION.MAX_SIZE,
      value: 4194304,
      message:
        'El documento adjunto que estas tratando de cargar no es compatible con nuestra plataforma, te pedimos tener en cuenta las siguientes recomendaciones: Tu vídeo no puede durar más de 90 segundos y los formatos permitidos son : AVI, 3GP (móviles), MOV (Mac), WMV (Windows), MPG, MPEG y MP4 con un peso máximo de 4 MB. Las imágenes que puedes cargar deben estar en JPG, PNG o documentos en PDF, Excel o Word'
    },
    {
      type: TYPE_VALIDATION.ACCEPT_TYPES,
      value: [
        ACCEPT_TYPE.IMAGE_PNG,
        ACCEPT_TYPE.IMAGE_JPEG,
        ACCEPT_TYPE.APPLICATION_PDF,
        ACCEPT_TYPE.VIDEO_AVI,
        ACCEPT_TYPE.VIDEO_3GP,
        ACCEPT_TYPE.VIDEO_MOV,
        ACCEPT_TYPE.VIDEO_WMV,
        ACCEPT_TYPE.VIDEO_MPG,
        ACCEPT_TYPE.VIDEO_MPEG,
        ACCEPT_TYPE.VIDEO_MP4,
        ACCEPT_TYPE.APPLICATION_DOC,
        ACCEPT_TYPE.APPLICATION_DOCX,
        ACCEPT_TYPE.APPLICATION_DOTX,
        ACCEPT_TYPE.APPLICATION_DOCM,
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_XLTX,
        ACCEPT_TYPE.APPLICATION_XLSM,
        ACCEPT_TYPE.APPLICATION_XLTM,
        ACCEPT_TYPE.APPLICATION_XLAM,
        ACCEPT_TYPE.APPLICATION_XLSB,
        ACCEPT_TYPE.APPLICATION_PPT,
        ACCEPT_TYPE.APPLICATION_POTX,
        ACCEPT_TYPE.APPLICATION_PPTX,
        ACCEPT_TYPE.APPLICATION_PPSX,
        ACCEPT_TYPE.APPLICATION_PPAM,
        ACCEPT_TYPE.APPLICATION_PPTM,
        ACCEPT_TYPE.APPLICATION_POTM,
        ACCEPT_TYPE.APPLICATION_PPSM,
        ACCEPT_TYPE.APPLICATION_MDB,
        ACCEPT_TYPE.APPLICATION_PDF
      ],
      message:
        'El documento adjunto que estas tratando de cargar no es compatible con nuestra plataforma, te pedimos tener en cuenta las siguientes recomendaciones: Tu vídeo no puede durar más de 90 segundos y los formatos permitidos son : AVI, 3GP (móviles), MOV (Mac), WMV (Windows), MPG, MPEG y MP4 con un peso máximo de 4 MB. Las imágenes que puedes cargar deben estar en JPG, PNG o documentos en PDF, Excel o Word'
    }
  ];
  omsCategories = [];
  scCategories = [];
  scSubcategories = [];
  scReasonTypes = [];
  classificationSelected = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SupportModalComponent>,
    public COMPONENT: ComponentsService,
    public SUPPORT: SupportService,
    public userParams: UserParametersService,
    public loadingService: LoadingService,
    private languageService: TranslateService
  ) {}

  /**
   * @memberof SupportModalComponent
   */
  ngOnInit() {
    this.getInfoSeller();
    this.SUPPORT.getClassification()
      .pipe(filter(response => response && response.data))
      .subscribe(categories => (this.omsCategories = categories.data));
  }

  getClassification(omsCategories: Array<CaseCategory>) {
    return this.groupByKey(omsCategories, 'classification').pipe(
      map(options => options[0]),
      toArray()
    );
  }

  groupByKey(datas: Array<CaseCategory>, query: string, include?: Object) {
    return from(datas).pipe(
      filter(data => (include ? this.matchQuery(data, include) : true)),
      groupBy(item => item[query]),
      mergeMap(group => group.pipe(toArray()))
    );
  }

  matchQuery(data: Object, where: Object) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const dataElement = data[key];
        for (const whereKey in where) {
          if (where.hasOwnProperty(whereKey)) {
            const whereElement = where[whereKey];
            if (dataElement === whereElement && key === whereKey) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  onClickClassificationOption(item: CaseCategory) {
    this.scCategories = [];
    this.scSubcategories = [];
    this.scReasonTypes = [];
    this.classificationSelected = item;
    this.groupByKey(this.omsCategories, 'classification', {
      classification: item.classification
    })
      .pipe(
        switchMap(options => from(options)),
        toArray()
      )
      .subscribe((categories: Array<CaseCategory>) => {
        this.scCategories = categories;
      });
  }

  onClickCategoryOption(item: CaseCategory) {
    this.scSubcategories = [];
    this.scReasonTypes = [];
    this.classificationSelected = item;
    this.groupByKey(this.omsCategories, 'category', {
      category: item.category
    })
      .pipe(
        switchMap(options =>
          from(options).pipe(
            filter(
              option => option.subcategory != null || option.category != null
            )
          )
        ),
        toArray()
      )
      .subscribe((subcategories: Array<CaseCategory>) => {
        this.scSubcategories = subcategories;
      });
  }

  onClickSubcategoryOption(item: CaseCategory) {
    this.scReasonTypes = [];
    this.classificationSelected = item;
    this.scReasonTypes = item.type;
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
      nit: new FormControl(
        user.sellerNit,
        Validators.compose([Validators.required])
      ),
      account: new FormControl(
        user.sellerName,
        Validators.compose([Validators.required])
      ),
      emailContact: new FormControl(
        user.sellerEmail,
        Validators.compose([Validators.required, Validators.email])
      ),
      typeOfRequirement: new FormControl(
        'null',
        Validators.compose([Validators.required])
      ),
      description: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.instant('descriptionOrders'))
        ])
      ),
      contact: new FormControl(
        user.sellerName,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.instant('contactOrders'))
        ])
      ),
      classification: new FormControl('null'),
      subCategory: new FormControl('null'),
      category: new FormControl('null')
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
    console.log(this.classificationSelected)
    const messageSupport = {
      contact: form.value.contact.trim(),
      description: form.value.description.trim(),
      emailContact: form.value.emailContact,
      account: this.user.sellerName,
      nit: this.user.sellerNit,
      idCategory: this.classificationSelected.idMatrix,
      typeOfRequirement: form.value.typeOfRequirement.trim(),
      //caseOrigin: "Sitio web marketplace",
      //caseMarketplaceOwner: "Soporte MarketPlace",
      attachments: this.response.attachments
    };
    console.log(messageSupport)
    this.loadingService.viewSpinner();
    this.SUPPORT.sendSupportMessage(
      this.user['access_token'],
      messageSupport
    ).subscribe(
      (res: any) => {
        this.loadingService.closeSpinner();
        this.COMPONENT.openSnackBar(
          this.languageService.instant(
            'secure.parametize.support_modal.ts_send_msj'
          ),
          this.languageService.instant('actions.accpet_min'),
          10000
        );
        this.onNoClick();
      },
      err => {
        this.loadingService.closeSpinner();
        this.COMPONENT.openSnackBar(
          this.languageService.instant(
            'secure.support_modal.ts_error_msj_support'
          ),
          this.languageService.instant('actions.accpet_min'),
          10000
        );
      }
    );
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
            type: this.getExtensionName(file),
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

  getExtensionName(file: File): string {
    const extensionName = file.name.split(/(\.\w+$)/)[1];
    return extensionName.length > 2
      ? extensionName.slice(1, extensionName.length)
      : '';
  }
}

interface Attachment {
  name: String;
  type: String;
  base64: String;
}
