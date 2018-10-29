import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-create-specification',
    templateUrl: 'dialog.component.html',
})
export class SpecificationDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<SpecificationDialogComponent>
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
