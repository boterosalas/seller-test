import { Component, OnInit, Input, OnChanges, OnDestroy, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../search.component.service';
import { Logger, LoadingService } from '@app/core';
import { CategoryModel } from './category.model';
import { ProcessService } from '../../component-process/component-process.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

// log component
const log = new Logger('ListCategorizationComponent');

@Component({
    selector: 'app-list-categorization',
    templateUrl: './list.component.html'
})

export class ListCategorizationComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * Initialize data
     *
     * @type {string} searchText its necesary to search text in json
     * @memberof ListCategorizationComponent
     */
    @Input() searchText: string;
    listCategories: CategoryModel[];
    finishCharge = false;
    openAllItems = false;
    selectedCategory: string;
    selectedIdCategory: number;
    idDetailProduct: number;
    productType: string;
    isEdit = false;
    @Input() set detailProduct(value: any) {
        if (value) {
            this.selectedCategoryCurrent(value);
            this.isShowP = true;
            this.isEdit = true;
        } else {
            this.selectedCategoryCurrent(null);
            this.isShowP = true;
            this.isEdit = false;
        }
    }
    @Input() ean: any;

    subs: Subscription = new Subscription();

    // Variable para mostrar loading
    public isLoad = false;
    copyDataCategory: any;
    @Output() showLoad = new EventEmitter<boolean>();
    isShowP = false;

    /**
     * Creates an instance of ListCategorizationComponent.
     * @param {SearchService} searchService
     * @memberof ListCategorizationComponent
     */
    constructor(
        private searchService: SearchService,
        private process: ProcessService,
        private snackBar: MatSnackBar,
        private languageService: TranslateService,
        private loadingService?: LoadingService,
        ) { }

    /**
     * Initialize component get categories list.
     *
     * @memberof ListCategorizationComponent
     */
    ngOnInit() {
        this.subs = this.searchService.change.subscribe((result: any) => {
            if (this.productType) {
                if (this.productType === result.ProductType) {
                    this.selectedCategory = result.Name;
                    this.selectedIdCategory = result.Id;
                    const data = {
                        CategorySelected: result.Id,
                        CategoryName: result.Name,
                        CategoryType: result.ProductType
                    };
                    this.process.validaData(data);
                } else {
                    const msg = this.languageService.instant('secure.products.create_product_unit.categorization.list.standard_variant');
                    this.snackBar.open(msg, this.languageService.instant('actions.close'), {
                        duration: 3000
                    });
                }

            } else {
                this.selectedCategory = result.Name;
                if (this.selectedIdCategory !== result.Id) {
                    this.selectedIdCategory = result.Id;
                }
                const data = {
                    CategorySelected: result.Id,
                    CategoryName: result.Name,
                    CategoryType: result.ProductType
                };
                this.process.validaData(data);
            }
        });
    }

    selectedCategoryCurrent(detailProduct: any) {
        // this.loadingService.viewSpinner();
        if (detailProduct) {
            this.selectedCategory = detailProduct.category;
            this.selectedIdCategory = parseInt(detailProduct.categoryId, 0);
            this.idDetailProduct = parseInt(detailProduct.categoryId, 0);
            this.productType = detailProduct.productType;
            const data = {
                CategorySelected: parseInt(detailProduct.categoryId, 0),
                CategoryName: detailProduct.category,
                CategoryType: detailProduct.productType
            };
            this.process.validaData(data);
            this.getCategoriesList();
        } else {
            this.selectedCategory = undefined;
            this.selectedIdCategory = undefined;
            this.idDetailProduct = undefined;
            this.productType = undefined;
            const data = {
                CategorySelected: undefined,
                CategoryName: undefined,
                CategoryType: undefined
            };
            this.process.validaData(data);
            this.getCategoriesList();
        }
    }

    /** When list changes need organized  */
    ngOnChanges() {
        this.organizedLisSearchText(this.listCategories);
    }

    /**
     * Open all items from categories
     *
     * @memberof ListCategorizationComponent
     */
    public openAll(): void {
        this.openAllItems = !this.openAllItems;
        this.organizedLisSearchText(this.listCategories, true);
    }

    /**
     * Search text in another text, two with lowercase.
     *
     * @param {string} modelName
     * @returns {boolean}
     * @memberof ListCategorizationComponent
     */
    public searchTextIn(modelName: string): boolean {
        if (this.searchText) {
            return modelName.toLowerCase().search(this.searchText.toLowerCase()) !== -1;
        }
    }

    /**
     * Change text with the same text but with mark.
     *
     * @param {string} modelName
     * @returns {string}
     * @memberof ListCategorizationComponent
     */
    public changeText(modelName: string): string {
        const init = modelName.toLowerCase().search(this.searchText.toLowerCase());
        const end = this.searchText.length;
        return modelName.replace(modelName.slice(init, init + end), '<mark>' + modelName.slice(init, init + end) + '</mark>');
    }

    /**
     * Organized list with search text.
     * Open if finds search text and mark text.
     *
     * @param {*} list
     * @param {boolean} [openClose=false]
     * @returns {boolean}
     * @memberof ListCategorizationComponent
     */
    public organizedLisSearchText(list: any, openClose: boolean = false): boolean {
        let find = false;
        let findSons = false;
        if (list) {
            for (let i = 0; i < list.length; i++) {
                // Has a conditional to open all with out modify names, refer to a the same name but with the mark.
                if (!openClose) {
                    list[i].Show = false;
                    list[i].ModifyName = false;
                    // Verify if has text in name.
                    if (this.searchTextIn(list[i].Name)) {
                        list[i].Show = true;
                        find = true;
                        list[i].ModifyName = this.changeText(list[i].Name);
                    }
                    // If has sons do the same recursive function
                    if (list[i].Son.length) {
                        findSons = this.organizedLisSearchText(list[i].Son);
                        // If has sons with the search text on it, open his father.
                        if (!find && findSons || find && findSons) {
                            list[i].Show = true;
                            find = true;
                        } else if (!find) {
                            find = findSons;
                            list[i].Show = findSons;
                        }
                    }
                } else {
                    // Else show all items and with the recursive function open her sons.
                    list[i].Show = this.openAllItems;
                    list[i].ModifyName = null;
                    findSons = this.organizedLisSearchText(list[i].Son, true);
                }
            }
        }
        return find; // Return if find sons.
    }

    /**
     * Get categories from service.
     *
     * @memberof ListCategorizationComponent
     */
    public getCategoriesList(): void {
        this.searchService.getCategories().subscribe((result: any) => {
            // Copia del arreglo de todas las categories para hacer la busqueda y traducir la que ha selelcionado.
            this.copyDataCategory = JSON.parse(result.body.body);
            // guardo el response
            if (result.status === 200 && result.body.body) {
                const body = JSON.parse(result.body.body);
                this.listCategories = body.Data;
                this.showOnlyWithSon();
                // this.loadingService.closeSpinner();
                this.selectedCategory = '';
            // Hacemos una busqueda de la categoria con el clone del arreglo para mostrar cual seleccionó y enviarla al 3 paso traducido.
            this.copyDataCategory.Data.forEach(el => {
                if (el.Id === this.selectedIdCategory) {
                    this.selectedCategory = el.Name;
                    const data = {
                        CategorySelected: el.Id,
                        CategoryName: el.Name,
                        CategoryType: el.ProductType
                    };
                    this.process.validaData(data);
                }
            });
            } else {
                this.loadingService.closeSpinner();
                log.debug('ListCategorizationComponent:' + result.message);
            }
            this.isLoad = false;
        });
    }


    /**
     * Categories has ones with outh sons, and is required deletes.
     * Runs all principal categories and slice ones.
     *
     * @memberof ListCategorizationComponent
     */
    public showOnlyWithSon(): void {
        if (this.listCategories && this.listCategories.length) {
            this.organizedCategoriesList(this.listCategories);
            if (this.listCategories && this.idDetailProduct) {
                this.showCategorySelect(this.idDetailProduct);
            }
            for (let i = 0; i < this.listCategories.length; i++) {
                if (this.listCategories[i].IdParent || !this.listCategories[i].Son.length) {
                    this.listCategories.splice(i, 1);
                    i--;
                }
            }
            this.finishCharge = true;
        }
    }

    /**
     * Categories from back doesn't have sons associated, if this is true this function, creates and initialize sons.
     * and creates response with a category model.
     * @private
     * @param {*} model
     * @returns {CategoryModel}
     * @memberof ListCategorizationComponent
     */
    private getCategoryMap(model: any): CategoryModel {
        let son = null;
        if (model.Son && model.Son.length) {
            son = model.Son;
        }
        return new CategoryModel(model.Name, model.IdParent, model.ProductType, son, model.Id);
    }

    /**
     * Initialize model
     *
     * @private
     * @param {*} model
     * @memberof ListCategorizationComponent
     */
    private createCategorySonObject(model: any): void {
        if (!model.Son) {
            model.Son = [];
        }
    }

    /**
     * After gets categories from back, it response with a list model, with out any organization
     *
     * @private
     * @param {*} list
     * @returns {CategoryModel[]}
     * @memberof ListCategorizationComponent
     */
    private organizedCategoriesList(list: any): CategoryModel[] {
        const categories: CategoryModel[] = [];
        for (let i = 0; i < list.length; i++) {
            this.createCategorySonObject(list[i]);
            for (let j = 0; j < list.length; j++) {
                if (list[i].Id === list[j].IdParent) {
                    list[j].Show = false;
                    list[i].Son.push(list[j]);
                    list[j].touched = true;
                }
            }
            if (list[i].IdParent === null) {
                categories.push(this.getCategoryMap(list[i]));
            }

        }
        return categories;
    }

    public refreshVtexTree() {
        this.getCategoriesList();
        this.languageService.onLangChange.subscribe((e: Event) => {
            localStorage.setItem('culture_current', e['lang']);
            this.isLoad = true;
            this.openAllItems = false;
            this.getCategoriesList();
        });
    }
    showCategorySelect(idCategorySelect: number) {
        const idParent = this.listCategories.find(x => x.Id === idCategorySelect).IdParent;
        if (idParent != null) {
            this.listCategories.find(x => x.Id === idCategorySelect).Show = true;
            this.showCategorySelect(idParent);
            this.isShowP = false;
        } else {
            this.listCategories.find(x => x.Id === idCategorySelect).Show = true;
        }
    }

    ngOnDestroy(): void {
        // tslint:disable-next-line:no-unused-expression
        !!this.subs && this.subs.unsubscribe();
    }
}
