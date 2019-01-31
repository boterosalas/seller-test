import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, ErrorStateMatcher } from '@angular/material';
import { Logger, LoadingService } from '@app/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';

/* log component */
const log = new Logger('SearchCategorizationComponent');

// Error when invalid control is dirty, touched, or submitted.
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}


/**
 * Component dialogo para agregar nuevas especificaciones (specs).
 * @export
 * @class AddDialogComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-add-dialog-specs',
    templateUrl: './dialog-add-specs.component.html',
    styleUrls: ['./dialog-add-specs.component.scss']
})


export class AddDialogSpecsComponent implements OnInit {

    /**
     * Initializacion de variables del componente.
     *
     * @memberof AddDialogComponent
     */

    formAddSpecs: FormGroup;
    public matcher: MyErrorStateMatcher;
    list = false;
    public listOptions = [];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddDialogSpecsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.createAddSpecsFrom();
    }

    public createAddSpecsFrom(): void {
        this.formAddSpecs = this.fb.group({
            nameSpec: new FormControl('', Validators.required),
            requiredSpec: new FormControl('', Validators.required),
            optionSpec: new FormControl('', Validators.required),
        });
        this.matcher = new MyErrorStateMatcher();
    }

    public stateSpec() {
        console.log('radio_ ', this.formAddSpecs.controls.optionSpec.value);
    }

    /**
     * Cierra el componente dialogo sin ninguna repsuesta.
     *
     * @memberof AddDialogComponent
     */
    close(): void {
        this.dialogRef.close();
    }

    /**
     * Agregar opcion para lista deplegable
     *
     * @memberof AddDialogSpecsComponent
     */
    public addOption(): void {
        this.listOptions.push({
            'option': ''
        });
    }
}
