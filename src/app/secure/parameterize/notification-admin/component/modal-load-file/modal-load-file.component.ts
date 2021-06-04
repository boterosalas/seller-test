import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-load-file',
  templateUrl: './modal-load-file.component.html',
  styleUrls: ['./modal-load-file.component.scss']
})
export class ModalLoadFileComponent implements OnInit, OnDestroy  {

  public _filesAux: File[] = [];
  public _fileAux = null;
  public refuseMaxSize = false;
  public disabledBtn = true;
  public files: File[] = [];
  public file = null;
  public maxSize = 10145728;
  public lastInvalids: any;
  public fileImgBase64: any;
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
  public nameFile = '';
  public dateFile: any;

  public validComboDrag = false;
  public dragFiles = true;
  public lastFileAt: Date;
  public typeBody = null;
  public messageValidateDimension= '';

  @Output() emitDataImgLoad = new EventEmitter<object>();

  public _showComponent: boolean;

  @Input() set params(value: any) {
    if (value.show !== 'undefined') {
      this._showComponent = value.show ;
      this.typeBody = value.typeBody;
    } else {
      this._showComponent = true;
      this.typeBody = 1;
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ModalLoadFileComponent>,
    public snackBar?: MatSnackBar,
  ) { }

  ngOnInit() {
    if (this.data && this.data.show) {
      this._showComponent = this.data.show;
      this.typeBody = this.data.typeBody;
    }
  }
  /**
   * funcion para caturar la fecha
   *
   * @returns {Date}
   * @memberof ModalLoadFileComponent
   */
  public getDate(): Date {
    return new Date();
  }
  /**
   * funcion para validar el archivo
   *
   * @param {*} arrayFiles
   * @param {*} file
   * @memberof ModalLoadFileComponent
   */
  validateFile(arrayFiles: any, file: any) {
    this.startInit = false;
    this._fileAux = arrayFiles && arrayFiles.length > 0 ? arrayFiles[0] : file;
    if (this._fileAux !== null && this._fileAux !== undefined && this._fileAux !== 'undefined') {
      this.size = parseFloat(((this._fileAux.size) / 1024 / 1024).toFixed(3));
      this.validate(this._fileAux).then(data => {
        this.refuseMaxSize = this.size < 7000 ? false : true;
        if (this.typeBody === 1) {
          this.dimesion = data.width <= 900 && data.height <= 300 ? true : false;
          this.messageValidateDimension = 'Medidas de las imagenes no pueden superar 900 x 300 px';
        } else if (this.typeBody === 3) {
          this.dimesion = data.width <= 900 && data.height <= 600 ? true : false;
          this.messageValidateDimension = 'Medidas de las imagenes no pueden superar 900 x 600 px';
        } else {
          this.dimesion = true;
        }
        this.error = this.refuseMaxSize === true || this.dimesion === false ? true : false;
        if (!this.error) {
          this.loadDragAndDrop(this._fileAux);
        } else {
          this.success = false;
        }
      });
    }
    this.file = null;
    this.files = [];
  }
  /**
   * funcion para cargar archivos y pasarlo a base 64
   *
   * @param {*} file
   * @memberof ModalLoadFileComponent
   */
  loadDragAndDrop(file: any) {
    this.getBase64(file).then(data => {
      try {
        this.fileImgBase64 = data;
        this.imagePathDrag = this._sanitizer.bypassSecurityTrustResourceUrl(data);
        this.emitDataImgLoad.emit(this.fileImgBase64);
        this.nameFile = file.name;
        this.dateFile = file.lastModifiedDate;
        this.success = this.error ? false : true;
      } catch (error) {
        const msg = 'Se ha presentado un error al realizar la peteción al servidor';
        this.snackBar.open(msg, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  /**
   * funcion para cambiar el archivo a base 64
   *
   * @param {*} file
   * @returns {*}
   * @memberof ModalLoadFileComponent
   */
  getBase64(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  /**
   * funcion para trasnformar un archivo y setear propiedades de una imagen tal como height, width 
   *
   * @param {*} file
   * @returns {*}
   * @memberof ModalLoadFileComponent
   */
  validate(file: any): any {
    return new Promise((resolve, reject) => {
      const img = new Image;
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = error => reject(error);
    });
  }
  /**
   * funcion para cerrar y salvar la imgen en el modal
   *
   * @memberof ModalLoadFileComponent
   */
  closeAndsave() {
    this.close();
    this.imagePathDrag = this._sanitizer.bypassSecurityTrustResourceUrl(this.fileImgBase64);
    this.processFinish$.next(
      {
        imgBase64: this.fileImgBase64,
        nameFile: this.nameFile,
        sizeFile: this.size
      }
    );
  }
  /**
   * funcion para cerrar el modal
   *
   * @memberof ModalLoadFileComponent
   */
  close() {
    this.dialogRef.close();
  }
   /**
    * funcion para destruir el componente del modal
    *
    * @memberof ExpandedProductComponent
    */
    ngOnDestroy() {
      if (Object.keys(this.dialogRef).length !== 0) {
        this.dialogRef.close();
      }
    }

}
