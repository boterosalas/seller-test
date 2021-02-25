import { Component, OnInit, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { EndpointService, LoadingService, Logger } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SellerService } from '../../seller.service';
import { HttpEvent } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { SupportService } from '@app/secure/support-modal/support.service';

const log = new Logger('ModalBulkloadAgreementComponent');

@Component({
  selector: 'app-modal-bulkload-agreement',
  templateUrl: './modal-bulkload-agreement.component.html',
  styleUrls: ['./modal-bulkload-agreement.component.scss']
})
export class ModalBulkloadAgreementComponent implements OnInit {

  public form: FormGroup;
  public uploadAgreementBtn = true;
  public clearTable = new EventEmitter<any>();

  accept = '*';
  files: File[] = [];
  filesExcel: File[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  httpEmitter: Subscription;
  httpEvent: HttpEvent<Event>;
  lastFileAt: Date;
  maxSize = 3145728;
  lastInvalids: any;
  dataToSend: any;
  showProgress = false;
  validComboDrag = true;
  validComboDragExcel = true;
  dragFiles = true;
  file = null;
  fileExcel = true;
  arraySend = [];

  public agreementRegex = {
    number: '',
  };

  disableSend = false;

  public urlDownloadFile: string;
  public limitRowExcel: number;

  public arrayNecessaryData: Array<any>;
  public iVal: any;
  public fileName: any;
  public fileSize: any;

  /* Input file que carga el archivo*/
  @ViewChild('fileUploadOption') inputFileUpload: any;

  constructor(
    public dialogRef: MatDialogRef<ModalBulkloadAgreementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    public componentService: ComponentsService,
    private api: EndpointService,
    private languageService: TranslateService,
    private sellerService: SellerService,
    private shellComponent: ShellComponent,
    private loadingService: LoadingService,
    public SUPPORT: SupportService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.validateFormSupport();
    this.urlDownloadFile = this.api.get('uploadMassiveAgreementSellers');
  }

  /**
   * Metodo para crear formulario
   * @memberof ModalBulkloadAgreementComponent
   */
  createForm() {
    this.form = new FormGroup({
      typeAgreement: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  /**
   * Funcion para cerrar modal
   * @memberof ModalBulkloadAgreementComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Funcion para pasar a 64 el archivo PDF y poder enviarlo al servicio
   * @param {*} file
   * @returns {*}
   * @memberof ModalBulkloadAgreementComponent
   */
  public getBase64(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  readFileUpload(evt: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let data: any;
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { raw: true, type: 'binary', sheetRows: this.limitRowExcel });
          let ws: XLSX.WorkSheet;
          if (wb.Sheets && wb.Sheets['Hoja1']) {
            ws = wb.Sheets['Hoja1'];
          }
          /* save data */
          if (ws && ws !== null && ws !== undefined) {
            data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
            log.debug(data);
            resolve(data);
          } else {
            reject(e);
          }
        } catch (e) {
          log.info(e);
          reject(e);
        }
      };
      reader.readAsBinaryString(target.files[0]);
    });
  }

  validateDataFromFile(res: any, file: any) {
    if (res.length > 1) {
      let contEmptyRow = 0;
      /*Se hace iteración en todas las filas del excel*/
      for (let i = 0; i < res.length; i++) {
        /*Se crea un nuevo objeto por cada fila que traiga el excel*/
        this.arrayNecessaryData.push([]);
        /*Se hace iteración en todas las columnas que tenga una fila del excel*/
        for (let j = 0; j < res[0].length; j++) {
          /*Se valida si la primera celda de cada columna si tenga dato, si no tiene no se tendra en cuenta*/
          if (res[0][j] !== '' && res[0][j] !== null && res[0][j] !== undefined) {
            /*Se insertan los datos de la celda en el objeto creato anteriormente dentro del arreglo de datos necesarios, solo si el la primera celda de toda la columna trae datos*/
            this.arrayNecessaryData[i].push(res[i][j]);
          }
        }
      }

      /*Constante para almacenar cuantas columnas tienes el archivo de excel*/
      const numCol: any = this.arrayNecessaryData[0].length;

      /*Se hace iteración en el arreglo dependiendo del número de filas*/
      for (let i = 0; i < this.arrayNecessaryData.length; i++) {
        /*Variable para contar cuantas celdas vacias tiene una fila*/
        let contEmptycell = 0;
        /*Variable para decir si una fila esta vacia*/
        let rowEmpty = false;

        /*Iteracion de 0 hasta el número de columnas */
        for (let j = 0; j < numCol; j++) {
          /*Validación para saber si una celda esta vacia*/
          if (this.arrayNecessaryData[i][j] === undefined || this.arrayNecessaryData[i][j] === null ||
            this.arrayNecessaryData[i][j] === ' ' || this.arrayNecessaryData[i][j] === '') {
            /*Si hay celdas vacias se empiezan a contar*/
            contEmptycell += 1;
            /*Validación si el número de celdas vacias es igual al número de columnas*/
            if (contEmptycell === numCol) {
              /*Se empiezan a contar las filas vacias*/
              contEmptyRow += 1;
              /*Se confirma que hay una fila vacia*/
              rowEmpty = true;
            }
          }
        }
        /*Validación si hay fila vacia */
        if (rowEmpty) {
          /*Si hay fila vacia esta se remueve y se devuelve la iteración un paso */
          this.arrayNecessaryData.splice(i, 1);
          i--;
        }
      }
      /*
      * if valido si el excel solo trae 2 registros y hay 1 vacio
      * else if se valida que el documento tenga en los titulos o primera columna nos datos ID vendedor
      * else si no lo tiene significa que el formato es invalido y manda un error*/
      if ((res.length - contEmptyRow) === 1) {
        this.loadingService.closeSpinner();
        this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
      } else {
        if (this.arrayNecessaryData[0].includes('ID vendedor')) {
          this.iVal = {
            iNombreMarca: this.arrayNecessaryData[0].indexOf('ID vendedor'),
          };
        }
        this.fileName = file.target.files[0].name;
        this.fileSize = file.target.files[0].size;
        this.fileExcel = false;
        this.validateDataRegex();
      }
    } else {
      this.loadingService.closeSpinner();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
    }
  }

