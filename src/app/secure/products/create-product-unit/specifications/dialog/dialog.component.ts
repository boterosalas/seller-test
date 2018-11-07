import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-create-specification',
    templateUrl: 'dialog.component.html',
    styleUrls: ['../specification.component.scss']
})
export class SpecificationDialogComponent {

    public formSpecification: FormGroup;
    /**
     * Se construye el componente con un form
     */
    constructor(
        public dialogRef: MatDialogRef<SpecificationDialogComponent>
    ) {
        this.formSpecification = new FormGroup({
            Name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
            Value: new FormControl('', [Validators.required, Validators.maxLength(200)]),
        });
    }

    /**
     * Al cerrar el dialogo envia una respuesta con los valores del formulario.
     *
     * @param {boolean} save
     * @memberof SpecificationDialogComponent
     */
    public closeDialog(save: boolean): void {
        if (save) {
            if (this.formSpecification.valid) {
                this.dialogRef.close(this.formSpecification.value);
            }
        } else {
            this.dialogRef.close(false);
        }
    }

    /**
     * Cuando pasa por un input del formulario ya que automaticamente no fue posible ponerlo 'dirty'
     * se vio en la obligacion de ponerlo manualmente.
     *
     * @param {string} name
     * @memberof SpecificationDialogComponent
     */
    public onBlur(name: string): void {
        this.formSpecification.controls[name].markAsDirty();
    }
}
