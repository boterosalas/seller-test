import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '@app/secure/seller/register/register.component';

@Component({
  selector: 'app-form-manage-seller',
  templateUrl: './form-manage-seller.component.html',
  styleUrls: ['./form-manage-seller.component.scss']
})
export class FormManageSellerComponent implements OnInit {


  public imagesSrc: Array<any> = [
    '../../../../../assets/seller-register/logo_exito_check.jpg',
    '../../../../../assets/seller-register/logo_carulla.jpg',
    '../../../../../assets/seller-register/logo_mis_catalogos_check.jpg'
  ];

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

  @Input() dataSellerSelect: any;
  constructor() {
    this.matcher = new MyErrorStateMatcher();
  }

  ngOnInit(): void {
    this.createFormControls();
  }

  /**
   *
   * @param {*} e
   * @param {*} num
   * @memberof FormManageSellerComponent
   */
  changeImageColor(e: any, num: any) {
    /* La 'e' se trae el elemento que se esta ejecutando en el DOM de html de angular.
    Le enviamos la posicion desde HTML[num] */
    if (e.checked) {
      this.imagesSrc[num] = this.imagesRegister[num].checked;
    } else {
      this.imagesSrc[num] = this.imagesRegister[num].unchecked;
    }

  }

  createFormControls() {
    this.nit = new FormControl(this.dataSellerSelect.Nit, [
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
      (this.dataSellerSelect.Address, [Validators.required]);
    this.state = new FormControl();
    this.city = new FormControl();
    this.daneCode = new FormControl(this.dataSellerSelect.DaneCode);
    this.sincoDaneCode = new FormControl();
    this.name = new FormControl
      (this.dataSellerSelect.Name, [Validators.required,
      Validators.pattern(this.nameStoreRegex)]);
    this.isLogisticsExito = new FormControl(this.dataSellerSelect.IsLogisticsExito);
    this.isShippingExito = new FormControl(this.dataSellerSelect.IsShippingExito);
    this.gotoExito = new FormControl(this.dataSellerSelect.GotoExito);
    this.gotoCarrulla = new FormControl(this.dataSellerSelect.GotoCarrulla);
    this.gotoCatalogo = new FormControl(this.dataSellerSelect.GotoCatalogo);
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

}
