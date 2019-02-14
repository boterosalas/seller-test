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
    typeList = 'list';
    typeText = 'text';
    optionNumber = 0;
    showErrorMin = false;
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddDialogSpecsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dataToEdit = data;
    }

    ngOnInit() {
        this.createAddSpecsFrom();
    }

    /**
     * Remover opciones de la vista.
     *
     * @param {*} opc
     * @param {number} index
     * @memberof AddDialogSpecsComponent
     */
    public removeOpt(opc: any, index: number): void {
        this.formAddSpecs.removeControl(opc.name);
        this.listOptions.splice(index, 1);
    }

    public createAddSpecsFrom(): void {
        let optionData = null;
        if (this.dataToEdit) {
            optionData = this.dataToEdit.List.length !== 0 ? this.typeList : this.typeText;
            this.optionNumber = this.dataToEdit.List.length;
        }
        this.formAddSpecs = this.fb.group({
            nameSpec: new FormControl(this.dataToEdit !== null ? this.dataToEdit.Name : null, [Validators.required, Validators.maxLength(200)]),
            requiredSpec: new FormControl(this.dataToEdit !== null ? this.dataToEdit.Required : null),
            optionSpec: new FormControl(optionData, Validators.required),
        });

        if (this.dataToEdit && this.dataToEdit.List && this.dataToEdit.List.length) {
            this.dataToEdit.List.forEach(element => {
                this.listOptions.push({
                    option: element,
                    formControl: new FormControl(element, Validators.required),
                    name: 'option' + this.listOptions.length
                });
                this.formAddSpecs.addControl(this.listOptions[this.listOptions.length - 1].name, this.listOptions[this.listOptions.length - 1].formControl);
            });
        }
        this.formAddSpecs.controls.optionSpec.setValue(optionData);
        this.matcher = new MyErrorStateMatcher();
    }

    /**
     * Valida si el formularioes valido y si esta seleccionada la opcion tipo lista que todos sus componentes tengan valores.
     *
     * @memberof AddDialogSpecsComponent
     */
    public saveSpec(): void {
        if (this.formAddSpecs.valid && ((this.validOptions() && this.formAddSpecs.controls.optionSpec.value === this.typeList) || this.formAddSpecs.controls.optionSpec.value === this.typeText)) {
            const data = this.formAddSpecs.value;
            data.idSpec = this.dataToEdit !== null ? this.dataToEdit.Id : null;
            if (this.listOptions.length && this.formAddSpecs.controls.optionSpec.value === this.typeList) {
                data.ListValues = [];
                this.listOptions.forEach(element => {
                    data.ListValues.push(element.formControl.value);
                });
            }
            this.dialogRef.close(data);
        }
    }

    /**
     * Valida que las opciones esten todas llenas
     *
     * @returns {boolean}
     * @memberof AddDialogSpecsComponent
     */
    public validOptions(): boolean {
        let changes = true;
        if (this.listOptions.length) {
            if (this.listOptions.length > 1) {
                this.listOptions.forEach(element => {
                    if (!element.formControl.value) {
                        changes = false;
                        return changes;
                    }
                });
            } else {
                changes = false;
                this.showErrorMin = true;
            }
        } else {
            changes = false;
            this.showErrorMin = true;
        }
        return changes;
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
        this.optionNumber ++;
        this.listOptions.push({
            option: '',
            formControl: new FormControl('', Validators.required),
            name: 'option' + this.optionNumber
        });
        this.formAddSpecs.addControl(this.listOptions[this.listOptions.length - 1].name, this.listOptions[this.listOptions.length - 1].formControl);
    }
}
