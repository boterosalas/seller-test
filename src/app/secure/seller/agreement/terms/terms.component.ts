import { Component, OnInit } from '@angular/core';
import { FormGroupName, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-terms',
    templateUrl: 'terms.component.html',
    styleUrls: ['terms.component.scss']
})

export class TermsComponent implements OnInit {

    /**
     * Se inicializan variables necesarias para el funcionamiento del componente de mostrar el dialogo de contrato de trabajo.
     * @memberof TermsComponent
     */
    formTerms: FormGroup;



    constructor() {
    }

    ngOnInit() {}

    createTermsForms(): void {
        this.formTerms = new FormGroup({
            responsable: new FormControl('', [
                Validators.required
            ]),
            identification: new FormControl('', [
                Validators.required
            ]),
            accept: new FormControl(false, [
                Validators.requiredTrue
            ])
        });
    }
}
