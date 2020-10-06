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
import { SupportService } from '@app/secure/support-modal/support.service';


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
    public pluVtex: FormControl;
    public sellerSku: FormControl;
    public stock: FormControl;
    public matcher: MyErrorStateMatcher;
    public regexNoSpaces = /^((?! \s+|\s+$).)*$/;
    public regexOnlyNumber = /^[0-9]*$/;
    public regexSellerSku = /^(([a-zA-Z0-9].)|([^a-zA-Z0-9]+[a-zA-Z0-9])).*$/;

    listFilterOfferts: any[];
    eanList: any;
    productList: any;
    stockList: any;
    pluVtexList: any;
    sellerSkuList: any;

    offertRegexFilter = {
        nameProduct: '',
        sellerSku: '',
        number: ''
    };

    /**
     * Creates an instance of FilterComponent.
     * @param {ListComponent} list
     * @memberof FilterComponent
     */
    constructor(
        public list: ListComponent,
        public SUPPORT: SupportService,
    ) {
    }

    /**
     * @method ngOnInit
     * @description Metodo que se llama mientras se inicia el componente
     * @memberof FilterComponent
     */
    ngOnInit() {
        this.validateFormSupport();
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
                this.pluVtex.setValue(undefined);
                break;
            case 'filterSellerSku':
                this.sellerSku.setValue(undefined);
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
        this.product = new FormControl('', Validators.compose([Validators.maxLength(120), Validators.pattern(this.offertRegexFilter.nameProduct)]));
        this.ean = new FormControl('');
        this.pluVtex = new FormControl('', [Validators.pattern(this.offertRegexFilter.number)]);
        this.sellerSku = new FormControl('', [Validators.pattern(this.offertRegexFilter.sellerSku)]);
        this.stock = new FormControl('', []);
        this.matcher = new MyErrorStateMatcher();
    }

    public validateFormSupport(): void {
        this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
            let dataOffertRegex = JSON.parse(res.body.body);
            dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'productos' || data.Module === 'transversal');
            for (const val in this.offertRegexFilter) {
                if (!!val) {
                    const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
                    this.offertRegexFilter[val] = element && `${element.Value}`;
                }
            }
            this.createFormControls();
            this.createForm();
        });
    }

    /**
     * Metodo que permite solo números
     * @param {*} event
     * @memberof FilterComponent
     */
    onlyNumber(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
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
            pluVtex: this.pluVtex,
            sellerSku: this.sellerSku
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
     * Funcion que resetea el formulario y llama el listado de ofertas
     * @memberof FilterComponent
     */
    cleanFilter() {
        this.filterForm.reset();
        this.cleanFilterListOfferts();
        this.list.cleanAllFilter();
    }

    /**
     * Limpiamos variables del filtro
     * @memberof FilterComponent
     */
    public cleanFilterListOfferts(): void {
        this.eanList = null;
        this.productList = null;
        this.stockList = null;
        this.pluVtexList = null;
        this.sellerSkuList = null;
        this.listFilterOfferts = [];
    }

}
