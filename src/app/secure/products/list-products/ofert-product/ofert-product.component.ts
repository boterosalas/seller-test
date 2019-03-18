
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


    ) { }

    ngOnInit() {
        this.createFormControls();
        console.log('applyOffer: ', this.applyOffer);
        console.log(this.ofertProduct.value);
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
            UpdatedStock: new FormControl({ value: true }),
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
     *  instancia de elementos es una matriz o arreglo de formulario en lugar de un control de formulario
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

    getInfoOfert() {
        const data = [
            this.ofertProduct.controls.ofertPrice.value,
        ];
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
    }

    /**
     * Metodo que permite enviar la aoferta para aplicar.
     *
     * @memberof OfertExpandedProductComponent
     */
    sendJsonInformation() {
        this.getPriceDescount();
        console.log(this.ofertProduct.value);
        this.loadingService.viewSpinner();
        this.bulkLoadService.setOffers(this.ofertProduct.value)
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
}
