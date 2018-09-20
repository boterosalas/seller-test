import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Logger, UserParametersService } from '@app/core';
import { ComponentsService } from '@app/shared';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { LoadGuideService } from '../load-guide.service';

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
    public userParams: UserParametersService
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
    this.loadGuide.downloadInformationForGuide(this.user, `?sellerId=${this.user.sellerId}&limit=${form.value.limit}`)
      .subscribe((res: Array<{}>) => {
        if (res.length > 0) {
          this.componentService.openSnackBar('Se ha descargado correctamente la información', 'Cerrar', 3000);
          // aplico el formato al json para los campos tracking y guide
          this.applyFormatToJson(res);
        } else {
          this.componentService.openConfirmAlert('No se han encontrado órdenes', '¿Quieres descargar el formato de envío vació?')
            .then(response => {
              if (response) {
                const emptyFile = [{
                  'Orden': undefined,
                  'Sku': undefined,
                  'Cantidad': undefined,
                  'Transportadora': undefined,
                  'Guía': undefined
                }];
                this.exportAsExcelFile(emptyFile, 'Formato de guías');
              }
            });
        }
      });
  }

  /**
   * Aplico el formato al json para los campos tracking y guide
   * @param {any} res
   * @memberof DownloadFormatComponent
   */
  applyFormatToJson(res) {

    const newKeys = { orderId: 'Orden', sku: 'Sku', quantity: 'Cantidad', tracking: 'Transportadora', guide: 'Guía' };
    for (let i = 0; i < res.length; i++) {
      res[i].tracking = null;
      res[i].guide = null;
      res[i] = this.renameKeys(res[i], newKeys);
    }
    this.exportAsExcelFile(res, 'Formato de guías');
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
