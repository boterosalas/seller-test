import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { LoadingService, ModalService, UserParametersService } from '@app/core';
import { ListProductService } from './list-products.service';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher, PageEvent, MatPaginatorIntl, MatSnackBar, MatPaginator, MatDialog, MatSidenav } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ModelFilterProducts } from './listFilter/filter-products.model';
import { MenuModel, listProductsName, readFunctionality, offerFuncionality, updateFunctionality, unitaryCreateName, deleteFunctionality } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';
import { UserInformation } from '@app/shared';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DownloadProductsComponent } from './download-products/download-products.component';
import { DownloadProductsSellerComponent } from './download-products-seller/download-products-seller.component';

export interface ListFilterProducts {
    name: string;
    value: string;
    nameFilter: string;
}

export interface FilterList {
    Id: string;
    Name: string;
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
        {
            provide: MatPaginatorIntl,
            useClass: MatPaginatorI18nService,
        }
    ],
})

export class ListProductsComponent implements OnInit {
    value = '';
    productsList: any = [];
    public filterProduts: FormGroup;
    public filterCategory: FormGroup;
    // public myProduct = false;
    @Input() myProduct = false;
    @Input() showTabs = true;
    @Input() showButtonDownload = true;

    public matcher: MyErrorStateMatcher;
    public paramsData: ModelFilterProducts;
    nameProductList: any;
    eanList: any;
    creationDateList: any;
    initialDateList: any;
    finalDateList: any;
    fechaInicial: any;
    fechaFinal: any;
    pluVtexList: any;
    categoryList: any;
    showProducts = false;
    // user info
    public user: UserInformation;

    eanVariable = false;
    pluVariable = false;
    nameVariable = false;
    fechaInicialVariable = false;
    fechaFinalVariable = false;
    categoryVariable = false;
    showFilter = true;

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
    edit = updateFunctionality;
    delete= deleteFunctionality;
    offerPermission = false;
    editPermission = false;
    deletePermission = false;
    permissionComponent: MenuModel;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild('drawer', {static: false}) drawer: MatSidenav;
    listCategories: any;
    categoryInfo: any;


    validateKey = true;
    keywords: Array<any> = [];
    listCategories2: any;
    idcategory: any;
    namecategory: Array<any> = [];

    isAdmin = false;
    dataChips: Array<any> = [];
    invalidCategory: Boolean = false;

    constructor(
        private languageService: TranslateService,
        public userParams: UserParametersService,
        private loadingService?: LoadingService,
        private productsService?: ListProductService,
        private modalService?: ModalService,
        private fb?: FormBuilder,
        public SUPPORT?: SupportService,
        public snackBar?: MatSnackBar,
        public authService?: AuthService,
        public dialog?: MatDialog,
    ) {
    }
    ngOnInit() {
        console.log('myProduct: ', this.myProduct);
        this.offerPermission = this.authService.getPermissionForMenu(listProductsName, this.offer);
        this.editPermission = this.authService.getPermissionForMenu(unitaryCreateName, 'Editar');
        this.deletePermission = this.authService.getPermissionForMenu(listProductsName, this.delete );
        this.getDataUser();
        this.validateFormSupport();
        this.refreshCategoryTree();
        if (this.showTabs) {
            this.closedDraw();
        }
    }
    /**
     * funcion para cerrar el contenedor de filtros
     *
     * @memberof ListProductsComponent
     */
    closedDraw() {
        setTimeout(() => {
            this.drawer.closedStart.subscribe(res => {
                const principalToolbar = document.getElementById('principal-toolbar');
                const matToolbar = document.getElementById('matToolbar');
                if (principalToolbar && principalToolbar.classList.contains('tabsShowZindex')) {
                    principalToolbar.classList.remove('tabsShowZindex');
                }
                matToolbar.classList.remove('notFixed');
            });
        }, 1000);
    }

