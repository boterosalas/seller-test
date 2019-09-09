import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { SearchService } from '../search.component.service';
import { Logger } from '@app/core';
import { CategoryModel } from './category.model';
import { ProcessService } from '../../component-process/component-process.service';
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
    @Input() set detailProduct(value: any) {
        if (value) {
            this.selectedCategoryCurrent(value);
        } else {
            this.selectedCategoryCurrent(null);
        }
    }

    subs: Subscription = new Subscription();

    /**
     * Creates an instance of ListCategorizationComponent.
     * @param {SearchService} searchService
     * @memberof ListCategorizationComponent
     */
    constructor(
        private searchService: SearchService,
        private process: ProcessService,
        private snackBar: MatSnackBar,
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
                    const msg = 'No puedes cambiar la categoría de Estandar a Variante o de Variante a Estandar';
                    this.snackBar.open(msg, 'Cerrar', {
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
        if (detailProduct) {
            // this.selectedCategory = 'Pantalones';
            // this.selectedIdCategory = 28033;
            // this.idDetailProduct = 28033;
            // this.productType = 'Clothing';
            // const data = {
            //     CategorySelected: 28033,
            //     CategoryName: 'Pantalones',
            //     CategoryType: 'Clothing'
            // };
            this.selectedCategory = 'Televisores 4K Uhd';
            this.selectedIdCategory = 28052;
            this.idDetailProduct = 28052;
            this.productType = 'Technology';
            const data = {
                CategorySelected: 28052,
                CategoryName: 'Televisores 4K Uhd',
                CategoryType: 'Technology'
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
            // guardo el response
            if (result.status === 200) {
                const body = JSON.parse(result.body.body);
                this.listCategories = body.Data;
                this.showOnlyWithSon();
            } else {
                log.debug('ListCategorizationComponent:' + result.message);
            }
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

    showCategorySelect(idCategorySelect: number) {
        const idParent = this.listCategories.find(x => x.Id === idCategorySelect).IdParent;
        if (idParent != null) {
            this.listCategories.find(x => x.Id === idCategorySelect).Show = true;
            this.showCategorySelect(idParent);
        } else {
            this.listCategories.find(x => x.Id === idCategorySelect).Show = true;
        }
    }

    ngOnDestroy(): void {
        !!this.subs && this.subs.unsubscribe();
    }
}
