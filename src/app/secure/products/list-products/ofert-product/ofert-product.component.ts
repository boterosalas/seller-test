
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar } from '@angular/material';
import { AuthService } from '@app/secure/auth/auth.routing';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from '../list-products.service';
import { BulkLoadService } from '@app/secure/offers/bulk-load/bulk-load.service';
import { ProcessService } from '../../create-product-unit/component-process/component-process.service';
import { Router } from '@angular/router';
import { SupportService } from '@app/secure/support-modal/support.service';
import { distinctUntilChanged, last, takeLast, repeat } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

const log = new Logger('OfertExpandedProductComponent');

@Component({
    selector: 'app-ofert-expanded-product',
    templateUrl: 'ofert-product.component.html',
    styleUrls: ['ofert-product.component.scss'],
})
export class OfertExpandedProductComponent implements OnInit {
    public ofertProduct: FormGroup;
    public comboForm: FormGroup;
    // public Combos: FormArray;
    public matcher: MyErrorStateMatcher;

    @Input() applyOffer: any;
    @Input() productsExpanded: any;

    public isTypeCurrency = false;
    // public formatNumber = /^[0-9]+$/;
    // public formatPromEntrega = /^0*[1-9]\d?\s[a]{1}\s0*[1-9]\d?$/;
    public valuePrice: any;
    public totalCombo: any;
    public showImage = false;
    public showButton = true;
    offertRegex = {
        formatNumber: '',
        promiseDelivery: '',
        price: ''
    };

    public validateNumberOrder: boolean;

    constructor(
        public SUPPORT: SupportService,
        private loadingService?: LoadingService,
        public snackBar?: MatSnackBar,
        private modalService?: ModalService,
        private fb?: FormBuilder,
        public authService?: AuthService,
        public bulkLoadService?: BulkLoadService,
        private process?: ProcessService,
        private router?: Router,
        private listService?: ListProductService
    ) { }

    ngOnInit() {
        this.validateFormSupport();
        this.createFormControls();
    }


