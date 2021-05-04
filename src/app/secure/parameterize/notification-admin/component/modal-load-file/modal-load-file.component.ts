import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-modal-load-file',
  templateUrl: './modal-load-file.component.html',
  styleUrls: ['./modal-load-file.component.scss']
})
export class ModalLoadFileComponent implements OnInit {

  public _filesAux: File[] = [];
  public _fileAux = null;
  public refuseMaxSize = false;
  public disabledBtn = true;
  public files: File[] = [];
  public file = null;
  public maxSize = 10145728;
  public lastInvalids: any;
  public fileImgBase64 = '';
  public imagePathDrag: SafeResourceUrl = '';
  public accept = '.jpg, .JPG, .png, .PNG';
  public processFinish$ = new Subject<any>();
  public isDimesion = true;
  public showError = false;



  public startInit = true;
  public success = false;
  public error = false;

  public size: number;
  public dimesion: boolean;

  @Output() emitDataImgLoad = new EventEmitter<object>();

  public _showComponent: boolean;

  @Input() set showComponent(value: any) {
    if (value !== 'undefined') {
      this._showComponent = value;
    } else {
      this._showComponent = true;
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    if (this.data && this.data.show) {
      this._showComponent = this.data.show;
    }
  }

  public getDate(): Date {
    return new Date();
  }

  validateFile(arrayFiles: any, file: any) {
    this.startInit = false;
    this._fileAux = arrayFiles && arrayFiles.length > 0 ? arrayFiles[0] : file;
    if (this._fileAux !== null && this._fileAux !== undefined && this._fileAux !== 'undefined') {
      this.size = parseFloat(((this._fileAux.size) / 1024 / 1024).toFixed(3));
      this.validate(this._fileAux).then(data => {
        this.refuseMaxSize = this.size < 7000 ? false : true;
        this.dimesion = data.width <= 800 && data.height <= 600 ? true : false ;
        this.error = this.refuseMaxSize === true || this.dimesion === false ? true : false;
        this.success = this.error ? false : true;
      });
    }
    this.file = null;
    this.files = [];
  }

  loadDragAndDrop(file: any) {
      this.getBase64(file).then(data => {
        try {
          this.fileImgBase64 = data;
          this.imagePathDrag = this._sanitizer.bypassSecurityTrustResourceUrl(data);
          this.processFinish$.next(data);
          this.emitDataImgLoad.emit(data);
        } catch (error) {
          console.log(error);
        }
      });
  }

  getBase64(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  validate(file: any): any {
    return new Promise((resolve, reject) => {
      const img = new Image;
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = error => reject(error);
    });
  }

}
