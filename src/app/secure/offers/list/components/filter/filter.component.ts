import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { ListComponent } from '../../list/list.component';
import { ModelFilter } from './filter.model';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, FormGroupDirective, Validators, FormBuilder, NgForm } from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-filter-offer',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit, OnChanges {

    @Input() sidenav;

    @Input() filterRemoved;

    public formFilter: ModelFilter;
    public filterForm: FormGroup;
    public productName: FormControl;
    public ean: FormControl;
    public stock: FormControl;
    public matcher: MyErrorStateMatcher;
    public regexNoSpaces = /^((?! \s+|\s+$).)*$/;

    constructor(
        public list: ListComponent
    ) {
        this.formFilter = new ModelFilter();
    }

    ngOnInit() {
        this.createFormControls();
        this.createForm();
    }

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
        this.filterForm = new FormGroup({
            productName: this.productName,
            ean: this.ean,
            stock: this.stock
        });
    }

    /**
     * @method toggleMenu
     * @memberof FilterComponent
     * @description Metodo para cerrar el menu
     */
    toggleMenu() {
        this.sidenav.toggle();
    }

}
