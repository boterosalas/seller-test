import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { MatSnackBar, ErrorStateMatcher } from '@angular/material';
import { BasicInformationService } from './basic-information.component.service';
import { EanServicesService } from '../validate-ean/ean-services.service';
import { ProcessService } from '../component-process/component-process.service';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { LoadingService } from '@app/core';
import { trimField, withArray } from '@app/shared/util/validation-messages';
import { TranslateService } from '@ngx-translate/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import _ from 'lodash';
import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';

/**
 * exporta funcion para mostrar los errores de validacion del formulario
 *
 * @export
 * @class MyErrorStateMatcher
 * @implements {ErrorStateMatcher}
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}


@Component({
    selector: 'app-basic-information',
    templateUrl: './basic-information.component.html',
    styleUrls: ['./basic-information.component.scss']
})


export class ProductBasicInfoComponent implements OnInit {

    @Input() isAdmin: string;
    otherForm: FormGroup;
    /** Initialize variables */
    formBasicInfo: FormGroup;
    packing: FormGroup;
    product: FormGroup;
    formKeyword: FormGroup;
    keywords = [];
    colorSelected: string;
    sonList = [];
    sizes = [];
    colorPick: string;
    colorPick2: string;
    ColorPDP: string = null;
    CodeName: string = null;
    formCreate = false;
    public validateEanSonExist;
    public validAfter = false;
    public descrip: string;
    _detailProduct: any;
    inputRequired = true;
    isEdit = false;
    listColorProducts = [];
    disabledEanChildren = false;
    show = false;
    isManual = false;
    borderColor = '';
    reload = 0;
    BrandsRegex = { brandsName: '', formatIntegerNumber: '', referenceProduct: ''};
    @Input() set detailProduct(value: any) {
        if (value) {
            this._detailProduct = value;
            if (!this.formBasicInfo) {
                this.initComponent();
            }
            this.disabledEanChildren = true;
            this.isEdit = true;
            this.getInformationBasic(value);
        }
    }
    /**
     *  Json  con los colores predefinidos.
     */
    colorList = [
        { Name: 'secure.products.create_product_unit.basic_information.beige', Label: 'Beige', color: '#F5F5DC', border: '#e2e1c8', hexColorCode: 16185047 },
        { Name: 'secure.products.create_product_unit.basic_information.black', Label: 'Negro', color: '#000000', border: '#000000', hexColorCode: 0 },
        { Name: 'secure.products.create_product_unit.basic_information.white', Label: 'Blanco', color: '#FFFFFF', border: '#bdbdbd', hexColorCode: 16777215 },
        { Name: 'secure.products.create_product_unit.basic_information.blue', Label: 'Azul', color: '#03A9F4', border: '#8282f9', hexColorCode: 255 },
        { Name: 'secure.products.create_product_unit.basic_information.yellow', Label: 'Amarillo', color: '#FEEA3A', border: '#cece00', hexColorCode: 16776960 },
        { Name: 'secure.products.create_product_unit.basic_information.brown', Label: 'Café', color: '#4E342E', border: '#3E2723', hexColorCode: 6830601 },
        { Name: 'secure.products.create_product_unit.basic_information.gray', Label: 'Gris', color: '#37474F', border: '#565656', hexColorCode: 9803157 },
        { Name: 'secure.products.create_product_unit.basic_information.green', Label: 'Verde', color: '#2E7D32', border: '#1B5E20', hexColorCode: 32768 },
        { Name: 'secure.products.create_product_unit.basic_information.orange', Label: 'Naranja', color: '#FF8F00', border: '#FF6F00', hexColorCode: 16750899 },
        { Name: 'secure.products.create_product_unit.basic_information.pink', Label: 'Rosa', color: '#E91E63', border: '#C2185B', hexColorCode: 15572666 },
        { Name: 'secure.products.create_product_unit.basic_information.purple', Label: 'Morado', color: '#6639B6', border: '#670167', hexColorCode: 8388736 },
        { Name: 'secure.products.create_product_unit.basic_information.red', Label: 'Rojo', color: '#c62828', border: '#b71c1c', hexColorCode: 16711680 },
        { Name: 'secure.products.create_product_unit.basic_information.silver', Label: 'Plata', color: '#BDBDBD', border: '#9E9E9E', hexColorCode: 12632256 },
        { Name: 'secure.products.create_product_unit.basic_information.golden', Label: 'Dorado', color: '#FFB300', border: '#FFA000', hexColorCode: 15590005 },
        { Name: 'secure.products.create_product_unit.basic_information.multicolored', Label: 'Multicolor', color: '#FFB300', border: '#bdbdbd', hexColorCode: 986895, multicolor: true },
    ];



    public UnitMeasurementList = ['secure.products.create_product_unit.basic_information.gram', 'secure.products.create_product_unit.basic_information.mililitre', 'secure.products.create_product_unit.basic_information.metre', 'secure.products.create_product_unit.basic_information.Unit'];
    validateRegex: any;
    newForm: any;
    valInputEan: any;
    asignatedEanSon: boolean;
    public showButton = false; // Variable que se conecta con el servicio que habilita los botones
    public productData: any;
    config: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
        // placeholder: this.languageService.instant('secure.products.create_product_unit.basic_information.write_description_here'),
        translate: 'no',
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ]
    };

    // Brands Variables
    brands = [];
    filterBrands = [];

    combos = [];

    constructor(
        private snackBar: MatSnackBar,
        private service: BasicInformationService,
        private serviceEanSon: EanServicesService,
        private process: ProcessService,
        public SUPPORT: SupportService,
        private loadingService: LoadingService,
        private languageService: TranslateService,
    ) {
        this.initComponent();
    }

    ngOnInit() {
        this.listOfBrands();
        this.getRegexByModule();
    }

    /**
     * Funcion que inicializa el formulario con los datos necesario.
     *
     * @memberof ProductBasicInfoComponent
     */
    public initComponent(): void {
        this.productData = this.process.getProductData();
        this.valdiateInfoBasic();
        this.listSize();
        this.listColor();
        this.validateEanSonExist = true;
        this.process.change.subscribe(data => {
            this.productData = this.process.getProductData();
            if (this.formBasicInfo && this.formBasicInfo.controls.Category.value !== this.productData.Category &&
                this.formBasicInfo.controls.Category.value !== this.productData.CategoryName) {
                this.formBasicInfo.controls.Category.setValue(this.productData.CategoryName);
                if (this.productData.ProductType === 'Clothing') {
                    if (!this._detailProduct) {
                        this.sonList = [];
                        const views = this.process.getViews();
                        views.showInfo = false;
                        this.process.setViews(views);
                    } else {
                        this._detailProduct.category = this.productData.CategoryName;
                        if (this._detailProduct.category !== this.productData.CategoryName) {
                            this.sonList = [];
                            const views = this.process.getViews();
                            views.showInfo = false;
                            this.process.setViews(views);
                        }
                    }
                } else {
                    this.sonList = [];
                    if (!this.formBasicInfo.invalid) {
                        const views = this.process.getViews();
                        views.showInfo = true;
                        this.process.setViews(views);
                    } else {
                        const views = this.process.getViews();
                        views.showInfo = false;
                        this.process.setViews(views);
                    }
                }
            }
            this.showButton = data.showEan;
        });
        this.reloadByCulture();
    }

    /**
     * Obtiene el valor de la regex
     *
     * @param {string} name
     * @returns {string}
     * @memberof ProductBasicInfoComponent
     */
    public getValue(name: string): string {
        if (this.validateRegex && this.validateRegex.Data) {
            for (let i = 0; i < this.validateRegex.Data.length; i++) {
                if (this.validateRegex.Data[i].Identifier === name) {
                    return this.validateRegex.Data[i].Value;
                }
            }
            return null;
        }
    }

    /**
     * Create formulario para informacion basica.
     *
     * @private
     * @memberof ProductBasicInfoComponent
     */
    private createForm(): void {

        this.formKeyword = new FormGroup({
        });

        this.formBasicInfo = new FormGroup({
            Keyword: new FormControl('', [Validators.required]),
            Name: new FormControl('', Validators.compose([
                Validators.required, Validators.pattern(this.getValue('nameProduct')), Validators.minLength(1)
            ])),
            Category: new FormControl({ value: this.productData.CategorySelected, disabled: true },
                [
                    Validators.required,
                ]),
            shippingSize: new FormControl(1,
                [
                ]),
            IsCombo: new FormControl(false, []),
            EanCombo: new FormControl('', [Validators.pattern(this.getValue('ean'))]),
            Brand: new FormControl('',
                [
                    Validators.required, Validators.pattern(this.getValue('brandProduct'))
                ]),
            MeasurementUnit: new FormControl('', [Validators.required]),
            ConversionFactor: new FormControl('', [Validators.required, Validators.pattern(this.getValue('factConversionProduct'))]),
            packing: new FormGroup({
                HighPacking: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('decimalsProduct'))
                    ]),
                LongPacking: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('decimalsProduct'))
                    ]),
                WidthPacking: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('decimalsProduct'))
                    ]),
                WeightPacking: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('decimalsProduct'))
                    ])
            }),
            product: new FormGroup({
                HighProduct: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('decimalsProduct'))
                    ]),
                LongProduct: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('decimalsProduct'))
                    ]),
                WidthProduct: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('decimalsProduct'))
                    ]),
                WeightProduct: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('decimalsProduct'))
                    ])
            }),
            parentReference: new FormControl('', [Validators.pattern(this.BrandsRegex.referenceProduct)]),
            Description: new FormControl('',
                [
                    Validators.required, Validators.pattern(/^((?!<script>|<SCRIPT>|<Script>|&lt;Script&gt;|&lt;SCRIPT&gt;|&lt;script&gt;)[\s\S])*$/)
                ])

        });
        this.formBasicInfo.controls.EanCombo.disable();
        this.formBasicInfo.get('IsCombo').valueChanges.subscribe(val => {
            if (!val) {
                this.combos = [];
                this.formBasicInfo.controls.EanCombo.disable();
                this.formBasicInfo.setValidators(null);
            } else {
                this.formBasicInfo.controls.EanCombo.enable();
                this.formBasicInfo.controls.EanCombo.reset();
                this.formBasicInfo.setValidators(withArray(this.combos));
            }
        });

        this.formBasicInfo.get('Brand').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
            if (!this.isManual) {
                if (!!val && val.length >= 2) {
                    this.filterBrands = this.brands.filter(brand => brand.Name.toString().toLowerCase().includes(val.toLowerCase()));
                    const exist = this.filterBrands.find(brand => brand.Name === val);
                    if (!exist) {
                        if (this._detailProduct && this._detailProduct.brand !== undefined && this._detailProduct.brand !== '') {
                            this.formBasicInfo.get('Brand').clearValidators();
                        } else {
                            this.formBasicInfo.get('Brand').setErrors({ pattern: true });
                        }
                    } else {
                        this.formBasicInfo.get('Brand').setErrors(null);
                        const views = this.process.getViews();
                        views.showInfo = true;
                        this.process.setViews(views);
                    }
                } else if (!val) {
                    this.filterBrands = [];
                    this.formBasicInfo.get('Brand').setErrors({ required: true });
                } else {
                    this.formBasicInfo.get('Brand').setErrors({ pattern: true });
                }
            } else {
                if (!val) {
                    this.filterBrands = [];
                    this.formBasicInfo.get('Brand').setErrors({ required: true });
                }
            }

        });

        this.validatorKeyWord();
        this.formCreate = true;
        this.formBasicInfo.statusChanges.subscribe(data => {
            const views = this.process.getViews();
            if (data === 'INVALID') {
                if (this.formBasicInfo.controls.Description.value !== this.descrip) {
                    this.descrip = this.formBasicInfo.controls.Description.value;
                }
                views.showInfo = false;
                this.process.setViews(views);
            } else {
                if (this.formBasicInfo.controls.Description.value && this.formBasicInfo.controls.Description.value !== this.descrip) {
                    this.descrip = this.formBasicInfo.controls.Description.value;
                    if (this.validateClothingProduct()) {
                        this.sendDataToService(true);
                    }
                }
                if (views.showInfo && this.keywords.length > 0 && this.validateClothingProduct()) {
                    views.showInfo = true;
                    this.process.setViews(views);
                }
            }
        });


    }

    public validateClothingProduct(): boolean {
        return (this.productData.ProductType === 'Clothing' && this.getValidSonsForm() || (this.productData.ProductType !== 'Clothing'));
    }

    /**
     * Funcion que guarda las palabras claves en un arreglo con coma si no la posee.
     *
     * @memberof ProductBasicInfoComponent
     */
    public saveKeyword(): void {
        let word = this.formBasicInfo.controls.Keyword.value;
        if (word) {
            word = word.trim();
            if (word.search(',') === -1) {
                this.keywords.push(word);
            } else {
                const counter = word.split(',');
                counter.forEach(element => {
                    if (element) {
                        this.keywords.push(element);
                    }
                });
            }
            this.detectForm();
            this.formBasicInfo.controls.Keyword.clearValidators();
            this.formBasicInfo.controls.Keyword.reset();
        }
        if (!this.isEdit) {
            this.validatorKeyWord();
        }

        if (this.keywords.length === 0) {
            this.validatorKeyWord();
        }
    }

    public validatorKeyWord() {
        if (this.keywords.length > 0) {
            this.formBasicInfo.controls.Keyword.setErrors(null);
        } else {
            this.formBasicInfo.controls.Keyword.setValidators(Validators.required);
        }
    }

    public deleteKeywork(indexOfValue: number): void {
        this.keywords.splice(indexOfValue, 1);
        if (this.keywords.length < 1) {
            this.formBasicInfo.setErrors({ required: true });
        }
    }

    /**
     * selectColor
     */
    public selectColor(color: any, son: any): void {
        son.colorSelected = color.Label;
        this.detectForm();
    }


    /**
     * Functiones que validan si es un color oscuro para ponerle una clase de border en el selector de color.
     *
     * @param {string} str
     * @param {number} [len=0]
     * @returns
     * @memberof ProductBasicInfoComponent
     */
    public padZero(str: string, len: number = 0) {
        len = len || 2;
        const zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }

    public invertColor(hex: string, bw: boolean = true) {
        // if (hex) {
        if (hex && hex !== '#0') {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            if (hex.length !== 6) {
                throw new Error('Invalid HEX color.');
            }
            const r = parseInt(hex.slice(0, 2), 16),
                g = parseInt(hex.slice(2, 4), 16),
                b = parseInt(hex.slice(4, 6), 16);
            if (bw) {
                return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                    ? '#bdbdbd'
                    : '#FFFFFF';
            }
            // pad each with zeros and return
            return '#' + this.padZero((255 - r).toString(16)) + this.padZero((255 - g).toString(16)) + this.padZero((255 - b).toString(16));
        }
    }

    public addSon(): void {
        if (this.validarNewSon()) {
            const newForm = {
                form: new FormGroup({
                    Ean: new FormControl('',
                        [
                            Validators.required, Validators.pattern(this.getValue('ean'))
                        ]),
                    Size: new FormControl('',
                        [
                            Validators.required, Validators.pattern(this.getValue('sizeProduct'))
                        ]),
                    HexColorCodeName: new FormControl('',
                        [
                            Validators.required, Validators.pattern(this.getValue('hexColorNameProduct'))
                        ]),
                    associateEanSon: new FormControl(false
                    )
                }),
                Show: true,
                colorPick: null,
                colorPick2: null,
                listColor: this.mapItems(this.listColorProducts),
                name: null
            };
            newForm.form.controls.HexColorCodeName.enable();
            this.sonList.push(newForm);
            this.valInputEan = newForm.form.controls.Ean;
            const views = this.process.getViews();
            views.showInfo = false;
            this.process.setViews(views);
        } else {
            // error to show

            this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.basic_information.order_to_add_necessary'), this.languageService.instant('actions.close'), {
                duration: 3000,
            });
        }
    }

    public validarNewSon(): boolean {
        if (this.sonList.length) {
            if (!this.sonList[this.sonList.length - 1].form.valid) {
                this.sonList[this.sonList.length - 1].form.controls.Ean.markAsDirty();
                this.sonList[this.sonList.length - 1].form.controls.Size.markAsDirty();
                this.sonList[this.sonList.length - 1].form.controls.HexColorCodeName.markAsDirty();
                this.sonList[this.sonList.length - 1].dirty = true;
                this.sonList[this.sonList.length - 1].Show = true;
            }
            return this.sonList[this.sonList.length - 1].form.valid;
        } else {
            return true;
        }
    }


    public toggleSon(son: any): void {
        son.Show = !son.Show;
    }

    public deleteSon(index: number): void {
        this.sonList.splice(index, 1);
        this.sendDataToService(true);
    }

    public valdiateInfoBasic(): void {
        const param = ['productos', null];
        this.service.getRegexInformationBasic(param).subscribe(res => {
            this.validateRegex = JSON.parse(res.body.body);
            this.createForm();
        });

    }

    /**
     * Funcion para validar si el EAn del Hijo existe.
     * @member of validateEanSon()
     * @memberof ProductBasicInfoComponent
     */
    public validateEanSon(): void {
        if (this.valInputEan.value !== '') {
            this.serviceEanSon.validateEan(this.valInputEan.value).subscribe(res => {
                // Validar si la data es un booleano para validar si exiset el Ean del hijo
                this.validateEanSonExist = (res['data']);
                if (this.validateEanSonExist) {
                    this.valInputEan.setErrors({ 'validExistEanSonDB': this.validateEanSonExist });
                }
            });
        }
    }

    onAsignatedEanSonChanged(value: boolean, ean: any) {
        this.asignatedEanSon = value;
        if (this.asignatedEanSon === true) {
            if (ean) {
                ean.setValue('');
                ean.disable();
            }
            if (!this.valInputEan.value) {
                const data = {
                    AssignEan: this.asignatedEanSon
                };
                this.process.validaData(data);
            } else {
                this.process.unavailableEanView();
            }
        } else {
            if (!this.valInputEan.value && !this.validateEanSonExist) {
                this.process.unavailableEanView();
            } else {
                this.sendEanSon();
            }
            if (ean) {
                ean.enable();
            }
        }
        this.detectForm();
    }

    /**
     * Envia ean para ser validado
     *
     * @memberof ProductBasicInfoComponent
     */
    public sendEanSon(): void {
        const data = {
            Ean: this.valInputEan.value
        };
        this.process.validaData(data);
    }

    /**
     * Detecta cambios en el formulario para asi cuando este, este valido, permita continuar con la creación.
     *
     * @memberof ProductBasicInfoComponent
     */
    public detectForm(): void {
        if (this.formBasicInfo.valid && this.keywords.length) {
            if ((this.productData.ProductType === 'Clothing' && this.getValidSonsForm()) || (this.productData.ProductType !== 'Clothing')) {
                const isClothing = this.productData.ProductType === 'Clothing' ? true : false;
                this.sendDataToService(isClothing);
                this.validAfter = true;
            } else if (this.validAfter && !this.getValidSonsForm()) {
                const views = this.process.getViews();
                views.showInfo = false;
                this.process.setViews(views);
            }
        }
    }

    setValidatorKeywords() {
        this.formBasicInfo.controls['Keyword'].setValidators([Validators.required, Validators.pattern(this.getValue('keyWordsProduct'))]);
    }

    public checkVerify(value: boolean) {
        if (this.combos && this.combos.length === 0) {
            this.combos = [];
        }
        let data = {
            IsCombo: !value,
            EanCombo: this.combos
        };
        if (!value === false) {
            data = {
                IsCombo: !value,
                EanCombo: null
            };
        }
        this.process.validaData(data);
    }


    /** Enviar datos al servicio */
    public sendDataToService(isClothing?: any): void {
        const packingData = this.formBasicInfo.controls.packing as FormGroup;
        const productDateSize = this.formBasicInfo.controls.product as FormGroup;
        const data = {
            Name: this.formBasicInfo.controls.Name.value,
            Brand: this.formBasicInfo.controls.Brand.value.toUpperCase(),
            SkuShippingSize: this.formBasicInfo.controls.shippingSize.value,
            IsCombo: this.formBasicInfo.controls.IsCombo.value,
            PackageWidth: packingData.controls.WidthPacking.value,
            PackageHeight: packingData.controls.HighPacking.value,
            PackageLength: packingData.controls.LongPacking.value,
            PackageWeight: packingData.controls.WeightPacking.value,
            ProductWidth: productDateSize.controls.WidthProduct.value,
            ProductHeight: productDateSize.controls.HighProduct.value,
            ProductLength: productDateSize.controls.LongProduct.value,
            ProductWeight: productDateSize.controls.WeightProduct.value,
            ParentReference: isClothing === true ? this.formBasicInfo.controls.parentReference.value : '',
            Description: this.formBasicInfo.controls.Description.value,
            MeasurementUnit: this.formBasicInfo.controls.MeasurementUnit.value,
            ConversionFactor: this.formBasicInfo.controls.ConversionFactor.value,
            KeyWords: this.keywords.join(),
            Children: this.getSonData()
        };
        this.process.validaData(data);
    }

    public getSonData(): any {
        const sonData = [];
        let children: any;
        if (this._detailProduct && this._detailProduct.productType === 'Clothing' && this._detailProduct.children) {
            children = this._detailProduct.children;
        }
        for (let i = 0; i < this.sonList.length; i++) {
            sonData.push({
                Ean: this.sonList[i].form.controls.Ean.value,
                HasEAN: !this.sonList[i].form.controls.associateEanSon.value,
                Size: this.sonList[i].form.controls.Size.value,
                Color: this.sonList[i].colorSelected,
                HexColourName: this.sonList[i].form.controls.HexColorCodeName.value,
                idProductProcess: children !== undefined ? children[i].idProductProcess : null
            });
        }
        return sonData;
    }

    /**
     * Valida si el producto es clothing y si posee hijos creados y validados en el formulario
     *
     * @returns {boolean}
     * @memberof ProductBasicInfoComponent
     */
    public getValidSonsForm(): boolean {
        let valid = true;
        for (let i = 0; i < this.sonList.length; i++) {
            if (!this.sonList[i].form.valid || !this.sonList[i].colorSelected ||
                !this.sonList[i].colorPick) {
                valid = false;
            }
        }
        if (!this.sonList.length) {
            valid = false;
        }
        return valid;
    }

    /**
     * Obtiene el listado de marcas
     *
     * @returns {array}
     * @memberof ProductBasicInfoComponent
     */

    listOfBrands() {
        this.loadingService.viewSpinner();
        this.service.getActiveBrands().subscribe(brands => {
            const initialBrands = brands.Data.Brands;
            this.brands = initialBrands.sort((a, b) => {
                if (a.Name > b.Name) {
                    return 1;
                }
                if (a.Name < b.Name) {
                    return -1;
                }
                return 0;
            });
            this.loadingService.closeSpinner();
        });
    }

    /**
     * Funcion para somunir el listado de tallas
     *
     * @memberof ProductBasicInfoComponent
     */
    listSize() {
        this.service.getSizeProducts().subscribe(size => {
            if (size.status === 200 || size.status === 201) {
                    this.sizes = size.body['data'];
                if (this.sonList.length > 0) {
                    for (let i = 0; i < this.sonList.length; i++) {
                        this.sonList[i].form.controls.Size.enable();
                    }
                }
            }
        });
    }
    /**
     * Funcion para consumir los colores
     *
     * @memberof ProductBasicInfoComponent
     */
    listColor() {
        this.service.getColorProducts().subscribe(result => {
            if (result.status === 200 || result.status === 201) {
                if (result && result.body.errors.length === 0) {
                    this.listColorProducts = result.body.data;
                    this.listColorProducts = this.mapItems(
                        this.listColorProducts
                    );
                } else {
                    this.listColorProducts = [];
                }
            } else {
                this.listColorProducts = [];
            }
        });
    }

    /**
     * funcion para mapear un nuevo array de colores por cada hijo con atributos como selected, colorText y border que no vienen en el modelo
     *
     * @param {any[]} items
     * @returns {any[]}
     * @memberof ProductBasicInfoComponent
     */
    mapItems(items: any[]): any[] {
        return items.map(x => {
            return {
                code: x.code,
                name: x.name,
                label: x.label,
                selected: false,
                colorText: this.colorText(x.code),
                border: this.colorBorder(x.code)
            };
        });
    }
    /**
     * funcion para cambiar el color del texto, valida cuando el color de fondo es claro y le coloca un color mas oscuro al texto
     *
     * @param {string} code
     * @returns
     * @memberof ProductBasicInfoComponent
     */
    colorText(code: string) {
        let colorText = '';
        if (code === 'FFCC13' || code === 'FFDB58' || code === 'FFFF00' || code === 'F7FE2E' || code === 'F4FA58' || code === 'E6D690' || code === 'E3E4E5' || code === 'ECE2C6' || code === 'FFFFFF' || code === 'C2C2C2' || code === 'F9F9E7' || code === 'F5F5DC' || code === 'FFEDAE' || code === 'F2D3BC' || code === 'E0E094' || code === 'F2D3BC' || code === 'FFBCA4' || code === '19FF74' || code === 'FF90C8' || code === 'D2691E' || code === 'FFFFFE' || code === 'FFFFFD' || code === 'FFFFFC'|| code === 'F9F9E7') {
            colorText = '5d5c5c ';
        } else {
            colorText = 'e9e8e8';
        }
        return colorText;
    }
    /**
     * funcion para cambiar el color de border claros por oscuros
     *
     * @param {string} code
     * @returns
     * @memberof ProductBasicInfoComponent
     */
    colorBorder(code: string) {
        let colorBorder = '';
        if (code === 'FFFFFF' || code === 'F9F9E7' || code === 'FFFFFE' || code === 'FFFFFD' || code === 'FFFFFC') {
            colorBorder = '1px solid #d4d2d2';
        } else {
            colorBorder = '1px solid #' + code;
        }
        return colorBorder;
    }
    /**
     * funcion para seleccionar un color y mandarlo al json y a las diferentes variables
     *
     * @param {string} code
     * @param {string} name
     * @param {boolean} selected
     * @param {*} son
     * @memberof ProductBasicInfoComponent
     */
    select(code: string, name: string, selected: boolean, son: any) {
        son.listColor.forEach(element => {
            element.selected = false;
            if (element.code === code) {
                element.selected = !selected;
                if (!selected === false) {
                    son.colorSelected = null;
                    son.colorPick = null;
                } else {
                    son.colorSelected = name;
                    son.colorPick = code;
                    son.name = name;
                }
            }
        });
        this.detectForm();
    }

    /**
     * funcion para recarga el input de tallas dependiendo del idioma seleccionado
     *
     * @memberof ProductBasicInfoComponent
     */
    reloadByCulture() {
        this.languageService.onLangChange.subscribe((e: Event) => {
            this.reload ++;
            if (this.reload > 2) {
                window.location.reload();
            }
            if (this.sonList.length > 0) {
                this.listColorProducts = [];
                this.listColor();
                this.sizes = [];
                this.listSize();
                setTimeout(() => {
                    for (let i = 0; i < this.sonList.length; i++) {
                        const list = this.mapItemsEdit(this.listColorProducts);
                        setTimeout(() => {
                            this.sonList[i].form.controls.Size.setValue();
                            this.sonList[i].form.controls.Size.disable();
                            this.sonList[i].listColor = this.setChildenColor(list, this.sonList[i].name);
                            this.sonList[i].colorSelected = this.searchColorSelect(list, this.sonList[i].name);
                        }, 3000);
                    }
                }, 5000);
            }
        });
    }
    /**
     * funcion para mapear los hijos cuando vienen para editarlos
     *
     * @param {any[]} items
     * @returns {any[]}
     * @memberof ProductBasicInfoComponent
     */
    mapItemsEdit(items: any[]): any[] {
        return items.map(x => {
            return {
                code: x.code,
                name: x.name,
                label: x.label,
                selected: false,
                colorText: this.colorText(x.code),
                border: this.colorBorder(x.code)
            };
        });
    }
    /**
     * informacion basica - llena la información
     *
     * @param {*} detailProduct
     * @memberof ProductBasicInfoComponent
     */
    getInformationBasic(detailProduct: any) {
        if (detailProduct) {
            if (this.formBasicInfo && this.formBasicInfo.controls) {
                const packingData = this.formBasicInfo.controls.packing as FormGroup;
                const productDateSize = this.formBasicInfo.controls.product as FormGroup;
                this.formBasicInfo.controls.Name.setValue(detailProduct.name);
                this.formBasicInfo.controls.Brand.setValue(detailProduct.brand);
                this.formBasicInfo.controls.MeasurementUnit.setValue(detailProduct.measurementUnit);
                this.formBasicInfo.controls.ConversionFactor.setValue(detailProduct.conversionFactor);
                this.formBasicInfo.controls.shippingSize.setValue(detailProduct.skuShippingSize);
                packingData.controls.WidthPacking.setValue(detailProduct.packageWidth);
                packingData.controls.HighPacking.setValue(detailProduct.packageHeight);
                packingData.controls.LongPacking.setValue(detailProduct.packageLength);
                packingData.controls.WeightPacking.setValue(detailProduct.packageWeight);
                productDateSize.controls.WidthProduct.setValue(detailProduct.productWidth);
                productDateSize.controls.HighProduct.setValue(detailProduct.productHeight);
                productDateSize.controls.LongProduct.setValue(detailProduct.productLength);
                productDateSize.controls.WeightProduct.setValue(detailProduct.productWeight);
                this.formBasicInfo.controls.Description.setValue(detailProduct.description);
                if (detailProduct.keyWords !== null && detailProduct.keyWords !== undefined) {
                    this.formBasicInfo.controls.Keyword.setValue(detailProduct.keyWords);
                    this.inputRequired = false;
                } else {
                    this.formBasicInfo.controls.Keyword.setValue(null);
                    this.inputRequired = true;
                }
                if (detailProduct.children && detailProduct.children.length > 0) {
                    this.setChildren(detailProduct);
                }
                const isClothing = detailProduct.productType === 'Clothing' ? true : false;

                if (this.isEdit) {
                    const valueReference = detailProduct.parentReference ? detailProduct.parentReference : '';
                    this.formBasicInfo.controls.parentReference.setValue(valueReference);
                    this.formBasicInfo.controls.parentReference.disable();
                } else {
                    this.formBasicInfo.controls.parentReference.enable();
                    this.formBasicInfo.controls.parentReference.setValidators([Validators.required, Validators.pattern(this.BrandsRegex.referenceProduct)]);
                }
                this.saveKeyword();
                this.sendDataToService(isClothing);
            }
        }
    }
    /**
     * setea los hijos registrados en el formulario
     *
     * @param {*} detailProduct
     * @memberof ProductBasicInfoComponent
     */
    setChildren(detailProduct: any) {
        if (detailProduct && detailProduct.children && detailProduct.children.length > 0) {
            for (let i = 0; i < detailProduct.children.length; i++) {
                const list = this.mapItems(this.listColorProducts);
                const newForm = {
                    form: new FormGroup({
                        Ean: new FormControl({ value: detailProduct.children[i].ean, disabled: true },
                            [
                                Validators.required, Validators.pattern(this.getValue('ean'))
                            ]),
                        Size: new FormControl(detailProduct.children[i].size,
                            [
                                Validators.required, Validators.pattern(this.getValue('sizeProduct'))
                            ]),
                        HexColorCodeName: new FormControl(detailProduct.children[i].hexColourName,
                            [
                                Validators.required, Validators.pattern(this.getValue('hexColorNameProduct'))
                            ]),
                        associateEanSon: new FormControl({ value: false, disabled: true }
                        )
                    }),
                    Show: false,
                    colorPick: '#' + detailProduct.children[i].hexColourCodePDP,
                    colorPick2: null,
                    colorSelected: this.searchColorSelect(list, detailProduct.children[i].color),
                    listColor: this.setChildenColor(list, detailProduct.children[i].color),
                    name: detailProduct.children[i].color
                };
                newForm.form.controls.HexColorCodeName.enable();
                this.sonList.push(newForm);
                this.valInputEan = newForm.form.controls.Ean;
            }
        }
    }

    /**
     * funcion para setear el color a los hijos
     *
     * @param {*} list
     * @param {string} color
     * @returns
     * @memberof ProductBasicInfoComponent
     */
    setChildenColor(list: any, color: string) {
        list.forEach(element => {
            if (element.label === color) {
                element.selected = true;
            }
        });
        return list;
    }
    /**
     * funcion para buscar en la lista de colores el seleccionado
     *
     * @param {*} list
     * @param {string} color
     * @returns
     * @memberof ProductBasicInfoComponent
     */
    searchColorSelect(list: any, color: string) {
        let name = '';
        list.forEach(element => {
            if (element.label === color) {
                name = element.name;
            }
        });
        return name;
    }

    addEanCombo() {
        if (!!this.formBasicInfo.controls.EanCombo.value && this.formBasicInfo.controls.EanCombo.valid && !this.combos.includes(this.formBasicInfo.controls.EanCombo.value)) {
            this.loadingService.viewSpinner();
            this.serviceEanSon.validateEan(this.formBasicInfo.controls.EanCombo.value).subscribe(res => {
                // Validar si la data es un booleano para validar si exiset el Ean del hijo
                this.validateEanSonExist = (res['data']);
                if (this.validateEanSonExist) {
                    this.combos.push(this.formBasicInfo.controls.EanCombo.value);
                    const data = {
                        EanCombo: this.combos
                    };
                    this.process.validaData(data);
                    this.formBasicInfo.controls.EanCombo.reset();
                } else {
                    this.formBasicInfo.controls.EanCombo.setErrors({ existBD: true });
                }
                this.loadingService.closeSpinner();
            });
        } else {
            this.formBasicInfo.controls.EanCombo.setErrors({ exist: true });
        }
    }

    deleteEan(index: number) {
        this.combos.splice(index, 1);
        const data = {
            EanCombo: this.combos
        };
        this.process.validaData(data);
    }
    showBrandsInput(changeShow: boolean) {
        this.show = !changeShow;
        this.isManual = !changeShow;
        this.setValidateBrands();
    }

    setValidateBrands() {
        this.formBasicInfo.controls['Brand'].setValue('');
        this.formBasicInfo.get('Brand').setErrors(null);
        if (this.isManual) {
            this.formBasicInfo.controls['Brand'].setValidators([Validators.required, Validators.pattern(this.BrandsRegex.brandsName)]);
        } else {
            this.formBasicInfo.controls['Brand'].setValidators([
                Validators.required, Validators.pattern(this.getValue('brandProduct'))
            ]);
        }
    }


    public getRegexByModule(): void {
        this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
            let dataOffertRegex = JSON.parse(res.body.body);
            dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'parametrizacion' || data.Module === 'productos');
            for (const val in this.BrandsRegex) {
                if (!!val) {
                    const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
                    this.BrandsRegex[val] = element && `${element.Value}`;
                }
            }
            this.createForm();
        });
    }

    get IsCombo(): FormControl {
        return this.formBasicInfo.controls.IsCombo as FormControl;
    }
}
