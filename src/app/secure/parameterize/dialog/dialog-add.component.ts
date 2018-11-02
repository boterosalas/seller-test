import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-add-dialog',
    templateUrl: 'dialog-add.component.html',
    styleUrls: ['../specifications/specifications.component.scss']
})
export class AddDialogComponent implements OnInit {

    modeDialog: boolean;
    typeModel: number;
    formSpecs: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<AddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.modeDialog = data !== null;
        console.log(data);
        if (data) {
            this.typeModel = data.type;
        }
        if (!this.modeDialog) {
            this.createAddSpecForm(null);
        } else {
            this.createAddSpecForm(data);
        }
    }

    ngOnInit() {
    }

    close(): void {
        this.dialogRef.close();
    }

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

    public saveSpecGroup(): void {
        if (this.formSpecs.valid) {
            this.dialogRef.close(this.formSpecs.value);
        }
    }
}
