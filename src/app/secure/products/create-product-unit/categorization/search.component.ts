import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.component.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Logger } from '@app/core';

/* log component */
const log = new Logger('SearchCategorizationComponent');

export interface FilterList {
    Id: string;
    Name: string;
}

@Component({
    selector: 'app-search-categorization',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchCategorizationComponent implements OnInit {

    // variable que almacena los resultados obtenidos al realizar el filtro del autocomplete
    public filteredOptions: Observable<string[]>;

    searchCategory = new FormControl();
    filteredStates: Observable<FilterList[]>;
    listCategories: any;
    chargueList = false;
    searchText: string;
    searchTextInput: any;

    /**
     * Creates an instance of SearchCategorizationComponent.
     * @param {SearchService} searchService
     * @memberof SearchCategorizationComponent
     */
    constructor(private searchService: SearchService) {
    }

    /**
     * Initialize component gets categories list.
     *
     * @memberof SearchCategorizationComponent
     */
    ngOnInit() {
        this.getCategoriesList();
    }

    /**
     * Verify if find in categories names lower case and return boolean.
     *
     * @private
     * @param {string} value
     * @returns {FilterList[]}
     * @memberof SearchCategorizationComponent
     */
    public _filterStates(value: string): FilterList[] {
        const filterValue = value.toLowerCase();
        return this.listCategories.filter(state => state.Name.toLowerCase().indexOf(filterValue) === 0);
    }

    /**
     * Get categories from service, and storage in list categories.
     *
     * @memberof SearchCategorizationComponent
     */
    public getCategoriesList(): void {
        this.searchService.getCategories().subscribe((result: any) => {
            // guardo el response
            if (result.status === 200) {
                const body = JSON.parse(result.body.body);
                this.listCategories = body.Data;
                this.chargueList = true;
                this.filteredStates = this.searchCategory.valueChanges
                    .pipe(
                        startWith(''),
                        map(state => state ? this._filterStates(state) : this.listCategories.slice())
                    );
            } else {
                log.debug('SearchCategorizationComponent:' + result.message);
            }
        });
    }

    /**
     * Event from angular material search
     *
     * @param {*} event
     * @memberof SearchCategorizationComponent
     */
    whatchValueInput(event: any): void {
        this.searchTextInput = event;
    }

    /**
     * Execute search text in tree after click ENTER.
     *
     * @param {*} event
     * @memberof SearchCategorizationComponent
     */
    public keyDownFunction(event: any): void {
        // keyCode 13 -> Enter
        if (event.keyCode === 13) {
            if (this.searchTextInput.Name) {
                this.searchText = this.searchTextInput.Name;
            } else {
                this.searchText = this.searchTextInput;
            }
        }
    }
}