  /**
   * Recorrer arreglo y validar formato numerico
   * @memberof ModalBulkloadAgreementComponent
   */
  validateDataRegex() {
    let copyArrSellers = this.arrayNecessaryData;
    copyArrSellers.splice(0, 1);
    copyArrSellers.forEach(el => {
      if (el[0].match(this.agreementRegex.number)) {
        this.disableSend = true;
      } else {
        this.disableSend = false;
        this.componentService.openSnackBar('Formato inválido ID vendedor', this.languageService.instant('actions.accpet_min'), 4000);
      }
    });
  }

  sendImportAgreement() {
    this.loadingService.viewSpinner();
    const lengthFiles = document.getElementById('pdf').getElementsByTagName('input')[0].files.length;
    let file = document.getElementById('pdf').getElementsByTagName('input')[0].files[lengthFiles - 1];
    if (!file) {
      file = this.files[this.files.length - 1];
    }
    console.log('this.files: ', this.files);
    this.getBase64(file).then(data => {
      try {
        const bodyToSend = {
          fileAgreement: data.slice(data.search('base64') + 7, data.length),
          typeContracts: this.form.controls.typeAgreement.value,
          name: this.form.controls.description.value,
          sellers: this.arraySend,
          applyAllSeller: this.data.selectAll
        };
        console.log(bodyToSend);
        // this.sellerService.registersContract(bodyToSend).subscribe((result: any) => {
        //   this.loadingService.closeSpinner();
        //   if (result.statusCode === 200) {
        //     const dataRes = JSON.parse(result.body).Data;
        //     if (dataRes) {
        //       this.componentService.openSnackBar(this.languageService.instant('secure.load_guide_page.finish_upload_info.title'), this.languageService.instant('actions.close'), 5000);
        //       this.dialogRef.close(false);
        //       this.shellComponent.eventEmitterOrders.getClear();
        //     } else {
        //       this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.close'), 5000);
        //     }
        //   } else {
        //     this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.close'), 5000);
        //   }
        // });
      } catch (e) {
        log.error(this.languageService.instant('shared.components.load_file.snackbar_error'), e);
      }
    });

  }

  public getDate(): Date {
    return new Date();
  }

  validateOneFile() {
    this.uploadAgreementBtn = false;
  }

  validateFormatInvalidate(validate: any) {
    this.uploadAgreementBtn = true;
  }

  resetVariableUploadFile() {
    this.fileName = '';
    this.arrayNecessaryData = [];
  }

  resetUploadFIle() {
    this.inputFileUpload.nativeElement.value = '';
  }

  onFileChange(evt: any) {
    /*1. Limpio las variables empleadas en el proceso de carga.*/
    this.resetVariableUploadFile();
    /*2. Capturo los datos del excel*/
    this.readFileUpload(evt).then(data => {
      /*3. Valido los datos del excel*/
      this.validateDataFromFile(data, evt);
      this.resetUploadFIle();
    }, err => {
      this.loadingService.closeSpinner();
      this.resetVariableUploadFile();
      this.resetUploadFIle();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.accpet_min'), 4000);
    });
  }


  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataRegex = JSON.parse(res.body.body);
      dataRegex = dataRegex.Data.filter(data => data.Module === 'transversal' || data.Module === 'productos');
      for (const val in this.agreementRegex) {
        if (!!val) {
          const element = dataRegex.find(regex => regex.Identifier === val.toString());
          this.agreementRegex[val] = element && `${element.Value}`;
        }
      }
    });
  }

  sendMassiveAgreement() {
    console.log(11, this.arrayNecessaryData);
    this.sendImportAgreement();
  }
}
