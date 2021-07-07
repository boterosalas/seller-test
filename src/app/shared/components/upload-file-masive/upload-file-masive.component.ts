import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { Subject, Subscription, timer } from "rxjs";
import { HttpEvent } from "@angular/common/http";
import { isNullOrUndefined } from "util";
import { UploadFileMasiveService } from "./upload-file-masive.service";
import { switchMap, takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { RoutesConst } from "@app/shared";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
const EXCEL_EXTENSION = ".xlsx";

@Component({
  selector: "app-upload-file-masive",
  templateUrl: "./upload-file-masive.component.html",
  styleUrls: ["./upload-file-masive.component.scss"],
})
export class UploadFileMasiveComponent implements OnInit, OnDestroy {
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
  disabledBtn = true;
  processFinish$ = new Subject<any>();

  limitRowExcel = 1048576;

  _filesAux: File[] = [];
  _fileAux = null;
  json = [];
  listErrors = [];
  listBtnError = [];
  public nameFileExport = "";
  public listBtn = [];

  public titleStatus = "";
  public iconStatus = "";
  public showError = false;
  public loadFile = true;
  public routes: any;
  public ListBtn = [];
  public subTitleStatus = "";
  public colorStatus = "";

  constructor(
    private uploadFileMasiveService: UploadFileMasiveService,
    public dialogRef: MatDialogRef<UploadFileMasiveComponent>,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (
      (this.data && this.data.status === 1) ||
      this.data.status === 4 ||
      this.data.status === 3
    ) {
      this.validateStatus(this.data.status, this.data);
    }
    this.routes = RoutesConst;
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
  /**
   * funcion para calcular el tamaño del archivo
   *
   * @param {*} files
   * @param {*} file
   * @memberof UploadFileMasiveComponent
   */
  resetFiles(files: any, file: any) {
    if (!isNullOrUndefined(file)) {
      this._filesAux = [];
      this._fileAux = file;
      const size = parseFloat((file.size / 1024 / 1024).toFixed(3));
      if (size < 7.0) {
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
        const size = parseFloat((this._fileAux.size / 1024 / 1024).toFixed(3));
        if (size < 7.0) {
          this.refuseMaxSize = false;
        } else {
          this.refuseMaxSize = true;
        }
      }
    }
    if (this.refuseMaxSize && file === null) {
      this.disabledBtn = true;
    } else {
      this.disabledBtn = false;
    }
    this.file = null;
    this.files = [];
  }
  /**
   * funcion para armar y subir el archivo
   *
   * @memberof UploadFileMasiveComponent
   */
  sendUploadCategory() {
    this.readFileUpload(this._fileAux).then((data) => {
      if (data && data.length) {
        data.splice(0, 1);
        if (data.length > 0) {
          data.forEach((categories) => {
            this.json.push({
              Id: categories[0] ? parseInt(categories[0], 0) : 0,
              IdParent: categories[1] ? parseInt(categories[1], 0) : null,
              ProductType: categories[2],
              Name: categories[3],
              Commission: categories[4] ? parseInt(categories[4], 0) : 0,
              TariffCode: categories[5],
              Tariff: categories[6] ? categories[6] : 0,
              IdVTEX: categories[7] ? parseInt(categories[7], 0) : 0,
              VtexIdCarulla: categories[8],

              SincoSubLineId: categories[9] ? parseInt(categories[9], 0) : null,
              SincoCategoryId: categories[10] ? parseInt(categories[10], 0) : null,
              SincoSubCategoryId: categories[11] ? parseInt(categories[11], 0) : null,
              SincoSegmentId: categories[12] ? parseInt(categories[12], 0) : null,

            });
          });
          this.uploadFileMasiveService.uploadFile(this.data.services.send.name, this.data.services.send.method, this.json).subscribe(result => {
            if (result && result.statusCode === 200) {
              if (result.body) {
                const body = JSON.parse(result.body);
                if (body && body.Data && body.Data.Data) {
                  this.loadFile = false;
                  this.validateStatus(1, null);
                  this.verifyStatus(1);
                }
              }
            }
          });
        } else {
          this.snackBar.open("El archivo esta vacío", "Cerrar", {
            duration: 3000,
          });
        }
      }
    });
  }
  /**
   * funcion para lecura de archivo de excel
   *
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof UploadFileMasiveComponent
   */
  readFileUpload(evt: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.loadingService.viewSpinner();
      let data: any;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        try {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, {
            raw: true,
            type: "binary",
            sheetRows: this.limitRowExcel,
          });
          /* grab first sheet */
          let ws: XLSX.WorkSheet;

          if (wb.Sheets && wb.SheetNames[0]) {
            ws = wb.Sheets[wb.SheetNames[0]];
          }

          /* save data */
          if (ws && ws !== null && ws !== undefined) {
            data = XLSX.utils.sheet_to_json(ws, { header: 1,  blankrows: false, defval: null });
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
  /**
   * funcion verificar el estado de la carga
   *
   * @param {number} status
   * @memberof UploadFileMasiveComponent
   */
  verifyStatus(status: number) {
    // tslint:disable-next-line: no-unused-expression
    !!this.uploadFileMasiveService.status(
      this.data.services.status.name,
      this.data.services.status.method
    ) &&
      timer(this.data.initTime, this.data.intervalTime)
        .pipe(
          takeUntil(this.processFinish$),
          switchMap(() =>
            this.uploadFileMasiveService.status(
              this.data.services.status.name,
              this.data.services.status.method
            )
          )
        )
        .subscribe((res) => {
          if (res && res.statusCode && res.body) {
            const body = JSON.parse(res.body);
            if (body && body.Data) {
              this.validateStatus(body.Data.Status, body.Data);
            }
          }
        });
  }
  /**
   * funcion para validar el estado para colocar variables dinamicas
   *
   * @param {number} status
   * @param {string} checked
   * @param {*} data
   * @memberof UploadFileMasiveComponent
   */
  validateStatus(status: number, data: any) {
    switch (status) {
      case 1:
      case 4:
        this.titleStatus = this.data.uploadStatus.proccess.title;
        this.iconStatus = this.data.uploadStatus.proccess.icon;
        this.ListBtn = this.data.uploadStatus.proccess.btn;
        this.colorStatus = "#BCBCBC";
        break;
      case 2:
        this.titleStatus = this.data.uploadStatus.success.title;
        this.subTitleStatus = this.data.uploadStatus.success.subTile;
        this.ListBtn = this.data.uploadStatus.success.btn;
        this.iconStatus = this.data.uploadStatus.success.icon;
        this.colorStatus = "#6FB63E";
        this.processFinish$.next(true);
        break;
      case 3:
        let errors = [];
        const response =
          data && data.Response ? JSON.parse(data.Response) : null;
        if (this.data.listError !== null) {
          errors = this.data.listError;
        }
        if (response !== null && response.Errors.length > 0) {
          errors = response.Errors;
        }
        this.listErrors = errors;
        this.titleStatus = this.data.uploadStatus.error.title;
        this.iconStatus = this.data.uploadStatus.error.icon;
        this.listBtnError = this.data.uploadStatus.error.btn;
        this.nameFileExport = this.data.uploadStatus.error.nameFile;
        this.colorStatus = "#D14444";
        this.showError = true;
        this.loadFile = false;
        this.processFinish$.next(false);
        break;
      default:
        break;
    }
  }
  /**
   * funcion para volver al home
   *
   * @memberof UploadFileMasiveComponent
   */
  goToHome() {
    this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
  }

  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof FinishUploadInformationComponent
   */
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
   * Método que permite dar el formato correcto al archivo excel generado
   * @param {*} s
   * @returns
   * @memberof FinishUploadInformationComponent
   */
  s2ab(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    // tslint:disable-next-line:curly
    for (let i = 0; i !== s.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  /**
   * Método que permite generar el excel con los datos pasados.
   * @param {*} buffer
   * @param {string} fileName
   * @memberof FinishUploadInformationComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: "",
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  /**
   * funcion para resetear los campos
   *
   * @memberof UploadFileMasiveComponent
   */
  resetFields() {
    this.titleStatus = "";
    this.iconStatus = "";
    this.processFinish$ = new Subject<any>();
    this.ListBtn = [];
    this.listBtnError = [];
    this.listErrors = [];
    this.json = [];
    this._filesAux = [];
    this._fileAux = null;
    this.disabledBtn = true;
  }
  /**
   * funcion para cerrar el modal
   *
   * @memberof UploadFileMasiveComponent
   */
  close() {
    this.dialogRef.close();
    this.resetFields();
  }
  /**
   * funcion para destruir el componente
   *
   * @memberof UploadFileMasiveComponent
   */
  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
