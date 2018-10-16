import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SearchService } from '../search.component.service';
import { Logger } from '@app/core';
import { CategoryModel } from './category.model';


// log component
const log = new Logger('TreeCategoriesComponent');

@Component({
    selector: 'app-list-categorization',
    templateUrl: './list.component.html'
})

export class ListCategorizationComponent implements OnInit, OnChanges {

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

    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.getCategoriesList();
    }

    ngOnChanges() {
        this.organizedLisSearchText(this.listCategories);
    }

    public openAll(): void {
        this.openAllItems = !this.openAllItems;
        this.organizedLisSearchText(this.listCategories, true);
    }

    public searchTextIn(modelName: string): boolean {
        if (modelName === 'Gastronomia') {
            console.log(modelName.toLowerCase().search(this.searchText.toLowerCase()) !== -1);
        }
        return modelName.toLowerCase().search(this.searchText.toLowerCase()) !== -1;
    }

    public changeText(modelName: string): string {
        const init = modelName.toLowerCase().search(this.searchText.toLowerCase());
        const end = this.searchText.length;
        if (modelName === 'Gastronomia') {
            console.log('si', modelName.slice(init, init + end));
        }
        return modelName.replace( modelName.slice(init, init + end), '<mark>' + modelName.slice(init, init + end) + '</mark>');
    }

    public organizedLisSearchText(list: any, openClose: boolean = false): boolean {
        let find = false;
        let findSons = false;
        for (let i = 0; i < list.length; i++) {
            if (i === 9) {
                console.log('stop here');
            }
            if (!openClose) {
                list[i].Show = false;
                list[i].ModifyName = false;
                if ( this.searchTextIn(list[i].Name) ) {
                    list[i].Show = true;
                    find = true;
                    list[i].ModifyName = this.changeText(list[i].Name);
                    if (list[i].Name === 'Gastronomia') {
                        console.log(list[i]);
                    }
                }
                if (list[i].Son.length) {
                    findSons = this.organizedLisSearchText(list[i].Son);
                    if (!find && findSons) {
                        list[i].Show = true;
                        find = true;
                    }else if (!find) {
                        find = findSons;
                        list[i].Show = true;
                    }
                }

                list[i].Name = list[i].Name + list[i].Show;
            } else {
                list[i].Show = this.openAllItems;
                list[i].ModifyName = null;
                findSons = this.organizedLisSearchText(list[i].Son, true);
            }
        }
        return find;
    }

    public getCategoriesList(): void {
        this.searchService.getCategories().subscribe((body: any) => {
            // guardo el response
            if (body.status === 200 || true) {
                this.listCategories = body.Data;
                this.showOnlyWithSon();
            } else {
                log.debug('ListCategorizationComponent:' + body.message);
            }
        });
    }

    public showOnlyWithSon(): void {
        if (this.listCategories && this.listCategories.length) {
            this.organizedCategoriesList(this.listCategories);
            for (let i = 0; i < this.listCategories.length; i++) {
                if (this.listCategories[i].IdParent || !this.listCategories[i].Son.length) {
                    this.listCategories.splice(i, 1);
                    i--;
                }
            }
            this.finishCharge = true;
        }
    }

    private getCategoryMap(model: any): CategoryModel {
        let son = null;
        if (model.Son && model.Son.length) {
            son = model.Son;
        }
        return new CategoryModel(model.Name, model.IdParent, model.ProductType, son, model.Id);
    }

    private createCategorySonObject(model: any): void {
        if (!model.Son) {
            model.Son = [];
        }
    }

    private organizedCategoriesList(list: any): CategoryModel[] {
        const categories: CategoryModel[] = [];
        for (let i = 0; i < list.length; i++) {
            this.createCategorySonObject(list[i]);
            for (let j = 0; j < list.length; j++) {
                if (list[i].Id === list[j].IdParent) {
                    list[j].Show = false;
                    if (this.searchText && list[j].Name.search(this.searchText) !== -1) {
                        list[j].Show = true;
                    }
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
}
