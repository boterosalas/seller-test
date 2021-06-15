import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { ComponentsService } from '@app/shared';
import { dataUrltoBlob } from 'angular-file/file-upload/fileTools';
import { FormControl, FormGroup } from '@angular/forms';

const EXCEL_EXTENSION = '.xlsx';


/**
 * Component Modal que permite visualizar la lista de erores recibidos y exportarlos a un archivo tipo excel
 */
@Component({
  selector: 'app-finish-upload-product-information',
  templateUrl: './finish-upload-product-information.component.html',
  styleUrls: ['./finish-upload-product-information.component.scss']
})

/**
 * FinishUploadProductInformationComponent
 */
export class FinishUploadProductInformationComponent implements AfterViewInit {

  public response: any;
  public has: string;
  public have: string;
  public errors: string;
  public error: string;
  public name: string;
  public typeModal: string;
  public limitRowExcel = 1048576;
  public countError = 0;
  public countSuccessful = 0;
  public urlFile = null;
  public form: FormGroup;
  @ViewChild('fileUploadOption', {static: false}) inputFileUpload: any;

  /**
   * Creates an instance of FinishUploadProductInformationComponent.
   * @param {MatDialogRef<FinishUploadProductInformationComponent>} dialogRef
   * @param {*} data
   * @memberof FinishUploadProductInformationComponent
   */
  constructor(
    public dialogRef: MatDialogRef<FinishUploadProductInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private languageService: TranslateService,
    public componentService: ComponentsService,
  ) {
    this.typeModal = data.type;
    this.response = data.response;
    console.log(data);
    this.has = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.has');
    this.have = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.have');
    this.errors = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.errors');
    this.error = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.error');
    this.name = this.languageService.instant('secure.products.create_product_unit.list_products.product_name');
    if (data !== undefined && data !== 'undefined' && this.typeModal === 'product') {
      if (data && data.response && data.response.body && data.response.body.data && data.response.body.data.response && data.response.body.data.response.Data !== undefined) {
        const {Error, Successful, Url} = data.response.body.data.response.Data;
        this.countError = Error;
        this.countSuccessful = Successful;
        this.urlFile = Url;
      }
    }
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      fileUploadOption: new FormControl()
    });
  }

  ngAfterViewInit() {
    if ( !!this.response.productNotifyViewModel && this.response.productNotifyViewModel.length > 0) {
      this.response.productNotifyViewModel.map(element => {
        element.ProductName = !!element.ProductName ? element.ProductName : !!element.productName ? element.productName : null;
        element.Ean = !!element.Ean ? element.Ean : !!element.ean ? element.ean : null;
      });
      this.cd.detectChanges();
    }
  }
  /**
   * Método para cerrar el modal
   * @memberof FinishUploadProductInformationComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  verifyStateCharge() {
    this.dialogRef.close(true);
  }

  // Funcion para recargar la pagina.
  reloadPage() {
    window.location.reload();
  }


  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof FinishUploadProductInformationComponent
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
   * @memberof FinishUploadProductInformationComponent
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
   * @memberof FinishUploadProductInformationComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  onFileChange(evt: any) {
    this.readFileUpload(evt).then(data => {
      console.log(data);
    }, err => {
      console.log(err);
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.accpet_min'), 4000);
    }).catch(err => {

    });
  }


  
  /**
   * Funcionalidad que permite capturar los datos del excel.
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof LoadGuidePageComponent
   */
   readFileUpload(evt: any): Promise<any> {

    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {

      let data: any;
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      // tslint:disable-next-line:curly
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        try {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { raw: true, type: 'binary', sheetRows: this.limitRowExcel });
          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          /* save data */

          data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
          resolve(data);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsBinaryString(target.files[0]);
    });
  }


    resetUploadFIle() {
      // Limpio el input file
      this.inputFileUpload.nativeElement.value = '';
    }

    uploadFileError (url: string) {
      if (url != null) {
        window.open(url, '_back');
      } else {
        console.error('error al descargar archivo');
      }
    }
}
