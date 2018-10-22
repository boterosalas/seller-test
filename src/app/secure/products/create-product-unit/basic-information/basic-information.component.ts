import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

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

    constructor() {
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
        if ( this.formKeyword.controls.Keyword.value) {
            this.keywords.push(this.formKeyword.controls.Keyword.value);
            this.formKeyword.controls.Keyword.setValue(null);
        }
    }
}
