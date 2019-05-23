import { Component, Inject, TemplateRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Subject, Observable, timer } from 'rxjs';
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

  request: Observable<any>;
  content: TemplateRef<any>;

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
    // this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    !!this.request && timer(this.data.initTime, this.data.intervalTime).pipe(takeUntil(this.processFinish$), switchMap(() => this.request)).subscribe((res) => {
      try {
        const response = JSON.parse(res.body.body).Data;
        const { Status } = response;
        if (Status === 2) {
          this.Success = true;
          this.inProcess = false;
          this.processFinish$.next(response);
        } else if (Status === 3) {
          this.Success = false;
          this.inProcess = false;
          this.listError = response.Data;
          this.countError = response.Data.length;
          this.processFinish$.next(response);
        }
      } catch {
        this.Success = false;
        this.inProcess = false;
        this.processFinish$.next(null);
      }
    });
    
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

  ngOnDestroy() {
    this.processFinish$.next(null);
  }

}
