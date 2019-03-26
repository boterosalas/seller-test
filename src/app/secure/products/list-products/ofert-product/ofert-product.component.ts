
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher, MatSnackBar } from '@angular/material';
import { AuthService } from '@app/secure/auth/auth.routing';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from '../list-products.service';
import { BulkLoadService } from '@app/secure/offers/bulk-load/bulk-load.service';
import { ProcessService } from '../../create-product-unit/component-process/component-process.service';
import { Router } from '@angular/router';

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

    public formatNumber = /^[0-9]+$/;
    public formatPromEntrega = /^0*[1-9]\d?\s[a]{1}\s0*[1-9]\d?$/;
    public valuePrice: any;
    public totalCombo: any;
    public showImage = false;
    public showButton = true;


    constructor(
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
                Validators.pattern(this.formatNumber)
            ]),
            Price: new FormControl('', [
                Validators.required,
                Validators.pattern(this.formatNumber),

            ]),
            DiscountPrice: new FormControl('', [
                Validators.pattern(this.formatNumber)
            ]),
            PromiseDelivery: new FormControl('', [Validators.required,
            Validators.pattern(this.formatPromEntrega)]),
            IsFreightCalculator: new FormControl('', [Validators.required,
            Validators.pattern(this.formatNumber)]),
            Warranty: new FormControl('', [Validators.required,
            Validators.pattern(this.formatNumber)]),
            ofertOption: new FormControl(''),
            IsUpdatedStock: new FormControl(''),
            Combos: this.fb.array([]), /*
            ofertPriceComponet: new FormControl('', [Validators.required,
                Validators.pattern(this.formatNumber)]),
            ComboQuantity: new FormControl('', [Validators.required,
                Validators.pattern(this.formatNumber)]),*/
        });
        this.matcher = new MyErrorStateMatcher();
        // tslint:disable-next-line:no-shadowed-variable
        this.applyOffer.eanesCombos.forEach((element: any) => {
            this.addItem(element.nameCombo, element.ean);
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
            Validators.pattern(this.formatNumber)]),
            ComboQuantity: ['', Validators.compose([Validators.required, Validators.pattern(this.formatNumber)])],
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
            if (this.ofertProduct.controls.DiscountPrice.value && this.ofertProduct.controls.DiscountPrice.value >= 8000) {
                errors = false;
                if (this.ofertProduct.controls.DiscountPrice.value >= this.ofertProduct.controls.Price.value) {
                    if (showErrors) {
                        this.snackBar.open('El precio no debe ser menor que el precio con descuento', 'Cerrar', {
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
                this.setCategoryError(errors);

            }
        } else {
            // this.ofertProduct.controls.Price.setValue(this.totalCombo);
            if (this.ofertProduct.controls.Price.value && this.ofertProduct.controls.Price.value >= 8000) {
                errors = false;
            } else {
                this.setCategoryErrorPrice(errors);
            }
        }
        this.sendArray();
    }


    public setCategoryError(show: boolean): void {
        if (show) {
            if (this.ofertProduct.controls.DiscountPrice.value <= 8000) {
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
            IsUpdatedStock: this.ofertProduct.controls.IsUpdatedStock.value === 'IsUpdatedStock' ? '1' : '0',
            // ComboQuantity: this.Combos.controls.ComboQuantity.value,
            // EanCombo: this.ofertProduct.controls.EanCombo.value,
        };

        let aryOfAry = [data];
        aryOfAry = aryOfAry.concat(this.getChildrenData());
        this.process.validaData(aryOfAry);
        this.loadingService.viewSpinner();
        this.bulkLoadService.setOffers(aryOfAry).subscribe(
            (result: any) => {
                if (result.status === 200 || result.status === 201) {
                    this.snackBar.open('Aplicó correctamente una oferta', 'Cerrar', {
                        duration: 3000,
                    });
                    // Le dice al servicio que cambie la variable, apra que aquel que este suscrito, lo cambie.
                    this.listService.changeEmitter();
                } else {
                    log.error('Error al intentar aplicar una oferta');
                    this.modalService.showModal('errorService');
                }
                this.loadingService.closeSpinner();
            }
        );
    }

    public sendArray() {
        if (this.ofertProduct.controls.DiscountPrice.value >= this.ofertProduct.controls.Price.value) {
            this.showButton = true;
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
        this.ofertProduct.reset();
        this.cleanFilterListProducts(result);
        // this.ofertProduct = null;
    }
}
