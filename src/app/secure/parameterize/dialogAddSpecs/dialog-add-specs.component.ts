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
    dataToEdit: any;
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddDialogSpecsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dataToEdit = data;
        console.log(data);
    }

    ngOnInit() {
        this.createAddSpecsFrom();
        console.log(this.dataToEdit);

    }

    public createAddSpecsFrom(): void {
        this.formAddSpecs = this.fb.group({
            nameSpec: new FormControl(this.dataToEdit.Name, Validators.required),
            requiredSpec: new FormControl(this.dataToEdit.Required),
            optionSpec: new FormControl(this.dataToEdit.ValueList, Validators.required),
        });
        this.matcher = new MyErrorStateMatcher();
    }

    public saveSpec(): void {
        if (this.formAddSpecs.valid) {
            const data = this.formAddSpecs.value;
            data.idSpec = this.dataToEdit.Id;
            console.log(data);
            this.dialogRef.close(data);
        }
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
            option: '',
            formControl: new FormControl('', Validators.required),
            name: 'option' + this.listOptions.length
        });
        this.formAddSpecs.addControl(this.listOptions[this.listOptions.length - 1].name, this.listOptions[this.listOptions.length - 1].formControl);
    }
}