    /**
     * Funcion apra crear el formulario
     *
     * @memberof OfertExpandedProductComponent
     */
    createFormControls() {
        this.ofertProduct = this.fb.group({
            Stock: new FormControl('', [
                Validators.required,
                Validators.pattern(this.offertRegex.price)
            ]),
            Price: new FormControl('', [
                Validators.required,
                Validators.pattern(this.offertRegex.price)
            ]),
            DiscountPrice: new FormControl('', [
                Validators.pattern(this.offertRegex.price)
            ]),
            PromiseDelivery: new FormControl('', [
                Validators.required,
                Validators.pattern(this.offertRegex.promiseDelivery)
            ]),
            IsFreightCalculator: new FormControl('', [
                Validators.required,
                Validators.pattern(this.offertRegex.price)
            ]),
            Warranty: new FormControl('', [
                Validators.required,
                Validators.pattern(this.offertRegex.formatNumber)
            ]),
            ofertOption: new FormControl(''),
            IsUpdatedStock: new FormControl(''),
            Combos: this.fb.array([]), /*
            ofertPriceComponet: new FormControl('', [Validators.required,
                Validators.pattern(this.formatNumber)]),
            ComboQuantity: new FormControl('', [Validators.required,
                Validators.pattern(this.formatNumber)]),*/
            Currency: new FormControl('COP')
        });

        // Borrar esta linea, para Internacional
        this.ofertProduct.get('Currency').disable();

        this.matcher = new MyErrorStateMatcher();
        // tslint:disable-next-line:no-shadowed-variable
        this.applyOffer.eanesCombos.forEach((element: any) => {
            this.addItem(element.nameCombo, element.ean);
        });
        // this.ofertProduct.controls.IsUpdatedStock.disable();
        // this.disableUpdate();
        this.ofertProduct.get('Currency').valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
            this.changeTypeCurrency(val);
            if (val === 'USD' && this.authService.completeUserData.country !== 'Colombia') {
                this.ofertProduct.get('ofertOption').setValue(null);
                this.ofertProduct.get('ofertOption').enabled && this.ofertProduct.get('ofertOption').disable();
            } else {
                this.ofertProduct.get('ofertOption').setValue(null);
                !this.ofertProduct.get('ofertOption').enabled && this.ofertProduct.get('ofertOption').enable();
            }
        });
    }


    /**
     *  Instancia de elementos es una matriz o arreglo de formulario en lugar de un control de formulario
     *
     * @param {string} nameCombo
     * @memberof OfertExpandedProductComponent
     */
    addItem(nameCombo: string, ean?: number, EanCombo?: number): void {
        this.comboForm = this.fb.group({
            ofertPriceComponet: new FormControl('', [Validators.required,
            Validators.pattern(this.offertRegex.formatNumber)]),
            ComboQuantity: ['', Validators.compose([Validators.required, Validators.pattern(this.offertRegex.formatNumber)])],
            nameCombo: [nameCombo],
            EAN: [ean],
            EanCombo: this.applyOffer.ean
        });
        this.Combos.push(this.comboForm);
    }

    /**
     * Seteamos el valor de los componentes combos que se manejan de tipo arrayForm para interactuar entre ellos.
     *
     * @readonly
     * @type {FormArray}
     * @memberof OfertExpandedProductComponent
     */
    get Combos(): FormArray {
        return this.ofertProduct.get('Combos') as FormArray;
    }

    /**
     * Funcion para activar o desactivar toogle de actualizar inventario
     *
     * @memberof OfertExpandedProductComponent
     */
    /*
        public disableUpdate(): void {
             this.ofertProduct.controls.ofertOption.valueChanges.subscribe(val => {
                 if (val === 'IsLogisticsExito') {
                     this.ofertProduct.controls.IsUpdatedStock.enable();
                 } else {
                    //  this.ofertProduct.controls.IsUpdatedStock.setValue(false);
                     this.ofertProduct.controls.IsUpdatedStock.enable();
                 }
             });
        } */

    /**
     * Obtiene el precio de descuento si tiene ean combos.
     *
     * @memberof OfertExpandedProductComponent
     */
    getPriceDescount() {
        let total = 0;
        this.Combos.controls.forEach((price: any) => {
            total += (price.value.ofertPriceComponet * price.value.ComboQuantity);
        });

        /* Agrege los valores a los imputs tiene q crear una regla donde compare si son iguales OK,
        pero si son diferentes q precio sea mayor eso lo hace en el validate del control */

        this.ofertProduct.controls.DiscountPrice.setValue(total);
        this.valuePrice = this.ofertProduct.controls.Price.setValue(total);
        this.totalCombo = total;
        if (total <= 8000 && this.ofertProduct.value.Currency === 'COP') {
            this.snackBar.open('El precio no debe ser menor que 8000', 'Cerrar', {
                duration: 3000,
            });
        }
        return total;
    }

    /**
     * Funcion para validar que el precio no sea mneor al precio con descuento.
     *
     * @param {boolean} [showErrors=true]
     * @memberof OfertExpandedProductComponent
     */
    getVerifyPrice(showErrors: boolean = true, total?: number) {
        let errors = true;
        if (this.ofertProduct.controls.DiscountPrice.value) {
            if (this.ofertProduct.controls.DiscountPrice.value && parseFloat(this.ofertProduct.controls.DiscountPrice.value) >= 8000) {
                errors = false;
                if (parseFloat(this.ofertProduct.controls.DiscountPrice.value) >= parseFloat(this.ofertProduct.controls.Price.value)) {
                    if (showErrors) {
                        this.snackBar.open('El precio no debe ser menor o igual que el precio con descuento', 'Cerrar', {
                            duration: 3000,
                        });
                    }
                } if (parseFloat(this.ofertProduct.controls.DiscountPrice.value) !== parseFloat(this.totalCombo) && this.applyOffer.eanesCombos.length !== 0) {
                    if (showErrors) {
                        this.snackBar.open('El precio con descuento debe ser igual a la suma de los combos', 'Cerrar', {
                            duration: 3000,
                        });
                    }
                }
            } else {
                if (this.ofertProduct.controls.Currency.value === 'USD') {
                    errors = false;
                    if (parseFloat(this.ofertProduct.controls.DiscountPrice.value) >= parseFloat(this.ofertProduct.controls.Price.value)) {
                        if (showErrors) {
                            this.snackBar.open('El precio no debe ser menor o igual que el precio con descuento', 'Cerrar', {
                                duration: 3000,
                            });
                        }
                    } if (parseFloat(this.ofertProduct.controls.DiscountPrice.value) !== parseFloat(this.totalCombo) && this.applyOffer.eanesCombos.length !== 0) {
                        if (showErrors) {
                            this.snackBar.open('El precio con descuento debe ser igual a la suma de los combos', 'Cerrar', {
                                duration: 3000,
                            });
                        }
                    }
                }
                this.setCategoryError(errors);
            }
        } else {
            // this.ofertProduct.controls.Price.setValue(this.totalCombo);
            if (this.ofertProduct.controls.Price.value && this.ofertProduct.controls.Price.value >= 8000) {
                errors = false;
            } else {
                if (this.ofertProduct.controls.Currency.value === 'COP') {
                    this.setCategoryErrorPrice(errors);
                } else {
                    errors = false;
                    this.setCategoryErrorPrice(errors);
                }
            }
        }
        this.sendArray();
    }


    public setCategoryError(show: boolean): void {
        if (show) {
            if (this.ofertProduct.controls.DiscountPrice.value <= 8000 && this.ofertProduct.controls.Currency.value === 'COP') {
                this.ofertProduct.controls.DiscountPrice.setErrors({ price: show });
            }
        } else {
            this.ofertProduct.controls.DiscountPrice.setErrors(null);
        }
    }

    public setCategoryErrorPrice(show: boolean): void {
        if (show) {
            if (this.ofertProduct.controls.Price.value <= 8000) {
                this.ofertProduct.controls.Price.setErrors({ priceReal: show });
            }
        } else {
            this.ofertProduct.controls.Price.setErrors(null);
        }
    }


    /**
     * Metodo para crear el arreglo de componentes de eanes combo
     *
     * @returns {Array<any>}
     * @memberof OfertExpandedProductComponent
     */
    getChildrenData(): Array<any> {
        const result = [];
        this.Combos.controls.forEach((children: any) => {
            result.push({
                EanCombo: children.value.EanCombo,
                Price: children.value.ofertPriceComponet,
                ComboQuantity: parseInt(children.value.ComboQuantity, 16),
                EAN: children.value.EAN,
                Stock: null,
                AverageFreightCost: null,
                IsEnviosExito: null,
                IsFreeShipping: null,
                IsFreightCalculator: null,
                PromiseDelivery: null,
                IsLogisticsExito: 0
            });
        });
        return result;
    }


    /**
     * Metodo para concatenar todo el arreglo y enviar la data
     *
     * @memberof OfertExpandedProductComponent
     */
    public sendDataToService(): void {
        // this.getVerifyPrice(true);
        // this.getPriceDescount();
        const data = {
            EAN: this.applyOffer.ean,
            Stock: this.ofertProduct.controls.Stock.value,
            Price: this.ofertProduct.controls.Price.value,
            DiscountPrice: this.ofertProduct.controls.DiscountPrice.value,
            AverageFreightCost: this.ofertProduct.controls.IsFreightCalculator.value,
            PromiseDelivery: this.ofertProduct.controls.PromiseDelivery.value,
            Warranty: this.ofertProduct.controls.Warranty.value,
            IsFreeShipping: this.ofertProduct.controls.ofertOption.value === 'IsFreeShipping' ? '1' : '0',
            IsEnviosExito: this.ofertProduct.controls.ofertOption.value === 'IsEnviosExito' ? '1' : '0',
            IsFreightCalculator: this.ofertProduct.controls.ofertOption.value === 'IsFreightCalculator' ? '1' : '0',
            IsLogisticsExito: this.ofertProduct.controls.ofertOption.value === 'IsLogisticsExito' ? '1' : '0',
            IsUpdatedStock: this.ofertProduct.controls.IsUpdatedStock.value === true ? '1' : '0',
            // ComboQuantity: this.Combos.controls.ComboQuantity.value,
            // EanCombo: this.ofertProduct.controls.EanCombo.value,
            Currency: this.ofertProduct.controls.Currency.value,
        };
        let aryOfAry = [data];
        aryOfAry = aryOfAry.concat(this.getChildrenData());
        this.process.validaData(aryOfAry);
        this.loadingService.viewSpinner();
        this.bulkLoadService.setOffersProducts(aryOfAry).subscribe(
            (result: any) => {
                if (result.status === 200 || result.status === 201) {
                    this.snackBar.open('Aplicó correctamente una oferta', 'Cerrar', {
                        duration: 3000,
                    });
                    this.loadingService.closeSpinner();

                    // Le dice al servicio que cambie la variable, para que aquel que este suscrito, lo cambie.
                    this.listService.changeEmitter();
                    window.location.reload();

                } else {
                    log.error('Error al intentar aplicar una oferta');
                    this.modalService.showModal('errorService');
                }
                this.loadingService.closeSpinner();
                window.location.reload();

            }, error => {
                this.loadingService.closeSpinner();
                window.location.reload();
            });
    }

    /**
     * Metodo que activa variable apra habilitar o deshabilitar el boton
     *
     * @memberof OfertExpandedProductComponent
     */
    public sendArray() {
        if (parseFloat(this.ofertProduct.controls.DiscountPrice.value) >= parseFloat(this.ofertProduct.controls.Price.value)) {
            this.showButton = true;
        } else if (this.applyOffer.eanesCombos.length !== 0 && (parseFloat(this.ofertProduct.controls.DiscountPrice.value) && parseFloat(this.ofertProduct.controls.DiscountPrice.value) !== this.totalCombo)) {
            this.showButton = true;
        } else if (this.applyOffer.eanesCombos.length !== 0 && ((!this.ofertProduct.controls.DiscountPrice.value && (this.totalCombo !== parseFloat(this.ofertProduct.controls.Price.value))))) {
            this.showButton = true;
            this.snackBar.open('El precio debe ser igual a la suma de los combos sino existe precio con descuento.', 'Cerrar', {
                duration: 3000,
            });
        } else {
            this.showButton = false;
            // this.sendDataToService();
        }
    }

    public abc() {
        if (this.comboForm.controls.ComboQuantity.value !== 0) {
            if (this.applyOffer.eanesCombos.length !== 0) {
                if (this.ofertProduct.controls.DiscountPrice.value === null || this.ofertProduct.controls.DiscountPrice.value === '') {
                    this.ofertProduct.controls.Price.setValue(this.totalCombo);
                }
            }
        }
    }

    public cleanFilterListProducts(result: any) {
        result = null;
    }

    // Funcion para limpiar formulario
    public cleanFilter(result?: any) {
        this.ofertProduct.controls.Stock.reset();
        this.ofertProduct.controls.Price.reset();
        this.ofertProduct.controls.DiscountPrice.reset();
        this.ofertProduct.controls.PromiseDelivery.reset();
        this.ofertProduct.controls.IsFreightCalculator.reset();
        this.ofertProduct.controls.Warranty.reset();
        this.ofertProduct.controls.ofertOption.reset();
        this.ofertProduct.controls.IsUpdatedStock.reset();
        if (this.applyOffer.eanesCombos.length !== 0) {
            this.Combos.controls.forEach((price: any) => {
                price.controls.ofertPriceComponet.reset('');
                price.controls.ComboQuantity.reset('');
            });
        }

        if (this.ofertProduct.controls.Currency.value !== 'COP') {
            this.ofertProduct.controls.Currency.setValue('COP');
        }
        this.cleanFilterListProducts(result);
    }

    /*
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

    /*
    * Funcion que recibe como parametro el tipo de evento seleccionado en la lista desplegable (USD, COP), muestra un mensaje de cambio de moneda
    * limpias las variables precio, precio con descuento y costo de flete promedio
    * si cuenta con combos, al cambiar el tipo de moneda tambien se aplica el reseteo de las variables precio y cantidad de combo
    * @param event
    */

    changeTypeCurrency(event: any) {
        this.setCategoryError(false);
        this.ofertProduct.controls.Price.reset('');
        this.ofertProduct.controls.DiscountPrice.reset('');
        this.ofertProduct.controls.IsFreightCalculator.reset('');
        this.snackBar.open(`El tipo de moneda se ha cambiado a (${event})`, 'Cerrar', {
            duration: 3000,
        });

        if (this.applyOffer.eanesCombos.length !== 0) {
            this.Combos.controls.forEach((price: any) => {
                price.controls.ofertPriceComponet.reset('');
                price.controls.ComboQuantity.reset('');
            });
        }

        if (event === 'USD') {
            this.ofertProduct.controls['DiscountPrice'].setValidators([Validators.pattern(this.offertRegex.formatNumber)]);
            this.ofertProduct.controls['Price'].setValidators([Validators.pattern(this.offertRegex.formatNumber)]);
            this.ofertProduct.controls['IsFreightCalculator'].setValidators([Validators.pattern(this.offertRegex.formatNumber)]);
        } else {
            this.ofertProduct.controls['DiscountPrice'].setValidators([Validators.pattern(this.offertRegex.price)]);
            this.ofertProduct.controls['Price'].setValidators([Validators.pattern(this.offertRegex.price)]);
            this.ofertProduct.controls['IsFreightCalculator'].setValidators([Validators.pattern(this.offertRegex.price)]);
        }
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
            this.createFormControls();
        });
    }

    notifyEvent(value: any) {
        switch (value.toString()) {
            case 'IsFreeShipping':
                const radioIsFreeShipping = document.getElementById('isFreeShipping');
                if (value === this.ofertProduct.get('ofertOption').value) {
                    this.ofertProduct.get('ofertOption').setValue('');
                    setTimeout(() => {
                        radioIsFreeShipping && radioIsFreeShipping.classList.remove('mat-radio-checked');
                    });
                } else {
                    this.ofertProduct.get('ofertOption').setValue('IsFreeShipping');
                    radioIsFreeShipping && radioIsFreeShipping.classList.add('mat-radio-checked');
                }
                break;
            case 'IsEnviosExito':
                const radioIsEnviosExito = document.getElementById('isEnviosExito');
                if (value === this.ofertProduct.get('ofertOption').value) {
                    this.ofertProduct.get('ofertOption').setValue('');
                    setTimeout(() => {
                        radioIsEnviosExito && radioIsEnviosExito.classList.remove('mat-radio-checked');
                    });
                } else {
                    this.ofertProduct.get('ofertOption').setValue('IsEnviosExito');
                    radioIsEnviosExito && radioIsEnviosExito.classList.add('mat-radio-checked');
                }
                break;
        }
    }


    validatePromiseDeliveri() {
        const promiseDeliExample = this.ofertProduct.controls.PromiseDelivery.value;
        const tes_splitted = promiseDeliExample.split(/\s(a|-|to)\s/);
        const result = tes_splitted[0] + ' a ' + tes_splitted[2];
        this.validateNumberOrder = Number(tes_splitted[2]) > Number(tes_splitted[0]);
        if (this.validateNumberOrder === true) {
        } else {
            this.snackBar.open('El primer número no debe ser mayor al segundo', 'Cerrar', {
                duration: 3000,
            });
        }
        console.log('result: ', result);
    }
}
