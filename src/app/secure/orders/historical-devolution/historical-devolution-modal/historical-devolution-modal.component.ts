import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserInformation, HistoricalDevolutionEntity, FAKE } from '@app/shared';
import * as _ from 'lodash';

interface DialogData {
  user: UserInformation;
  historical: HistoricalDevolutionEntity;
}

@Component({
  selector: 'app-historical-devolution-modal',
  templateUrl: './historical-devolution-modal.component.html',
  styleUrls: ['./historical-devolution-modal.component.scss']
})
export class HistoricalDevolutionModalComponent {
  public historical: HistoricalDevolutionEntity;
  public user: UserInformation;

  constructor(
    public dialogRef: MatDialogRef<HistoricalDevolutionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    /**
     * _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
     *  ya que al usar el mimso json estaba presentando cambios en ambas vistas
     */
    this.historical = _.cloneDeep(data.historical);
    this.historical =
      this.historical ||
      (FAKE.FAKEPENDINGDEVOLUTION as HistoricalDevolutionEntity);

    this.user = data.user;
  }

  /**
   * Evento para cerrar el modal
   * @memberof HistoricalDevolutionComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
