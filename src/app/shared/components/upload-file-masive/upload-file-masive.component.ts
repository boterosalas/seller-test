import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import * as XLSX from 'xlsx';
import { UploadFileMasiveService } from './upload-file-masive.service';

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
  refuseMaxSize = false;
  disabledBtn= true;

  limitRowExcel = 1048576;

  _filesAux: File[] = [];
  _fileAux = null;
  json = [];

  constructor(
    private uploadFileMasiveService: UploadFileMasiveService,
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
    if (this.refuseMaxSize && file === null){
      this.disabledBtn = true;
    } else {
      this.disabledBtn = false;
    }
    this.file = null;
    this.files = [];
  }

  sendUploadCategory() {
    this.readFileUpload(this._fileAux).then(data => {
      if (data && data.length) {
        data.splice(0, 1);
        if (data.length > 0) {
          data.forEach(categories => {
            this.json.push(
              {
                'Id': categories[0] ? parseInt(categories[0], 0)  : null,
                'ProductType': categories[1],
                'Name': categories[2],
                'Commission': categories[3],
                'IdVTEX': categories[4],
                'VtexIdCarulla': categories[5],
                'IdParent': categories[6] ? parseInt(categories[6], 0) : null,
                'TariffCode': categories[7],
                'Tariff': categories[8],
              }
            );
          });
          this.uploadFileMasiveService.createUpdateMassiveCategories(this.json).subscribe(result => {
            console.log(result);

          });
        } else {
          console.log('sin data archivo vacio');
        }
      }
    });
  }

  readFileUpload(evt: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.loadingService.viewSpinner();
      let data: any;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        try {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { raw: true, type: 'binary', sheetRows: this.limitRowExcel });
          /* grab first sheet */
          let ws: XLSX.WorkSheet;

          if (wb.Sheets && wb.SheetNames[0]) {
            ws = wb.Sheets[wb.SheetNames[0]];
          }

          /* save data */
          if (ws && ws !== null && ws !== undefined) {
            data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
            resolve(data);
          } else {
            reject(e);
          }
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsBinaryString(this._fileAux);
    });
  }
}
