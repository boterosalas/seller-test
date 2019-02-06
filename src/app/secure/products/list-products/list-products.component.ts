import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from './list-products.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ModelFilterProducts } from './listFilter/filter-products.model';


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
    public paramsData: ModelFilterProducts;
    nameProductList: any;
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

    /**
     * Crear formualrio de filtro
     *
     * @memberof ListProductsComponent
     */
    createFormControls() {
        this.filterProduts = this.fb.group({
            productName: new FormControl('', Validators.compose([Validators.pattern(this.getValue('nameProduct'))])),
            ean: new FormControl('', Validators.compose([, Validators.pattern(this.getValue('ean'))])), /*
            nit: new FormControl('', [Validators.pattern('^[0-9]*$')]), */
            initialDate: new FormControl('', []),
            finalDate: new FormControl('', []),
            creationDate: new FormControl('', []),
            matcher: new MyErrorStateMatcher()
        });
    }

    // Funcion para limpiar formulario
    public cleanFilterListProducts(): void {
        this.nameProductList = null;
        this.eanList = null;
        this.creationDateList = null;
        this.initialDateList = null;
        this.finalDateList = null;
        this.listFilterProducts = [];

    }

    // Funcion para limpiar formulario
    public cleanFilter() {
        this.filterProduts.reset();
        this.cleanFilterListProducts();
    }

    // Funcion para cargar datos de regex
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

    public filterProducts() {
        this.cleanFilterListProducts();
    }

    public filterListProducts(params?: any) {
        // let urlParams: any;
        let urlParams2: any;
        let countFilter = 0;

        this.nameProductList = this.filterProduts.controls.productName.value || null;
        this.eanList = this.filterProduts.controls.ean.value || null;
        this.creationDateList = this.filterProduts.controls.creationDate.value || null;
        this.initialDateList = this.filterProduts.controls.initialDate.value || null;
        this.finalDateList = this.filterProduts.controls.finalDate.value || null;

        const initialDate = '04-02-2019';
        const finalDate = '05-02-2019';
        const ean = null;
        const creationDate = null;
        const page = 0;
        const limit = 30;

        // urlParams =  this.filterProduts.controls.productName.value;
        // urlParams =  this.filterProduts.controls.ean.value;

        if (this.nameProductList) {
            countFilter++;
        } else {
            countFilter++;
        }
        if (this.eanList) {
            countFilter++;
        } else {
            countFilter++;
        } if (this.creationDateList === null) {
        } else if (this.creationDateList === 'createDate') {
            this.creationDateList = true;
            this.initialDateList = this.initialDateList;
            this.finalDateList = this.finalDateList;
            countFilter++;
        } else {
            this.creationDateList = false;
            this.initialDateList = this.initialDateList;
            this.finalDateList = this.finalDateList;
            countFilter++;
        }

        if (countFilter) {
            urlParams2 = `${this.initialDateList}/${this.finalDateList}/${this.eanList}/${this.nameProductList}/${this.creationDateList}/${page}/${limit}/`;
        }

        console.log('urlParams2: ', urlParams2);
        this.loadingService.viewSpinner();
        this.productsService.getListProducts(urlParams2).subscribe((result: any) => {
            console.log('res: ', result);
            if (result.data !== undefined) {
                // const body = JSON.parse(result.data);
                this.productsList = result.data.list;
                console.log('productsList: ', this.productsList);
                // const response = result.body.data;
            } else {
                this.modalService.showModal('errorService');
            }
            this.loadingService.closeSpinner();
        });

    }
}
