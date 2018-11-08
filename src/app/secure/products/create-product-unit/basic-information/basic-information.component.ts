import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { BasicInformationService } from './basic-information.component.service';

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
    keywords: string[] = [];
    colorSelected: string;
    sonList = [];
    colorPick: string;
    colorPick2: string;
    ColorPDP: string = null;
    CodeName: string = null;
    formCreate = false;
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
        { Name: 'MultiColor', color: '#FFB300', border: '#FFA000', hexColorCode: 986895 },
    ];
    validateRegex: any;

    constructor(
        private snackBar: MatSnackBar,
        private service: BasicInformationService
    ) {
    }

    ngOnInit() {
        this.valdiateInfoBasic();
    }

    public getValue(name: string): string {
        for (let i = 0; i < this.validateRegex.Data.length; i++) {
            if (this.validateRegex.Data[i].Identifier === name) {
                return this.validateRegex.Data[i].Value;
            }
        }
        return null;
    }

    private createForm(patterns: any): void {
        console.log('patterns.nameProduct: ', this.getValue('nameProduct'));
        this.formKeyword = new FormGroup({
            Keyword: new FormControl('', [])
        });
        this.formBasicInfo = new FormGroup({
            Name: new FormControl('',
                [
                    Validators.required, Validators.pattern(this.getValue('nameProduct'))
                ]),
            Category: new FormControl({ value: 'Nancy', disabled: true },
                [
                    Validators.required,
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
            packing: new FormGroup({
                HighPacking: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('packingHeightProduct'))
                    ]),
                LongPacking: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('packingLengthProduct'))
                    ]),
                WidthPacking: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('packingWidthProduct'))
                    ]),
                WeightPacking: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('packingWeightProduct'))
                    ])
            }),
            product: new FormGroup({
                HighProduct: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('packingHeightProduct'))
                    ]),
                LongProduct: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('packingLengthProduct'))
                    ]),
                WidthProduct: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('packingWidthProduct'))
                    ]),
                WeightProduct: new FormControl('',
                    [
                        Validators.required, Validators.pattern(this.getValue('packingWeightProduct'))
                    ])
            }),
            Description: new FormControl('',
                [
                    Validators.required, Validators.pattern(this.getValue('descriptionProduct'))
                ])
        });
        this.formCreate = true;
        console.log(this.formBasicInfo);
    }

    public saveBasicInfo(): void {
    }

    public sabeKeyword(): void {
        let word = this.formKeyword.controls.Keyword.value;
        if (word) {
            word = word.trim();
            if (word[word.length] !== ',') {
                word += ',';
            }
            this.keywords.push(word);
            this.formKeyword.controls.Keyword.setValue(null);
        }
    }
    /**
     * selectColor
     */
    public selectColor(color: any, son: any): void {
        son.colorSelected = color.Name;
        console.log(son);
    }


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
                        ])
                }),
                Show: true,
                colorPick: null,
                colorPick2: null,
            };
            let t = newForm.form.controls.HexColorCodePDP.disable();
            t = newForm.form.controls.HexColorCodeName.disable();
            this.sonList.push(newForm);
        } else {
            // error to show

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
            console.log('validateRegex: ', this.validateRegex.Data);
            this.createForm(this.validateRegex.Data);
        });

    }
}
