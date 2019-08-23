import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { LoadingService, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { UserInformation, RoutesConst } from '@app/shared';
import { RegisterService } from './register.service';
import { TestRequest } from '@angular/common/http/testing';
import { forEach } from '@angular/router/src/utils/collection';
import { MenuModel, createFunctionality, registerName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { Router } from '@angular/router';
import { trimField } from '@app/shared/util/validation-messages';
import { PayoneerService } from './payoneer.service';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { countries } from './countries';


// Error when invalid control is dirty, touched, or submitted.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [RegisterService]
})


export class RegisterSellerComponent implements OnInit {

  countries = countries;
  colombia = 'COLOMBIA';
  isColombiaSelect = true;
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

  sellerRegex = {
    phoneNumber: '',
    contactName: '',
    email: '',
    nameStore: '',
    integerNumber: '',
    internationalIdentifier: '',
    internationalPostalCode: '',
    payoneer: '',
    internationalLocation: '',
    warranty: ''
  };

  public values = '';
  public existValueInDB: boolean;
  public matcher: MyErrorStateMatcher;
  public validateFormRegister: FormGroup;
  public validateFormRegisterAdmin: FormGroup;
  public idState: number;
  public daneCode: any;
  public disabledForService: boolean;
  public user: UserInformation;
  public activeButton: boolean;
  public selectedValue: string;

  profileSeller: string[] = [];
  profileAdmin: string[] = [];


  // Variables con los permisos que este componente posee
  permissionComponent: MenuModel;
  create = createFunctionality;
  disabledComponent = false;

  constructor(
    private registerService: RegisterService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    public userService: UserLoginService,
    public userParams: UserParametersService,
    public authService: AuthService,
    private router: Router,
    private payoneerService: PayoneerService,
    private regexService: BasicInformationService
  ) { }

  /**
   * Funcion que verifica si la funcion del modulo posee permisos
   *
   * @param {string} functionality
   * @returns {boolean}
   * @memberof BulkLoadProductModerationComponent
   */
  public getFunctionality(functionality: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
  }

  /**
   * Agregar FormBuilder y cambiar el formulario
   */
  ngOnInit() {
    this.getProfile();
    this.userService.isAuthenticated(this);
    this.permissionComponent = this.authService.getMenu(registerName);
    this.disabledComponent = !this.getFunctionality(this.create);
    this.initSellerForm(this.disabledComponent);
    this.matcher = new MyErrorStateMatcher();
    this.initAdminForm();
    this.getRegex();
  }

  getRegex() {
    this.regexService.getRegexInformationBasic(null).subscribe(res => {
      let dataSellerRegex = JSON.parse(res.body.body);
      dataSellerRegex = dataSellerRegex.Data.filter(data => data.Module === 'vendedores');
      for (const val in this.sellerRegex) {
        if (!!val) {
          const element = dataSellerRegex.find(regex => regex.Identifier === val.toString());
          this.sellerRegex[val] = element && `${element.Value}`;
        }
      }
      this.initAdminForm();
      this.initSellerForm(this.disabledComponent);
    });
  }

