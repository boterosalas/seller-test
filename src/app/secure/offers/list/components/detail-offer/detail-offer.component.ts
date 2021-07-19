import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { LoadingService, ModalService, Logger } from '@app/core';
import { environment } from '@env/environment';
import { BulkLoadService } from '../../../bulk-load/bulk-load.service';
import { ListComponent } from '../../list/list.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';
import { AuthService } from '@app/secure/auth/auth.routing';
import { distinctUntilChanged } from 'rxjs/operators';
import { validateDataToEqual } from '@app/shared/util/validation-messages';
import { TranslateService } from '@ngx-translate/core';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { ModalRuleOfferComponent } from '@app/secure/products/list-products/modal-rule-offer/modal-rule-offer.component';
import { ModalProgramOfertComponent } from '../modal-program-ofert/modal-program-ofert.component';
import moment from 'moment';


// Error when invalid control is dirty, touched, or submitted.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Oferts {
  EAN: string;
  Stock: string;
  Price: string;
  AverageFreightCost: string;
  PromiseDelivery: string;
  IsFreeShipping: string;
  IsEnviosExito: string;
  IsFreightCalculator: string;
  IsLogisticsExito: string;
  IsUpdatedStock?: string;
  OfferByReference?: any;
  DiscountPrice?: number;
  Currency?: string;
  Warranty?: string;
  Periodicity?: number;
  EanCombo?: string;
  ComboQuantity?: number;
  SellerSku?: any;
  Reference?: any;
}

const log = new Logger('DetailOfferComponent');


