import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dialog-save',
    templateUrl: 'dialogSave.component.html',
    styleUrls: ['dialogSave.component.scss']
})

export class SaveProcessDialogComponent {
    public response: any;
    public has: string;
    public have: string;
    public errors: string;
    public error: string;
    constructor(
        public dialogRef: MatDialogRef<SaveProcessDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public res: any,
        private languageService: TranslateService
      ) {
        this.response = res;
        this.has = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.has');
        this.have = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.have');
        this.errors = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.errors');
        this.error = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.error');
      }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
