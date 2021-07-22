import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DATE_LOCALE, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ListService } from '../../list.service';
import moment from 'moment';
import { Subject } from 'rxjs';
import { LoadingService } from '@app/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateService } from '@app/shared/util/date.service';

@Component({
  selector: 'app-modal-program-ofert',
  templateUrl: './modal-program-ofert.component.html',
  styleUrls: ['./modal-program-ofert.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ],
})
export class ModalProgramOfertComponent implements OnInit {

  public form: FormGroup;
  public priceCurrent = '';
  public discountPriceCurrent = '';
  public ean = '';
  public comboList= null;
  public comboForm: FormGroup;
  public activeTabIndex = 0;
  public showButton: boolean;
  public unLess: boolean;
  public totalCombo: any;
  public valuePrice: any;
  public priceApproval = 0;
  public showForm = true;
  public today = moment().add(1, 'days').format('YYYY-MM-DD');

  public Price: any;
  public DiscountPrice: any;
  public isEdit = false;
  public isDelete = false;

  public scheduleOfferDateStart = null;
  public scheduleOfferDateEnd = null;

  public processFinish$ = new Subject<any>();
  public processDelete$ = new Subject<any>();
  tomorrow = DateService.getTomorrowDate();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalProgramOfertComponent>,
    private languageService: TranslateService,
    private loadingService: LoadingService,
    private fb?: FormBuilder,
    public snackBar?: MatSnackBar,
    private offerService?: ListService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.validateIsEdit();
    this.validateIsDelete();
    this.priceCurrent = this.data !== null ? this.data.price.value : null;
    this.discountPriceCurrent = this.data !== null ? this.data.discountPrice.value : null;
    this.ean = this.data !== null ? this.data.ean.value : null;
  }
  /**
   * funcion para crear formulario
   *
   * @memberof ModalProgramOfertComponent
   */
  createForm() {
    this.form = this.fb.group({
      Price: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.data.offertRegex.formatNumber)])),
      DiscountPrice: new FormControl('', Validators.compose([Validators.pattern(this.data.offertRegex.formatNumber)])),
      startDate: new FormControl('', Validators.compose([Validators.required])),
      dateEnd: new FormControl('', Validators.compose([Validators.required])),
      Combos: this.fb.array([]),
    });
    if (this.data && this.data.combo && this.data.combo.length > 0) {
      this.comboList = this.data.combo;
      this.createFormCombo(this.comboList);
    }
  }
  /**
   * funcion para crear formulario para combos
   *
   * @param {*} combosList
   * @memberof ModalProgramOfertComponent
   */
  createFormCombo(combosList: any) {
    if (combosList && combosList.length > 0) {
      combosList.forEach((element: any) => {
        this.addItem(element);
      });
    }
  }
  /**
   * funcion para crear formulario combo y setear valores
   *
   * @param {*} element
   * @memberof ModalProgramOfertComponent
   */
  addItem(element: any): void {
    const price = this.data.isEdit ? element.price || element.Price : '';
    const quantity = this.data.isEdit ? element.quantity || element.Quantity : '';
    const nameProduct = this.data.isEdit ? element.nameCombo : element.productName;
    this.comboForm = this.fb.group({
      Ean: element.ean,
      Price: new FormControl(price, Validators.compose([Validators.required, Validators.pattern(this.data.offertRegex.formatNumber)])),
      Quantity: [quantity, Validators.compose([Validators.required, Validators.pattern(this.data.offertRegex.formatNumber)])],
      nameCombo: new FormControl(nameProduct),
    });
    this.Combos.push(this.comboForm);
  }

  /**
   * funcion para validar si es editar
   *
   * @memberof ModalProgramOfertComponent
   */
  validateIsEdit() {
    if (this.data && this.data.paramEdit !== null && this.form) {
      this.scheduleOfferDateStart = this.data.paramEdit.initialDate ? moment(this.data.paramEdit.initialDate).utc().add(1, 'days').format('YYYY-MM-DD').toString() : null;
      this.scheduleOfferDateEnd = this.data.paramEdit.finalDate ? moment(this.data.paramEdit.finalDate).utc().add(1, 'days').format('YYYY-MM-DD').toString() : null;
      this.isEdit = true;
      this.showButton = false;
      const priceEdit = this.data.isInternational && this.data.paramEdit.price ? this.data.paramEdit.price : parseInt(this.data.paramEdit.price, 10);
      const discountPriceEdit = this.data.isInternational && this.data.paramEdit.discountPrice ? this.data.paramEdit.discountPrice : parseInt(this.data.paramEdit.discountPrice, 10);
      this.form.controls.Price.setValue(priceEdit);
      this.form.controls.DiscountPrice.setValue(discountPriceEdit);
      this.form.controls.startDate.setValue(this.scheduleOfferDateStart);
      this.form.controls.dateEnd.setValue(this.scheduleOfferDateEnd);
      this.form.markAsTouched();
    } else {
      this.isEdit = false;
    }
  }

  /**
   * funcion para activar el tab
   *
   * @param {number} tab
   * @memberof ModalProgramOfertComponent
   */
  btnTabActive(tab: number) {
    this.activeTabIndex = tab;
  }
  /**
   * funcion para cerrar el modal
   *
   * @memberof ModalProgramOfertComponent
   */
  close() {
    this.dialogRef.close();
  }
  /**
   * funcion para validar campo de precio y precio con descuento
   *
   * @memberof ModalProgramOfertComponent
   */
  valiteInput() {
    const price = this.form.controls.Price.value;
    this.Price = this.form.controls.Price.value;
    const discountPrice = this.form.controls.DiscountPrice.value;
    this.DiscountPrice = this.form.controls.DiscountPrice.value;
    let total = 0;
    if (this.Combos && this.Combos.controls && this.Combos.controls.length > 0) {
      this.Combos.controls.forEach((priceCombo: any) => {
        total += (priceCombo.value.Price * priceCombo.value.Quantity);
      });
      if (discountPrice === null || discountPrice === '' || discountPrice === ' ' || discountPrice === undefined) {
        this.form.controls.Price.setErrors(null);
        if (total <= this.data.sellerMinPrice) {
          this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_must_less') + this.data.sellerMinPrice, this.languageService.instant('actions.close'), {
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
          this.form.controls.Price.setErrors(null);
          this.form.controls.DiscountPrice.setErrors(null);
          if (parseFloat(discountPrice) === total) {
            this.showButton = false;
          } else {
            this.showButton = true;
          }
        }
      }
    } else {
      if (price <= 8000 && this.data.Currency.value === 'COP') {
        this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_must_less') + this.data.sellerMinPrice, this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      } else {
        if (parseFloat(discountPrice) >= parseFloat(price)) {
          this.showButton = true;
        } else {
          this.showButton = false;
          if (this.data.Currency.value === 'COP') {
            this.form.controls.Price.setErrors(null);
            this.form.controls.DiscountPrice.setErrors(null);
          }
        }
      }
    }
  }
  /**
   * funcion para saber cual de las dos opciones tiene que validar
   *
   * @param {*} input
   * @memberof ModalProgramOfertComponent
   */
  validInput(input: any) {
    switch (input) {
      case 'Price':
        if (this.Price === '') {
        } else if (parseInt(this.Price, 10) < this.data.sellerMinPrice) {
          this.form.controls[input].setErrors({ 'isLessThanEightThousand': true });
        } else if (parseFloat(this.Price) <= parseFloat(this.DiscountPrice)) {
          this.form.controls[input].setErrors({ 'isLessThanDiscPrice': true });
          this.form.controls.DiscountPrice.setErrors({ 'isLessThanDiscPrice': true });
        } else if ((+this.form.controls.Price.value === 0 || +this.form.controls.Price.value === 0.00) && this.data.Currency.value === 'USD') {
          this.form.controls[input].setErrors({ 'notCero': true });
        } else if ((+this.form.controls.DiscountPrice.value === 0 || +this.form.controls.DiscountPrice.value === 0.00) && this.form.controls.DiscountPrice.value && this.data.Currency.value === 'USD') {
          this.form.controls['DiscountPrice'].setErrors({ 'notCero': true });
        } else {
          this.form.controls['DiscountPrice'].enable();
        }
        break;
      case 'DiscountPrice':
        if (this.DiscountPrice !== '') {
          if (parseInt(this.DiscountPrice, 10) < this.data.sellerMinPrice) {
            this.form.controls[input].setErrors({ 'isLessThanEightThousand': true });
          } else if (parseFloat(this.DiscountPrice.value) >= parseFloat(this.Price.value)) {
            this.form.controls[input].setErrors({ 'isgreaterThanPrice': true });
          } else if ((+this.form.controls.DiscountPrice.value === 0 || +this.form.controls.DiscountPrice.value === 0.00) && this.data.Currency.value.value === 'USD') {
            this.form.controls[input].setErrors({ 'notCero': true });
          } else {
            this.form.controls['Price'].reset(this.Price.value);
          }
        } else {
          this.form.controls['Price'].reset(this.Price.value);
        }
        break;
    }
  }
  /**
   * funcion para validar el precio minimo y el precio con descuento
   *
   * @returns
   * @memberof ModalProgramOfertComponent
   */
  unLessDiscountPrice() {
    if (Number(this.form.controls.DiscountPrice.value) < this.data.sellerMinPrice) {
      this.form.controls.DiscountPrice.setErrors({ 'unLess': true });
      this.unLess = true;
      this.form.controls.DiscountPrice.markAsDirty();
      return false;
    } else {
      this.unLess = false;
      this.form.controls.DiscountPrice.setErrors(null);
      return true;
    }
  }
  /**
   * funcion para validar los precion de los combos con el precio activo
   *
   * @returns
   * @memberof ModalProgramOfertComponent
   */
  getPriceDescount() {
    let total = 0;
    this.Combos.controls.forEach((price: any) => {
      total += (price.value.Price * price.value.Quantity);
    });

    this.form.controls.DiscountPrice.setValue(total);
    this.valuePrice = this.form.controls.Price.setValue(total);
    this.totalCombo = total;
    this.form.controls.DiscountPrice.setErrors({ price: true });
    if (total <= this.data.sellerMinPrice) {
      this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.ofert_product.price_must_less'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    }
    return total;
  }
  /**
   * funcion para guardar o editar una oferta programada
   *
   * @param {number} approval
   * @memberof ModalProgramOfertComponent
   */
  programOfert(approval: number) {
    this.loadingService.viewSpinner();
    if (approval) {
      this.priceApproval = approval;
    }
    if (this.form) {
      const params = {
        IdOffer: this.data.idOffer,
        IdSeller: this.data.idSeller,
        Price: this.data.isInternational ? this.form.value.Price : parseInt(this.form.value.Price, 10),
        DiscountPrice: this.data.isInternational ? this.form.value.DiscountPrice : parseInt(this.form.value.DiscountPrice, 10),
        InitialDate: this.form.value.startDate ? moment(this.form.value.startDate).utc().format('YYYY-MM-DD') : null,
        FinalDate: this.form.value.dateEnd ? moment(this.form.value.dateEnd).utc().format('YYYY-MM-DD') : null,
        PriceApproval: this.priceApproval,
        ComponentCombos: this.form.value.Combos.length > 0 ? this.form.value.Combos : null,
      };
      const refresDetail = {
        componentCombos: this.form.value.Combos.length > 0 ? this.form.value.Combos : null,
        discountPrice: this.data.isInternational ? this.form.value.DiscountPrice : parseInt(this.form.value.DiscountPrice, 10),
        ean: this.ean,
        finalDate: this.form.value.dateEnd ? moment(this.form.value.dateEnd).utc().format('YYYY-MM-DD') : null,
        idOffer: this.data.idOffer,
        idSeller: this.data.idSeller,
        initialDate: this.form.value.startDate ? moment(this.form.value.startDate).utc().format('YYYY-MM-DD') : null,
        price: this.data.isInternational ? this.form.value.Price : parseInt(this.form.value.Price, 10),
        priceApproval: false
      };
      if (!this.isEdit) {
        this.offerService.scheduleoffer(params).subscribe(result => {
          if (result && result.body && result.body.data) {
            if (result.body.data.successful > 0) {
              this.processFinish$.next(refresDetail);
              this.dialogRef.close();
              this.loadingService.closeSpinner();
            } else if (result.body.data.error > 0 && result.body.data.offerNotifyViewModels.length > 0) {
              this.dialogRef.close();
            }
          }
        });
      } else {
        this.offerService.editScheduleoffer(params).subscribe(result => {
          if (result && result.body && result.body.data) {
            if (result.body.data.successful > 0) {
              this.dialogRef.close();
              this.processFinish$.next(refresDetail);
              this.loadingService.closeSpinner();
            } else if (result.body.data.error > 0 && result.body.data.offerNotifyViewModels.length > 0) {
              this.dialogRef.close();
            }
          }
        });
      }
    }
  }


  /**
   * Metodo para validar oferta 30% por encima o por debajo el cambio
   * @memberof DetailOfferComponent
   */
  validateRulesOfert(): void {
    const valHighUp = +this.priceCurrent * 1.30;
    const valHighDown = +this.priceCurrent * 0.70;
    const valLowUp = +this.discountPriceCurrent * 1.30;
    const valLowDown = +this.discountPriceCurrent * 0.70;
    const valPrice = +this.form.controls.Price.value;
    const valDiscount = +this.form.controls.DiscountPrice.value;

    if (this.form.controls.DiscountPrice.value !== 0 && this.form.controls.DiscountPrice.value !== '') {
      if (this.discountPriceCurrent === '0.00' || this.discountPriceCurrent === '0') {
        if (valDiscount < valHighDown || valDiscount > valHighUp) {
          this.showForm = false;
        } else {
          this.showForm = true;
          this.programOfert(0);
        }
      } else {
        if (valDiscount < valLowDown || valDiscount > valLowUp) {
          this.showForm = false;
        } else {
          this.showForm = true;
          this.programOfert(0);
        }
      }
    } else {

      if (this.discountPriceCurrent !== '0.00') {
        if (valPrice < valLowDown || valPrice > valLowUp) {
          this.showForm = false;
        } else {
          this.showForm = true;
          this.programOfert(0);
        }
      } else {
        if (valPrice < valHighDown || valPrice > valHighUp) {
          this.showForm = false;
        } else {
          this.showForm = true;
          this.programOfert(0);
        }
      }
    }
  }
  /**
   * funcion para validar si es delete 
   *
   * @memberof ModalProgramOfertComponent
   */
  validateIsDelete() {
    if (this.data.isDelete) {
      this.isDelete = true;
    } else {
      this.isDelete = false;
    }
  }
  /**
   * funcion para ver la vista activa
   *
   * @param {boolean} value
   * @memberof ModalProgramOfertComponent
   */
  showViewActive(value: boolean) {
    this.showForm = value;
  }
  /**
   * funcion para eliminar una oferta programada
   *
   * @memberof ModalProgramOfertComponent
   */
  deleteScheduleOffer() {
    this.loadingService.viewSpinner();
    let params = '';
    if (this.data) {
      params = '?idOffer=' + this.data.idOffer + '&idSeller=' + this.data.idSeller;
    }
    this.offerService.deleteScheduleoffer(params).subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this.processDelete$.next();
        this.loadingService.closeSpinner();
      }
    });
  }


  get Combos(): FormArray {
    return this.form.get('Combos') as FormArray;
  }


}
