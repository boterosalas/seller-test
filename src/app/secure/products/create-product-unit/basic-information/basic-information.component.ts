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
            Category: new FormControl('Categoria',
                [
                    Validators.required
                ])
        });
        console.log(this.formBasicInfo);
    }

    public saveBasicInfo(): void {
    }
}
