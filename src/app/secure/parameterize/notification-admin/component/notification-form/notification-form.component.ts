import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { truncate } from 'fs';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit {

  @ViewChild('fileUploadOption', {static: false}) inputFileUpload: any;
  @ViewChild('pickerColor', {static: false}) pickerColor: any;
  @Output() isBackList = new EventEmitter<object>();
  public form: FormGroup;
  public fileImgBase64 = '';
  public imagePath: SafeResourceUrl = '';
  public fileName: string;
  public fileSize: number;

  public disableText = false;
  public disableLoadImag = false;
  public disableColor = false;

  public showDescriptionColorImg = true;

  public colorBackground= '#ffffff';

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
    private _sanitizer: DomSanitizer
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
      fileImg: new FormControl(''),
    });
  }

  setValueColor(color: string) {
    this.form.controls.pickerColor.setValue(color);
    this.colorBackground = color;
  }

  createNotification(){
  }

  onFileChange(event: any) {
    const file = event && event.target ? event.target.files[0] :  null;
    if (file !== null && file !== undefined && file !== 'undefined') {
      this.getBase64(file).then(data => {
        try {
          this.fileImgBase64 = data;
          this.fileName = file.name;
          this.fileSize = file.size ?  parseFloat(((file.size) / 1024 / 1024).toFixed(3)) : null;
          this.validate(file);
          this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(data);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  getBase64(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  validate(file: any) {
    const size = parseFloat(((file.size) / 1024 / 1024).toFixed(3));
    const img = new Image;
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = function() {
      if (img.width <= 800 && img.height <= 600 ) {
        console.log('dimesion correctas');
      } else {
        console.log('error para las dimensiones');
      }
      if (size <= 7000) {
        console.log('tamaño permitido');
      } else {
        console.log('archivo muy pesado');
      }
    };
  }

  validateBody(typeBody: number) {
    this.resetOpction(typeBody);
    switch (typeBody) {
      case 1:
        this.form.controls.bodyDescription.enable();
        this.form.controls.fileImg.enable();
        this.form.controls.pickerColor.disable();
         this.disableText = false;
         this.disableLoadImag = false;
         this.disableColor = true;
         this.config.editable = true;
         this.showDescriptionColorImg = true;
        break;
      case 2:
        this.form.controls.bodyDescription.enable();
        this.form.controls.fileImg.disable();
        this.form.controls.pickerColor.enable();
        this.disableText = false;
        this.disableLoadImag = true;
        this.disableColor = false;
        this.config.editable = true;
        this.showDescriptionColorImg = true;
        break;
      case 3:
        this.form.controls.bodyDescription.disable();
        this.form.controls.fileImg.enable();
        this.form.controls.pickerColor.disable();
        this.disableText = true;
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
    this.form.controls.fileImg.reset();
    this.imagePath = '';
    this.fileName = null;
    this.colorBackground = '#ffffff';
    if (type === 3) {
      this.form.controls.bodyDescription.reset();
    }
  }

  backList() {
    this.isBackList.emit({ back: true });
  }

}
