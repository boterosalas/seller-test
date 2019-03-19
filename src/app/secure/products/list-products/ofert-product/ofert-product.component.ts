
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { AuthService } from '@app/secure/auth/auth.routing';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from '../list-products.service';
import { BulkLoadService } from '@app/secure/offers/bulk-load/bulk-load.service';
import { QuickSight } from 'aws-sdk/clients/all';
import { element } from '@angular/core/src/render3/instructions';
import { ProcessService } from '../../create-product-unit/component-process/component-process.service';

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
    // public Combos: FormArray;
    public matcher: MyErrorStateMatcher;

    @Input() applyOffer: any;


    public formatNumber = /^[0-9]+$/;
    public formatPromEntrega = /^0*[1-9]\d?\s[a]{1}\s0*[1-9]\d?$/;

    constructor(
        private loadingService?: LoadingService,
        private productsService?: ListProductService,
        private modalService?: ModalService,
        private fb?: FormBuilder,
        public authService?: AuthService,
        public bulkLoadService?: BulkLoadService,
        private process?: ProcessService

    ) { }

    ngOnInit() {
        this.createFormControls();
        console.log('applyOffer: ', this.applyOffer);
        console.log('hola', this.ofertProduct.value);
    }


    /**
     * Funcion apra crear el formulario
     *
     * @memberof OfertExpandedProductComponent
     */
    createFormControls() {
        this.ofertProduct = this.fb.group({
            Stock: new FormControl('', [Validators.required,
            Validators.pattern(this.formatNumber)]),
            Price: new FormControl('', [Validators.required,
            Validators.pattern(this.formatNumber)]),
            DiscountPrice: new FormControl('', [
                Validators.pattern(this.formatNumber)]),
            PromiseDelivery: new FormControl('', [Validators.required,
            Validators.pattern(this.formatPromEntrega)]),
            IsFreightCalculator: new FormControl('', [Validators.required,
            Validators.pattern(this.formatNumber)]),
            Warranty: new FormControl('', [Validators.required,
            Validators.pattern(this.formatNumber)]),
            ofertOption: new FormControl(''),
            IsUpdatedStock: new FormControl({ value: true }),
            Combos: this.fb.array([]), /*
            ofertPriceComponet: new FormControl('', [Validators.required,
                Validators.pattern(this.formatNumber)]),
            ComboQuantity: new FormControl('', [Validators.required,
                Validators.pattern(this.formatNumber)]),*/
        });
        this.matcher = new MyErrorStateMatcher();
        // tslint:disable-next-line:no-shadowed-variable
        this.applyOffer.eanesCombos.forEach((element: any) => {
            this.addItem(element.nameCombo);
        });
        console.log(44, this.Combos);

    }


    /**
     *  Instancia de elementos es una matriz o arreglo de formulario en lugar de un control de formulario
     *
     * @param {string} nameCombo
     * @memberof OfertExpandedProductComponent
     */
    addItem(nameCombo: string): void {
        const comboForm = this.fb.group({
            ofertPriceComponet: new FormControl('', [Validators.required,
            Validators.pattern(this.formatNumber)]),
            ComboQuantity: ['', Validators.compose([Validators.required, Validators.pattern(this.formatNumber)])],
            nameCombo: [nameCombo]
        });
        this.Combos.push(comboForm);
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
        // tslint:disable-next-line:no-shadowed-variable
        this.Combos.controls.forEach((element: any) => {
            console.log(element);
            total += (element.value.ofertPriceComponet * element.value.ComboQuantity);
        });
        console.log(total);

        return total;
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
            console.log(children);
            result.push([{ ofertPrice: children.value.ofertPriceComponet, quantity: children.value.ComboQuantity }]);
        });
        return result;
    }


    /**
     * Metodo para concatenar todo el arreglo y enviar la data
     *
     * @memberof OfertExpandedProductComponent
     */
    public sendDataToService(): void {
        const data = {
            EAN: this.applyOffer.ean,
            Stock: this.ofertProduct.controls.Stock.value,
            Price: this.ofertProduct.controls.Price.value,
            DiscountPrice: this.ofertProduct.controls.DiscountPrice.value,
            AverageFreightCost: this.ofertProduct.controls.IsFreightCalculator.value,
            PromiseDelivery: this.ofertProduct.controls.PromiseDelivery.value,
            Warranty: this.ofertProduct.controls.Warranty.value,
            IsFreeShipping: this.ofertProduct.controls.ofertOption.value === 'IsFreeShipping',
            IsEnviosExito: this.ofertProduct.controls.ofertOption.value === 'IsEnviosExito',
            IsFreightCalculator: this.ofertProduct.controls.ofertOption.value === 'IsFreightCalculator',
            IsLogisticsExito: this.ofertProduct.controls.ofertOption.value === 'IsLogisticsExito',
            IsUpdatedStock: this.ofertProduct.controls.IsUpdatedStock.value,
            // ComboQuantity: this.Combos.controls.ComboQuantity.value,
            // EanCombo: this.ofertProduct.controls.EanCombo.value,
        };

        let aryOfAry = [[data]];
        aryOfAry = aryOfAry.concat(this.getChildrenData());
        this.process.validaData(aryOfAry);
        this.loadingService.viewSpinner();
        this.bulkLoadService.setOffers(aryOfAry)
            .subscribe(
                (result: any) => {
                    if (result.status === 200) {
                        const dataResult = result;
                        log.info(data);
                        if (dataResult.body.successful !== 0 || dataResult.body.error !== 0) {
                        } else if (dataResult.body.successful === 0 && dataResult.body.error === 0) {
                            this.modalService.showModal('errorService');
                        }
                    } else {
                        this.modalService.showModal('errorService');
                    }
                    this.loadingService.closeSpinner();
                }
            );
    }

    /**
     * Metodo que permite enviar la aoferta para aplicar.
     *
     * @memberof OfertExpandedProductComponent
     */
    sendJsonInformation() {
        console.log(this.sendDataToService);
        this.getPriceDescount();
        console.log(this.ofertProduct.value);
        this.loadingService.viewSpinner();
        this.bulkLoadService.setOffers(this.sendDataToService)
            .subscribe(
                (result: any) => {
                    if (result.status === 200) {
                        const data = result;
                        log.info(data);
                        if (data.body.successful !== 0 || data.body.error !== 0) {
                        } else if (data.body.successful === 0 && data.body.error === 0) {
                            this.modalService.showModal('errorService');
                        }
                    } else {
                        this.modalService.showModal('errorService');
                    }
                    this.loadingService.closeSpinner();
                }
            );
    }

    public getPrice(): any {

    }
}
