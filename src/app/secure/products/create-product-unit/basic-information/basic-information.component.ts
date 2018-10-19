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

    constructor() { }

    ngOnInit() {
        this.createForm();
    }

    private createForm(): void {
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
        });
    }

    public saveBasicInfo(): void {
    }
}
