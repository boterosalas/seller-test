import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-upload-file-masive',
  templateUrl: './upload-file-masive.component.html',
  styleUrls: ['./upload-file-masive.component.scss']
})
export class UploadFileMasiveComponent implements OnInit {

 
  files: File[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  httpEmitter: Subscription;
  httpEvent: HttpEvent<Event>;
  lastFileAt: Date;
  maxSize = 10145728;
  lastInvalids: any;
  dataToSend: any;
  showProgress = false;
  validComboDrag = true;
  dragFiles = true;
  file = null;
  arraySend = [];
  refuseMaxSize= false;

  _filesAux: File[] = [];
  _fileAux = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  /**
   * Obitene la fecha actual
   *
   * @returns
   * @memberof LoadFileComponent
   */
   public getDate(): Date {
    return new Date();
  }

  validateFormatInvalidate(validate: any) {
    console.log(validate);
  }


  resetFiles(files: any, file: any) {
    if (!isNullOrUndefined(file)) {
      this._filesAux = [];
      this._fileAux = file;
      const size = parseFloat(((file.size) / 1024 / 1024).toFixed(3));
      if (size < 7.000) {
        this.refuseMaxSize = false;
      } else {
        this.refuseMaxSize = true;
      }
    }

    if (files && files.length > 0) {
        if (files.length > 1) {
          this._fileAux = null;
          this._filesAux = files;
        } else {
          this._fileAux = files[0];
          this._filesAux = [];
          const size = parseFloat(((this._fileAux.size) / 1024 / 1024).toFixed(3));
          if (size < 7.000) {
            this.refuseMaxSize = false;
          } else {
            this.refuseMaxSize = true;
          }
        }
    }
    this.file = null;
    this.files = [];
    console.log(this._fileAux);
  }

}
