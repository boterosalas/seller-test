import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SearchFormEntity, InformationToForm, CommonService } from '@app/shared';
import { Subscription, Observable, timer, Subject } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { BulkLoadBillingService } from './bulk-load-billing.service';
import { result } from 'lodash';

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
  arrayListFilesBase64Name = [];
  arrayFilesErrors: any;

  arrayFilesBase64: any;

  processFinish$ = new Subject<any>();

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
    private languageService: TranslateService,
    private cdr: ChangeDetectorRef,
    private bulkLoadBillingService: BulkLoadBillingService
  ) { }

  ngOnInit() {
  }

  public saveFile(): void {
    // if ((!this.lastInvalids || !this.lastInvalids.length) && this.files.length) {
      this.uploadFiles();
      
    // }
  }

  async uploadFiles() {
    this.arrayListFilesBase64Name = [];
    this.arrayFilesBase64 = await this.getBase64(this.filesValidate).then(res => {
      setTimeout(() => {
        this.bulkLoadBillingService.sendBulkLoadBilling(res).subscribe( (results: any) => {
          console.log(results);
        });
      }, 1000);
    });

  }



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
              Base64Pdf:  base64File.slice(base64File.search('base64') + 7, base64File.length)
            };
            this.arrayListFilesBase64Name.push(bodyToSend);
         };
         reader.onerror = error => this.arrayFilesErrors(error);
      });
        resolve(this.arrayListFilesBase64Name);
    });

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
