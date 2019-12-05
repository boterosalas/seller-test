import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-rule-offer',
  templateUrl: './modal-rule-offer.component.html',
  styleUrls: ['./modal-rule-offer.component.scss']
})
export class ModalRuleOfferComponent implements AfterViewInit {

  approval: boolean;
  /**
   * Creates an instance of ModalErrorsComponent.
   * @param {MatDialogRef<ModalErrorsComponent>} dialogRef
   * @param {*} data
   * @memberof ModalErrorsComponent
   */
  constructor(
    public dialogRef: MatDialogRef<ModalRuleOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private languageService: TranslateService
  ) {
    console.log(data);
  }

  ngAfterViewInit() {
  }

  /**
   * Método para cerrar el modal
   * @memberof ModalErrorsComponent
   */
  onNoClick(): void {
    this.data = false;
    this.dialogRef.close(false);
  }

  onNoClickOk(): void {
    this.data = true;
    this.dialogRef.close(false);
  }
}
