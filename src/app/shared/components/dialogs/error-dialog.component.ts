import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-error-dialog',
    templateUrl: 'error-dialog.component.html',
    styleUrls: ['error-dialog.component.scss']
})
export class ErrorDialogComponent {
    public response: any;

    constructor(
        public dialogRef: MatDialogRef<ErrorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.response = data.response;
    }

    /**
     * Método para cerrar el modal
     * @memberof FinishUploadProductInformationComponent
     */
    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
