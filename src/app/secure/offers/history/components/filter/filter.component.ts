/* 3rd party components */
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormControl,
    FormGroupDirective,
    Validators,
    FormBuilder,
    NgForm
} from '@angular/forms';
/* our own custom components */
import { HistoryComponent } from '../../history/history.component';
import { ModelFilter } from './filter.model';

/**
 *
 * @export
 * @class FilterComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
    selector: 'app-history-offer',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit, OnChanges {

    /**
     * Variable que se usa para el funcionamiento de abrir y cerrar el menú
     * @memberof FilterComponent
     */
    @Input() sidenav;

    /**
     * Variable que recibe el filtro removido para limpiar el campo
     * @memberof FilterComponent
     */
    @Input() filterRemoved;

    /**
     * Conjunto de variables necesaria para validar el formulario
     * @memberof FilterComponent
     */
    public formFilter: ModelFilter;
    public historyFilterForm: FormGroup;
    public regexNoSpaces = /^((?! \s+|\s+$).)*$/;

    /**
     *Creates an instance of FilterComponent.
     * @param {HistoryComponent} list
     * @memberof FilterComponent
     */
    constructor(
        public history: HistoryComponent,
        private fb: FormBuilder
    ) {
        this.formFilter = new ModelFilter();
    }

    /**
     * @method ngOnInit
     * @description Metodo que se llama mientras se inicia el componente
     * @memberof FilterComponent
     */
    ngOnInit() {
        this.createForm();
    }

    /**
     * @method ngOnChanges
     * @description Metodo que se ejecuta cuando cambie algún miembro de la clase
     * @param changes
     * @memberof FilterComponent
     */
    ngOnChanges(changes: SimpleChanges) {
        /*switch (changes.filterRemoved.currentValue) {
            case 'filterEan':
                this.formFilter.ean = undefined;
                break;
        }*/
    }

    /**
     * @method createForm
     * @memberof FilterComponent
     * @description Metodo para crear el formulario
     */
    createForm() {
        this.historyFilterForm = this.fb.group({
            'dateInitial': [null, Validators.compose([])],
            'dateFinal': [null, Validators.compose([])],
            'ean': [null, Validators.compose([Validators.pattern(this.regexNoSpaces)])]
        });
    }

    /**
     * @method toggleMenu
     * @memberof FilterComponent
     * @description Metodo para abrir o cerrar el menu
     */
    toggleMenu() {
        this.sidenav.toggle();
    }

    historyFilter(data) {
        console.log(data.value.dateInitial);
        // const initial = new Date(formFilter.dateInitial);
        // console.log(initial.getDate());
    }
}
