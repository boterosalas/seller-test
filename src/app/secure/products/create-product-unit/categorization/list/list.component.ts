import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../search.component.service';
import { Logger } from '@app/core';
import { CategoryModel } from './category.model';


// log component
const log = new Logger('TreeCategoriesComponent');

@Component({
    selector: 'app-list-categorization',
    templateUrl: './list.component.html'
})

export class ListCategorizationComponent implements OnInit {

    /**
     * Initialize data
     *
     * @type {string} searchText its necesary to search text in json
     * @memberof ListCategorizationComponent
     */
    @Input() searchText: string;
    listCategories: CategoryModel[];
    finishCharge = false;

    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.getCategoriesList();
        console.log(this.searchText, 'searchTextsearchTextsearchText');
    }

    public getCategoriesList(): void {
        this.searchService.getCategories().subscribe((body: any) => {
            console.log(body);
            // guardo el response
            if (body.status === 200 || true) {
                this.listCategories = body.Data;
                this.organizedCategoriesList(this.listCategories);
                for (let i = 0; i < this.listCategories.length; i ++) {
                    if (this.listCategories[i].IdParent || !this.listCategories[i].Son.length) {
                        this.listCategories.splice(i, 1);
                        i--;
                    } else {
                        this.listCategories[i].Show = true;
                    }
                }
                this.finishCharge = true;
            } else {
                log.debug('ListCategorizationComponent:' + body.message);
            }
        });
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

    public showChild(categorie: CategoryModel): void {
        console.log(categorie);
        categorie.Son.forEach(element => {
            console.log(element);
            element.Show = true;
        });
    }
}