/**
 *
 * @export
 * @class DetailOfferComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-detail-offer',
  templateUrl: './detail-offer.component.html',
  styleUrls: ['./detail-offer.component.scss']
})

export class DetailOfferComponent implements OnInit {

  /**
   * @description Variable para controlar si el usuario esta editando la oferta.
   * @type {boolean}
   * @memberof DetailOfferComponent
   */
  public isUpdateOffer: boolean;

  /**
   * @description Variable para validar el formulario.
   * @type {FormGroup}
   * @memberof DetailOfferComponent
   */
  public formUpdateOffer: FormGroup;

  /**
   *
   *  @description Variables para controlar los campos del formulario.
   * @type {FormControl}
   * @memberof DetailOfferComponent
   */
  public Ean: FormControl;
  public Stock: FormControl;
  public Price: FormControl;
  public DiscountPrice: FormControl;
  public AverageFreightCost: FormControl;
  public PromiseDelivery: FormControl;
  public IsFreeShipping: FormControl;
  public IsEnviosExito: FormControl;
  public IsFreightCalculator: FormControl;
  public Warranty: FormControl;
  public Periodicity: FormControl;
  public SellerSku: FormControl;
  public IsUpdatedStock: FormControl;
  public OfferByReference: FormControl;
  public Currency: FormControl;
  public comboForm: FormGroup;
  public showButton: boolean;
  public country = 'COLOMBIA';

  public idOffer = null;
  public idSeller = null;

  public scheduleOfferDateStart = null;
  public scheduleOfferDateEnd = null;

  public activeTabIndex = 0;

  promiseFirts: string;
  promiseSeconds: string;
  to: string;
  showCombos = false;
  periodicityHtml = '';

  offertRegex = {
    formatNumber: '',
    promiseDelivery: '',
    currency: '',
    isUpdatedStock: '',
    discountPrice: '',
    price: '',
    sellerSku: ''
  };

  dataUpdateOffer = {
    ListOffers: [],
    priceApproval: 0
  };

  /**
   * @description Variable para controlar los errores de los inputs.
   * @type {MyErrorStateMatcher}
   * @memberof DetailOfferComponent
   */
  public matcher: MyErrorStateMatcher;

  /**
   * @description Variable que almacena los datos que se le van a enviar al servcio.
   * @type {Array<any>}
   * @memberof DetailOfferComponent
   */
  public params: Array<any>;

  /**
   * @description Variable en la que almacena los datos de la oferta de la cual se quiere ver el detalle.
   * @memberof DetailOfferComponent
   */
  @Input() dataOffer;

  /**
   * Variable para definir si el componente puede inicializarse para edicion.
   *
   * @type {boolean}
   * @memberof DetailOfferComponent
   */
  @Input() canEdit: boolean;

  /**
   * @description Variable que almancena un booleano que se le envia al listado de ofertas para volver a consumir el servicio
   * de listado de ofertas.
   * @type {EventEmitter<boolean>}
   * @memberof DetailOfferComponent
   */
  @Output() consumeServiceList = new EventEmitter<any>();

  /**
   *
   * @description Variable para controlar si es production o no
   * @memberof DetailOfferComponent
   */
  public isProductionEnv = environment.production;
  convertPromise: string;
  validateNumberOrder: boolean;
  public valuePrice: any;
  public totalCombo: any;
  public oferts: Oferts[];
  approvalOfert: any;
  selected: any;
  isInternational = false;
  sellerMinPrice: any;
  unLess: boolean;

  // Variable para cambiar copy del toogle de actualizar inventario
  public changeCopyUpdateStock = this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.stock_update');

  constructor(
    public list: ListComponent,
    public loadOfferService: BulkLoadService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    public SUPPORT: SupportService,
    private languageService: TranslateService,
    public authService: AuthService,
    private profileService: MyProfileService,
    private dialog: MatDialog,
    private fb?: FormBuilder,
    public snackBar?: MatSnackBar
  ) {
    this.isUpdateOffer = false;
    this.params = [];
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.getAllDataUser();
    this.setPromise();
    this.validateFormSupport();
    this.createValidators();
  }

  /**
   * @method handleKeyboardEvent
   * @param event
   * @description Metodo para controlar cuando se presiona la tecla Esc y poder volver al listado de ofertas.
   * @memberof DetailOfferComponent
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const evt = event.keyCode;
    if (evt === 27) {
      this.goToListOffers();
    }
  }

  /**
   * @method goToListOffers
   * @description Metodo para volver a listado de ofertas.
   * @memberof DetailOfferComponent
   */
  goToListOffers() {
    this.list.viewDetailOffer = false;
    this.list.inDetail = false;
  }
  /**
   * Descomponer la promesa de entrega
   *
   * @memberof DetailOfferComponent
   */
  setPromise() {
    if (this.editOffer && this.dataOffer.promiseDelivery) {
      const promiseDe = this.dataOffer.promiseDelivery.split(' ');
      this.promiseFirts = promiseDe[0];
      this.to = promiseDe[1];
      this.promiseSeconds = promiseDe[2];
    } else {
      this.promiseFirts = '';
      this.to = '';
      this.promiseSeconds = '';
    }
  }

  /**
   * @method editOffer
   * @description Metodo para activar la edicion de la oferta.
   * @memberof DetailOfferComponent
   */
  editOffer() {
    if (this.dataOffer.availableToOffer === true) {
      this.isUpdateOffer = true;
      this.createValidators();
      this.createForm();
      this.setCombos();
      this.selected = '2';
    } else {
      this.snackBar.open(this.languageService.instant('secure.offers.list.components.detail_offer.snackbar_offer_product'), this.languageService.instant('actions.close'), {
        duration: 5000,
      });
    }
  }

  /**
   * @method cancelEditOffer
   * @description Metodo para desactivar la edicion de la oferta.
   * @memberof DetailOfferComponent
   */
  cancelEditOffer() {
    this.isUpdateOffer = false;
  }

  /**
   * OBTENGO INFORMACION DEL USUARIO
   * @memberof OfertExpandedProductComponent
   */
  async getAllDataUser() {
    const sellerData = await this.profileService.getUser().toPromise().then(res => {
      const body: any = res.body;
      const response = JSON.parse(body.body);
      const userData = response.Data;
      this.sellerMinPrice = userData.MinFullPrice;
      this.country = userData.Country;
      this.loadingService.closeSpinner();
      return userData;
    });
  }


  /**
   * funcion para vlaidatar la regex
   *
   * @memberof DetailOfferComponent
   */
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'ofertas' || data.Module === 'transversal');
      for (const val in this.offertRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.offertRegex[val] = element && `${element.Value}`;
        }
      }
      this.createValidators();
    });
  }

  /**
   * @method createValidators
   * @description Metodo para crear el formControl de cada input con sus validaciones.
   * @memberof DetailOfferComponent
   */
  createValidators() {
    let priceCurrent = '';
    if (this.dataOffer.discountPrice !== '0.00') {
      priceCurrent = this.dataOffer.discountPrice;
    }
    this.Ean = new FormControl(this.dataOffer.ean);
    this.Stock = new FormControl(this.dataOffer.stock, [Validators.pattern(this.offertRegex.formatNumber)]);
    this.SellerSku = new FormControl(this.dataOffer.sellerSku, [Validators.pattern(this.offertRegex.sellerSku)]);
    this.Price = new FormControl(this.dataOffer.price, [Validators.pattern(this.offertRegex.formatNumber)]);
    this.DiscountPrice = new FormControl(priceCurrent, [Validators.pattern(this.offertRegex.formatNumber)]);
    this.AverageFreightCost = new FormControl(this.dataOffer.shippingCost, [Validators.pattern(this.offertRegex.formatNumber)]);
    this.PromiseDelivery = new FormControl('', [Validators.pattern(this.offertRegex.promiseDelivery)]);
    this.IsFreeShipping = new FormControl(this.dataOffer.isFreeShipping ? 1 : 0);
    this.OfferByReference = new FormControl('');
    this.IsEnviosExito = new FormControl(this.dataOffer.isEnviosExito ? 1 : 0);
    this.IsFreightCalculator = new FormControl(this.dataOffer.isFreightCalculator ? 1 : 0);
    this.Warranty = new FormControl(this.dataOffer.warranty);
    this.idOffer = this.dataOffer.idOffer;
    this.idSeller = this.dataOffer.idSeller;
    if (this.dataOffer.periodicity) {
      if (this.isInternational) {
        this.Periodicity = new FormControl({ value: 1, disabled: true });
        this.languageService.stream('secure.offers.historical_admin.historical_admin.day').subscribe(val => {
          this.periodicityHtml = val;
        });
      } else {
        this.Periodicity = new FormControl(this.dataOffer.periodicity.toString());
        if (this.Periodicity.value === '1') {
          this.languageService.stream('secure.offers.historical_admin.historical_admin.day').subscribe(val => {
            this.periodicityHtml = val;
          });
        } else {
          this.languageService.stream('secure.offers.historical_admin.historical_admin.hours').subscribe(val => {
            this.periodicityHtml = val;
          });
        }
      }
    } else {
      if (this.isInternational) {
        this.Periodicity = new FormControl({ value: 1, disabled: true });
      } else {
        this.Periodicity = new FormControl({ value: 1, disabled: false });
      }
      this.languageService.stream('secure.offers.historical_admin.historical_admin.day').subscribe(val => {
        this.periodicityHtml = val;
      });
    }

    if (this.dataOffer && this.dataOffer.scheduleOffer) {
      this.scheduleOfferDateStart = this.dataOffer.scheduleOffer.initialDate ? moment(this.dataOffer.scheduleOffer.initialDate).utc().format('DD/MM/YYYY') : null;
      this.scheduleOfferDateEnd = this.dataOffer.scheduleOffer.finalDate ? moment(this.dataOffer.scheduleOffer.finalDate).utc().format('DD/MM/YYYY') : null;

    }
    // this.IsLogisticsExito = new FormControl(this.dataOffer.isLogisticsExito ? 1 : 0);
    // this.IsUpdatedStock = new FormControl({ value: this.dataOffer.isUpdatedStock ? 1 : 0, disabled: this.IsLogisticsExito.value ? false : true }, [Validators.pattern(this.offertRegex.isUpdatedStock)]);
    this.IsUpdatedStock = new FormControl(this.dataOffer.isUpdatedStock ? 1 : 0);
    // this.Currency = new FormControl('COP');
    this.Currency = new FormControl(this.dataOffer.currency);
    this.setCurrentPromise();
  }
  /**
   * Setear la promesa de entrega, se descompone y luego se le asigna al controlador en el html
   *
   * @memberof DetailOfferComponent
   */
  setCurrentPromise() {
    this.languageService.stream('secure.offers.list.components.detail_offer.a').subscribe(val => {
      this.PromiseDelivery.setValue(this.promiseFirts + ' ' + val + ' ' + this.promiseSeconds);
    });
  }

  /**
   *  @description Metodo que crea el formGroup con las validaciones de los campos.
   *  @method createForm
   * @memberof DetailOfferComponent
   */
  createForm() {
    this.formUpdateOffer = this.fb.group({
      EAN: this.Ean,
      Stock: this.Stock,
      Price: this.Price,
      DiscountPrice: this.DiscountPrice,
      AverageFreightCost: this.AverageFreightCost,
      PromiseDelivery: this.PromiseDelivery,
      IsFreeShipping: this.IsFreeShipping,
      IsEnviosExito: this.IsEnviosExito,
      IsFreightCalculator: this.IsFreightCalculator,
      Warranty: this.Warranty,
      Periodicity: this.Periodicity,
      SellerSku: this.SellerSku,
      IsUpdatedStock: this.IsUpdatedStock,
      OfferByReference: this.OfferByReference,
      Currency: this.Currency,
      Combos: this.fb.array([]),
    });
    // Se borra esta linea o se comenta cuando se despliegue MPI
    this.formUpdateOffer.get('Currency').disable();
    this.validateOffertType(this.formUpdateOffer.get('Currency').value);
    this.formUpdateOffer.get('Currency').valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
      this.changeTypeCurrency(val);
      this.validateOffertType(val);
    });
    const initialValue = Object.assign(this.formUpdateOffer.value, {});
    this.formUpdateOffer.setValidators([validateDataToEqual(initialValue)]);
    this.validateNationality();

  }
  /**
   * funcion para validar la nacionalidad
   *
   * @memberof DetailOfferComponent
   */
  validateNationality() {
    this.formUpdateOffer.get('Currency').disable();
    if (this.country === 'COLOMBIA') {
      this.isInternational = false;
      this.formUpdateOffer.get('Currency').setValue('COP');
    } else {
      this.isInternational = true;
      this.formUpdateOffer.get('Currency').setValue('USD');
    }
  }
  /**
   * funsion para setear la moneda
   *
   * @param {*} val
   * @memberof DetailOfferComponent
   */
  validateOffertType(val: any) {
    if (val === 'USD' && !!this.authService.completeUserData && this.authService.completeUserData.Country !== 'Colombia') {
      this.formUpdateOffer.get('IsFreeShipping').setValue(0);
      this.formUpdateOffer.get('IsEnviosExito').setValue(0);
      // this.formUpdateOffer.get('IsLogisticsExito').setValue(0);
      this.formUpdateOffer.get('IsFreightCalculator').setValue(0);
      // tslint:disable-next-line:no-unused-expression
      this.formUpdateOffer.get('IsFreeShipping').enabled && this.formUpdateOffer.get('IsFreeShipping').disable();
      // tslint:disable-next-line:no-unused-expression
      this.formUpdateOffer.get('IsEnviosExito').enabled && this.formUpdateOffer.get('IsEnviosExito').disable();
      // tslint:disable-next-line:no-unused-expression
      // this.formUpdateOffer.get('IsLogisticsExito').enabled && this.formUpdateOffer.get('IsLogisticsExito').disable();
      // tslint:disable-next-line:no-unused-expression
      this.formUpdateOffer.get('IsFreightCalculator').enabled && this.formUpdateOffer.get('IsFreightCalculator').disable();
    } else {
      // tslint:disable-next-line:no-unused-expression
      !this.formUpdateOffer.get('IsFreeShipping').enabled && this.formUpdateOffer.get('IsFreeShipping').enable();
      // tslint:disable-next-line:no-unused-expression
      !this.formUpdateOffer.get('IsEnviosExito').enabled && this.formUpdateOffer.get('IsEnviosExito').enable();
      // tslint:disable-next-line:no-unused-expression
      // !this.formUpdateOffer.get('IsLogisticsExito').enabled && this.formUpdateOffer.get('IsLogisticsExito').enable();
      // tslint:disable-next-line:no-unused-expression
      !this.formUpdateOffer.get('IsFreightCalculator').enabled && this.formUpdateOffer.get('IsFreightCalculator').enable();
    }
  }

  /**
   * @method checkSlide
   * @description Metodo para validar los toogle.
   * @param {*} event
   * @param {string} slide
   * @memberof DetailOfferComponent
   */
  checkSlide(event: any, slide: string) {
    if (event.checked && event.checked === true) {
      switch (slide) {
        case 'isFreeShipping':
          this.IsFreeShipping.setValue(1);
          this.IsEnviosExito.setValue(0);
          this.IsFreightCalculator.setValue(0);
          // this.IsLogisticsExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.enable();
          break;
        case 'isEnviosExito':
          this.IsEnviosExito.setValue(1);
          this.IsFreeShipping.setValue(0);
          this.IsFreightCalculator.setValue(0);
          // this.IsLogisticsExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.enable();
          break;
        case 'isFreightCalculator':
          this.IsFreightCalculator.setValue(1);
          this.IsFreeShipping.setValue(0);
          this.IsEnviosExito.setValue(0);
          // this.IsLogisticsExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.enable();
          break;
        case 'IsLogisticsExito':
          // this.IsLogisticsExito.setValue(1);
          this.IsFreightCalculator.setValue(0);
          this.IsFreeShipping.setValue(0);
          this.IsEnviosExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.enable();
          break;
        case 'IsUpdatedStock':
          this.IsUpdatedStock.setValue(1);
          break;
      }
    } else if (event.checked === false) {
      switch (slide) {
        case 'isFreeShipping':
          this.IsFreeShipping.setValue(0);
          break;
        case 'isEnviosExito':
          this.IsEnviosExito.setValue(0);
          break;
        case 'isFreightCalculator':
          this.IsFreightCalculator.setValue(0);
          break;
        case 'IsLogisticsExito':
          // this.IsLogisticsExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.enable();
          break;
        case 'IsUpdatedStock':
          this.IsUpdatedStock.setValue(0);
          break;
      }
    }
  }

  /**
   * @method onlyNumber que permite solo el ingreso de números.
   * @param event
   * @memberof DetailOfferComponent
   */
  onlyNumber(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /**
   * @method validInput
   * @description Metodo utilizado para validar los datos de precio y precio con descuento.
   * @param {*} input
   * @memberof DetailOfferComponent
   */
  validInput(input: any) {
    switch (input) {
      case 'Price':
        if (this.Price.value === '') {
        } else if (parseInt(this.Price.value, 10) < this.sellerMinPrice) {
          this.formUpdateOffer.controls[input].setErrors({ 'isLessThanEightThousand': true });
        } else if (parseFloat(this.Price.value) <= parseFloat(this.DiscountPrice.value)) {
          this.formUpdateOffer.controls[input].setErrors({ 'isLessThanDiscPrice': true });
          this.formUpdateOffer.controls.DiscountPrice.setErrors({ 'isLessThanDiscPrice': true });
        } else if ((+this.formUpdateOffer.controls.Price.value === 0 || +this.formUpdateOffer.controls.Price.value === 0.00) && this.Currency.value === 'USD') {
          this.formUpdateOffer.controls[input].setErrors({ 'notCero': true });
        } else if ((+this.formUpdateOffer.controls.DiscountPrice.value === 0 || +this.formUpdateOffer.controls.DiscountPrice.value === 0.00) && this.formUpdateOffer.controls.DiscountPrice.value && this.Currency.value === 'USD') {
          this.formUpdateOffer.controls['DiscountPrice'].setErrors({ 'notCero': true });
        } else {
          this.DiscountPrice.enable();
        }
        break;
      case 'DiscountPrice':
        if (this.DiscountPrice.value !== '') {
          if (parseInt(this.DiscountPrice.value, 10) < this.sellerMinPrice) {
            this.formUpdateOffer.controls[input].setErrors({ 'isLessThanEightThousand': true });
          } else if (parseFloat(this.DiscountPrice.value) >= parseFloat(this.Price.value)) {
            this.formUpdateOffer.controls[input].setErrors({ 'isgreaterThanPrice': true });
          } else if ((+this.formUpdateOffer.controls.DiscountPrice.value === 0 || +this.formUpdateOffer.controls.DiscountPrice.value === 0.00) && this.Currency.value === 'USD') {
            this.formUpdateOffer.controls[input].setErrors({ 'notCero': true });
          } else {
            this.formUpdateOffer.controls['Price'].reset(this.Price.value);
          }
        } else {
          this.formUpdateOffer.controls['Price'].reset(this.Price.value);
        }
        break;
    }
  }

  /**
   * Metodo para validar el formato de la promesa de entrega
   * Y validar que el primer numero no sea mayor que el segundo.
   * @memberof DetailOfferComponent
   */
  validatePromiseDeliveriOffert() {
    const promiseDeli = this.formUpdateOffer.controls.PromiseDelivery.value;
    if (promiseDeli.match(this.offertRegex.promiseDelivery)) {
      if (this.formUpdateOffer.controls.PromiseDelivery.value !== '') {
        const promiseSplited = promiseDeli.split(/\s(a|-|to)\s/);
        this.convertPromise = promiseSplited[0] + ' a ' + promiseSplited[2];
        this.validateNumberOrder = Number(promiseSplited[2]) > Number(promiseSplited[0]);
        if (this.validateNumberOrder !== true) {
          this.formUpdateOffer.controls.PromiseDelivery.setErrors({ 'startIsGreaterThanEnd': true });
        }
      }
    }
  }

  /**
   * Metodo para validar el precio sin tocarlo y q sea mayor al precio minimo
   * @returns
   * @memberof DetailOfferComponent
   */
  unLessPrice() {
    if (Number(this.formUpdateOffer.controls.Price.value) < this.sellerMinPrice) {
      this.formUpdateOffer.controls.Price.setErrors({ 'unLess': true });
      this.unLess = true;
      this.formUpdateOffer.controls.Price.markAsDirty();
      return false;
    } else {
      this.unLess = false;
      this.formUpdateOffer.controls.Price.setErrors(null);
      return true;
    }
  }

  /**
   * Metodo para validar el precio con descuento sin tocarlo y q sea mayor al precio minimo
   * @returns
   * @memberof DetailOfferComponent
   */
  unLessDiscountPrice() {
    if (Number(this.formUpdateOffer.controls.DiscountPrice.value) < this.sellerMinPrice) {
      this.formUpdateOffer.controls.DiscountPrice.setErrors({ 'unLess': true });
      this.unLess = true;
      this.formUpdateOffer.controls.DiscountPrice.markAsDirty();
      return false;
    } else {
      this.unLess = false;
      this.formUpdateOffer.controls.DiscountPrice.setErrors(null);
      return true;
    }
  }

  /**
   * Metodo para validar oferta 30% por encima o por debajo el cambio
   * @memberof DetailOfferComponent
   */
  validateRulesOfert(): void {
    const valHighUp = +this.dataOffer.price * 1.30;
    const valHighDown = +this.dataOffer.price * 0.70;
    const valLowUp = +this.dataOffer.discountPrice * 1.30;
    const valLowDown = +this.dataOffer.discountPrice * 0.70;
    const valPrice = +this.formUpdateOffer.controls.Price.value;
    const valDiscount = +this.formUpdateOffer.controls.DiscountPrice.value;

    if (this.formUpdateOffer.controls.DiscountPrice.value !== 0 && this.formUpdateOffer.controls.DiscountPrice.value !== '') {
      if (this.dataOffer.discountPrice === '0.00' || this.dataOffer.discountPrice === 0.00 || this.dataOffer.discountPrice === '0') {
        if (valDiscount && (valDiscount < valHighDown || valDiscount > valHighUp)) {
          this.openDialogModalRule();
        } else {
          this.sameInfoUpdate();
          this.dataUpdateOffer['priceApproval'] = 0;
          this.submitUpdateOffer(this.dataUpdateOffer);
        }
      } else {
        if (valDiscount && (valDiscount < valLowDown || valDiscount > valLowUp)) {
          this.openDialogModalRule();
        } else {
          this.sameInfoUpdate();
          this.dataUpdateOffer['priceApproval'] = 0;
          this.submitUpdateOffer(this.dataUpdateOffer);
        }
      }
    } else {
      if (this.dataOffer.discountPrice !== '0.00') {
        if (valDiscount && (valPrice < valLowDown || valPrice > valLowUp)) {
          this.openDialogModalRule();
        } else {
          this.sameInfoUpdate();
          this.dataUpdateOffer['priceApproval'] = 0;
          this.submitUpdateOffer(this.dataUpdateOffer);
        }
      } else {
        if (valPrice && (valPrice < valHighDown || valPrice > valHighUp)) {
          this.openDialogModalRule();
        } else {
          this.sameInfoUpdate();
          this.dataUpdateOffer['priceApproval'] = 0;
          this.submitUpdateOffer(this.dataUpdateOffer);
        }
      }
    }
  }

  /**
   * Metodo para setear información
   * @memberof DetailOfferComponent
   */
  sameInfoUpdate(): void {
    const promiseSplited = this.formUpdateOffer.controls.PromiseDelivery.value.split(/\s(a|-|to)\s/);
    this.convertPromise = promiseSplited[0] + ' a ' + promiseSplited[2];
    this.formUpdateOffer.controls.PromiseDelivery.setValue(this.convertPromise);
    this.params.push(this.formUpdateOffer.value);
    const combos = this.formUpdateOffer.controls.Combos.value;

    let sendEan = this.dataOffer.ean;
    if (this.formUpdateOffer.controls['OfferByReference'].value === true) {
      sendEan = null;
    }
    this.oferts = [
      {
        EAN: sendEan,
        Stock: this.params[0].Stock,
        Price: this.params[0].Price,
        DiscountPrice: this.params[0].DiscountPrice,
        AverageFreightCost: this.params[0].AverageFreightCost,
        PromiseDelivery: this.params[0].PromiseDelivery,
        Warranty: this.params[0].Warranty,
        Periodicity: parseInt(this.params[0].Periodicity, 0),
        IsFreeShipping: this.formUpdateOffer.controls['IsFreeShipping'].value,
        IsEnviosExito: this.formUpdateOffer.controls['IsEnviosExito'].value,
        IsFreightCalculator: this.formUpdateOffer.controls['IsFreightCalculator'].value,
        OfferByReference: this.formUpdateOffer.controls['OfferByReference'].value ? true : false,
        SellerSku: this.params[0].SellerSku,
        Reference: this.dataOffer.reference,
        IsLogisticsExito: '0',
        IsUpdatedStock: this.params[0].IsUpdatedStock,
        Currency: this.formUpdateOffer.controls['Currency'].value
      }
    ];

    if (combos.length > 0) {
      combos.forEach((element: any) => {
        this.oferts.push({
          'EanCombo': this.dataOffer.ean,
          'Price': element.ofertPriceComponet,
          'ComboQuantity': element.ComboQuantity,
          'EAN': element.EAN,
          'Stock': null,
          'AverageFreightCost': null,
          'IsEnviosExito': null,
          'IsFreeShipping': null,
          'IsFreightCalculator': null,
          'PromiseDelivery': null,
          'IsLogisticsExito': '0',
          'SellerSku': null
        });
      });
    }

    this.dataUpdateOffer = {
      ListOffers: this.oferts,
      priceApproval: 0
    };
  }
  /**
   * funion para abrir el modal de reglas 
   *
   * @memberof DetailOfferComponent
   */
  openDialogModalRule(): void {
    const dialogRef = this.dialog.open(ModalRuleOfferComponent, {
      width: '95%',
      data: {},
    });
    dialogRef.afterClosed().subscribe(res => {
      log.info('The dialog was closed');
      this.approvalOfert = res;
      if (this.approvalOfert === true) {
        this.sameInfoUpdate();
        this.dataUpdateOffer['priceApproval'] = 1;
        this.submitUpdateOffer(this.dataUpdateOffer);
      } else {
        this.dataUpdateOffer = null;
      }
    });
  }

  /**
   * Mostrar alerta actualizacion variantes a todas alas ofertas
   * @param {*} event
   * @memberof DetailOfferComponent
   */
  alertSellerByReference(event: any) {
    if (event && (this.formUpdateOffer.controls.OfferByReference.value === true && this.formUpdateOffer.controls.IsUpdatedStock.value === 1 || this.formUpdateOffer.controls.IsUpdatedStock.value === true)) {
      this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.update_variants_all_references'), this.languageService.instant('actions.close'), {
        duration: 7000,
      });
    }
    if (this.formUpdateOffer.controls.OfferByReference.value === true) {
      this.changeCopyUpdateStock = this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.update_variants');
    } else {
      this.changeCopyUpdateStock = this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.stock_update');
    }
  }

  /**
   * @description Metodo para enviar los datos al servicio y actualizar la oferta.
   * @method submitUpdateOffer
   * @memberof DetailOfferComponent
   */
  submitUpdateOffer(dataUpdate: any) {
    let booleanReference = false;
    this.loadingService.viewSpinner();
    this.loadOfferService.setOffersProducts(dataUpdate).subscribe(
      (result: any) => {
        if (result.status === 200) {
          const data = result;
          if (data.body.successful !== 0 || data.body.error !== 0) {
            if (data.body.data.error > 0) {
              this.loadingService.closeSpinner();
              // this.consumeServiceList.emit(true);
              this.params = [];
              this.oferts = [];
              let countError = 0;
              data.body.data.offerNotifyViewModels.forEach(element => {
                if (element.code === 'PEX') {
                  countError++;
                }
              });
              if (countError === data.body.data.error) {
                this.openDialogModalRule();
              } else {
                this.snackBar.open(this.languageService.instant('secure.offers.list.components.detail_offer.snackbar_offer_product'), this.languageService.instant('actions.close'), {
                  duration: 5000,
                });
              }
            } else {
              this.loadingService.closeSpinner();
              this.oferts[0].OfferByReference === true ? booleanReference = true : booleanReference = false;
              this.goToListOffers();
              if (booleanReference === false) {
                this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.offer_has_been_correctly'), this.languageService.instant('actions.close'), {
                  duration: 5000,
                });
              }
              const dataEmit = {
                event: true,
                reference: booleanReference
              };
              this.consumeServiceList.emit(dataEmit);
              this.params = [];
              this.oferts = [];
            }
          } else if (data.body.successful === 0 && data.body.error === 0) {
            this.modalService.showModal('errorService');
            this.loadingService.closeSpinner();
            this.params = [];
            this.oferts = [];
          }
        } else {
          this.modalService.showModal('errorService');
          this.loadingService.closeSpinner();
          this.params = [];
          this.oferts = [];
        }
        if (result.body.data.error === 1) {
          this.loadingService.closeSpinner();
          this.modalService.showModal('errorService');
        }
      }, error => {
        this.loadingService.closeSpinner();
        this.modalService.showModal('errorService');
      }
    );
  }


  /**
   * Funcion que recibe como parametro el tipo de evento seleccionado en la lista desplegable (USD, COP), muestra un mensaje de cambio de moneda
   * y limpias las variables
   * @param event
   */

  changeTypeCurrency(event: any) {
    if (event === 'USD') {
      this.formUpdateOffer.controls['DiscountPrice'].setValidators([Validators.pattern(this.offertRegex.formatNumber)]);
      this.formUpdateOffer.controls['Price'].setValidators([Validators.required, Validators.pattern(this.offertRegex.formatNumber)]);
      this.formUpdateOffer.controls['AverageFreightCost'].setValidators([Validators.required, Validators.pattern(this.offertRegex.formatNumber)]);
    } else {
      this.formUpdateOffer.controls['DiscountPrice'].setValidators([Validators.pattern(this.offertRegex.price)]);
      this.formUpdateOffer.controls['Price'].setValidators([Validators.required, Validators.pattern(this.offertRegex.price)]);
      this.formUpdateOffer.controls['AverageFreightCost'].setValidators([Validators.required, Validators.pattern(this.offertRegex.price)]);
    }
    this.AverageFreightCost = new FormControl(this.dataOffer.shippingCost, [Validators.required, Validators.pattern(this.offertRegex.formatNumber)]);
    this.snackBar.open(`${this.languageService.instant('secure.offers.list.components.detail_offer.snackbar_currency')} (${event})`, this.languageService.instant('actions.close'), {
      duration: 3000,
    });
  }
  /**
   * recorre combo y setear
   *
   * @memberof DetailOfferComponent
   */
  setCombos() {
    if (this.dataOffer && this.dataOffer.offerComponents.length > 0) {
      this.dataOffer.offerComponents.forEach((element: any) => {
        this.addItem(element);
      });
    }
  }
  /**
   * agregar combos
   *
   * @param {*} element
   * @memberof DetailOfferComponent
   */
  addItem(element: any): void {
    this.comboForm = this.fb.group({
      EAN: element.ean,
      ofertPriceComponet: new FormControl(element.price, [Validators.required, Validators.pattern(this.offertRegex.formatNumber)]),
      ComboQuantity: [element.quantity, Validators.compose([Validators.required, Validators.pattern(this.offertRegex.formatNumber)])],
      nameCombo: new FormControl(element.productName),
    });
    this.Combos.push(this.comboForm);
  }

  /**
   * validar el precio con descuento
   *
   * @returns
   * @memberof DetailOfferComponent
   */
  getPriceDescount() {
    let total = 0;
    this.Combos.controls.forEach((price: any) => {
      total += (price.value.ofertPriceComponet * price.value.ComboQuantity);
    });

    this.formUpdateOffer.controls.DiscountPrice.setValue(total);
    this.valuePrice = this.formUpdateOffer.controls.Price.setValue(total);
    this.totalCombo = total;
    this.formUpdateOffer.controls.DiscountPrice.setErrors({ price: true });
    if (total <= this.sellerMinPrice) {
      this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_must_less'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    }
    return total;
  }
  /**
   * validacion para verificar el precio
   *
   * @param {boolean} [showErrors=true]
   * @param {number} [total]
   * @memberof DetailOfferComponent
   */
  getVerifyPrice(showErrors: boolean = true, total?: number) {
    let errors = true;
    if (this.formUpdateOffer.controls.DiscountPrice.value) {
      if (this.formUpdateOffer.controls.DiscountPrice.value && parseFloat(this.formUpdateOffer.controls.DiscountPrice.value) >= this.sellerMinPrice) {
        errors = false;
        if (parseFloat(this.formUpdateOffer.controls.DiscountPrice.value) >= parseFloat(this.formUpdateOffer.controls.Price.value)) {
          if (showErrors) {
            this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_lower_discount'), this.languageService.instant('actions.close'), {
              duration: 3000,
            });
          }
        }
        if (parseFloat(this.formUpdateOffer.controls.DiscountPrice.value) !== parseFloat(this.totalCombo) && this.dataOffer.offerComponents.length !== 0) {
          if (showErrors) {
            this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.discount_price_sumatory_combo'), this.languageService.instant('actions.close'), {
              duration: 3000,
            });
          }
        }
      } else {
        this.formUpdateOffer.get('Currency').valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
          this.changeTypeCurrency(val);
          if (val === 'USD') {
            errors = false;
            if (parseFloat(this.formUpdateOffer.controls.DiscountPrice.value) >= parseFloat(this.formUpdateOffer.controls.Price.value)) {
              if (showErrors) {
                this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_lower_discount'), this.languageService.instant('actions.close'), {
                  duration: 3000,
                });
              }
            }
            if (parseFloat(this.formUpdateOffer.controls.DiscountPrice.value) !== parseFloat(this.totalCombo) && this.dataOffer.offerComponents.length !== 0) {
              if (showErrors) {
                this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.discount_price_sumatory_combo'), this.languageService.instant('actions.close'), {
                  duration: 3000,
                });
              }
            }
          }
          this.setCategoryError(errors);
        });
      }
    } else {
      if (this.formUpdateOffer.controls.Price.value && this.formUpdateOffer.controls.Price.value >= this.sellerMinPrice) {
        errors = false;
      } else {
        if (this.formUpdateOffer.get('Currency').value === 'COP') {
          this.setCategoryErrorPrice(errors);
        } else {
          const regexp = new RegExp(this.offertRegex.formatNumber),
            test = regexp.test(this.formUpdateOffer.controls.Price.value);
          errors = !test;
          this.setCategoryErrorPrice(errors);
        }
      }
    }
    this.sendArray();
  }

  /**
   * Metodo que activa variable apra habilitar o deshabilitar el boton
   *
   * @memberof OfertExpandedProductComponent
   */
  public sendArray() {
    if (parseFloat(this.formUpdateOffer.controls.DiscountPrice.value) >= parseFloat(this.formUpdateOffer.controls.Price.value)) {
      this.showButton = true;
    } else if (this.Combos.controls.length !== 0 && (parseFloat(this.formUpdateOffer.controls.DiscountPrice.value) && parseFloat(this.formUpdateOffer.controls.DiscountPrice.value) !== this.totalCombo)) {
      this.showButton = true;
    } else if (this.Combos.controls.length !== 0 && ((!this.formUpdateOffer.controls.DiscountPrice.value && (this.totalCombo !== parseFloat(this.formUpdateOffer.controls.Price.value))))) {
      this.showButton = true;
      this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.expanded_product.price_must_equal_combos'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    } else {
      this.showButton = false;
    }
  }
  /**
   * setear input error
   *
   * @param {boolean} show
   * @memberof DetailOfferComponent
   */
  public setCategoryError(show: boolean): void {
    if (this.formUpdateOffer.controls.Currency.value === 'COP') {
      if (show) {
        if (this.formUpdateOffer.controls.DiscountPrice.value <= this.sellerMinPrice) {
          this.formUpdateOffer.controls.DiscountPrice.setErrors({ price: show });
        }
      } else {
        this.formUpdateOffer.controls.DiscountPrice.setErrors(null);
      }
    }
  }
  /**
   * setear error en el input
   *
   * @param {boolean} show
   * @memberof DetailOfferComponent
   */
  public setCategoryErrorPrice(show: boolean): void {
    if (this.formUpdateOffer.controls.Currency.value === 'COP') {
      if (show) {
        if (this.formUpdateOffer.controls.Price.value <= this.sellerMinPrice) {
          this.formUpdateOffer.controls.Price.setErrors({ priceReal: show });
        }
      } else {
        this.formUpdateOffer.controls.Price.setErrors(null);
      }
    }
  }
  /**
   * validacion input para precio, combo y precio con descuento
   *
   * @memberof DetailOfferComponent
   */
  public valiteInput() {
    const price = this.formUpdateOffer.controls.Price.value;
    const discountPrice = this.formUpdateOffer.controls.DiscountPrice.value;
    let total = 0;
    if (this.Combos && this.Combos.controls && this.Combos.controls.length > 0) {
      this.Combos.controls.forEach((priceCombo: any) => {
        total += (priceCombo.value.ofertPriceComponet * priceCombo.value.ComboQuantity);
      });
      if (discountPrice === null || discountPrice === '' || discountPrice === ' ' || discountPrice === undefined) {
        this.formUpdateOffer.controls.Price.setErrors(null);
        if (total <= this.sellerMinPrice) {
          this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_must_less') + this.sellerMinPrice, this.languageService.instant('actions.close'), {
            duration: 3000,
          });
        } else {
          if (parseFloat(price) !== total) {
            this.showButton = true;
            this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.expanded_product.price_must_equal_combos'), this.languageService.instant('actions.close'), {
              duration: 3000,
            });
          } else {
            this.showButton = false;
          }
        }
      } else {
        if (parseFloat(discountPrice) >= parseFloat(price)) {
          this.showButton = true;
          this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_lower_discount'), this.languageService.instant('actions.close'), {
            duration: 3000,
          });
        } else {
          this.showButton = false;
          this.formUpdateOffer.controls.Price.setErrors(null);
          this.formUpdateOffer.controls.DiscountPrice.setErrors(null);
          if (parseFloat(discountPrice) !== total) {
            this.showButton = true;
          } else {
            this.showButton = false;
          }
        }
      }
    } else {
      if (price <= 8000 && this.formUpdateOffer.value.Currency === 'COP') {
        this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_must_less'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      } else {
        if (parseFloat(discountPrice) >= parseFloat(price)) {
          this.showButton = true;
        } else {
          this.showButton = false;
          if (this.formUpdateOffer.value.Currency === 'COP') {
            this.formUpdateOffer.controls.Price.setErrors(null);
            this.formUpdateOffer.controls.DiscountPrice.setErrors(null);
          }
        }
      }
    }
  }

  /**
   * funcion para abrir el modal de ofertas programadas, se le pasan parametros 
   *
   * @param {*} [paramsEdit]
   * @param {boolean} [isDelete]
   * @param {boolean} [isEdit]
   * @memberof DetailOfferComponent
   */
  offersPrograms(paramsEdit?: any, isDelete?: boolean, isEdit?: boolean) {
    let comboList = null;
    if (this.dataOffer.offerComponents || this.dataOffer.scheduleOffer != null) {
      if (this.dataOffer.scheduleOffer != null && isEdit) {
        comboList = this.dataOffer.scheduleOffer.componentCombos;
      } else {
        comboList = this.dataOffer.offerComponents;
      }

    }
    const dialogRef = this.dialog.open(ModalProgramOfertComponent, {
      width: '50%',
      data: {
        paramEdit: paramsEdit === undefined ? null : paramsEdit,
        isDelete: isDelete,
        isEdit: isEdit,
        discountPrice: this.DiscountPrice,
        isInternational: this.isInternational,
        price: this.Price,
        ean: this.Ean,
        sellerMinPrice: this.sellerMinPrice,
        Currency: this.Currency,
        offertRegex: this.offertRegex,
        idOffer: this.idOffer,
        idSeller: this.idSeller,
        combo: comboList
      },
    });

    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      this.dataOffer.scheduleOffer = val;
    });
    dialogIntance.processDelete$.subscribe((val) => {
      this.dataOffer.scheduleOffer = null;
    });
  }
  /**
   * funsion para activar el tab de ofertas combos y ofertas programadas
   *
   * @param {number} tab
   * @memberof DetailOfferComponent
   */
  btnTabActive(tab: number) {
    this.activeTabIndex = tab;
  }


  /**
   * inicializar control de combos
   *
   * @readonly
   * @type {FormArray}
   * @memberof DetailOfferComponent
   */
  get Combos(): FormArray {
    return this.formUpdateOffer.get('Combos') as FormArray;
  }
}
