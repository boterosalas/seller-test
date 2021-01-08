import { Component, OnInit } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { Subscription } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { BulkLoadBillingService } from './bulk-load-billing.service';
import { LoadingService } from '@app/core';
import { FinishUploadInformationComponent } from '@app/secure/offers/bulk-load/finish-upload-information/finish-upload-information.component';


@Component({
  selector: 'app-bulk-load-billing',
  templateUrl: './bulk-load-billing.component.html',
  styleUrls: ['./bulk-load-billing.component.scss']
})
export class BulkLoadBillingComponent implements OnInit {


  accept = '*';
  files: File[] = [];
  filesValidate: File[] = [];
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
  dragFiles = true;
  file = null;
  filesErrors = 0;
  filesSuccess = 0;
  showShowRecommendationsContainer = true;
  invalidsFile = true;
  arrayListFilesBase64Name = [];
  arrayFilesErrors: any;
  arrayFilesBase64: any;
  sendableFormData: FormData;
  messageErrorMaxSize = this.languageService.instant('secure.orders.bulk.billing.maximum_file_size_megabytes') + ' 3.000 ' + this.languageService.instant('secure.orders.bulk.billing.megabytes');
  countSizeFile = 0;
  typeFile= 0;
  allFileError: Boolean = false;

  public informationToForm: SearchFormEntity = {
    title: 'secure.orders.orders',
    subtitle: 'menu.Carga masiva de Facturas',
    btn_title: 'secure.billing.summaryPayment.search_summaryPayment',
    title_for_search: 'secure.billing.summaryPayment.search_summaryPayment',
    type_form: 'bulkLoadBillingOrders',
    information: new InformationToForm,
    count: null
  };
  constructor(
    public snackBar: MatSnackBar,
    private languageService: TranslateService,
    private bulkLoadBillingService: BulkLoadBillingService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() { }
  /**
   * funcion para guardar el listado de archivos pre-cargados
   *
   * @memberof BulkLoadBillingComponent
   */
  public saveFile(): void {
    this.uploadFiles();
  }

  /**
   * funcion para cargar varias facturas async
   *
   * @memberof BulkLoadBillingComponent
   */
  async uploadFiles() {
    this.arrayListFilesBase64Name = [];
    this.loadingService.viewSpinner();
    this.arrayFilesBase64 = await this.getBase64(this.filesValidate).then(res => {
      setTimeout(() => {
        this.bulkLoadBillingService.sendBulkLoadBilling(res).subscribe((results: any) => {
          if (results) {
            if (results.error > 0) {
              this.loadingService.closeSpinner();
              this.openModal(3, results.listError);
            } else {
              this.loadingService.closeSpinner();
              this.openModal(1, null);
            }
          } else {
              this.loadingService.closeSpinner();
              this.snackBar.open(this.languageService.instant('error'), this.languageService.instant('actions.close'), {
                duration: 3000,
              });
            }
          this.countSizeFile = 0;
        });
      }, 1000);
    });
  }


  /**
   * funcion para transformar un listado de archivos a base 64
   *
   * @param {*} files
   * @returns {Promise<any>}
   * @memberof BulkLoadBillingComponent
   */
  async getBase64(files: any): Promise<any> {
    return new Promise<any>(async (resolve) => {
      files.forEach(file => {
        let idOrder = '';
        if (file && file.name) {
          idOrder = file.name.split('.')[0];
        }
        let bodyToSend = {};
        let base64File = '';
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          base64File = (reader.result).toString();
          bodyToSend = {
            IdOrder: idOrder,
            Base64File: base64File.slice(base64File.search('base64') + 7, base64File.length),
            FileType: this.typeFile
          };
          this.arrayListFilesBase64Name.push(bodyToSend);
        };
        reader.onerror = error => this.arrayFilesErrors(error);
      });
      resolve(this.arrayListFilesBase64Name);
    });

  }

