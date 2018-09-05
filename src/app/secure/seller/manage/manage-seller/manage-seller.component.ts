/* 3rd party components */
import { Component, OnInit } from '@angular/core';
/* our own custom components */
import { EventEmitterSeller } from '../events/eventEmitter-seller.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '@app/secure/seller/register/register.component';
import { AnyLengthString } from 'aws-sdk/clients/comprehend';
import { LoadingService, ModalService } from '@app/core';
import { RegisterService } from '@app/secure/seller/register/register.service';

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

  constructor(
    public eventsSeller: EventEmitterSeller,
    public storeService: StoresService,
    private loadingService: LoadingService,
    private registerService: RegisterService,
    private modalService: ModalService,
  ) {
    this.matcher = new MyErrorStateMatcher();
    this.currentSellerSelect = new StoreModel(0, '');
    this.user = {};
    this.activeButton = false;
  }

  AnyLengthString;
  ngOnInit() {
    this.createFormControls();
    // EventEmitter que permite saber cuando el usuario a buscado una tienda
    this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      this.currentSellerSelect = seller;
      this.name.setValue(this.currentSellerSelect.Name);
      this.nit.setValue(this.currentSellerSelect.Nit);
      this.address.setValue(this.currentSellerSelect.Address);
      this.daneCode.setValue(this.currentSellerSelect.DaneCode);
      this.isLogisticsExito.setValue(this.currentSellerSelect.IsLogisticsExito);
      this.isShippingExito.setValue(this.currentSellerSelect.IsShippingExito);
      this.gotoExito.setValue(this.currentSellerSelect.GotoExito);
      this.gotoCarrulla.setValue(this.currentSellerSelect.GotoCarrulla);
      this.gotoCatalogo.setValue(this.currentSellerSelect.GotoCatalogo);
    });
  }

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
  keyPress(event: any) {
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
  validateExist(event: any, param: string) {
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
}
