import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-dialog-save',
    templateUrl: 'dialogSave.component.html',
    styleUrls: ['dialogSave.component.scss']
})

export class SaveProcessDialogComponent {
    public response: any;
    constructor(
        public dialogRef: MatDialogRef<SaveProcessDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) {
        this.response = data;
        console.log('resposne dialog: ', this.response);
      }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
