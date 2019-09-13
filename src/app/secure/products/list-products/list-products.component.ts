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
import { MenuModel, listProductsName, readFunctionality, offerFuncionality } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { TranslateService } from '@ngx-translate/core';

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
    fechaInicial: any;
    fechaFinal: any;
    showProducts = false;

    eanVariable = false;
    nameVariable = false;
    fechaInicialVariable = false;
    fechaFinalVariable = false;

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
    listFilterProducts: ListFilterProducts[] = [];
    validateRegex: any;
    productsProductExpanded: any = [];
    read = readFunctionality;
    offer = offerFuncionality;
    offerPermission = false;

    constructor(
        private languageService: TranslateService,
        private loadingService?: LoadingService,
        private productsService?: ListProductService,
        private modalService?: ModalService,
        private fb?: FormBuilder,
        public SUPPORT?: SupportService,
        public snackBar?: MatSnackBar,
        public authService?: AuthService,
    ) { }
    ngOnInit() {
        this.offerPermission = this.authService.getPermissionForMenu(listProductsName, this.offer);
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
            /* ean: new FormControl('', Validators.compose([, Validators.pattern(this.getValue('ean'))])),
             nit: new FormControl('', [Validators.pattern('^[0-9]*$')]), */
            ean: new FormControl(''),
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
        this.filterListProducts('', false, false);
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

    public changeDates(): void {
        this.applyFilter = false;
    }

    public filterListProducts(params?: any, activeFilter?: any, showErrors: boolean = true) {
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
            // Se declara esta variable para comparar las fechas.
            this.fechaInicial = new Date(this.filterProduts.controls.initialDate.value);
            this.initialDateList = this.getDate(new Date(this.filterProduts.controls.initialDate.value));
        }
        if (this.filterProduts.controls.finalDate.value) {
            // Se declara esta variable para comparar las fechas.
            this.fechaFinal = new Date(this.filterProduts.controls.finalDate.value);
            this.finalDateList = this.getDate(new Date(this.filterProduts.controls.finalDate.value));

        }
        this.fechaFinalVariable = false;
        const page = this.pagepaginator;
        const limit = this.pageSize;

        if (page || limit) {
            countFilter++;
        }
        if (this.nameProductList) {
            countFilter++;
            this.nameVariable = true;
        } else {
            this.nameVariable = false;
            countFilter++;
        }
        if (this.eanList) {
            this.eanVariable = true;
            countFilter++;
        } else {
            this.eanVariable = false;
            countFilter++;
        } if (this.creationDateList === null) {
        } else if (this.creationDateList === 'createDate') {
            this.fechaFinalVariable = true;
            this.creationDateList = true;
            if (this.initialDateList && this.finalDateList) {
                const inicial = this.fechaInicial.getTime();
                const final = this.fechaFinal.getTime();
                if (final < inicial) {
                    fecha++;
                    if (showErrors) {
                        this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.date_must_no_be_initial_date'), this.languageService.instant('actions.close'), {
                            duration: 3000,
                        });
                    }
                }
                countFilter++;
            } else {
                fecha++;
                if (showErrors) {
                    this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.you_must_initial'), this.languageService.instant('actions.close'), {
                        duration: 3000,
                    });
                }
            }
        } else {
            this.fechaFinalVariable = true;
            this.creationDateList = false;
            if (this.initialDateList && this.finalDateList) {
                const inicial = this.fechaInicial.getTime();
                const final = this.fechaFinal.getTime();
                if (final < inicial) {
                    fecha++;
                    // alert('La fecha inicial NO debe ser mayor a la fecha final');
                    if (showErrors) {
                        this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.you_must_initial'), this.languageService.instant('actions.close'), {
                            duration: 3000,
                        });
                    }
                }
                countFilter++;
            } else {
                fecha++;
                if (showErrors) {
                    // alert('Debes igresar fecha inicial y final para realizar filtro');
                    this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.you_must_initial'), this.languageService.instant('actions.close'), {
                        duration: 3000,
                    });
                }
            }
        }

        if (fecha > 0) {
            this.initialDateList = null;
            this.finalDateList = null;
        }

        if (countFilter) {
            urlParams2 = `${this.initialDateList}/${this.finalDateList}/${this.eanList}/${this.nameProductList}/${this.creationDateList}/${page}/${limit}/`;
        }

        this.loadingService.viewSpinner(); // Mostrar el spinner
        if (params && !fecha) {
            params.toggle();
        }
        if (activeFilter) {
            this.applyFilter = true;
        }
        // sigue el hilo de ejecucion, sin esperar a nadie
        this.showProducts = false;

        // osea aqui se puede demorar 1 seg o 10 segundos
        this.productsService.getListProducts(urlParams2).subscribe((result: any) => {
            this.showProducts = true;
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
        // esto lo hace primero que lo de arriba por que JS crea un hilo de ejecucion en la peticion.
        this.filterProducts(fecha); // esto lo hace asi la peticion no haya traido nada
    }

    public filterProducts(fecha?: any) {
        this.cleanFilterListProducts();
        this.nameProductList = this.filterProduts.controls.productName.value || null;
        this.eanList = this.filterProduts.controls.ean.value || null;
        if (!fecha) {
            this.creationDateList = this.filterProduts.controls.creationDate.value || null;
        }
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
            // this.cleanFilter();
        }
        if (!this.eanVariable) {
            this.filterProduts.controls.ean.setValue('');
            this.eanList = null;
        }
        if (!this.nameVariable) {
            this.filterProduts.controls.productName.setValue('');
            this.nameProductList = null;
        }
        if (!this.fechaFinalVariable) {
            this.filterProduts.controls.finalDate.setValue('');
            this.filterProduts.controls.initialDate.setValue('');
            this.filterProduts.controls.creationDate.setValue('');
            this.creationDateList = null;
            this.initialDateList = null;
            this.finalDateList = null;
        }
        this.filterListProducts(null, false, false);
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
