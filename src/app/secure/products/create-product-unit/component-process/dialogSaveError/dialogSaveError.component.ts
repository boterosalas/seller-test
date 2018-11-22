import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-dialog-save-error',
    templateUrl: 'dialogSaveError.component.html',
    styleUrls: ['../component-process.component.scss']
})

export class SaveProcessErrorDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<SaveProcessErrorDialogComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
