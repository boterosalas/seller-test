import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '@app/store/store.service';
import { ConfigurationState } from '@app/store/configuration';
import { Observable, Subscription } from 'rxjs';
import { Filter } from '@app/shared/components/case-filter/models/Filter';
import { MatSnackBar } from '@angular/material';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { LoadingService } from '@app/core';
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
  selectSeller = false;

  optionsCheck = []


  constructor(
    public translateService: TranslateService,
    public eventsSeller: EventEmitterSeller,
    private sellerSupportService: SellerSupportCenterService,
    private loadingService: LoadingService,
    private storeService?: StoreService,
    public snackBar?: MatSnackBar,
    public SUPPORT?: SupportService,
    private profileService?: MyProfileService,
    private _sellerContactService?: SellerContactsService
  ) { }

  ngOnInit() {

    this.createForm();
    this.getStatusCase();
    this.getAllDataUser();
    this.optionsContact();
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

  public optionsContact() {
    this.loadingService.viewSpinner();
    this._sellerContactService.getListContacts().subscribe(resp => {
      let object =  JSON.parse(resp.body);
      this.optionsCheck = object.Data;
      console.log(this.optionsCheck);
      this.loadingService.closeSpinner();
    })
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

  /**
   * Funcion para mostrar los filtros 
   */

  showFilter() {
    this.isShowFilter = true;
    this.selectSeller = true;
    this.nameLists = [];
    this.optionsContact();
  
  }

  /**
   * funcion para mostar el email
   */

  showEmailSend() {
    this.isShowEmail = !this.isShowEmail;
  }

  /**
   * funcion para agregar los seller id
   */

  saveKeyword() {
    this.keywords.push(this.seller.Name);
    this.arraySellerId.push(this.seller.IdSeller);
    this.validateSendSeller();
    this.IsClickEnable = false;
    this.clearSearch = true;
  }

  /**
   * 
   * @param indexOfValue posicion del arreglo
   * Funcion para eliminar los seller id
   */

  deleteKeywork(indexOfValue: number): void {
    this.keywords.splice(indexOfValue, 1);
    this.arraySellerId.splice(indexOfValue, 1);
    this.validateSendSeller();
  }

  /**
   * metodo para activar el boton
   */
  
  validateSendSeller() {
    if (this.arraySellerId.length > 0) {
      this.disabledButton = false;
    } else {
      this.disabledButton = true;
    }

  }

  /**
   * 
   * @param e valor del check
   * funcion para agregar el listado de los filtros
   */

  addFilter(e:any){
    if(e.checked){
      this.nameLists.push(e.NameList)
    } else {
      this.nameLists.forEach((element, i) => {
        if(element === e.NameList) {
          this.nameLists.splice(i, 1);
        }
      });
    }
  }

  /**
   * funcion para exportar los contactos
   */

  sendExportContacts() {

    this.loadingService.viewSpinner();

    const arraySend = {
      email: '',
      sellers: [],
      nameLists: []
    };
    
    if (this.form) {
      arraySend.email = this.form.controls['email'].value;
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

  /**
   * funcion para limpiar los campos 
   */

  clearSellerSearch() {
    this.valueCheck = true;
    this.isShowFilter = false;
    this.selectSeller = false;
    if (this.valueCheck === true) {
      this.clearSearch = true;
      this.keywords = [];
      this.arraySellerId = [];
      this.nameLists = [];
    }
  }

  ngOnDestroy() {
    if (this.InitialSubscription) {
      this.InitialSubscription.unsubscribe();
      this.IsClickEnable = false;
    }
  }
}
