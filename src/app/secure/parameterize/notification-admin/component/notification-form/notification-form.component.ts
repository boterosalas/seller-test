import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatDialog, MatSnackBar } from '@angular/material';
import { ModalLoadFileComponent } from '../modal-load-file/modal-load-file.component';
import { ModalPreviewNotificationComponent } from '../modal-preview-notification/modal-preview-notification.component';
import { ModalGenericComponent } from '../modal-generic/modal-generic.component';
import { NotificationAdminService } from '../../notification-admin.service';
import { LoadingService } from '@app/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit, OnDestroy  {

  @ViewChild('fileUploadOption', { static: false }) inputFileUpload: any;
  @ViewChild('pickerColor', { static: false }) pickerColor: any;
  @ViewChild('radioGroupNotification', { static: false }) radioGroupNotification: any;
  @Output() isBackList = new EventEmitter<object>();
  @Output() refreshData = new EventEmitter<object>();
  @Output() confirDelete = new EventEmitter<object>();

  public isEdit = false;
  @Input() set paramsNotification(value: any) {
    if (value) {
      window.scroll(0, 0);
      this.setValueNotificacion(value.notification);
      this.isEdit = value.isEdit ? value.isEdit : false;
      this.btnTitle = this.isEdit ? 'Editar anuncio' : 'Crear anuncio';
    }
  }

  public form: FormGroup;
  public disableText = false;
  public disableLoadImag = false;
  public disableColor = true;
  public btnTitle = '';
  public showDescriptionColorImg = true;
  public show: boolean;
  public colorBackground = '#ffffff';
  public imagePathDrag = null;
  public nameFile = null;
  public sizeFile = null;
  public params: any;
  public today = Date.now();
  public checkedTypeNotification: any;
  public checkedCulture: any;
  public imagUrl = '';
  public changeFile = false;
  public paramsSaveImg: any;
  public listError = [];
  public withError = false;
  public createOrEdit = true;
  public titleErrorSubtitle = '';
  public idNotification = null;
  public dialogRef: any;
  public matcher: MyErrorStateMatcher;
  public typeBody= '1';


  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: '',
    translate: 'no',
    sanitize: false,
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      [],
      [
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(
    public translateService: TranslateService,
    private notificationAdminService: NotificationAdminService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    public snackBar?: MatSnackBar,
  ) {
    this.createForm();
  }

  ngOnInit() { }
  /**
   * funcion para crear fomulario
   *
   * @memberof NotificationFormComponent
   */
  createForm() {
    this.form = new FormGroup({
      bodyNotification: new FormControl('1', [Validators.required]),
      dateInitial: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      lenguaje: new FormControl('National'),
      dateEnd: new FormControl(''),
      pageDestiny: new FormControl(''),
      bodyDescription: new FormControl(''),
      pickerColor: new FormControl({ value: '', disabled: true }),
    });
  }
  /**
   * funcion para setear el color en el pickercolor
   *
   * @param {string} color
   * @memberof NotificationFormComponent
   */
  setValueColor(color: string) {
    this.form.controls.pickerColor.setValue(color);
    this.colorBackground = color;
    this.imagePathDrag = 'backgroundColor';
  }
  /**
   * funcion para mostrar el modal de carga de archivo
   *
   * @memberof NotificationFormComponent
   */
  modalLoadFiel() {
    const params = {
      show: true,
      typeBody: this.typeBody
    };
     this.dialogRef = this.dialog.open(ModalLoadFileComponent, {
      width: '50%',
      data: params,
      disableClose: true,
    });

    const dialogIntance = this.dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      if (val.imgBase64 !== undefined) {
        this.imagePathDrag = val.imgBase64;
        this.imagUrl = val.imgBase64;
        this.nameFile = val.nameFile;
        this.sizeFile = val.sizeFile;
        this.changeFile = true;
      }
    });
  }
  /**
   * funcion para emitir el evento cuando se cargue la imagen 
   *
   * @param {*} data
   * @memberof NotificationFormComponent
   */
  emitDataImgLoad(data: any) {
    this.imagePathDrag = data;
    this.imagUrl = data;
    this.changeFile = true;
  }
  /**
   * funcion para validar el tipo de
   *
   * @param {number} typeBody
   * @memberof NotificationFormComponent
   */
  validateBody(typeBody: string) {
    this.typeBody = typeBody;
    this.resetOpction(typeBody);
    switch (typeBody) {
      case '1':
        this.form.controls.bodyDescription.enable();
        this.form.controls.pickerColor.disable();
        this.disableText = false;
        this.show = true;
        this.disableLoadImag = false;
        this.disableColor = true;
        this.config.editable = true;
        this.showDescriptionColorImg = true;
        this.imagePathDrag = null;
        this.nameFile = null;
        this.sizeFile = null;
        break;
      case '3':
        this.form.controls.bodyDescription.enable();
        this.form.controls.pickerColor.enable();
        this.disableText = false;
        this.show = true;
        this.disableLoadImag = true;
        this.disableColor = false;
        this.config.editable = true;
        this.showDescriptionColorImg = true;
        this.imagePathDrag = 'backgroundColor';
        this.nameFile = null;
        this.sizeFile = null;
        this.changeFile = false;
        this.imagUrl = null;
        break;
      case '2':
        this.form.controls.bodyDescription.disable();
        this.form.controls.pickerColor.disable();
        this.disableText = true;
        this.show = false;
        this.disableLoadImag = false;
        this.disableColor = true;
        this.config.editable = false;
        this.showDescriptionColorImg = false;
        this.imagePathDrag = null;
        this.nameFile = null;
        this.sizeFile = null;
        break;
      default:
        break;
    }
  }
  /**
   * funcion para resetear las opciones de pickercolor y descripcion
   *
   * @param {number} type
   * @memberof NotificationFormComponent
   */
  resetOpction(type: string) {
    this.form.controls.pickerColor.reset();
    this.colorBackground = '#ffffff';
    if (type === '3') {
      this.form.controls.bodyDescription.reset();
    }
  }
  /**
   * funcion para devolverse al listado de notificaciones
   *
   * @memberof NotificationFormComponent
   */
  backList() {
    window.scroll(0, 0);
    this.isBackList.emit({ back: true });
  }
  /**
   * funcion para ver modal de prevista del anuncio
   *
   * @memberof NotificationFormComponent
   */
  preview() {
    const paramsCreate = this.setparams();
    paramsCreate.showPreview = true;
    paramsCreate.isEdit = this.isEdit;
    paramsCreate.btnTitle = this.btnTitle;
    this.dialogRef = this.dialog.open(ModalPreviewNotificationComponent, {
      width: '58%',
      data: paramsCreate,
    });

    const dialogIntance = this.dialogRef.componentInstance;
    dialogIntance.processFinishModalPreview$.subscribe((val) => {
      this.saveNotification();
      this.dialogRef.close();
    });
  }
  /**
   * funcion para salvar el anuncio creado
   *
   * @memberof NotificationFormComponent
   */
  saveNotification() {
    this.loadingService.viewSpinner();
    if (this.isEdit) {
      if (this.changeFile) {
        const params = this.paramSaveOrChangeImg();
        this.notificationAdminService.saveImgNotification(params).subscribe(result => {
          if (result && result.status === 200) {
            const body = result.body;
            this.withError = false;
            this.createOrEdit = true;
            if (body) {
              if (body.Data && body.Errors.length === 0) {
                if (body.Data.Response === true) {
                  this.imagUrl = body.Data.Url;
                  const paramsCreate = this.setparams();
                  this.notificationAdminService.updateNotification(paramsCreate).subscribe(res => {
                    if (res && res.Errors.length === 0) {
                      this.createOrEdit = true;
                      this.loadingService.closeSpinner();
                      this.modalGeneric();
                    } else {
                      this.createOrEdit = false;
                      this.withError = true;
                      this.listError = res.Errors;
                      this.titleErrorSubtitle = 'Ha ocurrido un error al momento de cargar el anuncio';
                      this.loadingService.closeSpinner();
                      this.modalGeneric();
                    }
                  });
                } else {
                  const msg = 'Se ha presentado un error al realizar la peteción al servidor';
                  this.snackBar.open(msg, 'Cerrar', {
                    duration: 3000
                  });
                }
              } else {
                this.createOrEdit = false;
                this.withError = true;
                this.listError = body.Errors;
                this.titleErrorSubtitle = 'Ha ocurrido un error al momento de cargar el anuncio';
                this.loadingService.closeSpinner();
                this.modalGeneric();
              }
            }
          }
        });

      } else {
        const paramsCreate = this.setparams();
        this.notificationAdminService.updateNotification(paramsCreate).subscribe(res => {
          if (res && res.Errors.length === 0) {
            this.withError = false;
            this.createOrEdit = true;
            this.loadingService.closeSpinner();
            this.modalGeneric();
          } else {
            this.createOrEdit = false;
            this.withError = true;
            this.listError = res.Errors;
            this.titleErrorSubtitle = 'Ha ocurrido un error al momento de cargar la imagen';
            this.loadingService.closeSpinner();
            this.modalGeneric();
          }
        });
      }
    } else {
      if (this.typeBody !== '2') {
        const params = this.paramSaveOrChangeImg();
        this.notificationAdminService.saveImgNotification(params).subscribe(result => {
          if (result && result.status === 200) {
            const body = result.body;
            this.withError = false;
            this.createOrEdit = true;
            if (body) {
              if (body.Data && body.Errors.length === 0) {
                if (body.Data.Response === true) {
                  this.imagUrl = body.Data.Url;
                  const paramsCreate = this.setparams();
                  this.notificationAdminService.createNew(paramsCreate).subscribe(res => {
                    if (res && res.Errors.length === 0) {
                      this.createOrEdit = true;
                      this.loadingService.closeSpinner();
                      this.modalGeneric();
                    } else {
                      this.createOrEdit = false;
                      this.withError = true;
                      this.listError = res.Errors;
                      this.titleErrorSubtitle = 'Ha ocurrido un error al momento de cargar el anuncio';
                      this.loadingService.closeSpinner();
                      this.modalGeneric();
                    }
                  });
                } else {
                  this.createOrEdit = false;
                  this.withError = true;
                  this.listError = body.Errors;
                  this.titleErrorSubtitle = 'Ha ocurrido un error al momento de cargar el anuncio';
                  this.loadingService.closeSpinner();
                  this.modalGeneric();
                }
              } else {
                this.createOrEdit = false;
                this.withError = true;
                this.listError = body.Errors;
                this.titleErrorSubtitle = 'Ha ocurrido un error al momento de cargar la imagen';
                this.loadingService.closeSpinner();
                this.modalGeneric();
              }
            }
          }
        });
      } else {
        this.imagUrl = null;
        const paramsCreate = this.setparams();
        this.notificationAdminService.createNew(paramsCreate).subscribe(res => {
          if (res && res.Errors.length === 0) {
            this.createOrEdit = true;
            this.loadingService.closeSpinner();
            this.modalGeneric();
          } else {
            this.createOrEdit = false;
            this.withError = true;
            this.listError = res.Errors;
            this.titleErrorSubtitle = 'Ha ocurrido un error al momento de cargar el anuncio';
            this.loadingService.closeSpinner();
            this.modalGeneric();
          }
        });
      }
    }
  }
  /**
   * funcion para enviar los parametros para guardar la imgen
   *
   * @returns
   * @memberof NotificationFormComponent
   */
  paramSaveOrChangeImg() {
    const paramsSaveImg = {
      NewsContentType: this.form.controls && this.form.controls.bodyNotification ? this.form.controls.bodyNotification.value : null,
      Name: this.nameFile,
      ContentBase64: this.imagePathDrag.split('base64,')[1],
      isBase64: true
    };
    return paramsSaveImg;
  }
  /**
   * funcion para crear parametros y crear el anuncio
   *
   * @returns
   * @memberof NotificationFormComponent
   */
  setparams() {
    const paramsCreate = {
      Id: this.idNotification,
      NewsContentType: parseInt(this.form.controls.bodyNotification.value, 0),
      Target: this.form.controls.lenguaje.value,
      InitialDate: this.form.controls.dateInitial.value,
      FinalDate: this.form.controls.dateEnd.value,
      Title: this.form.controls.title.value ? this.form.controls.title.value.charAt(0).toUpperCase() + this.form.controls.title.value.slice(1) : null,
      Link: this.form.controls.pageDestiny.value,
      Body: this.form.controls.bodyDescription.value !== '' ? this.form.controls.bodyDescription.value : null,
      UrlImage: this.imagUrl,
      PartitionGrouper: 'News',
      BackgroundColor: this.form.controls.pickerColor.value ? this.form.controls.pickerColor.value : null,
    };

    return <any>paramsCreate;
  }
  /**
   * funcion para llamar al modal generico para mostrar editado, creado o eliminar
   *
   * @memberof NotificationFormComponent
   */
  modalGeneric() {
    const title = this.isEdit ? 'El anuncio se ha editado exitosamente' : 'El anuncio se ha creado exitosamente';
    const params = {
      success: {
        createOrEdit: this.createOrEdit,
        isEdit: this.isEdit,
        title: title,
      },
      error: {
        isError: this.withError,
        listError: this.listError,
        titleErrorSubtitle: this.titleErrorSubtitle
      },
      delete: {
        isDelete: false
      },
    };
     this.dialogRef = this.dialog.open(ModalGenericComponent, {
      width: '50%',
      data: params,
      disableClose: true
    });

    const dialogIntance = this.dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      this.refreshData.emit(val);
      this.dialogRef.close();
    });
  }
  /**
   * funcion para setear en el formulario para editar
   *
   * @param {*} params
   * @memberof NotificationFormComponent
   */
  setValueNotificacion(params: any) {
    if (params && this.form) {
      const newNotification = params.NewsContentType ? params.NewsContentType.toString() : '1';
      this.form.controls.title.setValue(params.Title);
      this.form.controls.dateInitial.setValue(params.InitialDate);
      this.form.controls.dateEnd.setValue(params.FinalDate);
      this.form.controls.title.setValue(params.Title);
      this.form.controls.pageDestiny.setValue(params.Link);
      this.form.controls.bodyDescription.setValue(params.Body);
      this.form.controls.bodyNotification.setValue(newNotification);
      this.form.controls.lenguaje.setValue(params.Target);
      this.form.controls.pickerColor.setValue(params.BackgroundColor);
      this.idNotification = params.Id;
      this.imagePathDrag = params.UrlImage;
      this.imagUrl = params.UrlImage;
      this.validateBody(newNotification);
      this.colorBackground = params.BackgroundColor;
    }
  }
/**
 * funcion para destruir el componente del modal
 *
 * @memberof NotificationFormComponent
 */
ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
