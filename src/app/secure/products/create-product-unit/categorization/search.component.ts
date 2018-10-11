import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.component.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ListCategorizationComponent } from './list/list.component';
import { FormControl } from '@angular/forms';


export interface State {
    flag: string;
    name: string;
    population: string;
}

@Component({
    selector: 'app-search-categorization',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchCategorizationComponent implements OnInit {

    // variable que almacena los resultados obtenidos al realizar el filtro del autocomplete
    public filteredOptions: Observable<string[]>;

    stateCtrl = new FormControl();
    filteredStates: Observable<State[]>;

    states: State[] = [
        {
            name: 'Arkansas',
            population: '2.978M',
            // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
            flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
        },
        {
            name: 'California',
            population: '39.14M',
            // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
            flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
        },
        {
            name: 'Florida',
            population: '20.27M',
            // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
            flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
        },
        {
            name: 'Texas',
            population: '27.47M',
            // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
            flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
        }
    ];

    constructor(private searchService: SearchService) {
        this.filteredStates = this.stateCtrl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterStates(state) : this.states.slice())
            );
    }

    private _filterStates(value: string): State[] {
        const filterValue = value.toLowerCase();

        return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
    }

    ngOnInit() {
    }

    whatchValueInput(event: any): void {
    }

    public keyDownFunction(event: any): void {
        // keyCode 13 -> Enter
        if (event.keyCode === 13) {
            console.log(event);
        }
    }
}
