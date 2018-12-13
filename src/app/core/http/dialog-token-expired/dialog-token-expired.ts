import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-dialog-token',
    templateUrl: 'dialog-token-expired.html',
    styleUrls: ['dialog-token-expired.scss']
})
export class DialogTokenExpiredComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogTokenExpiredComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    closeDialog(): void {
        this.dialogRef.close(true);
    }

}
