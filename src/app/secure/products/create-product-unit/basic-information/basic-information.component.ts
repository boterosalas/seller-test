import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { BasicInformationService } from './basic-information.component.service';
import { EanServicesService } from '../validate-ean/ean-services.service';
import { ProcessService } from '../component-process/component-process.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-basic-information',
    templateUrl: './basic-information.component.html',
    styleUrls: ['./basic-information.component.scss']
})

export class ProductBasicInfoComponent implements OnInit {

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
    @Input() set detailProduct(value: any) {
        if (value) {
            this._detailProduct = value;
            this.getInformationBasic(value);
        }
    }
    /**
     *  Json  con los colores predefinidos.
     */
    colorList = [
        { Name: 'Beige', color: '#F5F5DC', border: '#e2e1c8', hexColorCode: 16185047 },
        { Name: 'Negro', color: '#000000', border: '#000000', hexColorCode: 0 },
        { Name: 'Blanco', color: '#FFFFFF', border: '#bdbdbd', hexColorCode: 16777215 },
        { Name: 'Azul', color: '#03A9F4', border: '#8282f9', hexColorCode: 255 },
        { Name: 'Amarillo', color: '#FEEA3A', border: '#cece00', hexColorCode: 16776960 },
        { Name: 'Cafe', color: '#4E342E', border: '#3E2723', hexColorCode: 6830601 },
        { Name: 'Gris', color: '#37474F', border: '#565656', hexColorCode: 9803157 },
        { Name: 'Verde', color: '#2E7D32', border: '#1B5E20', hexColorCode: 32768 },
        { Name: 'Naranja', color: '#FF8F00', border: '#FF6F00', hexColorCode: 16750899 },
        { Name: 'Rosa', color: '#E91E63', border: '#C2185B', hexColorCode: 15572666 },
        { Name: 'Morado', color: '#6639B6', border: '#670167', hexColorCode: 8388736 },
        { Name: 'Rojo', color: '#c62828', border: '#b71c1c', hexColorCode: 16711680 },
        { Name: 'Plata', color: '#BDBDBD', border: '#9E9E9E', hexColorCode: 12632256 },
        { Name: 'Dorado', color: '#FFB300', border: '#FFA000', hexColorCode: 15590005 },
        { Name: 'MultiColor', color: '#FFB300', border: '#bdbdbd', hexColorCode: 986895, multicolor: true },
    ];

    public UnitMeasurementList = ['Gramo', 'Mililitro', 'Metro', 'Unidad'];
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
        placeholder: 'Escriba aquí la descripción...',
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

    constructor(
        private snackBar: MatSnackBar,
        private service: BasicInformationService,
        private serviceEanSon: EanServicesService,
        private process: ProcessService
    ) {
        this.initComponent();
    }

    ngOnInit() {
        this.listOfBrands();
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
    }

