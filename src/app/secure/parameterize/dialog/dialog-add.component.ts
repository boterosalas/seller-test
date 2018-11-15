import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';



/**
 * Component dialogo para agregar nuevas especificaciones o marcas. dependiendo de como se inicialicen el componente
 * con data.type es marca (Brand) y sin ese atributo es Specifications (specs).
 * @export
 * @class AddDialogComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-add-dialog',
    templateUrl: 'dialog-add.component.html',
    styleUrls: ['../specifications/specifications.component.scss']
})


export class AddDialogComponent implements OnInit {

    /**
     * Initializacion de variables del componente.
     *
     * @memberof AddDialogComponent
     */
    modeDialog: boolean;
    typeModel = 0;
    formSpecs: FormGroup;
    formBrands: FormGroup;

    /**
     * Creates an instance of AddDialogComponent.
     * @param {MatDialogRef<AddDialogComponent>} dialogRef
     * @param {*} data
     * @memberof AddDialogComponent
     */
    constructor(
        public dialogRef: MatDialogRef<AddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.modeDialog = data !== null;
        if (data) {
            this.typeModel = data.type;
            this.createAddBrandFrom();
        } else {
            if (!this.modeDialog) {
                this.createAddSpecForm(null);
            } else {
                this.createAddSpecForm(data);
            }
        }
    }

    ngOnInit() {
    }

    /**
     * Cierra el componente dialogo sin ninguna repsuesta.
     *
     * @memberof AddDialogComponent
     */
    close(): void {
        this.dialogRef.close();
    }


    public createAddBrandFrom(): void {
        this.formBrands = new FormGroup({
            NameBrand: new FormControl('', Validators.required)
        });
    }

    /**
     * Crea el formulario reactivo de specifications.
     *
     * @param {*} data
     * @memberof AddDialogComponent
     */
    public createAddSpecForm(data: any): void {
        let name = null;
        if (data) {
            name = data.Name;
        }
        this.formSpecs = new FormGroup({
            NameSpec: new FormControl(name, [
                Validators.required
            ])
        });
    }

    /**
     * Cierra el dialogo enviando como respuesta el model del formulario.
     *
     * @memberof AddDialogComponent
     */
    public saveSpecGroup(): void {
        if (this.formSpecs.valid) {
            this.dialogRef.close(this.formSpecs.value);
        }
    }
}
