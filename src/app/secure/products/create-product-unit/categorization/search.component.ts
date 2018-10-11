import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.component.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ListCategorizationComponent } from './list/list.component';
import { FormControl } from '@angular/forms';


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

    constructor(private searchService: SearchService) {
        this.filteredStates = this.searchCategory.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterStates(state) : this.listCategories.slice())
            );
    }

    private _filterStates(value: string): FilterList[] {
        const filterValue = value.toLowerCase();
        return this.listCategories.filter(state => state.Name.toLowerCase().indexOf(filterValue) === 0);
    }

    public getCategoriesList(): void {
        this.searchService.getCategories().subscribe((body: any) => {
            // guardo el response
            if (body.status === 200 || true) {
                this.listCategories = body.Data;
                this.chargueList = true;
            } else {
                // log.debug('ListCategorizationComponent:' + body.message);
            }
        });
    }

    ngOnInit() {
        this.getCategoriesList();
    }

    whatchValueInput(event: any): void {
        this.searchTextInput = event;
    }

    public keyDownFunction(event: any): void {
        // keyCode 13 -> Enter
        if (event.keyCode === 13) {
            // this.chargueList = !this.chargueList;
            if (this.searchTextInput.Name) {
                this.searchText = this.searchTextInput.Name;
            } else {
                this.searchText = this.searchTextInput;
            }
        }
    }
}
