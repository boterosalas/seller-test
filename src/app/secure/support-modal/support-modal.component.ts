import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
import { CaseCategory, FieldsRequired } from '@app/shared/models/case-category';

// log component
const log = new Logger('SupportModalComponent');

export interface DialogData {
  data: boolean;
}

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

  omsCategories: Array<any> = [];
  scCategories = [];
  scSubcategories = [];
  scReasonTypes = [];
  scRequiered: Array<FieldsRequired> = [];
  classificationSelected = null;

  appealRating_clasification: any;
  appealRating_sub_clasification: any;
  appealRating: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SupportModalComponent>,
    public COMPONENT: ComponentsService,
    public SUPPORT: SupportService,
    public userParams: UserParametersService,
    public loadingService: LoadingService,
    public languageService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  /**
   * @memberof SupportModalComponent
   */
  ngOnInit() {
    console.log('data: ', this.data);
    this.getCaseEvaluation();
    this.getInfoSeller();
    this.SUPPORT.getClassification()
      .pipe(filter(response => response && response.data))
      .subscribe(categories => this.omsCategories = categories.data);
  }

  /**
   * Caso de evaluacion mensual por defecto
   * @memberof SupportModalComponent
   */
  getCaseEvaluation() {
    this.SUPPORT.getClassification().subscribe(categories => {
      console.log(categories);
      let ratingCategorie = categories.data;
      ratingCategorie = ratingCategorie.filter(el => el.idMatrix === 'MT498');
      console.log(ratingCategorie);
      ratingCategorie.forEach(element => {
        this.appealRating_clasification = element.classification;
        this.appealRating_sub_clasification = element.category;

      });
      this.appealRating = [this.appealRating_clasification, this.appealRating_sub_clasification];
      console.log('this.appealRating: ', this.appealRating);
    });
  }

  getClassification(omsCategories: Array<CaseCategory>) {
    return this.groupByKey(omsCategories, 'classification').pipe(
      map(options => options[0]),
      toArray());
  }

  groupByKey(datas: Array<CaseCategory>, query: string, include?: Object) {
    return from(datas).pipe(
      filter(data => (include ? this.matchQuery(data, include) : true)),
      groupBy(item => item[query]),
      mergeMap((group) => group.pipe(toArray()))
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

  getFieldsRequired(arrayFields: Array<FieldsRequired>): Array<FieldsRequired> {
    if (arrayFields != null && arrayFields.length > 0) {
      const arrayReturn: Array<FieldsRequired> = [];
      arrayFields.forEach(element => {
        if (element.requiered) {
          switch (element.name) {
            case 'paymentDate':
              element.placeHolder = this.languageService.instant('secure.parametize.support_modal.field.paymentDate');
              break;

            case 'orderStripNumber':
              element.placeHolder = this.languageService.instant('secure.parametize.support_modal.field.orderStripNumber');
              break;

            case 'billNumber':
              element.placeHolder = this.languageService.instant('secure.parametize.support_modal.field.billNumber');
              break;

            default:
              break;
          }
          arrayReturn.push(element);
        }
      });
      return arrayReturn;
    }
    return null;
  }

  onClickClassificationOption(item: CaseCategory) {
    this.myform.clearValidators();
    this.scCategories = [];
    this.scSubcategories = [];
    this.scReasonTypes = [];
    this.classificationSelected = item;
    this.scRequiered = [];
    this.groupByKey(this.omsCategories, 'classification',
      {
        classification: item.classification
      })
      .pipe(
        switchMap(options => from(options)),
        // tslint:disable-next-line:no-shadowed-variable
        groupBy(item => item['category']),
        mergeMap((group) => group.pipe(toArray(), map(data => data[0]))),
        toArray()
      )
      .subscribe((categories: any) => {
        this.scCategories = categories;
      });
    if (!item.category) {
      this.scReasonTypes = item.type;
      this.scRequiered = this.getFieldsRequired(item.fields);
    }
  }

  onClickCategoryOption(item: CaseCategory) {
    this.scSubcategories = [];
    this.scReasonTypes = [];
    this.classificationSelected = item;
    this.scRequiered = [];
    this.groupByKey(this.omsCategories, 'category', {
      category: item.category
    })
      .pipe(
        switchMap(options =>
          from(options).pipe(
            filter(option => option.subcategory != null || option.category != null)
          )
        ),
        toArray()
      )
      .subscribe((subcategories: Array<CaseCategory>) => {
        subcategories.forEach(e => {
          if (this.classificationSelected.classification === e.classification) {
            this.scSubcategories.push(e);
          }
        });
      });
    if (!item.subcategory) {
      this.scReasonTypes = item.type;
      this.scSubcategories = [];
      this.scRequiered = this.getFieldsRequired(item.fields);
    }
  }

  onClickSubcategoryOption(item: CaseCategory) {
    this.myform.clearValidators();
    this.scReasonTypes = [];
    this.scRequiered = [];
    this.classificationSelected = item;
    this.scReasonTypes = item.type;
    this.scRequiered = this.getFieldsRequired(item.fields);
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
          /* Validators.required, */
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
      classification: new FormControl(this.appealRating_clasification,
        Validators.compose([Validators.required])
      ),
      subCategory: new FormControl(''),
      category: new FormControl(''),
      paymentDate: new FormControl(null, [
        /* this.validatorFunction('paymentDate').bind(this)] */
      ]),
      orderStripNumber: new FormControl(null, [
        /* this.validatorFunction('orderStripNumber').bind(this) */
      ]),
      billNumber: new FormControl(null, [
        /* this.validatorFunction('billNumber').bind(this) */
      ])
    });
  }

  /* public validatorFunction(fieldName: string): ValidatorFn {
    return (field: FormControl): { [key: string]: boolean } | null => {

      this.scRequiered.forEach(element => {
        if (element.requiered && element.name === fieldName &&
          field.value !== undefined && field.value !== null && field.value !== '') {
          return null;
        }
      });
      return { 'fields': false };
    }
  } */

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
      account: this.user.sellerName,
      nit: this.user.sellerNit,
      idCategory: this.classificationSelected.idMatrix,
      typeOfRequirement: form.value.typeOfRequirement.trim(),
      // caseOrigin: "Sitio web marketplace",
      // caseMarketplaceOwner: "Soporte MarketPlace",
      attachments: this.response.attachments,
      paymentDate: form.value.paymentDate,
      orderStripNumber: form.value.orderStripNumber,
      billNumber: form.value.billNumber
    };
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
