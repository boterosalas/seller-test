import { Component, OnInit, Inject } from '@angular/core';
import { FormGroupName, FormGroup, FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
    chargueView = false;

    // tslint:disable-next-line:max-line-length
    textTerms: string;


    constructor(
        public dialogRef: MatDialogRef<TermsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.textTerms = data;

    }

    ngOnInit() {
        this.createTermsForms();
    }

    /** funcion para abrir nueva ventana con la url del documento pdf de terminos */
    public closeDialog(): void {
        window.open(this.textTerms, '_blank');
    }

    /**
     * Funcion para inicializar el formulario
     *
     * @memberof TermsComponent
     */
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
        this.chargueView = true;
    }

    /**
     * Guardar terminos del vendendor.
     *
     * @memberof TermsComponent
     */
    public saveTerms(): void {
        if (this.formTerms.valid) {
            of(true).subscribe(data => {
                if (data) {
                    this.dialogRef.close();
                }
            /* }, error => {*/
            });
        }
    }
}
