import { Component, Inject, TemplateRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Subject, Observable, timer, Subscription } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

const EXCEL_EXTENSION = '.xlsx';



/**
 * Component Modal que permite visualizar la lista de erores recibidos y exportarlos a un archivo tipo excel
 */
@Component({
  selector: 'app-finish-upload-information',
  templateUrl: './finish-upload-information.component.html',
  styleUrls: ['./finish-upload-information.component.scss']
})

/**
 * FinishUploadInformationComponent
 */
export class FinishUploadInformationComponent implements AfterViewInit, OnDestroy {

  public response: any;
  public responseData: any;
  inProcess = true;
  processFinish$ = new Subject<any>();
  Success = false;
  countError: number;
  listError: any;
  listErrorStatus: any;
  pex = false;
  showExport = true;

  request: Observable<any>;
  content: TemplateRef<any>;
  subs: Subscription = new Subscription();

  /**
   * Creates an instance of FinishUploadInformationComponent.
   * @param {MatDialogRef<FinishUploadInformationComponent>} dialogRef
   * @param {*} data
   * @memberof FinishUploadInformationComponent
   */
  constructor(
    public dialogRef: MatDialogRef<FinishUploadInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    this.response = data;
  }

  ngAfterViewInit() {
    const typeStatus = this.data.typeStatus;
    if (typeStatus === 1 || typeStatus === 4 && this.data.listError === null) {
      // tslint:disable-next-line: no-unused-expression
      !!this.request && timer(this.data.initTime, this.data.intervalTime).pipe(takeUntil(this.processFinish$), switchMap(() => this.request)).subscribe((res) => {
        try {
          const { status, response } = res.body.data;
          if (status === 2) {
            this.Success = true;
            this.inProcess = false;
            this.processFinish$.next(res);
          } else if (status === 3) {
            if (response) {
              if (this.data.responseDiferent) {
                this.listErrorStatus = response.ListError;
                this.listError = this.mapItemsResponseDiferent(this.listErrorStatus);
              } else {
                if (JSON.parse(response).Data !== undefined) {
                  if (JSON.parse(response).Data.OfferNotify) {
                    this.listErrorStatus = JSON.parse(response).Data.OfferNotify;
                  }
                  if (JSON.parse(response).Data.ProductNotify) {
                    this.listErrorStatus = JSON.parse(response).Data.ProductNotify;
                  }
                  this.listError = this.mapItems(this.listErrorStatus);
                } else {
                  if (JSON.parse(response).ListError) {
                    this.listErrorStatus = JSON.parse(response).ListError;
                  }
                  this.listError = this.mapItemsLoadGuide(this.listErrorStatus);
                }
              }
            } else {
              this.listErrorStatus = [length = 0];
            }
            this.Success = false;
            this.inProcess = false;
            if (this.data.showExport !== undefined) {
              this.showExport = this.data.showExport;
            }

            this.countError = this.listErrorStatus.length;
            this.processFinish$.next(res);
          }
        } catch {
          this.Success = false;
          this.inProcess = false;
          this.processFinish$.next(null);
        }
      });
    } else if (typeStatus === 2 && this.data.listError === null) {
      this.Success = true;
      this.inProcess = false;
      this.cdr.detectChanges();
    } else if (typeStatus === 3 && this.data.listError !== null) {
      this.Success = false;
      this.inProcess = false;
      this.listError = this.mapItems(this.data.listError);
      this.pex = this.typeErrorShowButton(this.listError);
      this.countError = this.data.listError.length;
      if (this.data && this.data.showExport !== undefined) {
        this.showExport = this.data.showExport;
      }
      this.cdr.detectChanges();
    }
    this.cdr.detectChanges();
  }
  /**
   * funcion para mapear las llaves y normalizar el nombre enviado del back
   *
   * @param {any[]} items
   * @returns {any[]}
   * @memberof FinishUploadInformationComponent
   */
  mapItems(items: any[]): any[] {
    return items.map(x => {
      return {
        Ean: this.validateHeader(x.ean, x.Ean),
        Message: this.validateHeader(x.message, x.Message),
        Code: x.code
      };
    });
  }
  mapItemsResponseDiferent(items: any[]): any[] {
    return items.map(x => {
      return {
        Message: this.validateHeader(x.message, x.Message),
        Code: 'ResponseDiferent'
      };
    });
  }

  /**
   * funcion para mapear la respuesta del servidor
   *
   * @param {any[]} items
   * @returns {any[]}
   * @memberof FinishUploadInformationComponent
   */
  mapItemsLoadGuide(items: any[]): any[] {
    return items.map(x => {
      return {
        Sku: x.Sku,
        Message: x.Message
      };
    });
  }

  /**
   * Validacion para saber cual de los dos valores esta undefined y retonar el valor diferente de undefined
   *
   * @param {*} a
   * @param {*} b
   * @returns
   * @memberof FinishUploadInformationComponent
   */
  validateHeader(a: any, b: any) {
    if (a !== undefined) {
      return a;
    } else {
      return b;
    }
  }

  /**
   * Método para cerrar el modal
   * @memberof FinishUploadInformationComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof FinishUploadInformationComponent
   */
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
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
      view[i] = s.charCodeAt(i) & 0xFF;
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
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  /**
   * validar si sale el boton y no
   *
   * @param {*} list
   * @returns
   * @memberof FinishUploadInformationComponent
   */
  typeErrorShowButton(list: any) {
    let countPex = 0;
    if (list && list.length > 0) {
      list.forEach(element => {
        if (element.Code === 'PEX') {
          countPex++;
        }
      });
    }
    if (countPex === list.length) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * funcion para enviar el evento al aceptar o confrimar
   *
   * @memberof FinishUploadInformationComponent
   */
  // tslint:disable-next-line:member-ordering
  confirmation: () => void;
  /**
   * Funcion para destruir el componente y parar la solicitud del estado de la carga masiva de ofertas
   *
   * @memberof FinishUploadInformationComponent
   */
  ngOnDestroy() {
    this.processFinish$.next(null);
    this.dialogRef.close();
  }

}
