import { Component, OnInit } from '@angular/core';
import { SearchFormEntity, InformationToForm, CommonService } from '@app/shared';
import { Subscription } from 'rxjs';
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
    if ((!this.lastInvalids || !this.lastInvalids.length) && this.files.length) {
      this.uploadFiles();
    }
  }

  public uploadFiles(): void {
    const lengthFiles = document.getElementById('pdf').getElementsByTagName('input')[0].files.length;
    let file = document.getElementById('pdf').getElementsByTagName('input')[0].files[lengthFiles - 1];
    console.log(this.files);
    // if (!file) {
    //   file = this.files[this.files.length - 1];
    // }
    // this.showProgress = true;
    // this.getBase64(file).then(data => {
    //   try {
    //     const bodyToSend = {
    //       IdOrder: this.dataToSend.body.id,
    //       Base64Pdf: data.slice(data.search('base64') + 7, data.length)
    //     };
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

  public getBase64(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  public getDate(): Date {
    return new Date();
  }

}
