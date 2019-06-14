import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { LanguageService } from '@app/core/translate/language.service';

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
        private languageService: LanguageService
      ) {
        this.response = res;
        this.has = this.languageService.getValue('secure.products.create_product_unit.component_process.dialog_save.there.has');
        this.have = this.languageService.getValue('secure.products.create_product_unit.component_process.dialog_save.there.have');
        this.errors = this.languageService.getValue('secure.products.create_product_unit.component_process.dialog_save.there.errors');
        this.error = this.languageService.getValue('secure.products.create_product_unit.component_process.dialog_save.there.error');
      }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
