/* 3rd party components */
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
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

export class FilterComponent implements OnInit {

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
    public rangeDays = 14;
    public milisecondsRangeDays = 1000 * 60 * 60 * 24 * this.rangeDays;
    public rangeDateMax;
    public rangeError = false;

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
     * @method createForm
     * @memberof FilterComponent
     * @description Metodo para crear el formulario
     */
    createForm() {
        this.historyFilterForm = this.fb.group({
            'dateInitial': [null, Validators.compose([Validators.required])],
            'dateFinal': new FormControl(null, Validators.compose([Validators.required, Validators.pattern(this.regexNoSpaces)])),
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

    /**
     * @method setMaxDateRange
     * @memberof FilterComponent
     * @description Set the date final of filter
     */
    setMaxDateRange() {
        if ( this.historyFilterForm.value.dateInitial != null ) {
            this.rangeDateMax = new Date( this.historyFilterForm.value.dateInitial.getTime() + this.milisecondsRangeDays );
        }
    }

    /**
     * @method validateFinalRange
     * @memberof FilterComponent
     * @description Validate the range of dates for filter
     */
    validateFinalRange() {
        if ( this.historyFilterForm.value.dateFinal != null && this.historyFilterForm.value.dateInitial != null ) {
            if ( (this.historyFilterForm.value.dateFinal.getTime() - this.historyFilterForm.value.dateInitial.getTime()) > (1000 * 60 * 60 * 24 * (this.rangeDays++)) ) {
                this.rangeError = true;
            }
        }
    }

    historyFilter(data) {
        console.log(data.value);
    }
}
