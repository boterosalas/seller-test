import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '@app/shared/services/common.service';

export class TypeDialog {
    Process = 1;
    Error = 2;
    Success = 3;
}

@Component({
    selector: 'app-error-dialog',
    templateUrl: 'error-dialog.component.html',
    styleUrls: ['error-dialog.component.scss']
})
export class ErrorDialogComponent {

    public response: any;
    public typeDialog =  new TypeDialog();

    constructor(
        public dialogRef: MatDialogRef<ErrorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private service: CommonService) {
        this.response = data;
        console.log(this.response);
    }

    /**
     * Método para cerrar el modal
     * @memberof FinishUploadProductInformationComponent
     */
    onNoClick(): void {
        this.dialogRef.close(false);
    }

    /**
     * Invoca el servicio comun para ejecutar un emiter y recargar el servicio que verifica el estado de la carga.
     *
     * @memberof ErrorDialogComponent
     */
    chargeDialogAgain(): void {
        this.service.chargeAgainService();
    }

}
