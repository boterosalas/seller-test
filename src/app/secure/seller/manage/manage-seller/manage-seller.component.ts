/* 3rd party components */
import { Component, OnInit } from '@angular/core';
/* our own custom components */
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '@app/secure/seller/register/register.component';
import { LoadingService, ModalService, Logger, UserLoginService, UserParametersService } from '@app/core';
import { ManageSellerService } from './../manage.service';
import { isEmpty } from 'lodash';
import { RegisterService } from '@app/secure/seller/register/register.service';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';

const log = new Logger('ManageSellerComponent');

/**
 *
 *
 * @export
 * @class ManageSellerComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-manage-seller',
  templateUrl: './manage-seller.component.html',
  styleUrls: ['./manage-seller.component.scss']
})

export class ManageSellerComponent implements OnInit {

  public imagesRegister: Array<any> = [
    {
      checked: '../../../../../assets/seller-register/logo_exito_check.jpg',
      unchecked: '../../../../../assets/seller-register/logo_exito.jpg'
    },
    {
      checked: '../../../../../assets/seller-register/logo_carulla_check.jpg',
      unchecked: '../../../../../assets/seller-register/logo_carulla.jpg'
    },
    {
      checked: '../../../../../assets/seller-register/logo_mis_catalogos_check.jpg',
      unchecked: '../../../../../assets/seller-register/logo_mis_catalogos.jpg'
    }
  ];

  public emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]?(?:[a-zA-Z0-9-]{0,}[a-zA-Z0-9]+\.)+[a-z]{2,}$/;
  public nameStoreRegex = /^((?!\.com$)(?!\.co$)(?!\.net$)(?!\.net.$)(?!\.gov$)(?! gov$)(?!\.edu$)(?! S.A.S$)(?! S.A$)(?! SA$)(?! SAS$)(?! s.a.s$)(?! sa.s$)(?! s.as$)(?! sas$)(?! s.a.$)(?! S.a.S$)(?! s.a.S$)(?! s.a$)(?! S.a.$)(?! LTDA$)(?! ltda$)(?! Ltda$)(?! LTDA.$)(?! ltda.$)(?! lTDA$)(?! ltDA$)(?! ltdA$)(?! lTda$)(?! ltDa$)(?! lTDa$)(?! LTda$)(?! LtDa$)(?! \s+|\s+$).)*$/;

  public matcher: MyErrorStateMatcher;
  public validateFormRegister: FormGroup;

  public nit: FormControl;
  public rut: FormControl;
  public contactName: FormControl;
  public email: FormControl;
  public phoneNumber: FormControl;
  public address: FormControl;
  public state: FormControl;
  public city: FormControl;
  public daneCode: FormControl;
  public sincoDaneCode: FormControl;
  public name: FormControl;
  public isLogisticsExito: FormControl;
  public isShippingExito: FormControl;
  public gotoExito: FormControl;
  public gotoCarrulla: FormControl;
  public gotoCatalogo: FormControl;

  // variable que almacena el nombre de la tienda seleccionada
  public currentSellerSelect: StoreModel;
  // Información del usuario
  public user: any;

  public activeButton: boolean;
  public existValueInDB: boolean;
  public idState: number;
  public disabledForService: boolean;
  public noValidateData: any;
  public elementStateLoad: string;
  public elementCityLoad: string;
  public firstEmit = true;
  public idSeller: string;

  /**
   * Creates an instance of ManageSellerComponent.
   * @param {EventEmitterSeller} eventsSeller
   * @param {StoresService} storeService
   * @param {LoadingService} loadingService
   * @param {ManageSellerService} manageSeller
   * @param {ModalService} modalService
   * @param {RegisterService} registerService
   * @memberof ManageSellerComponent
   */
  constructor(
    public eventsSeller: EventEmitterSeller,
    public storeService: StoresService,
    private loadingService: LoadingService,
    private manageSeller: ManageSellerService,
    private modalService: ModalService,
    private registerService: RegisterService,
    public userService: UserLoginService,
    private router: Router,
    public userParams: UserParametersService
  ) {
    this.matcher = new MyErrorStateMatcher();
    this.currentSellerSelect = new StoreModel(0, '');
    this.user = {};
    this.activeButton = true;
  }

  /**
   *
   *
   * @memberof ManageSellerComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
    this.createFormControls();
    // EventEmitter que permite saber cuando el usuario a buscado una tienda
    this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      this.elementStateLoad = null;
      this.elementCityLoad = null;
      if (!isEmpty(seller)) {
        this.idSeller = seller.IdSeller;
        this.firstEmit = true;
        this.manageSeller.getSpecificSeller(seller.IdSeller, '1').subscribe((res: any) => {
          if (res.status === 200) {
            const body = JSON.parse(res.body.body);
            this.currentSellerSelect = body.Data;
            this.nit.setValue(this.currentSellerSelect.Nit);
            this.rut.setValue(this.currentSellerSelect.Rut);
            this.contactName.setValue(this.currentSellerSelect.ContactName);
            this.email.setValue(this.currentSellerSelect.Email);
            this.phoneNumber.setValue(this.currentSellerSelect.PhoneNumber);
            this.state.setValue(this.currentSellerSelect.State);
            this.city.setValue(this.currentSellerSelect.City);
            this.address.setValue(this.currentSellerSelect.Address);
            this.daneCode.setValue(this.currentSellerSelect.DaneCode);
            this.sincoDaneCode.setValue(this.currentSellerSelect.SincoDaneCode);
            this.name.setValue(this.currentSellerSelect.Name);
            this.isLogisticsExito.setValue(this.currentSellerSelect.IsLogisticsExito);
            this.isShippingExito.setValue(this.currentSellerSelect.IsShippingExito);
            this.gotoExito.setValue(this.currentSellerSelect.GotoExito);
            this.gotoCarrulla.setValue(this.currentSellerSelect.GotoCarrulla);
            this.gotoCatalogo.setValue(this.currentSellerSelect.GotoCatalogo);
            this.noValidateData = Object.assign({}, {
              email: this.currentSellerSelect.Email,
              name: this.currentSellerSelect.Name
            });
            this.elementStateLoad = this.currentSellerSelect.State;
            this.elementCityLoad = this.currentSellerSelect.City;
          }
        });
      }
    });
  }

  /**
   *
   *
   * @memberof ManageSellerComponent
   */
  createFormControls() {
    this.nit = new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern('^[0-9]*$')
    ]);
    this.rut = new FormControl
      ('', [Validators.required,
      Validators.maxLength(20),
      Validators.pattern('^[0-9]*$')
      ]);
    this.contactName = new FormControl
      ('', [Validators.required,
      Validators.pattern('^[0-9A-Za-zá é í ó ú ü ñ  à è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ  À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$')
      ]);
    this.email = new FormControl
      ('', [Validators.required,
      Validators.pattern(this.emailRegex)
      ]);
    this.phoneNumber = new FormControl
      ('', [Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$')]);
    this.address = new FormControl
      ('', [Validators.required]);
    this.state = new FormControl();
    this.city = new FormControl();
    this.daneCode = new FormControl();
    this.sincoDaneCode = new FormControl();
    this.name = new FormControl
      ('', [Validators.required,
      Validators.pattern(this.nameStoreRegex)]);
    this.isLogisticsExito = new FormControl();
    this.isShippingExito = new FormControl();
    this.gotoExito = new FormControl();
    this.gotoCarrulla = new FormControl();
    this.gotoCatalogo = new FormControl();
    this.createForm();
  }

  /**
   *
   *
   * @memberof ManageSellerComponent
   */
  createForm() {

    this.validateFormRegister = new FormGroup({
      Nit: this.nit,
      Rut: this.rut,
      ContactName: this.contactName,
      Email: this.email,
      PhoneNumber: this.phoneNumber,
      Address: this.address,
      State: this.state,
      City: this.city,
      DaneCode: this.daneCode,
      SincoDaneCode: this.sincoDaneCode,
      Name: this.name,
      IsLogisticsExito: this.isLogisticsExito,
      IsShippingExito: this.isShippingExito,
      GotoExito: this.gotoExito,
      GotoCarrulla: this.gotoCarrulla,
      GotoCatalogo: this.gotoCatalogo
    });
  }

  /**
   * @method keyPress que permite solo el ingreso de números
   * @param event
   * @memberof RegisterSellerComponent
   */
  keyPress(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /**
   *
   * @method Metodo para validar si existe el parametro despues de cambiar el focus del input
   * @param {*} event
   * @memberof RegisterSellerComponent
   */
  validateExist(event: any, param: string): void {
    const jsonExistParam = event.target.value;
    if (jsonExistParam !== '' && jsonExistParam !== '' && jsonExistParam !== undefined && jsonExistParam !== null) {
      this.loadingService.viewSpinner();
      this.activeButton = false;
      this.registerService.fetchData(JSON.parse(JSON.stringify(jsonExistParam.replace(/\ /g, '+'))), param)
        .subscribe(
          (result: any) => {
            if (result.status === 200) {
              const data_response = JSON.parse(result.body.body);
              this.existValueInDB = data_response.Data;
              switch (param) {
                case 'Email':
                  if (this.existValueInDB && jsonExistParam !== this.noValidateData.email) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistEmailDB': data_response.Data });
                  }
                  break;
                case 'Name':
                  if (this.existValueInDB && jsonExistParam !== this.noValidateData.name) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNameDB': data_response.Data });
                  }
                  break;
              }
              if (!this.existValueInDB) {
                this.activeButton = true;
              }
              this.activeButton = true;
              this.loadingService.closeSpinner();
            } else {
              this.modalService.showModal('errorService');
              this.activeButton = true;
              this.loadingService.closeSpinner();
            }
          }
        );
    }
  }

  /**
   * @method receiveDataState Metodo para obtener la data de departamento.
   * @param
   * @memberof RegisterSellerComponent
   */
  receiveDataState($event: any): void {
    if ($event && $event !== undefined && $event !== null) {
      this.idState = $event.Id;
      this.validateFormRegister.controls['State'].setValue($event.Name);
      if (!this.firstEmit) {
        this.validateFormRegister.controls['City'].setValue('');
        this.validateFormRegister.controls['DaneCode'].setValue(null);
      }
      this.firstEmit = false;
    }
  }


  /**
   * @method receiveDataCitie Metodo para obtener la data de la ciudad.
   * @param
   * @memberof RegisterSellerComponent
   */
  receiveDataCitie($event: any): void {
    if ($event && $event !== undefined && $event !== null) {
      this.validateFormRegister.controls['DaneCode'].setValue($event.DaneCode);
      this.validateFormRegister.controls['City'].setValue($event.Name);
      this.validateFormRegister.controls['SincoDaneCode'].setValue($event.SincoDaneCode);
    }
  }

  submitUpdateSeller(): void {
    if (this.validateFormRegister.valid) {
      this.loadingService.viewSpinner();
      this.disabledForService = true;
      const values = this.validateFormRegister.value;
      values.id = this.idSeller;
      this.manageSeller.updateSeller(values).subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const data = JSON.parse(result.body.body);
            if (data.Data) {
              this.modalService.showModal('successUpdate');
            } else if (!data.Data) {
              this.modalService.showModal('error');
            }
          } else {
            this.modalService.showModal('errorService');
          }

          this.disabledForService = false;
          this.loadingService.closeSpinner();

        }
      );
    }
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
    } else if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    }
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
    }
  }

  /**
   * Function to capitalize a string
   * @param value
   */
  public capitalizeName(value: string): string {
    if (!value) {
      return null;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}