import { Component, OnInit, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '@app/store/store.service';
import { ConfigurationState } from '@app/store/configuration';
import { Observable, of, Subscription } from 'rxjs';
import { Filter } from '@app/shared/components/case-filter/models/Filter';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { LoadingService } from '@app/core';
import { DatePipe } from '@angular/common';
import { SupportService } from '@app/secure/support-modal/support.service';
import { SellerSupportCenterService } from '@app/secure/seller-support-center/services/seller-support-center.service';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { SellerContactsService } from './seller-contacts.service';
@Component({
  selector: 'app-seller-contacts',
  templateUrl: './seller-contacts.component.html',
  styleUrls: ['./seller-contacts.component.scss']
})
export class SellerContactsComponent implements OnInit , OnDestroy {

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
  sellerId: any;
  headerConfigurations: any;
  options: any;
  case$: Observable<any>;
  IsClickEnable = false;
  keywords = [];
  arraySellerId = [];
  nameLists = [];
  seller: any;
  disabledButton = true;
  disabledCheckBox = true;
  clearSearch = false;
  valueCheck = false;
  getClassification = [];

  optionsCheck = [
    {name:'Gerente general', checked:false},
    {name:'Comercial y ventas', checked:false},
    {name:'Operaciones y logística', checked:false},
    {name:'Contenido', checked:false},
    {name:'Reclamaciones y devoluciones', checked:false},
    {name:'Pagos y facturación', checked:false},
    {name:'Mercadeo', checked:false},
  ]


  constructor(
    public translateService: TranslateService,
    public eventsSeller: EventEmitterSeller,
    private sellerSupportService: SellerSupportCenterService,
    private loadingService: LoadingService,
    private storeService?: StoreService,
    public snackBar?: MatSnackBar,
    private formatDate?: DatePipe,
    public SUPPORT?: SupportService,
    private profileService?: MyProfileService,
    private _sellerContactService?: SellerContactsService
  ) { }

  ngOnInit() {

    this.SUPPORT.getListClassification().subscribe( resp => {
      this.getClassification = resp.data;
    });

    this.createForm();
    this.getStatusCase();
    this.getAllDataUser();
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

   /**
   * Metodo para obtener información del usuario logueado
   * @memberof ListOfCaseComponent
   */
    async getAllDataUser() {
      this.loadingService.viewSpinner();
      const sellerData = await this.profileService.getUser().toPromise().then(res => {
        const body: any = res.body;
        const response = JSON.parse(body.body);
        const userData = response.Data;
        this.sellerId = userData.IdSeller;
        this.email = userData.Email;
        this.form.controls['email'].setValue(this.email);
        localStorage.setItem('typeProfile', userData.Profile);
        if (userData.Profile !== 'seller' && userData.Profile && userData.Profile !== null) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
        this.loadingService.closeSpinner();
        return userData;
      });
    }

  createForm() {
    this.form = new FormGroup({
      importAll: new FormControl(this.valueCheck),
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
    this.isShowFilter = true;
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

  addFilter(e:any){
    if(e.checked){
      this.nameLists.push(e.name)
    } else {
      this.nameLists.forEach((element, i) => {
        if(element === e.name) {
          this.nameLists.splice(i, 1);
        }
      });
    }
  }

  sendExportReclain() {

    // this.loadingService.viewSpinner();

    const arraySend = {
      email: '',
      allSeller: '',
      sellers: [],
      nameLists: []
    };
    
    if (this.form) {
      arraySend.email = this.form.controls['email'].value;
      arraySend.allSeller = this.form.controls['importAll'].value;
      arraySend.sellers = this.arraySellerId;
      arraySend.nameLists = this.nameLists;
    }

    this._sellerContactService.sendEmailExportContacts(arraySend).subscribe((res: any) => {
      if (res) {
        if (res.errors && res.errors.length > 0) {
          this.snackBar.open(this.translateService.instant('secure.orders.send.error_ocurred_processing'), this.translateService.instant('actions.close'), {
            duration: 3000,
        });
        } else {
          this.snackBar.open(this.translateService.instant('Los contactos se han enviado de manera correcta al correo solicitado'), this.translateService.instant('actions.close'), {
            duration: 3000,
        });
        }
        this.loadingService.closeSpinner();

      
      } else {
        this.loadingService.closeSpinner();
        this.snackBar.open(this.translateService.instant('secure.orders.send.error_ocurred_processing'), this.translateService.instant('actions.close'), {
        duration: 3000,
      });
      
      }
    });

  }

  clearSellerSearch(value: any) {
    this.valueCheck = value;
    this.isShowFilter = false;
    if (this.valueCheck === true) {
      this.clearSearch = true;
      this.keywords = [];
      this.arraySellerId = [];
    }
  }

  ngOnDestroy() {
    if (this.InitialSubscription) {
      this.InitialSubscription.unsubscribe();
      this.IsClickEnable = false;
    }
  }
}