    /**
     * Metodo para obtener el listado de categorías
     * @memberof ListProductsComponent
     */
    public getCategoriesList() {
        this.loadingService.viewSpinner();
        this.productsService.getCateriesList().subscribe((result: any) => {
            if (result.statusCode === 200) {
                const body = JSON.parse(result.body);
                this.listCategories = body.Data;
            }
            this.loadingService.closeSpinner();
        });
    }

    /**
     * Funcion para guardar arreglo de categorias
     * @memberof ListProductsComponent
     */
    saveIdCategory() {
        this.idcategory = [];
        this.namecategory = [];
        this.keywords.forEach(element => {
            this.listCategories.find(el => {
                if (element === el.Name) {
                    if (this.idcategory.find(id => id === el.Id)) {
                    } else {
                        this.idcategory.push(el.Id);
                        this.namecategory.push(el.Name);
                    }
                }
            });
        });
    }

    /**
     * Función para ir guardando las categorías como chips.
     * @memberof ListProductsComponent
     */
    public saveKeyword(): void {
        let word = this.filterProduts.controls.category.value;
        if (word) {
            word = word.trim();
            if (word.search(',') === -1) {
                if (this.invalidCategory === false) {
                    this.keywords.push(word);
                }
            } else {
                const counter = word.split(',');
                counter.forEach(element => {
                    if (element) {
                        this.keywords.push(element);
                    }
                });
            }
            this.filterProduts.controls.category.clearValidators();
            this.filterProduts.controls.category.reset();
            this.validateKey = this.keywords.length > 0 ? false : true;
        }
        this.saveIdCategory();
    }

    /**
     * Funcion para eliminar las categorias en el filtro de listado de productos.
     * @param {number} indexOfValue
     * @memberof ListProductsComponent
     */
    public deleteKeywork(indexOfValue: number): void {
        this.keywords.splice(indexOfValue, 1);
        this.validateKey = this.keywords.length > 0 ? false : true;
        if (this.keywords.length < 1) {
            this.filterProduts.setErrors({ required: true });
        }
        this.saveIdCategory();
    }