  initAdminForm() {
    this.validateFormRegisterAdmin = new FormGroup({
      Nit: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(this.sellerRegex.integerNumber)
      ]),
      Email: new FormControl
        ('', [Validators.required,
        Validators.pattern(this.sellerRegex.email)
        ]),
      Name: new FormControl
        ('', [
          Validators.required,
          trimField,
          Validators.pattern(this.sellerRegex.nameStore)
        ]),
      Profile: new FormControl
        (this.profileAdmin, [Validators.required]),
    });
    this.putValioationStoreNameInLowerCaseAdmin();
  }

  initSellerForm(disabledForm: boolean) {
    this.validateFormRegister = new FormGroup({
      Nit: new FormControl({ value: '', disabled: disabledForm }, [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(this.sellerRegex.integerNumber)
      ]),
      Rut: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required,
        Validators.maxLength(20),
        Validators.pattern(this.sellerRegex.integerNumber)
        ]),
      ContactName: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required,
        Validators.pattern(this.sellerRegex.contactName)
        ]),
      Email: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required,
        Validators.pattern(this.sellerRegex.email)
        ]),
      PhoneNumber: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required,
        Validators.maxLength(20),
          trimField,
        Validators.pattern(this.sellerRegex.phoneNumber)]),
      Address: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required, Validators.pattern(this.sellerRegex.internationalLocation)]),
      Country: new FormControl,
      State: new FormControl,
      City: new FormControl,
      DaneCode: new FormControl(Validators.pattern(this.sellerRegex.integerNumber)),
      SincoDaneCode: new FormControl(Validators.pattern(this.sellerRegex.integerNumber)),
      Name: new FormControl({ value: '', disabled: disabledForm }, [
        Validators.required,
        trimField,
        Validators.pattern(this.sellerRegex.nameStore)
      ]),
      Policy: new FormControl({ value: '', disabled: disabledForm }, [
        Validators.required,
        Validators.pattern(this.sellerRegex.warranty)
      ]),
      Payoneer: new FormControl({ value: '', disabled: this.isColombiaSelect }),
      IsLogisticsExito: new FormControl({ value: false, disabled: disabledForm }),
      IsShippingExito: new FormControl({ value: true, disabled: disabledForm }),
      GotoExito: new FormControl({ value: true, disabled: disabledForm }),
      GotoCarrulla: new FormControl({ value: false, disabled: disabledForm }),
      GotoCatalogo: new FormControl({ value: true, disabled: disabledForm }),
      Profile: new FormControl
        (this.profileSeller, [Validators.required]),
    });
    this.disabledFiledsSellerForm();
    this.addValidationsSellerForm();
    this.putColombiaByDefault();
    this.putValidationStoreNameInLowerCaseSeller();
  }

  putValidationStoreNameInLowerCaseSeller() {
    !!this.Name && this.Name.valueChanges.subscribe(val => {
      if (!!val) {
        const validate = val.toString().toLowerCase().trim().match(this.sellerRegex.nameStore);
        !validate && this.Name.setErrors({ pattern: true });
      }
    });
  }

  putValioationStoreNameInLowerCaseAdmin() {
    const adminName = !!this.validateFormRegisterAdmin && (this.validateFormRegisterAdmin.get('Name') as FormControl);
    !!adminName && adminName.valueChanges.subscribe(val => {
      if (!!val) {
        const validate = val.toString().toLowerCase().trim().match(this.sellerRegex.nameStore);
        !validate && adminName.setErrors({ pattern: true });
      }
    });
  }


  disabledFiledsSellerForm() {
    this.State.disable();
    this.City.disable();
    this.PostalCode.disable();
    this.PhoneNumber.disable();
    this.Nit.disable();
    this.Rut.disable();
  }

  addValidationsSellerForm() {
    this.Country.valueChanges.subscribe(val => {
      if (!!val) {
        this.isColombiaSelect = val === this.colombia;
      }
      this.State.reset({ value: '', disabled: false });
      const selectedCountry = this.countries.find(element => element.CountryName === val);
      this.PhoneNumber.reset({ value: selectedCountry.CountryIndicative, disabled: true });
      this.City.reset(null);
      this.PostalCode.reset(null);
      this.City.enable();
      this.PostalCode.enable();
      this.PhoneNumber.enable();
      this.Nit.reset({ value: null, disabled: false });
      this.Rut.enable();
      this.isColombiaSelect ? this.validationsForColombiaSelectSellerForm() : this.validationsForNotColombiaSelectSellerForm();
    });
  }

  validationsForNotColombiaSelectSellerForm() {
    this.Nit.setValidators(Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(this.sellerRegex.internationalIdentifier)]));
    this.Rut.setValidators(Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(this.sellerRegex.internationalIdentifier)]));
    this.State.setValidators(Validators.compose([Validators.required, Validators.maxLength(60), Validators.pattern(this.sellerRegex.internationalLocation)]));
    this.City.setValidators(Validators.compose([Validators.required, Validators.maxLength(60), Validators.pattern(this.sellerRegex.internationalLocation)]));
    this.PostalCode.setValidators(Validators.compose([Validators.required, Validators.maxLength(8), Validators.minLength(4), Validators.pattern(this.sellerRegex.internationalPostalCode)]));
    this.Payoneer.enable();
    this.Payoneer.setValidators(Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern(this.sellerRegex.payoneer)]));
  }

  validationsForColombiaSelectSellerForm() {
    this.Nit.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern(this.sellerRegex.integerNumber)]));
    this.Rut.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern(this.sellerRegex.integerNumber)]));
    this.State.setValidators(null);
    this.City.setValidators(null);
    this.PostalCode.setValidators(Validators.pattern(this.sellerRegex.integerNumber));
    this.Payoneer.disable();
  }

  putColombiaByDefault() {
    const colombia = this.countries.find(element => element.CountryName === this.colombia);
    // tslint:disable-next-line:curly
    if (!!colombia) this.Country.setValue(colombia.CountryName);
    //this.Country.disable();
  }

  validateExitPayoneerUser(event: any) {
    const value = event.target.value;
    if (!!value) {
      this.loadingService.viewSpinner();
      this.payoneerService.getStatusById(value).subscribe((val: any) => {
        const body = JSON.parse(val.body);
        if (body && !body.Data) {
          this.Payoneer.setErrors({ payoneer: true });
        }
        this.loadingService.closeSpinner();
      });
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
   * @method keyPress que permite solo el ingreso de números
   * @param event
   * @memberof RegisterSellerComponent
   */
  keyPress(event: any, inputName: string) {
    if (inputName === 'nit' || inputName === 'rut') {
      inputName = !!this.isColombiaSelect ? 'integerNumber' : 'internationalIdentifier';
    } if (inputName === 'city' || inputName === 'state') {
      inputName = 'internationalLocation';
    }
    if (inputName === 'postalCode') {
      inputName = this.isColombiaSelect ? 'integerNumber' : `international${inputName.charAt(0).toUpperCase() + inputName.slice(1)}`;
    }
    const pattern = new RegExp(this.sellerRegex[inputName]);
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /**
   * @method submitSellerRegistrationForm para registrar al usuario
   * @memberof RegisterSellerComponent
   */
  submitSellerRegistrationForm() {
    this.loadingService.viewSpinner();
    this.disabledForService = true;
    const profile = !this.validateFormRegister.controls.Profile.value.includes('Tienda') ? `Tienda|${this.validateFormRegister.controls.Profile.value}` : this.validateFormRegister.controls.Profile.value;
    this.validateFormRegister.controls.Profile.setValue(profile);
    this.City.setValue(this.City.value.toString().toUpperCase());
    this.State.setValue(this.State.value.toString().toUpperCase());
    this.registerService.registerUser(this.validateFormRegister.value)
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const data = result && result.body && result.body.body && JSON.parse(result.body.body);
            if (!!data && data.Data) {
              this.modalService.showModal('success');
            } else if (!data || !data.Data) {
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

  /**
   *
   * @method submitAdminRegistrationForm para registrar al administrador
   * @memberof RegisterSellerComponent
   */
  public submitAdminRegistrationForm() {
    this.loadingService.viewSpinner();
    this.disabledForService = true;
    const profile = `Exito|${this.validateFormRegisterAdmin.controls.Profile.value}`;
    this.validateFormRegisterAdmin.controls.Profile.setValue(profile);
    this.registerService.registerUser(this.validateFormRegisterAdmin.value)
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const data = result && result.body && result.body.body && JSON.parse(result.body.body);
            if (!!data && data.Data) {
              this.modalService.showModal('success');
            } else if (!data || !data.Data) {
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

  /**
   *
   * @method Metodo para validar si existe el parametro despues de cambiar el focus del input
   * @param {*} event
   * @memberof RegisterSellerComponent
   */
  validateExist(event: any, form: string, param: string, name: any = '') {
    this.activeButton = false;
    const jsonExistParam = event.target.value;
    if (jsonExistParam !== '' && jsonExistParam !== '' && jsonExistParam !== undefined && jsonExistParam !== null && (!name || (name && name.valid))) {
      this.loadingService.viewSpinner();
      this.disabledForService = true;
      this.registerService.fetchData(JSON.parse(JSON.stringify(jsonExistParam.replace(/\ /g, '+'))), param)
        .subscribe(
          (result: any) => {
            if (result.status === 200) {
              const data_response = JSON.parse(result.body.body);
              this.existValueInDB = data_response.Data;
              switch (param) {
                case 'Nit':
                  if (this.existValueInDB && form === 'Seller') {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNitDB': data_response.Data });
                  } else if (this.existValueInDB && form === 'Admin') {
                    this.validateFormRegisterAdmin.controls[param].setErrors({ 'validExistNitDB': data_response.Data });
                  }
                  break;
                case 'Email':
                  if (this.existValueInDB && form === 'Seller') {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistEmailDB': data_response.Data });
                  } else if (this.existValueInDB && form === 'Admin') {
                    this.validateFormRegisterAdmin.controls[param].setErrors({ 'validExistEmailDB': data_response.Data });
                  }
                  break;
                case 'Name':
                  if (this.existValueInDB && form === 'Seller') {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNameDB': data_response.Data });
                  } else if (this.existValueInDB && form === 'Admin') {
                    this.validateFormRegisterAdmin.controls[param].setErrors({ 'validExistNameDB': data_response.Data });
                  }
                  break;
              }
              if (!this.existValueInDB) {
                this.activeButton = true;
              }
              this.disabledForService = false;
              this.loadingService.closeSpinner();
            } else {
              this.modalService.showModal('errorService');
              this.disabledForService = false;
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
  receiveDataState($event: any) {
    if ($event && $event !== undefined && $event !== null) {
      this.idState = $event.Id;
      this.validateFormRegister.controls['State'].setValue($event.Name);
    }
  }

  /**
   * @method receiveDataCitie Metodo para obtener la data de la ciudad.
   * @param
   * @memberof RegisterSellerComponent
   */
  receiveDataCitie($event: any) {
    if ($event && $event !== undefined && $event !== null) {
      this.validateFormRegister.controls['DaneCode'].setValue($event.DaneCode);
      this.validateFormRegister.controls['City'].setValue($event.Name);
      this.validateFormRegister.controls['SincoDaneCode'].setValue($event.SincoDaneCode);
    } else {
      this.validateFormRegister.controls['DaneCode'].setValue(null);
    }
  }

  disabledButton() {
    this.activeButton = false;
  }

  public getProfile(): void {
    this.registerService.typeProfile()
      .subscribe(
        (result: any) => {
          const datas = JSON.parse(result.body).Data;
          for (const data of datas) {
            if (data.ProfileType === 'Exito') {
              this.profileAdmin = data.Profiles;
            } else if (data.ProfileType === 'Tienda') {
              this.profileSeller = data.Profiles;
            }
          }
        });
  }

  get Country(): FormControl {
    return this.validateFormRegister.get('Country') as FormControl;
  }

  get State(): FormControl {
    return this.validateFormRegister.get('State') as FormControl;
  }

  get City(): FormControl {
    return this.validateFormRegister.get('City') as FormControl;
  }

  get PostalCode(): FormControl {
    return this.validateFormRegister.get('DaneCode') as FormControl;
  }

  get Nit(): FormControl {
    return this.validateFormRegister.get('Nit') as FormControl;
  }

  get Rut(): FormControl {
    return this.validateFormRegister.get('Rut') as FormControl;
  }

  get ContactName(): FormControl {
    return this.validateFormRegister.get('ContactName') as FormControl;
  }

  get Email(): FormControl {
    return this.validateFormRegister.get('Email') as FormControl;
  }

  get PhoneNumber(): FormControl {
    return this.validateFormRegister.get('PhoneNumber') as FormControl;
  }
  get Address(): FormControl {
    return this.validateFormRegister.get('Address') as FormControl;
  }

  get Name(): FormControl {
    return this.validateFormRegister.get('Name') as FormControl;
  }

  get Payoneer(): FormControl {
    return this.validateFormRegister.get('Payoneer') as FormControl;
  }

  get Exito(): FormControl {
    return this.validateFormRegister.get('GotoExito') as FormControl;
  }

  get Profile(): FormControl {
    return this.validateFormRegister.get('Profile') as FormControl;
  }

  get Carulla(): FormControl {
    return this.validateFormRegister.get('GotoCarulla') as FormControl;
  }
  get Catalogo(): FormControl {
    return this.validateFormRegister.get('GotoCatalogo') as FormControl;
  }

  get LogisticExito(): FormControl {
    return this.validateFormRegister.get('IsLogisticsExito') as FormControl;
  }

  get ShippingExito(): FormControl {
    return this.validateFormRegister.get('IsShippingExito') as FormControl;
  }
}

