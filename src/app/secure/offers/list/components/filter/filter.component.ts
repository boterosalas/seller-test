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
import { ListComponent } from '../../list/list.component';
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
    selector: 'app-filter-offer',
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
    public filterForm: FormGroup;
    public product: FormControl;
    public ean: FormControl;
    public PluVtex: FormControl;
    public stock: FormControl;
    public matcher: MyErrorStateMatcher;
    public regexNoSpaces = /^((?! \s+|\s+$).)*$/;
    public regexOnlyNumber = /^[0-9]*$/;

    /**
     * Creates an instance of FilterComponent.
     * @param {ListComponent} list
     * @memberof FilterComponent
     */
    constructor(
        public list: ListComponent
    ) { }

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
                this.product.setValue(undefined);
                break;
            case 'filterEan':
                this.ean.setValue(undefined);
                break;
            case 'filterPluVtex':
                this.PluVtex.setValue(undefined);
                break;
            case 'filterStock':
                this.stock.setValue(undefined);
                break;
            case 'all':
                this.filterForm.reset();
                break;
        }
    }

    /**
     * @method createFormControls
     * @memberof FilterComponent
     * @description Metodo para crear los controles el formulario
     */
    createFormControls() {
        this.product = new FormControl('', [Validators.pattern(this.regexNoSpaces)]);
        this.ean = new FormControl('', [Validators.pattern(this.regexNoSpaces)]);
        this.PluVtex = new FormControl('', [Validators.pattern(this.regexOnlyNumber)]);
        this.stock = new FormControl('', []);
        this.matcher = new MyErrorStateMatcher();
    }

    /**
     * @method createForm
     * @memberof FilterComponent
     * @description Metodo para crear el formulario
     */
    createForm() {
        this.filterForm = new FormGroup({
            product: this.product,
            ean: this.ean,
            stock: this.stock,
            PluVtex: this.PluVtex
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
