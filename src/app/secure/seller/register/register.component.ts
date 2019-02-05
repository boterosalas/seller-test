import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { LoadingService, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { UserInformation } from '@app/shared';
import { RegisterService } from './register.service';
import { TestRequest } from '@angular/common/http/testing';
import { MenuModel, createFunctionality, registerName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';


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

  public values = '';
  public existValueInDB: boolean;
  public matcher: MyErrorStateMatcher;
  public validateFormRegister: FormGroup;
  public idState: number;
  public daneCode: any;
  public disabledForService: boolean;
  public emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]?(?:[a-zA-Z0-9-]{0,}[a-zA-Z0-9]+\.)+[a-z]{2,}$/;
  public nameStoreRegex = /^((?!\.com$)(?!\.co$)(?!\.net$)(?!\.gov$)(?!\.edu$)(?!\ss\.a\.s$)(?!\ss\.a$)(?!\ss\.a\.$)(?!\ss\.a\.$)(?!\ssa\.s$)(?!\ssas$)(?!\ssa$)(?!\sltda$)(?!\sltda\.$).)*$/;
  public user: UserInformation;
  public activeButton: boolean;

  // Variables con los permisos que este componente posee
  permissionComponent: MenuModel;
  create = createFunctionality;
  disabledComponent = false;

  constructor(
    @Inject(RegisterService)
    private registerService: RegisterService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    public userService: UserLoginService,
    public userParams: UserParametersService,
    public authService: AuthService
  ) { }


  public validateNameStorage(name: string): boolean {
    const t = name.toLocaleLowerCase().trim();

    if (!t.match(this.nameStoreRegex)) {
      this.validateFormRegister.controls.Name.setErrors(
        {
          pattern: TestRequest
        }
      );
    } else {
      this.validateFormRegister.controls.Name.setErrors(null);
    }
    return true;
  }

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

  ngOnInit() {
    this.permissionComponent = this.authService.getMenu(registerName);
    const disabledForm = !this.getFunctionality(this.create);
    this.disabledComponent = disabledForm;
    this.validateFormRegister = new FormGroup({
      Nit: new FormControl({ value: '', disabled: disabledForm }, [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[0-9]*$')
      ]),
      Rut: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[0-9]*$')
        ]),
      ContactName: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required,
        Validators.pattern('^[0-9A-Za-zá é í ó ú ü ñ  à è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ  À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$')
        ]),
      Email: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required,
        Validators.pattern(this.emailRegex)
        ]),
      PhoneNumber: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$')]),
      Address: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required]),
      State: new FormControl,
      City: new FormControl,
      DaneCode: new FormControl,
      SincoDaneCode: new FormControl,
      Name: new FormControl
        ({ value: '', disabled: disabledForm }, [Validators.required]),
      IsLogisticsExito: new FormControl({ value: false, disabled: disabledForm }),
      IsShippingExito: new FormControl({ value: true, disabled: disabledForm }),
      GotoExito: new FormControl({ value: true, disabled: disabledForm }),
      GotoCarrulla: new FormControl({ value: false, disabled: disabledForm }),
      GotoCatalogo: new FormControl({ value: true, disabled: disabledForm })
    });
    this.matcher = new MyErrorStateMatcher();
  }

  /**
   * @method keyPress que permite solo el ingreso de números
   * @param event
   * @memberof RegisterSellerComponent
   */
  keyPress(event: any) {
    const pattern = /[0-9]/;
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
    this.registerService.registerUser(this.validateFormRegister.value)
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const data = JSON.parse(result.body.body);
            if (data.Data) {
              this.modalService.showModal('success');
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

  /**
   *
   * @method Metodo para validar si existe el parametro despues de cambiar el focus del input
   * @param {*} event
   * @memberof RegisterSellerComponent
   */
  validateExist(event: any, param: string, name: any = '') {
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
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNitDB': data_response.Data });
                  }
                  break;
                case 'Email':
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistEmailDB': data_response.Data });
                  }
                  break;
                case 'Name':
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNameDB': data_response.Data });
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
}

