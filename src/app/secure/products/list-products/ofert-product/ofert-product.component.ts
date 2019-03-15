
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { AuthService } from '@app/secure/auth/auth.routing';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from '../list-products.service';

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
    public matcher: MyErrorStateMatcher;

    @Input() applyOffer: any;



    constructor(
        private loadingService?: LoadingService,
        private productsService?: ListProductService,
        private modalService?: ModalService,
        private fb?: FormBuilder,
        public authService?: AuthService

    ) { }

    ngOnInit() {
        this.createFormControls();
        console.log('applyOffer: ', this.applyOffer);
    }

    createFormControls() {
        this.ofertProduct = this.fb.group({
            ofertStock: new FormControl(''),
            ofertPrice: new FormControl(''),
            ofertPriceDiscount: new FormControl(''),
            ofertPromiseDelivery: new FormControl(''),
            ofertShippingCost: new FormControl(''),
            ofertWarranty: new FormControl(''),
            ofertOption: new FormControl(''),
            ofertPriceComponet: new FormControl(''),
            ofertQuantityComponent: new FormControl(''),
            matcher: new MyErrorStateMatcher()
        });
    }
}
