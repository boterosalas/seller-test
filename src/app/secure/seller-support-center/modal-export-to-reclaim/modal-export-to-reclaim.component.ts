import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '@app/store/store.service';
import { ConfigurationState } from '@app/store/configuration';
import { SellerSupportCenterService } from '../services/seller-support-center.service';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseDetailResponse } from '../models/case-detail-response.model';
import { Filter } from '@app/shared/components/case-filter/models/Filter';
import { DialogData } from '@app/secure/support-modal/support-modal.component';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';


@Component({
  selector: 'app-modal-export-to-reclaim',
  templateUrl: './modal-export-to-reclaim.component.html',
  styleUrls: ['./modal-export-to-reclaim.component.scss']
})
export class ModalExportToReclaimComponent implements OnInit, OnDestroy {

  filter: Filter = {
    CaseNumber: '',
    OrderNumber: null,
    ReasonPQR: null,
    Status: [],
    DateInit: '',
    DateEnd: '',
    SellerId: null
  };

  public form: FormGroup;
  InitialSubscription: Subscription;
  isAdmin: any;
  isShowFilter = false;
  isShowEmail = false;
  email: string;
  headerConfigurations: any;
  options: any;
  case$: Observable<any>;
  IsClickEnable = false;
  keywords = [];
  arraySellerId = [];
  seller: any;
  // Modelo de ultima respuesta
  public lastPost = [
    { valuePost: 1, name: this.translateService.instant('secure.parametize.support_claims-filter.sac_answer') },
    { valuePost: 2, name: this.translateService.instant('secure.parametize.support_claims-filter.seller_answer') }
  ];


  constructor(
    public translateService: TranslateService,
    public eventsSeller: EventEmitterSeller,
    private sellerSupportService: SellerSupportCenterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storeService?: StoreService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.getStatusCase();
    this.validateData();
    this.InitialSubscription = this.eventsSeller.eventSearchSellerModal.subscribe((seller: StoreModel) => {
      if (seller) {
        if (seller.IdSeller) {
          this.IsClickEnable = true;
          this.seller = seller;
        }
      }
    });
  }


  validateData() {
    if (this.data) {
      if (this.data.isAdmin) {
        this.isAdmin = this.data.isAdmin;
      }

      if (this.data.email) {
        this.email = this.data.email;
        this.form.controls['email'].setValue(this.email);
      }

    }
  }

  createForm() {
    this.form = new FormGroup({
      lastPost: new FormControl(''),
      importAll: new FormControl(''),
      dateInitial: new FormControl(''),
      dateFinal: new FormControl(''),
      status: new FormControl(''),
      email: new FormControl(''),
    });
  }

  getStatusCase() {
    this.storeService.getStateConfiguration().subscribe((res: ConfigurationState) => {
      const arrayLang = this.sellerSupportService.getListHeaderConfiguration();
      switch (res.language) {
        case 'ES':
          this.headerConfigurations = arrayLang[0].ES;
          break;

        case 'US':
          this.headerConfigurations = arrayLang[1].US;
          break;

        default:
          this.headerConfigurations = [];
      }
      this.options = res.statusCases;
      // this.case$ = this.sellerSupportService
      //   // .getCase(this.route.snapshot.paramMap.get('idCase'))
      //   .getCase(this.idDetail)
      //   // tslint:disable-next-line:no-shadowed-variable
      //   .pipe(map((res: CaseDetailResponse) => res.data));
    });
  }

  showFilter() {
    this.isShowFilter = !this.isShowFilter;
  }

  showEmailSend() {
    this.isShowEmail = !this.isShowEmail;
  }

  saveKeyword() {
    this.keywords.push(this.seller.Name);
    this.arraySellerId.push (this.seller.IdSeller);
    this.IsClickEnable = false;
    console.log(this.arraySellerId);
  }

  public deleteKeywork(indexOfValue: number): void {
    this.keywords.splice(indexOfValue, 1);
    this.arraySellerId.splice(indexOfValue, 1);
    // if (this.keywords.length < 1) {
    //     this.formBasicInfo.setErrors({ required: true });
    // }
}
  ngOnDestroy() {
    if (this.InitialSubscription) {
      this.InitialSubscription.unsubscribe();
      this.IsClickEnable = false;
    }
  }

}
