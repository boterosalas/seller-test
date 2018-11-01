import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

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

    /**
     *  Json  con los colores predefinidos.
     */
    colorList = [
        { Name: 'Beige', color: '#F5F5DC', border: '#e2e1c8' },
        { Name: 'Negro', color: '#000000', border: '#000000' },
        { Name: 'Blanco', color: '#FFFFFF', border: '#bdbdbd' },
        { Name: 'Azul', color: '#03A9F4', border: '#8282f9' },
        { Name: 'Amarillo', color: '#FEEA3A', border: '#cece00' },
        { Name: 'Cafe', color: '#4E342E', border: '#3E2723' },
        { Name: 'Gris', color: '#37474F', border: '#565656' },
        { Name: 'Verde', color: '#2E7D32', border: '#1B5E20' },
        { Name: 'Naranja', color: '#FF8F00', border: '#FF6F00' },
        { Name: 'Rosa', color: '#E91E63', border: '#C2185B' },
        { Name: 'Morado', color: '#6639B6', border: '#670167' },
        { Name: 'Rojo', color: '#c62828', border: '#b71c1c' },
        { Name: 'Plata', color: '#BDBDBD', border: '#9E9E9E' },
        { Name: 'Dorado', color: '#FFB300', border: '#FFA000' },
        { Name: 'MultiColor', color: '#FFB300', border: '#FFA000' },
    ];

    constructor(
        private snackBar: MatSnackBar
    ) {
        this.createForm();
    }

    ngOnInit() {
    }

    private createForm(): void {
        this.formKeyword = new FormGroup({
            Keyword: new FormControl('', [])
        });
        this.formBasicInfo = new FormGroup({
            Name: new FormControl('',
                [
                    Validators.required
                ]),
            Category: new FormControl({ value: 'Nancy', disabled: true },
                [
                    Validators.required
                ]),
            Model: new FormControl('',
                [
                    Validators.required
                ]),
            Brand: new FormControl('',
                [
                    Validators.required
                ]),
            Detail: new FormControl('',
                [
                    Validators.required
                ]),
            packing: new FormGroup({
                HighPacking: new FormControl('',
                    [
                        Validators.required
                    ]),
                LongPacking: new FormControl('',
                    [
                        Validators.required
                    ]),
                WidthPacking: new FormControl('',
                    [
                        Validators.required
                    ]),
                WeightPacking: new FormControl('',
                    [
                        Validators.required
                    ])
            }),
            product: new FormGroup({
                HighProduct: new FormControl('',
                    [
                        Validators.required
                    ]),
                LongProduct: new FormControl('',
                    [
                        Validators.required
                    ]),
                WidthProduct: new FormControl('',
                    [
                        Validators.required
                    ]),
                WeightProduct: new FormControl('',
                    [
                        Validators.required
                    ])
            }),
            Description: new FormControl('',
                [
                    Validators.required
                ])
        });

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
                            Validators.required,
                        ]),
                    Size: new FormControl('',
                        [
                            Validators.required,
                        ]),
                    HexColorCodePDP: new FormControl('',
                        [
                            Validators.required,
                        ]),
                    HexColorCodeName: new FormControl('',
                        [
                            Validators.required,
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

}
