import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ListComponent } from './../../list/list.component';
import { ModelFilter } from './filter.model';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

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
        this.productName = new FormControl('', []);
        this.ean = new FormControl('', []);
        this.stock = new FormControl('', []);

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
