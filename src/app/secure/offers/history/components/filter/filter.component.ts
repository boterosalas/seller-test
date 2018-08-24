/* 3rd party components */
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
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
 * @class MyErrorStateMatcher
 * @description Error when invalid control is dirty, touched, or submitted.
 * @implements {ErrorStateMatcher}
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

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
    public productName: FormControl;
    public ean: FormControl;
    public stock: FormControl;
    public matcher: MyErrorStateMatcher;
    public regexNoSpaces = /^((?! \s+|\s+$).)*$/;

    /**
     *Creates an instance of FilterComponent.
     * @param {HistoryComponent} list
     * @memberof FilterComponent
     */
    constructor(
        public list: HistoryComponent
    ) {
        this.formFilter = new ModelFilter();
    }

    /**
     * @method ngOnInit
     * @description Metodo que se llama mientras se inicia el componente
     * @memberof FilterComponent
     */
    ngOnInit() {
        this.createFormControls();
        this.createForm();
    }

    /**
     * @method ngOnChanges
     * @description Metodo que se ejecuta cuando cambie algún miembro de la clase
     * @param changes
     * @memberof FilterComponent
     */
    ngOnChanges(changes: SimpleChanges) {
        switch (changes.filterRemoved.currentValue) {
            case 'filterProduct':
                this.formFilter.product = undefined;
                break;
            case 'filterEan':
                this.formFilter.ean = undefined;
                break;
            case 'filterStock':
                this.formFilter.stock = undefined;
                break;
        }
    }

    /**
     * @method createFormControls
     * @memberof FilterComponent
     * @description Metodo para crear los controles el formulario
     */
    createFormControls() {
        this.productName = new FormControl('', [Validators.pattern(this.regexNoSpaces)]);
        this.ean = new FormControl('', [Validators.pattern(this.regexNoSpaces)]);
        this.stock = new FormControl('', []);
        this.matcher = new MyErrorStateMatcher();
    }

    /**
     * @method createForm
     * @memberof FilterComponent
     * @description Metodo para crear el formulario
     */
    createForm() {
        this.historyFilterForm = new FormGroup({
            productName: this.productName,
            ean: this.ean,
            stock: this.stock
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
}
