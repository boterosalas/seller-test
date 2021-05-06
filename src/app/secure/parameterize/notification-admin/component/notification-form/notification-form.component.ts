import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ModalLoadFileComponent } from '../modal-load-file/modal-load-file.component';
import { ModalPreviewNotificationComponent } from '../modal-preview-notification/modal-preview-notification.component';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit {

  @ViewChild('fileUploadOption', { static: false }) inputFileUpload: any;
  @ViewChild('pickerColor', { static: false }) pickerColor: any;
  @Output() isBackList = new EventEmitter<object>();
  public form: FormGroup;
  public disableText = false;
  public disableLoadImag = false;
  public disableColor = true;

  public showDescriptionColorImg = true;
  public show: boolean;

  public colorBackground = '#ffffff';
  public imagePathDrag = null;

  public nameFile = null;
  public sizeFile = null;

  public params: any;


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
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      bodyNotification: new FormControl('1'),
      dateInitial: new FormControl(''),
      title: new FormControl(''),
      lenguaje: new FormControl('National'),
      dateEnd: new FormControl(''),
      pageDestiny: new FormControl(''),
      bodyDescription: new FormControl(''),
      pickerColor: new FormControl({ value: '', disabled: true }),
    });
  }

  setValueColor(color: string) {
    this.form.controls.pickerColor.setValue(color);
    this.colorBackground = color;
  }

  modalLoadFiel() {
    const params = {
      show: true
    };
    const dialogRef = this.dialog.open(ModalLoadFileComponent, {
      width: '50%',
      data: params,
      disableClose: true,
    });

    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      if (val.imgBase64 !== undefined) {
        this.imagePathDrag = val.imgBase64;
        this.nameFile = val.nameFile;
        this.sizeFile = val.sizeFile;
      }
    });
  }

  emitDataImgLoad(data: any) {
    this.imagePathDrag = data;
  }

  createNotification() {
  }

  validateBody(typeBody: number) {
    this.resetOpction(typeBody);
    switch (typeBody) {
      case 1:
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
      case 2:
        this.form.controls.bodyDescription.enable();
        this.form.controls.pickerColor.enable();
        this.disableText = false;
        this.show = true;
        this.disableLoadImag = true;
        this.disableColor = false;
        this.config.editable = true;
        this.showDescriptionColorImg = true;
        break;
      case 3:
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

  resetOpction(type: number) {
    this.form.controls.pickerColor.reset();
    this.colorBackground = '#ffffff';
    if (type === 3) {
      this.form.controls.bodyDescription.reset();
    }
  }

  backList() {
    this.isBackList.emit({ back: true });
  }

  preview() {
    this.params = {
      Id: null,
      bodyNotification: this.form.controls.bodyNotification.value,
      Target : this.form.controls.lenguaje.value,
      CreationDate : this.form.controls.dateInitial.value,
      FinalDate : this.form.controls.dateEnd.value,
      Title : this.form.controls.title.value,
      Link : this.form.controls.pageDestiny.value,
      Body : this.form.controls.bodyDescription.value,
      UrlImage: this.imagePathDrag,
      BackgroundColor : this.form.controls.pickerColor.value
    };
    console.log(this.params);
    // const dialogRef = this.dialog.open(ModalPreviewNotificationComponent, {
    //   width: '50%',
    //   data: null,
    // });
  }
}
