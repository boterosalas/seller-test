import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ModalLoadFileComponent } from '../modal-load-file/modal-load-file.component';

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
  public disableColor = false;

  public showDescriptionColorImg = true;
  public show: boolean;

  public colorBackground = '#ffffff';



  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: 'por aca carga las configurarionnes',
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
      bodyNotification: new FormControl(''),
      dateInitial: new FormControl(''),
      title: new FormControl(''),
      lenguaje: new FormControl(''),
      dateEnd: new FormControl(''),
      pageDestiny: new FormControl(''),
      bodyDescription: new FormControl(''),
      pickerColor: new FormControl(''),
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
    });

    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      // console.log(val);
    });
  }

  emitDataImgLoad(data: any) {
    // console.log(data);
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
}
