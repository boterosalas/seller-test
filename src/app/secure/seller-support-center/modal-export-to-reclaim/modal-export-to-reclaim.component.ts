import { Component, OnInit, Inject, OnDestroy, AfterViewInit } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { ModalExportReclaimService } from '../services/modal-export-reclaim.service';
import { LoadingService } from '@app/core';


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
  disabledButton = true;
  disabledCheckBox = true;
  clearSearch = false;
  valueCheck = false;

  public lastPost = [
    { valuePost: 1, name: this.translateService.instant('secure.parametize.support_claims-filter.sac_answer') },
    { valuePost: 2, name: this.translateService.instant('secure.parametize.support_claims-filter.seller_answer') }
  ];


  constructor(
    public translateService: TranslateService,
    public dialogRef: MatDialogRef<ModalExportToReclaimComponent>,
    public eventsSeller: EventEmitterSeller,
    private sellerSupportService: SellerSupportCenterService,
    private modalExportReclaimService: ModalExportReclaimService,
    private loadingService: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storeService?: StoreService,
    public snackBar?: MatSnackBar,
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
          this.clearSearch = false;
        }
      }
    });
  }


  validateData() {
    if (this.data) {
      if (this.data.isAdmin) {
        this.isAdmin = this.data.isAdmin;
      } else {
        this.valueCheck = true;
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
      importAll: new FormControl(this.valueCheck),
      dateInitial: new FormControl(''),
      dateFinal: new FormControl(''),
      status: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
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
    this.arraySellerId.push(this.seller.IdSeller);
    this.validateSendSeller();
    this.IsClickEnable = false;
    this.clearSearch = true;
  }


  deleteKeywork(indexOfValue: number): void {
    this.keywords.splice(indexOfValue, 1);
    this.arraySellerId.splice(indexOfValue, 1);
    this.validateSendSeller();
  }
  validateSendSeller() {
    if (this.arraySellerId.length > 0) {
      this.disabledButton = false;
    } else {
      this.disabledButton = true;
    }

  }

  sendExportReclain() {
    this.loadingService.viewSpinner();
    const arraySend = {
      dateInitial: '',
      dateFinal: '',
      status: '',
      lastPost: '',
      email: '',
      allSeller: '',
      sellers: []
    };
    if (this.form) {
      arraySend.dateInitial = this.form.controls['dateInitial'].value;
      arraySend.dateFinal = this.form.controls['dateFinal'].value;
      arraySend.status = this.form.controls['status'].value;
      arraySend.lastPost = this.form.controls['lastPost'].value;
      arraySend.email = this.form.controls['email'].value;
      arraySend.allSeller = this.form.controls['importAll'].value;
      arraySend.sellers = this.arraySellerId;
    }
    this.modalExportReclaimService.sendEmailExportReclaim(arraySend).subscribe((res: any) => {
      if (res) {
        if (res.errors && res.errors.length > 0) {
          this.snackBar.open(this.translateService.instant('secure.orders.send.error_ocurred_processing'), this.translateService.instant('actions.close'), {
            duration: 3000,
        });
        } else {
          this.snackBar.open(this.translateService.instant('secure.parametize.support_claims-filter.modal.export.confirmSend'), this.translateService.instant('actions.close'), {
            duration: 3000,
        });
        }
        this.loadingService.closeSpinner();

      this.dialogRef.close();
      } else {
        this.loadingService.closeSpinner();
        this.snackBar.open(this.translateService.instant('secure.orders.send.error_ocurred_processing'), this.translateService.instant('actions.close'), {
        duration: 3000,
      });
      this.dialogRef.close();
      }
    });
  }
  clearSellerSearch(value: any) {
    this.valueCheck = value;
    if (this.valueCheck === true) {
      this.clearSearch = true;
      this.keywords = [];
      this.arraySellerId = [];
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.InitialSubscription) {
      this.InitialSubscription.unsubscribe();
      this.IsClickEnable = false;
    }
  }
}
