import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from './list-products.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

const log = new Logger('ListProductsComponent');


@Component({
    selector: 'app-list-products',
    styleUrls: ['list-products.component.scss'],
    templateUrl: 'list-products.component.html'
})

export class ListProductsComponent implements OnInit {
    productsList: any;
    public filterProduts: FormGroup;
    public matcher: MyErrorStateMatcher;
    constructor(
        private loadingService?: LoadingService,
        private productsService?: ListProductService,
        private modalService?: ModalService,
        private fb?: FormBuilder
    ) { }
    ngOnInit() {
        this.getListProducts();
    }

    getListProducts(params?: any) {
        this.loadingService.viewSpinner();
        this.productsService.getListProducts(params).subscribe((result: any) => {
            console.log('result: ', result);
            if (result.data !== undefined) {
                // const body = JSON.parse(result.data);
                this.productsList = result.data.list;
                console.log('productsList: ', this.productsList);
                // const response = result.body.data;
                this.loadingService.closeSpinner();
            } else {
                this.loadingService.closeSpinner();
                this.modalService.showModal('errorService');
            }
        });
    }

    /**
     * Crear formualrio de filtro
     *
     * @memberof ListProductsComponent
     */
    createFormControls() {
        this.filterProduts = this.fb.group({
            product: new FormControl('', []),
            ean: new FormControl('', []), /*
            nit: new FormControl('', [Validators.pattern('^[0-9]*$')]), */
            creationDate: new FormControl('', []),
            updateDate: new FormControl('', []),
            initialDate: new FormControl('', []),
            finalDate: new FormControl('', []),
            matcher: new MyErrorStateMatcher()
        });
    }
}
