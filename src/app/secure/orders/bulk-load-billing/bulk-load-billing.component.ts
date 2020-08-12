import { Component, OnInit } from '@angular/core';
import { SearchFormEntity, InformationToForm, CommonService } from '@app/shared';
import { Subscription, Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

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
  showShowRecommendationsContainer= false;
  invalidsFile = true;
  prueba = [];
  errorePruebas: any;

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
    private service: CommonService,
    public snackBar: MatSnackBar,
    private languageService: TranslateService
  ) { }

  ngOnInit() {
  }

  public saveFile(): void {
    // if ((!this.lastInvalids || !this.lastInvalids.length) && this.files.length) {
      this.uploadFiles();
    // }
  }

   uploadFiles() {
    if (this.filesValidate && this.filesValidate.length > 0) {
      this.getBase64(this.filesValidate).subscribe(
        res => {
          setTimeout(() => {
            console.log(this.prueba);
          }, 5000 );
        }
      );
        // this.getBase64(this.filesValidate).toPromise().then(data => {
        //   console.log(data);
        //   // const bodyToSend = {
        //   //     IdOrder: 1,
        //   //     Base64Pdf: data.slice(data.search('base64') + 7, data.length)
        //   //   };
        //   // this.prueba.push(bodyToSend);
        // });
  
      
    }
    // const lengthFiles = document.getElementById('pdf').getElementsByTagName('input')[0].files.length;
    // let file = document.getElementById('pdf').getElementsByTagName('input')[0].files[lengthFiles - 1];
    // console.log(this.files);
    // if (!file) {
    //   file = this.files[this.files.length - 1];
    // }
    // this.showProgress = true;
    // this.getBase64(file).then(data => {
    //   try {
   
    //     this.service.postBillOrders(bodyToSend).subscribe(result => {
    //       if (result.body.data) {
    //         // Success
    //         this.snackBar.open(result.body.message, this.languageService.instant('actions.close'), {
    //           duration: 3000,
    //         });
    //       } else {
    //         // Error
    //         this.snackBar.open(result.body.message, this.languageService.instant('actions.close'), {
    //           duration: 3000,
    //         });
    //       }
    //       this.showProgress = false;
    //     }, error => {
    //       // Error
    //       this.snackBar.open(this.languageService.instant('shared.components.load_file.snackbar_ko'), this.languageService.instant('actions.close'), {
    //         duration: 3000,
    //       });
    //       this.showProgress = false;
    //     });
    //   } catch (e) {
    //   }
    // });
  }

  public getBase64(files: any): any {
    // return new Promise((resolve, reject) => {
      return new Observable(observer => {
        files.forEach(file => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => this.prueba.push(reader.result);
         reader.onerror = error => this.errorePruebas(error);
      });
        observer.next(this.prueba);
      });
    //  resolve(this.prueba);
    // });
  }

  public getDate(): Date {
    return new Date();
  }

  public changeValue(files: any) {
    console.log(files);
    this.filesErrors = 0;
    files.forEach(file => {
      const size = parseFloat(((file.size) / 1024 / 1024).toFixed(3));
      if (size < 3.000) {
        file.refuse = false;
      } else {
        file.refuse = true;
        this.filesErrors ++;
      }
    });
   this.validateErrors();
    this.filesValidate = files;
  }

  clearListFiles() {
    this.files = [];
    this.filesValidate = [];
    this.file = [];
  }

  deleteFile(index: number, file: any) {
    if (file && file.refuse) {
      this.filesErrors --;
    }
    this.filesValidate.splice(index, 1);
    this.validateErrors();
  }

  showRecommendations(show: boolean) {
    this.showShowRecommendationsContainer = !show;
  }

  validateErrors() {
    if (this.filesErrors > 0) {
      this.invalidsFile = true;
    } else {
      this.invalidsFile = false;
    }
  }

}
