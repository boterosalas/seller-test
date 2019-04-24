import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { LoadingService, ModalService } from '@app/core';
import { environment } from '@env/environment';
import { BulkLoadService } from '../../../bulk-load/bulk-load.service';
import { ListComponent } from '../../list/list.component';
import { MatSnackBar } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';


// Error when invalid control is dirty, touched, or submitted.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


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

export class DetailOfferComponent {

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
  public IsLogisticsExito: FormControl;
  public IsUpdatedStock: FormControl;
  public Currency: FormControl;

  offertRegex = {
    formatNumber: '',
    promiseDelivery: '',
    currency: '',
    isUpdatedStock: '',
    discountPrice: ''
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
  @Output() consumeServiceList = new EventEmitter<boolean>();

  /**
   *
   * @description Variable para controlar si es production o no
   * @memberof DetailOfferComponent
   */
  public isProductionEnv = environment.production;

  constructor(
    public list: ListComponent,
    public loadOfferService: BulkLoadService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    public SUPPORT: SupportService,
    public snackBar?: MatSnackBar,

  ) {
    this.isUpdateOffer = false;
    this.params = [];
  }

  ngOnInit() {
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
   * @method editOffer
   * @description Metodo para activar la edicion de la oferta.
   * @memberof DetailOfferComponent
   */
  editOffer() {
    this.isUpdateOffer = true;
    this.createValidators();
    this.createForm();
  }

  /**
   * @method cancelEditOffer
   * @description Metodo para desactivar la edicion de la oferta.
   * @memberof DetailOfferComponent
   */
  cancelEditOffer() {
    this.isUpdateOffer = false;
  }


  // Funcion para cargar datos de regex
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'ofertas');
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
    const formatNumber = /^[0-9]+$/;
    const formatPromEntrega = /^0*[1-9]\d?\s[a]{1}\s0*[1-9]\d?$/;
    const formatBoolean = /^[0-1]$/;

    this.Ean = new FormControl(this.dataOffer.ean);
    this.Stock = new FormControl(this.dataOffer.stock, [Validators.pattern(this.offertRegex.formatNumber)]);
    this.Price = new FormControl(this.dataOffer.price, [Validators.pattern(this.offertRegex.formatNumber)]);
    this.DiscountPrice = new FormControl(this.dataOffer.discountPrice, [Validators.pattern(this.offertRegex.formatNumber)]);
    this.AverageFreightCost = new FormControl(this.dataOffer.shippingCost, [Validators.pattern(this.offertRegex.formatNumber)]);
    this.PromiseDelivery = new FormControl(this.dataOffer.promiseDelivery, [Validators.pattern(this.offertRegex.promiseDelivery)]);
    this.IsFreeShipping = new FormControl(this.dataOffer.isFreeShipping ? 1 : 0);
    this.IsEnviosExito = new FormControl(this.dataOffer.isEnviosExito ? 1 : 0);
    this.IsFreightCalculator = new FormControl(this.dataOffer.isFreightCalculator ? 1 : 0);
    this.Warranty = new FormControl(this.dataOffer.warranty);
    this.IsLogisticsExito = new FormControl(this.dataOffer.isLogisticsExito ? 1 : 0);
    this.IsUpdatedStock = new FormControl({ value: this.dataOffer.isUpdatedStock ? 1 : 0, disabled: this.IsLogisticsExito.value ? false : true }, [Validators.pattern(this.offertRegex.isUpdatedStock)]);
    this.Currency = new FormControl(this.dataOffer.currency);
  }

