import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Logger, UserParametersService } from '@app/core';
import { ComponentsService } from '@app/shared';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { LoadGuideService } from '../load-guide.service';
import { TranslateService } from '@ngx-translate/core';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

// log component
const log = new Logger('DownloadFormatComponent');

@Component({
  selector: 'app-download-format',
  templateUrl: './download-format.component.html',
  styleUrls: ['./download-format.component.scss']
})

export class DownloadFormatComponent implements OnInit {

  public user: any;
  // Formulario para realizar la descarga
  public myform: FormGroup;

  language = 'ES';

  /**
   * Creates an instance of DownloadFormatComponent.
   * @param {LoadGuideService} loadGuide
   * @param {UserService} userService
   * @param {ComponentsService} componentService
   * @param {MatDialogRef<DownloadFormatComponent>} dialogRef
   * @param {FormBuilder} fb
   * @memberof DownloadFormatComponent
   */
  constructor(
    private loadGuide: LoadGuideService,
    private componentService: ComponentsService,
    public dialogRef: MatDialogRef<DownloadFormatComponent>,
    private fb: FormBuilder,
    public userParams: UserParametersService,
    private languageService: TranslateService,
  ) {
    this.user = {};
  }

  /**
   * @memberof DownloadFormatComponent
   */
  ngOnInit() {
    // Obtengo la información del usuario
    this.getDataUser();
    this.createForm();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * @memberof DownloadFormatComponent
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Método para descarga la información de las órdenes
   * @param {any} form
   * @memberof DownloadFormatComponent
   */
  downloadInformationForGuide(form) {
    this.setLanguage();
    this.loadGuide.downloadInformationForGuide(this.user, `?sellerId=${this.user.sellerId}&limit=${form.value.limit}`)
      .subscribe((res: Array<{}>) => {
        let emptyFile = [];
        if (res.length > 0) {
          this.componentService.openSnackBar(this.languageService.instant('secure.load_guide_page.download_format.ts_download_ok'), this.languageService.instant('actions.close'), 3000);
          // aplico el formato al json para los campos tracking y guide
          this.applyFormatToJson(res);
        } else {
          this.componentService.openConfirmAlert(this.languageService.instant('secure.orders.in_devolution.in_devolution_page.no_found_orders'), this.languageService.instant('secure.load_guide_page.download_format.ts_want_download'))
            .then(response => {
              if (response) {
                if (this.language === 'ES') {
                   emptyFile = [{
                    'Orden': undefined,
                    'Sku': undefined,
                    'Cantidad': undefined,
                    'Transportadora': undefined,
                    'Guía': undefined
                  }];
                } else {
                  emptyFile = [{
                    'Order': undefined,
                    'Sku': undefined,
                    'Amount': undefined,
                    'Shipping Company': undefined,
                    'Guide': undefined
                  }];
                }
                this.exportAsExcelFile(emptyFile, this.languageService.instant('secure.load_guide_page.download_format.guide_format'));
              }
            });
        }
      });
  }

  setLanguage() {
    this.languageService.onLangChange.subscribe((e: Event) => {
      this.language = e['lang'];
    });
    if (localStorage.getItem('culture_current')) {
      this.language = localStorage.getItem('culture_current');
    } else {
      this.language = 'ES';
    }
  }

  /**
   * Aplico el formato al json para los campos tracking y guide
   * @param {any} res
   * @memberof DownloadFormatComponent
   */
  applyFormatToJson(res) {

    let newKeys = { orderId: 'Orden', sku: 'Sku', quantity: 'Cantidad', tracking: 'Transportadora', guide: 'Guía' };
    if (this.language === 'US') {
      newKeys =  { orderId: 'Order', sku: 'Sku', quantity: 'Quantity', tracking: 'Shipping Company', guide: 'Guide' };
    }

    for (let i = 0; i < res.length; i++) {
      res[i].tracking = null;
      res[i].guide = null;
      res[i] = this.renameKeys(res[i], newKeys);
    }
    this.exportAsExcelFile(res, this.languageService.instant('secure.load_guide_page.download_format.guide_format'));
  }

  /**
   * Método que permite renombrar los atributos del json obtenido. esto para que el
   * formato concuerde con el establecido para la carga de guías
   * @param {any} obj
   * @param {any} newKeys
   * @returns
   * @memberof DownloadFormatComponent
   */
  renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }


  /**
   * Creo el formulario para validar el input limit
   * @memberof DownloadFormatComponent
   */
  createForm() {
    this.myform = this.fb.group({
      'limit': [null, Validators.compose([Validators.required, Validators.min(1)])],
    });
  }

  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof DownloadFormatComponent
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
   * @memberof DownloadFormatComponent
   */
  s2ab(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    // tslint:disable-next-line:no-bitwise
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
    return buf;
  }

  /**
   * Método que permite generar el excel con los datos pasados.
   * @param {*} buffer
   * @param {string} fileName
   * @memberof DownloadFormatComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    // close modal
    this.onNoClick();
  }

}
