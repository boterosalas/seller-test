import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-dialog-shared',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.scss']
})
export class DialogSharedComponent {
    public response: any;

    constructor(
        public dialogRef: MatDialogRef<DialogSharedComponent>,
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