    /**
     * Obtiene el valor de la regex
     *
     * @param {string} name
     * @returns {string}
     * @memberof ProductBasicInfoComponent
     */
    public getValue(name: string): string {
        for (let i = 0; i < this.validateRegex.Data.length; i++) {
            if (this.validateRegex.Data[i].Identifier === name) {
                return this.validateRegex.Data[i].Value;
            }
        }
        return null;
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
            Model: new FormControl('',
                [
                    Validators.required, Validators.pattern(this.getValue('modelProduct'))
                ]),
            Brand: new FormControl('',
                [
                    Validators.required, Validators.pattern(this.getValue('brandProduct'))
                ]),
            Detail: new FormControl('',
                [
                    Validators.required, Validators.pattern(this.getValue('detailProduct'))
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
            Description: new FormControl('',
                [
                    Validators.required, Validators.pattern(/^((?!<script>|<SCRIPT>|<Script>|&lt;Script&gt;|&lt;SCRIPT&gt;|&lt;script&gt;)[\s\S])*$/)
                ])
        });

        this.formBasicInfo.get('Brand').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
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
                }
            } else if (!val) {
                this.filterBrands = [];
                this.formBasicInfo.get('Brand').setErrors({ required: true });
            } else {
                this.formBasicInfo.get('Brand').setErrors({ pattern: true });
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
                        this.sendDataToService();
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
            if (this.keywords.length < 20) {
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
            } else {
                this.snackBar.open('Solo acepta un máximo de 20 palabras claves', 'Cerrar', {
                    duration: 3000,
                });
            }
        }
        this.validatorKeyWord();

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
        son.colorSelected = color.Name;
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
        if (hex) {
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
                    HexColorCodePDP: new FormControl('',
                        [
                            Validators.required,
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
            };
            let t = newForm.form.controls.HexColorCodePDP.disable();
            t = newForm.form.controls.HexColorCodeName.enable();
            this.sonList.push(newForm);
            this.valInputEan = newForm.form.controls.Ean;
            const views = this.process.getViews();
            views.showInfo = false;
            this.process.setViews(views);
        } else {
            this.snackBar.open('Para agregar mas hijos es necesario que el ultimo tenga todos los datos correctos', 'Cerrar', {
                duration: 3000,
            });
        }
    }

    public validarNewSon(): boolean {
        if (this.sonList.length) {
            if (!this.sonList[this.sonList.length - 1].form.valid) {
                this.sonList[this.sonList.length - 1].form.controls.Ean.markAsDirty();
                this.sonList[this.sonList.length - 1].form.controls.Size.markAsDirty();
                this.sonList[this.sonList.length - 1].form.controls.HexColorCodePDP.markAsDirty();
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
            ean.setValue('');
            this.valInputEan.disable();
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
            this.valInputEan.enable();
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
                this.sendDataToService();
                this.validAfter = true;
            } else if (this.validAfter && !this.getValidSonsForm()) {
                const views = this.process.getViews();
                views.showInfo = false;
                this.process.setViews(views);
            }
        }
    }

    /** Enviar datos al servicio */
    public sendDataToService(): void {
        const packingData = this.formBasicInfo.controls.packing as FormGroup;
        const productDateSize = this.formBasicInfo.controls.product as FormGroup;
        const data = {
            Name: this.formBasicInfo.controls.Name.value,
            Brand: this.formBasicInfo.controls.Brand.value.toUpperCase(),
            Details: this.formBasicInfo.controls.Detail.value,
            Model: this.formBasicInfo.controls.Model.value,
            SkuShippingSize: this.formBasicInfo.controls.shippingSize.value,
            PackageWidth: packingData.controls.WidthPacking.value,
            PackageHeight: packingData.controls.HighPacking.value,
            PackageLength: packingData.controls.LongPacking.value,
            PackageWeight: packingData.controls.WeightPacking.value,
            ProductWidth: productDateSize.controls.WidthProduct.value,
            ProductHeight: productDateSize.controls.HighProduct.value,
            ProductLength: productDateSize.controls.LongProduct.value,
            ProductWeight: productDateSize.controls.WeightProduct.value,
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
        for (let i = 0; i < this.sonList.length; i++) {
            sonData.push({
                Ean: this.sonList[i].form.controls.Ean.value,
                HasEAN: !this.sonList[i].form.controls.associateEanSon.value,
                Size: this.sonList[i].form.controls.Size.value,
                Color: this.sonList[i].colorSelected,
                HexColourCodePDP: this.sonList[i].colorPick.replace('#', ''),
                HexColourName: this.sonList[i].form.controls.HexColorCodeName.value
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
                this.sizes = JSON.parse(size.body);
            }
        });
    }
    getInformationBasic(detailProduct: any) {
        if (detailProduct) {
            if (this.formBasicInfo && this.formBasicInfo.controls) {
                const source = {
                    son: [
                        { ean: '7001114217494', size: 'M', color: 'green', hexColorCodePDP: '#5f1f1f', colorPick: '#5f1f1f', spefiColor: 'turquesa' },
                        { ean: '7001114217495', size: 'S', color: 'blue', hexColorCodePDP: '#1f5f4e', colorPick: '#5f1f1f', spefiColor: 'celeste' }
                    ]
                };
                detailProduct = { ...detailProduct, ...source };
                const packingData = this.formBasicInfo.controls.packing as FormGroup;
                const productDateSize = this.formBasicInfo.controls.product as FormGroup;
                this.formBasicInfo.controls.Name.setValue(detailProduct.name);
                this.formBasicInfo.controls.Brand.setValue(detailProduct.brand);
                this.formBasicInfo.controls.Model.setValue(detailProduct.model);
                this.formBasicInfo.controls.Detail.setValue('falta detalle de producto');
                this.formBasicInfo.controls.MeasurementUnit.setValue('Metro');
                this.formBasicInfo.controls.ConversionFactor.setValue(100);
                this.formBasicInfo.controls.shippingSize.setValue(detailProduct.shipping_size);
                packingData.controls.WidthPacking.setValue(detailProduct.package_width);
                packingData.controls.HighPacking.setValue(detailProduct.package_height);
                packingData.controls.LongPacking.setValue(detailProduct.package_length);
                packingData.controls.WeightPacking.setValue(detailProduct.package_weight);
                productDateSize.controls.WidthProduct.setValue(detailProduct.item_width);
                productDateSize.controls.HighProduct.setValue(detailProduct.item_height);
                productDateSize.controls.LongProduct.setValue(detailProduct.item_length);
                productDateSize.controls.WeightProduct.setValue(detailProduct.item_weight);
                this.formBasicInfo.controls.Description.setValue(detailProduct.description);
                this.formBasicInfo.controls.Keyword.setValue(detailProduct.keyword.join());
                if (detailProduct.keyword.length > 0) {
                    this.inputRequired = false;
                }
                this.saveKeyword();
                this.sendDataToService();
                if (detailProduct.son.length > 0) {
                    this.setChildren(detailProduct);
                }
            }
        }
    }

    setChildren(detailProduct: any) {
        if (detailProduct && detailProduct.son && detailProduct.son.length > 0) {
            for (let i = 0; i < detailProduct.son.length; i++) {
                const newForm = {
                    form: new FormGroup({
                        Ean: new FormControl(detailProduct.son[i].ean,
                            [
                                Validators.required, Validators.pattern(this.getValue('ean'))
                            ]),
                        Size: new FormControl('M',
                            [
                                Validators.required, Validators.pattern(this.getValue('sizeProduct'))
                            ]),
                        HexColorCodePDP: new FormControl('#5f1f1f',
                            [
                                Validators.required,
                            ]),
                        HexColorCodeName: new FormControl('RED',
                            [
                                Validators.required, Validators.pattern(this.getValue('hexColorNameProduct'))
                            ]),
                        associateEanSon: new FormControl(false
                        )
                    }),
                    Show: false,
                    colorPick: '#5f1f1f',
                    colorPick2: null,
                    colorSelected: 'green'
                };
                let t = newForm.form.controls.HexColorCodePDP.disable();
                t = newForm.form.controls.HexColorCodeName.enable();
                this.sonList.push(newForm);
                this.valInputEan = newForm.form.controls.Ean;
            }
        }
    }
}
