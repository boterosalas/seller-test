import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-rule-offer',
  templateUrl: './modal-rule-offer.component.html',
  styleUrls: ['./modal-rule-offer.component.scss']
})
export class ModalRuleOfferComponent implements AfterViewInit {

  /**
   * Creates an instance of ModalErrorsComponent.
   * @param {MatDialogRef<ModalErrorsComponent>} dialogRef
   * @param {*} data
   * @memberof ModalErrorsComponent
   */
  constructor(
    public dialogRef: MatDialogRef<ModalRuleOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {  }

  ngAfterViewInit() {
  }

  /**
   * Método para cerrar el modal
   * @memberof ModalErrorsComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onNoClickOk(): void {
    this.dialogRef.close(true);
  }

}
