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
// import { ListComponent } from '../../list/list.component';
import { ModelFilter } from './filter-seller.model';

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
 * @class FilterSellerComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
    selector: 'app-filter-seller',
    templateUrl: './filter-seller.component.html',
    styleUrls: ['./filter-seller.component.scss']
})

export class FilterSellerComponent implements OnInit, OnChanges {

    /**
     * Variable que se usa para el funcionamiento de abrir y cerrar el menú
     * @memberof FilterSellerComponent
     */
    @Input() sidenav;

    /**
     * Variable que recibe el filtro removido para limpiar el campo
     * @memberof FilterSellerComponent
     */
    @Input() filterRemoved;

    /**
     * Conjunto de variables necesaria para validar el formulario
     * @memberof FilterSellerComponent
     */
    public filterSeller: FormGroup;
    public id: FormControl;
    public sellerName: FormControl;
    public nit: FormControl;
    // public stateSeller: FormControl;
    public matcher: MyErrorStateMatcher;
    public regexNoSpaces = /^((?! \s+|\s+$).)*$/;

    /**
     * Creates an instance of FilterSellerComponent.
     * @param {ListComponent} list
     * @memberof FilterSellerComponent
     */
    constructor(
        private fb: FormBuilder
        // public list: ListComponent
    ) { }

    /**
     * @method ngOnInit
     * @description Metodo que se llama mientras se inicia el componente
     * @memberof FilterSellerComponent
     */
    ngOnInit() {
        this.createFormControls();
        this.createForm();
    }

    /**
     * @method ngOnChanges
     * @description Metodo que se ejecuta cuando cambie algún miembro de la clase
     * @param changes
     * @memberof FilterSellerComponent
     */
    ngOnChanges(changes: SimpleChanges) {
        switch (changes.filterRemoved.currentValue) {
            case 'filterID':
                this.id.setValue(undefined);
                break;
            case 'filterSellerName':
                this.sellerName.setValue(undefined);
                break;
            case 'filterNit':
                this.nit.setValue(undefined);
                break;
           /* case 'filterStateSeller':
                this.nit.setValue(undefined);
                break; */
            case 'all':
                this.filterSeller.reset();
                break;
        }
    }

    /**
     * @method createFormControls
     * @memberof FilterSellerComponent
     * @description Metodo para crear los controles el formulario
     */
    createFormControls() {
        this.filterSeller = this.fb.group({
        id: ['', Validators.pattern(this.regexNoSpaces)],
        sellerName: [''],
        nit: ['', Validators.pattern('^[0-9]*$')],
        matcher: new MyErrorStateMatcher()
        });
    }

    /**
     * @method createForm
     * @memberof FilterSellerComponent
     * @description Metodo para crear el formulario
     */
    createForm() {
        this.filterSeller = new FormGroup({
            id: this.id,
            sellerName: this.sellerName,
            nit: this.nit,
            // stateSeller: this.stateSeller
        });
    }

    /**
     * @method toggleMenu
     * @memberof FilterSellerComponent
     * @description Metodo para abrir o cerrar el menu
     */
    toggleMenu() {
        this.sidenav.toggle();
    }

}
