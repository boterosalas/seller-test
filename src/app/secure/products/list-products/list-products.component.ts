import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from './list-products.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';


export interface ListFilterProducts {
    name: string;
    value: string;
    nameFilter: string;
}

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
    productList: any;
    eanList: any;
    creationDateList: any;
    initialDateList: any;
    finalDateList: any;
    listFilterProducts: ListFilterProducts[] = [
    ];
    validateRegex: any;
    constructor(
        private loadingService?: LoadingService,
        private productsService?: ListProductService,
        private modalService?: ModalService,
        private fb?: FormBuilder,
        public SUPPORT?: SupportService,
    ) { }
    ngOnInit() {
        this.validateFormSupport();
        this.getInfoProducts();
    }

    public getInfoProducts(): void {
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
            product: new FormControl('', Validators.compose([Validators.pattern(this.getValue('nameProduct'))])),
            ean: new FormControl('', Validators.compose([, Validators.pattern(this.getValue('ean'))])), /*
            nit: new FormControl('', [Validators.pattern('^[0-9]*$')]), */
            initialDate: new FormControl('', []),
            finalDate: new FormControl('', []),
            creationDate: new FormControl('', Validators.required),
            matcher: new MyErrorStateMatcher()
        });
    }

    public cleanFilterListProducts(): void {
        this.productList = null;
        this.eanList = null;
        this.creationDateList = null;
        this.initialDateList = null;
        this.finalDateList = null;
        this.listFilterProducts = [];

    }

    public cleanFilter() {
        this.filterProduts.reset();
        this.cleanFilterListProducts();
    }

    public validateFormSupport(): void {
        const param = ['productos', null];
        this.SUPPORT.getRegexFormSupport(param).subscribe(res => {
            console.log('res: ', res);
            this.validateRegex = JSON.parse(res.body.body);
            console.log('this.validateRegex: ', this.validateRegex);
            this.createFormControls();
        });
    }

    /**
     * Obtiene el valor de la regex
     *
     */
    public getValue(name: string): string {
        for (let i = 0; i < this.validateRegex.Data.length; i++) {
            if (this.validateRegex.Data[i].Identifier === name) {
                return this.validateRegex.Data[i].Value;
            }
        }
        return null;
    }


}