  /**
   *  @description Metodo que crea el formGroup con las validaciones de los campos.
   *  @method createForm
   * @memberof DetailOfferComponent
   */
  createForm() {
    this.formUpdateOffer = new FormGroup({
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
      IsLogisticsExito: this.IsLogisticsExito,
      IsUpdatedStock: this.IsUpdatedStock,
      Currency: this.Currency
    });
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
          this.IsLogisticsExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.disable();
          break;
        case 'isEnviosExito':
          this.IsEnviosExito.setValue(1);
          this.IsFreeShipping.setValue(0);
          this.IsFreightCalculator.setValue(0);
          this.IsLogisticsExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.disable();
          break;
        case 'isFreightCalculator':
          this.IsFreightCalculator.setValue(1);
          this.IsFreeShipping.setValue(0);
          this.IsEnviosExito.setValue(0);
          this.IsLogisticsExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.disable();
          break;
        case 'IsLogisticsExito':
          this.IsLogisticsExito.setValue(1);
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
          this.IsLogisticsExito.setValue(0);
          this.IsUpdatedStock.setValue(0);
          this.IsUpdatedStock.disable();
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
        // this.DiscountPrice.reset(); Se elimina linea, con error al siempre hacer unfocus en precio borraba el precio de descuento.
        if (this.Price.value === '') {
        } else if (parseInt(this.Price.value, 10) < 8000 && this.Currency.value === 'COP') {
          this.formUpdateOffer.controls[input].setErrors({ 'isLessThanEightThousand': true });
        } else if (parseInt(this.Price.value, 10) <= parseInt(this.DiscountPrice.value, 10)) {
          this.formUpdateOffer.controls[input].setErrors({ 'isLessThanDiscPrice': true });
        } else {
          this.DiscountPrice.enable();
        }
        break;
      case 'DiscountPrice':

        if (this.DiscountPrice.value !== '') {
          if (parseInt(this.DiscountPrice.value, 10) < 8000 && this.Currency.value === 'COP') {
            this.formUpdateOffer.controls[input].setErrors({ 'isLessThanEightThousand': true });
          } else if (parseInt(this.DiscountPrice.value, 10) >= parseInt(this.Price.value, 10)) {
            this.formUpdateOffer.controls[input].setErrors({ 'isgreaterThanPrice': true });
          } else {
            this.formUpdateOffer.controls['Price'].reset(this.Price.value);
          }
        } else {
          this.formUpdateOffer.controls['Price'].reset(this.Price.value);
        }
        break;
      case 'PromiseDelivery':
        let val = this.PromiseDelivery.value;
        let start, end;
        const pattern = /(\d+ a \d+)$/;
        if (val.match(pattern)) {
          val = val.trim();
          start = parseInt(val.split('a')[0], 10);
          end = parseInt(val.split('a')[1], 10);

          if (start >= end) {
            this.formUpdateOffer.controls[input].setErrors({ 'startIsGreaterThanEnd': true });
          }
        }
        break;
    }
  }

  /**
   * @description Metodo para enviar los datos al servicio y actualizar la oferta.
   * @method submitUpdateOffer
   * @memberof DetailOfferComponent
   */
  submitUpdateOffer() {
    this.params.push(this.formUpdateOffer.value);
    this.loadingService.viewSpinner();
    this.loadOfferService.setOffers(this.params).subscribe(
      (result: any) => {
        if (result.status === 200) {
          const data = result;
          if (data.body.successful !== 0 || data.body.error !== 0) {
            this.loadingService.closeSpinner();
            this.goToListOffers();
            this.consumeServiceList.emit(true);
            this.params = [];
          } else if (data.body.successful === 0 && data.body.error === 0) {
            this.modalService.showModal('errorService');
            this.params = [];
          }
        } else {
          this.modalService.showModal('errorService');
          this.loadingService.closeSpinner();
          this.params = [];
        }
      }
    );
  }


  /**
   * Funcion que recibe como parametro el tipo de evento seleccionado en la lista desplegable (USD, COP), muestra un mensaje de cambio de moneda
   * y limpias las variables
   * @param event
   */

  changeTypeCurrency(event: any) {
    this.formUpdateOffer.controls['Price'].reset('');
    this.formUpdateOffer.controls['DiscountPrice'].reset('');
    this.formUpdateOffer.controls['AverageFreightCost'].reset('');
    this.snackBar.open(`El tipo de moneda se ha cambiado a (${event})`, 'Cerrar', {
      duration: 3000,
    });
  }


}
