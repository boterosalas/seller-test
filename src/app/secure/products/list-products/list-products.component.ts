import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from './list-products.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher, PageEvent } from '@angular/material';
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
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    length = 0;
    pageSize = 30;
    pagepaginator = 0;
    pageSizeOptions: number[] = [30, 60, 120, 600];
    pageEvent: PageEvent;
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
            this.validateRegex = JSON.parse(res.body.body);
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

    /**
     * Funcion para cambiar paginador
     *
     * @param {*} param
     * @returns {*}
     * @memberof ListProductsComponent
     */
    public changePaginatorProducts(param: any): any {
        this.pageSize = param.pageSize;
        this.pagepaginator = param.pageIndex;
        this.filterListProducts();
    }
    /*
       getListProducts(params?: any) {
           this.loadingService.viewSpinner();
           this.productsService.getListProducts(params).subscribe((result: any) => {
               console.log('result: ', result);
               if (result.data !== undefined) {
                   // const body = JSON.parse(result.data);
                   this.productsList = result.data.list;
                   this.length = this.productsList.length;
                   console.log('productsList: ', this.productsList);
                   // const response = result.body.data;
                   this.loadingService.closeSpinner();
               } else {
                   this.loadingService.closeSpinner();
                   this.modalService.showModal('errorService');
               }
           });
       } */

    public getDate(date: any): any {
        const day = this.addsZeroDate(date.getDate().toString());
        const months = this.addsZeroDate((date.getMonth() + 1).toString());
        const year = date.getFullYear();

        return day + '-' + months + '-' + year;
    }

    public addsZeroDate(param: any): any {
        if (param.length < 2) {
            return '0' + param;
        }
        return param;
    }

    public filterListProducts(params?: any) {
        // let urlParams: any;
        let urlParams2: any;
        let countFilter = 0;

        this.nameProductList = this.filterProduts.controls.productName.value || null;
        this.eanList = this.filterProduts.controls.ean.value || null;
        this.creationDateList = this.filterProduts.controls.creationDate.value || null;
        this.initialDateList = this.getDate(new Date(this.filterProduts.controls.initialDate.value)) || null;
        this.finalDateList = this.getDate(new Date(this.filterProduts.controls.finalDate.value)) || null;

        const page = this.pagepaginator;
        const limit = this.pageSize;

        // urlParams =  this.filterProduts.controls.productName.value;
        // urlParams =  this.filterProduts.controls.ean.value;
        if (page || limit) {
            countFilter++;
        }
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

        this.loadingService.viewSpinner();
        this.productsService.getListProducts(urlParams2).subscribe((result: any) => {
            if (result.data !== undefined) {
                // const body = JSON.parse(result.data);
                this.productsList = result.data.list;
                this.length = this.productsList.length;
                // const response = result.body.data;
            } else {
                this.modalService.showModal('errorService');
            }
            this.loadingService.closeSpinner();
        });

        this.filterProducts();
    }

    public filterProducts() {
        this.cleanFilterListProducts();
        this.nameProductList = this.filterProduts.controls.productName.value || null;
        this.eanList = this.filterProduts.controls.ean.value || null;
        this.creationDateList = this.filterProduts.controls.creationDate.value || null;
        this.initialDateList = new Date(this.filterProduts.controls.initialDate.value) || null;
        this.finalDateList = new Date(this.filterProduts.controls.finalDate.value) || null;

        const data = [];
        data.push({ value: this.nameProductList, name: 'nameProductList', nameFilter: 'productName' });
        data.push({ value: this.eanList, name: 'eanList', nameFilter: 'ean' });
        data.push({ value: this.creationDateList, name: 'creationDateList', nameFilter: 'creationDate' });
        this.add(data);

    }
    // Metodo para añadir los chips de los filtros

    public add(data: any): void {
        data.forEach(element => {
            const value = element.value;
            if (value) {
                /* Add our listFilterSellers
                if ((value || '').trim()) { */
                if ((value || '')) {
                    this.listFilterProducts.push({ name, value: element.name, nameFilter: element.nameFilter });
                }

            }
        });
    }

    // Metodo para ir eliminando los filtros aplicados
    public remove(productsFilter: ListFilterProducts): void {
        console.log('list 1: ', this.listFilterProducts);
        console.log('list 1: ', productsFilter);
        if (productsFilter.nameFilter === 'creationDate') {
            this.filterProduts.controls.initialDate.setValue(null);
            this.filterProduts.controls.finallDate.setValue(null);
         }
        const index = this.listFilterProducts.indexOf(productsFilter);
        if (index >= 0) {
            this.listFilterProducts.splice(index, 1);
            this[productsFilter.value] = '';
            this.filterProduts.controls[productsFilter.nameFilter].setValue(null);
        }
        this.filterListProducts();
    }
}