    /**
     * Metodo para abrir modal para la descarga de los productos solo admin
     * @memberof ListProductsComponent
     */
    openDialogDownloadProducts() {
        if (this.filterProduts.controls.initialDate.value) {
            this.initialDateList = this.getDate(new Date(this.filterProduts.controls.initialDate.value));
        } else {
            this.initialDateList = null;
        }
        if (this.filterProduts.controls.finalDate.value) {
            this.finalDateList = this.getDate(new Date(this.filterProduts.controls.finalDate.value));
        } else {
            this.finalDateList = null;
        }

        if (this.creationDateList === 'createDate') {
            this.creationDateList = true;
        } else if (this.creationDateList === 'updateDate') {
            this.creationDateList = false;
        } else {
            this.creationDateList = null;
        }
        const dataToSend = {
            ean: this.eanList || null,
            plu: this.pluVtexList || null,
            product: this.nameProductList || null,
            categories: this.categoryList || null,
            creationDate: this.creationDateList || null,
            initialDate: this.initialDateList || null,
            finalDate: this.finalDateList || null
        };

        const dialogRef = this.dialog.open(DownloadProductsComponent, {
            data: dataToSend
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

     /**
     * Metodo para abrir modal para la descarga de los productos seller
     * @memberof ListProductsComponent
     */
    openDialogDownloadProductsSeller() {
        if (this.filterProduts.controls.initialDate.value) {
            this.initialDateList = this.getDate(new Date(this.filterProduts.controls.initialDate.value));
        } else {
            this.initialDateList = null;
        }
        if (this.filterProduts.controls.finalDate.value) {
            this.finalDateList = this.getDate(new Date(this.filterProduts.controls.finalDate.value));
        } else {
            this.finalDateList = null;
        }

        if (this.creationDateList === 'createDate') {
            this.creationDateList = true;
        } else if (this.creationDateList === 'updateDate') {
            this.creationDateList = false;
        } else {
            this.creationDateList = null;
        }
        const dataToSend = {
            ean: this.eanList || null,
            plu: this.pluVtexList || null,
            product: this.nameProductList || null,
            categories: this.categoryList || null,
            creationDate: this.creationDateList || null,
            initialDate: this.initialDateList || null,
            finalDate: this.finalDateList || null
        };

        const dialogRef = this.dialog.open(DownloadProductsSellerComponent, {
            data: dataToSend
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }


    /**
     * Función para obtener la información del usuario logueado
     * @memberof ListProductsComponent
     */
    async getDataUser() {
        this.user = await this.userParams.getUserData();
        if (this.user.sellerProfile !== 'seller' && this.user.sellerProfile && this.user.sellerProfile !== null) {
            this.isAdmin = true;
            this.permissionComponent = this.authService.getMenuProfiel(listProductsName, 1);
            this.setPermission(1);
        } else {
            this.isAdmin = false;
            this.permissionComponent = this.authService.getMenuProfiel(listProductsName, 0);
            this.setPermission(0);
        }
    }

    /**
     * Seteo permiso para editar
     * @param {number} typeProfile
     * @memberof ListProductsComponent
     */
    setPermission(typeProfile: number) {
        this.editPermission = this.getFunctionality('Editar');
        this.deletePermission =  this.getFunctionality('Eliminar');
    }

    public getFunctionality(functionality: string): boolean {
        const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
        return permission && permission.ShowFunctionality;
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
            productName: new FormControl('', Validators.compose([Validators.maxLength(120), Validators.pattern(this.getValue('nameProduct'))])),
            ean: new FormControl(''),
            pluVtex: new FormControl('', Validators.compose([Validators.pattern(this.getValue('integerNumber'))])),
            initialDate: { disabled: true, value: '' },
            finalDate: { disabled: true, value: '' },
            creationDate: new FormControl('', []),
            category: new FormControl(''),
            matcher: new MyErrorStateMatcher()
        });

        this.filterProduts.get('category').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
            if (!!val && val.length >= 2) {
                this.listCategories2 = this.listCategories.filter(category => category.Name.toString().toLowerCase().includes(val.toLowerCase()));
                const exist = this.listCategories2.find(category => category.Name === val);
                if (!exist) {
                    this.filterProduts.get('category').setErrors({ pattern: true });
                    this.invalidCategory = true;
                } else {
                    this.filterProduts.get('category').setErrors(null);
                    this.invalidCategory = false;
                }
            } else if (!val) {
                this.listCategories2 = [];
                this.filterProduts.get('category').setErrors(null);
            } else {
                this.filterProduts.get('category').setErrors(null);
            }
        });
    }

    /**
     * Funcion que permite solo números
     *
     * @param {*} event
     * @memberof ListProductsComponent
     */
    onlyNumber(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    // Funcion para limpiar formulario
    public cleanFilterListProducts(): void {
        this.nameProductList = null;
        this.eanList = null;
        this.creationDateList = null;
        this.initialDateList = null;
        this.finalDateList = null;
        this.pluVtexList = null;
        this.categoryList = null;
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
        this.pagepaginator = 0;
        this.paginator.firstPage();
        this.filterListProducts(param, true);
    }

    // Funcion para limpiar formulario
    public cleanFilter() {
        this.idcategory = [];
        this.keywords = [];
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
        if (this.idcategory === [] || (this.idcategory && this.idcategory.length === 0)) {
            this.idcategory = null;
        }
        let urlParams2: any;
        let countFilter = 0;
        let fecha = 0;
        this.initialDateList = null;
        this.finalDateList = null;
        this.nameProductList = this.filterProduts.controls.productName.value || null;
        this.pluVtexList = this.filterProduts.controls.pluVtex.value || null;
        this.categoryList = this.idcategory || null;
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
        if (this.pluVtexList) {
            this.pluVariable = true;
            countFilter++;
        } else {
            this.eanVariable = false;
            countFilter++;
        }
        if (this.categoryList) {
            this.categoryVariable = true;
            countFilter++;
        } else {
            this.categoryVariable = false;
            countFilter++;
        }
        if (this.eanList) {
            this.eanVariable = true;
            countFilter++;
        } else {
            this.eanVariable = false;
            countFilter++;
        }
        if (this.creationDateList === null) {
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
            urlParams2 = `?&initialDate=${this.initialDateList}&finalDate=${this.finalDateList}&ean=${encodeURIComponent(this.eanList)}&productName=${encodeURIComponent(this.nameProductList)}&creationDate=${this.creationDateList}&page=${page}&limit=${limit}&pluVtex=${this.pluVtexList}&categories=${this.categoryList}&myProducts=${this.myProduct}`;
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
            if (result && result.data !== undefined) {
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
        this.pluVtexList = this.filterProduts.controls.pluVtex.value || null;
        this.categoryList = this.idcategory || null;


        if (!fecha) {
            this.creationDateList = this.filterProduts.controls.creationDate.value || null;
        }
        this.initialDateList = new Date(this.filterProduts.controls.initialDate.value) || null;
        this.finalDateList = new Date(this.filterProduts.controls.finalDate.value) || null;

        // const data = [];
        this.dataChips.push({ value: this.nameProductList, name: 'nameProductList', nameFilter: 'productName' });
        this.dataChips.push({ value: this.eanList, name: 'eanList', nameFilter: 'ean' });
        this.dataChips.push({ value: this.pluVtexList, name: 'pluVtexList', nameFilter: 'pluVtex' });
        this.dataChips.push({ value: this.creationDateList, name: 'creationDateList', nameFilter: 'creationDate' });
        if (this.idcategory && this.idcategory.length > 0) {
            this.namecategory.forEach(el => {
                if (el) {
                    this.dataChips.push({ value: el, name: 'categoryList', nameFilter: 'category' });
                }
            });
        }
        this.add(this.dataChips);
    }

    public closeFilter() {
        if (!this.applyFilter) {
            // this.cleanFilter();
        }
        if (!this.eanVariable) {
            this.filterProduts.controls.ean.setValue('');
            this.eanList = null;
        }
        if (!this.pluVariable) {
            this.filterProduts.controls.pluVtex.setValue('');
            this.pluVtexList = null;
        }
        if (!this.categoryVariable) {
            this.filterProduts.controls.category.setValue('');
            this.categoryList = null;
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
        this.dataChips = [];
    }

    // Metodo para ir eliminando los filtros aplicados
    public remove(productsFilter: ListFilterProducts): void {

        if (productsFilter.nameFilter === 'creationDate') {
            this.filterProduts.controls.initialDate.setValue(null);
            this.filterProduts.controls.finalDate.setValue(null);
        }

        const index = this.listFilterProducts.indexOf(productsFilter);

        if (productsFilter.nameFilter === 'category') {
            this.namecategory.forEach(el => {
                if (productsFilter.name === el) {
                    const indice = this.namecategory.indexOf(el);
                    const indice2 = this.idcategory.indexOf(el);
                    const indice3 = this.keywords.indexOf(el);

                    this.idcategory.splice(indice2, 1);
                    this.namecategory.splice(indice, 1);
                    this.keywords.splice(indice3, 1);
                }
            });
            this.listFilterProducts.splice(index, 1);
            // this.idcategory = null;
            // this.namecategory = null;
        }

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

    public refreshCategoryTree() {
        this.getCategoriesList();
        this.languageService.onLangChange.subscribe((e: Event) => {
            localStorage.setItem('culture_current', e['lang']);
            this.getCategoriesList();
        });
    }


    /**
     *
     * funcion para mostar el contenedor de filtros
     * @param {boolean} showFilter
     * @memberof ListProductsComponent
     */
    toggle(showFilter: boolean) {
        this.drawer.toggle();
        if (this.showTabs) {
            const element = document.getElementById('principal-toolbar');
            const matToolbar = document.getElementById('matToolbar');
            element.classList.add('tabsShowZindex');
            matToolbar.classList.add('notFixed');
        }
    }

    reloadData() {
        setTimeout(() => {
            this.filterListProducts();
        }, 2000);
    }

}