  /**
   * funcion para tomar la fecha actual
   *
   * @returns {Date}
   * @memberof BulkLoadBillingComponent
   */
  public getDate(): Date {
    return new Date();
  }
  /**
   * funcion para calcular el tamaño del archivo max 3 mb, cambiarlo y devolverlo para hacer la validacion
   *
   * @param {*} files
   * @memberof BulkLoadBillingComponent
   */
  public changeValue(files: any) {
    files.forEach(file => {
      const size = parseFloat(((file.size) / 1024 / 1024).toFixed(3));
      if (size < 3.000) {
        file.refuse = false;
      } else {
        file.refuse = true;
      }
      this.getExtensionFile(file.type);
      const isExist = this.filesValidate.find(x => x.name === file.name) !== undefined ? true : false;
      if (isExist) {
        file.fileExist = true;
      } else {
        file.fileExist = false;
      }

      if (file.fileExist || file.refuse) {
        this.filesErrors++;
      }

      if (!file.fileExist && !file.refuse) {
        this.filesSuccess++;
      }
      this.countSizeFile = this.countSizeFile + size;
      this.filesValidate.push(file);
    });
    this.calculateCount();
    this.validateErrors();
    this.files = [];
  }

  getExtensionFile(type: string){
    if(type) {
      switch (type) {
        case 'application/x-zip-compressed':
          this.typeFile = 2;
          break;
        case 'application/pdf':
          this.typeFile = 1;
          break;
      
        default:
          this.typeFile = 0;
          break;
      }
    }
  }

  /**
   * Función para validar que los archivos no superen el peso maximo de 7mb
   * @memberof BulkLoadBillingComponent
   */
  calculateCount() {
    if (this.countSizeFile > 7.000) {
      this.snackBar.open(this.languageService.instant('secure.orders.bulk.billing.maximum_All_file_size'), this.languageService.instant('actions.close'), {
        duration: 5000,
      });
      this.allFileError = true;
    } else {
      this.allFileError = false;
    }
  }
  /**
   * funcion para limpiar la lista de archivos
   *
   * @memberof BulkLoadBillingComponent
   */
  clearListFiles() {
    this.files = [];
    this.filesValidate = [];
    this.file = [];
    this.filesErrors = 0;
    this.filesSuccess = 0;
  }
  /**
   * funcion para eliminar un archivo de la lista antes de guardar
   *
   * @param {number} index
   * @param {*} file
   * @memberof BulkLoadBillingComponent
   */
  deleteFile(index: number, file: any) {
    const sizeFile = parseFloat(((file.size) / 1024 / 1024).toFixed(3));
    this.countSizeFile = this.countSizeFile - sizeFile;
    this.calculateCount();
    if (file && file.refuse || file.fileExist) {
      this.filesErrors--;
    }
    if (file && !file.refuse && !file.fileExist) {
      this.filesSuccess--;
    }
    this.filesValidate.splice(index, 1);
    this.validateErrors();
  }
  /**
   * funcion para mostrar/ocultar las recomendaciones
   *
   * @param {boolean} show
   * @memberof BulkLoadBillingComponent
   */
  showRecommendations(show: boolean) {
    this.showShowRecommendationsContainer = !show;
  }
  /**
   * funcion para validar los errores y habilitar el boton para guardar
   *
   * @memberof BulkLoadBillingComponent
   */
  validateErrors() {
    if (this.filesErrors > 0) {
      this.invalidsFile = true;
    } else {
      this.invalidsFile = false;
    }
  }
  /**
   * funcion para abrir el modal de carga de procesos y status
   *
   * @param {number} type
   * @param {*} listError
   * @memberof BulkLoadBillingComponent
   */
  openModal(type: number, listError: any) {
    this.loadingService.closeSpinner();
    const intervalTime = 6000;
    const data = {
      successText: this.languageService.instant('secure.products.Finish_upload_product_information.successful_upload'),
      failText: this.languageService.instant('secure.products.Finish_upload_product_information.error_upload'),
      processText: this.languageService.instant('secure.products.Finish_upload_product_information.upload_progress'),
      initTime: 500,
      intervalTime: intervalTime,
      listError: listError,
      typeStatus: type,
      showExport: false,
      responseDiferent : false
    };
    const dialog = this.dialog.open(FinishUploadInformationComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      disableClose: type === 1,
      data: data
    });
    const dialogIntance = dialog.componentInstance;
    dialogIntance.request = this.bulkLoadBillingService.verifyStatusBulkLoad();
    dialogIntance.processFinish$.subscribe((val) => {
      dialog.disableClose = false;
      this.clearListFiles();
    });
    dialog.afterClosed().subscribe(result => {
      this.clearListFiles();
    });
  }
}
