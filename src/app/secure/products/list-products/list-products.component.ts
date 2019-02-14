import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from './list-products.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher, PageEvent, MatPaginatorIntl, MatSnackBar } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ModelFilterProducts } from './listFilter/filter-products.model';
import { CustomPaginator } from './listFilter/paginatorList';
import { ReturnStatement } from '@angular/compiler';


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
    templateUrl: 'list-products.component.html',
    providers: [
        { provide: MatPaginatorIntl, useValue: CustomPaginator() }
    ]
})

export class ListProductsComponent implements OnInit {
    value = '';
    productsList: any = [];
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
    applyFilter = false;
    length = 0;
    pageSize = 30;
    pagepaginator = 0;
    separatorKeysCodes: number[] = [];
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
        public snackBar?: MatSnackBar,
    ) { }
    ngOnInit() {
        this.validateFormSupport();
    }

    onEnter(value: string) {
        this.value = value;
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
            initialDate: { disabled: true, value: '' },
            finalDate: { disabled: true, value: '' },
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

    /**
     * Funcion para limpiar filtros
     *
     * @memberof ListProductsComponent
     */
    public cleanAllFilter() {
        this.applyFilter = false;
        this.cleanFilter();
    }

    public filterApply(param: any) {
        this.filterListProducts(param, true);
    }

    // Funcion para limpiar formulario
    public cleanFilter() {
        this.filterProduts.reset();
        this.cleanFilterListProducts();
        this.filterListProducts();
    }

    // Funcion para cargar datos de regex
    public validateFormSupport(): void {
        const param = ['productos', null];
        this.SUPPORT.getRegexFormSupport(param).subscribe(res => {
            this.validateRegex = JSON.parse(res.body.body);
            this.createFormControls();
            this.filterListProducts();
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

    public filterListProducts(params?: any, activeFilter?: any) {
        // this.applyFilter = true;
        // let urlParams: any;
        let urlParams2: any;
        let countFilter = 0;
        let fecha = 0;
        this.initialDateList = null;
        this.finalDateList = null;
        this.nameProductList = this.filterProduts.controls.productName.value || null;
        this.eanList = this.filterProduts.controls.ean.value || null;
        this.creationDateList = this.filterProduts.controls.creationDate.value || null;
        if (this.filterProduts.controls.initialDate.value) {
            this.initialDateList = this.getDate(new Date(this.filterProduts.controls.initialDate.value));
        }
        if (this.filterProduts.controls.finalDate.value) {
            this.finalDateList = this.getDate(new Date(this.filterProduts.controls.finalDate.value));

        }

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
        } /*if (this.initialDateList && this.finalDateList) {
            countFilter++;
        } else {
            countFilter++;
        } if (this.finalDateList) {
            countFilter++;
        } else {
            countFilter++;
        } */
        if (this.eanList) {
            countFilter++;
        } else {
            countFilter++;
        } if (this.creationDateList === null) {
        } else if (this.creationDateList === 'createDate') {
            this.creationDateList = true;
            this.initialDateList = this.initialDateList;
            this.finalDateList = this.finalDateList;
            if (this.initialDateList && this.finalDateList) {
                if (this.finalDateList < this.initialDateList) {
                    fecha++;
                    // alert('La fecha inicial NO debe ser mayor a la fecha final');
                    this.snackBar.open('La fecha inicial NO debe ser mayor a la fecha final', 'Cerrar', {
                        duration: 3000,
                    });
                }
                countFilter++;
            } else {
                fecha++;
                // alert('Debes igresar fecha inicial y final para realizar filtro');
                this.snackBar.open('Debes igresar fecha inicial y final para realizar filtro', 'Cerrar', {
                    duration: 3000,
                });
            }
        } else {
            this.creationDateList = false;
            this.initialDateList = this.initialDateList;
            this.finalDateList = this.finalDateList;
            if (this.initialDateList && this.finalDateList) {
                if (this.finalDateList < this.initialDateList) {
                    fecha++;
                    // alert('La fecha inicial NO debe ser mayor a la fecha final');
                    this.snackBar.open('La fecha inicial NO debe ser mayor a la fecha final', 'Cerrar', {
                        duration: 3000,
                    });
                }
                countFilter++;
            } else {
                fecha++;
                // alert('Debes igresar fecha inicial y final para realizar filtro');
                this.snackBar.open('Debes igresar fecha inicial y final para realizar filtro', 'Cerrar', {
                    duration: 3000,
                });
            }
        }


        if (countFilter) {
            urlParams2 = `${this.initialDateList}/${this.finalDateList}/${this.eanList}/${this.nameProductList}/${this.creationDateList}/${page}/${limit}/`;
        }

        this.loadingService.viewSpinner();
        if (fecha === 0) {
            if (params) {
                params.toggle();
            }
            if (activeFilter) {
                this.applyFilter = true;
            }
            this.productsService.getListProducts(urlParams2).subscribe((result: any) => {
                if (result.data !== undefined) {
                    // const body = JSON.parse(result.data);
                    this.productsList = result.data.list;
                    this.length = result.data.total;
                    // const response = result.body.data;
                } else {
                    this.modalService.showModal('errorService');
                }
                this.loadingService.closeSpinner();
            }, error => {
                this.loadingService.closeSpinner();
            });
            this.loadingService.closeSpinner();
            this.filterProducts();
        } else {
            this.loadingService.closeSpinner();
        }
        this.loadingService.closeSpinner();
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

    public closeFilter() {
        if (!this.applyFilter) {
            this.cleanFilter();
        }
    }
    // Metodo para añadir los chips de los filtros

    public add(data: any): void {
        data.forEach(element => {
            const value = element.value;
            if (value) {
                if ((value || '')) {
                    if (element.value === 'createDate') {
                        element.value = 'Fecha de creación';
                    } else if (element.value === 'updateDate') {
                        element.value = 'Fecha de modificación';
                    }
                    this.listFilterProducts.push({ name: element.value, value: element.name, nameFilter: element.nameFilter });
                }

            }
        });
    }

    // Metodo para ir eliminando los filtros aplicados
    public remove(productsFilter: ListFilterProducts): void {
        if (productsFilter.nameFilter === 'creationDate') {
            this.filterProduts.controls.initialDate.setValue(null);
            this.filterProduts.controls.finalDate.setValue(null);
        }
        const index = this.listFilterProducts.indexOf(productsFilter);
        if (index >= 0) {
            this.listFilterProducts.splice(index, 1);
            this[productsFilter.value] = '';
            this.filterProduts.controls[productsFilter.nameFilter].setValue(null);
        }
        this.filterListProducts();
    }

    mirarfecha(): void {
        const final = this.finalDateList;
        const inicial = this.initialDateList;
        if (new Date(final) < new Date(inicial)) {
        }
    }

    public setCategoryError(show: boolean): void {
        const inicial = new Date(this.initialDateList);
        const final = new Date(this.finalDateList);
        if (show) {

            if (final < inicial) {
                this.filterProduts.controls.creationDate.setErrors({ date: show });
            }
        } else {
            this.filterProduts.controls.creationDate.setErrors(null);
        }
    }
}
