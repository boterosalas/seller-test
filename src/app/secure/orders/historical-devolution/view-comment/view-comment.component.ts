import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HistoricalDevolutionEntity, UserInformation, FAKE } from '@app/shared';
import * as _ from 'lodash';

interface DialogData {
  user: UserInformation;
  historical: HistoricalDevolutionEntity;
}

@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.scss']
})
export class ViewCommentComponent {
  public historical: HistoricalDevolutionEntity;
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<ViewCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    /**
     * _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
     *  ya que al usar el mimso json estaba presentando cambios en ambas vistas
     */
    this.historical = _.cloneDeep(data.historical);
    this.historical = this.historical || (FAKE.FAKEPENDINGDEVOLUTION as HistoricalDevolutionEntity);
    this.getMessage();
  }

  /**
   * Orden de comentarios a mostrar
   * 1. sacObservationReceiptRefuse
   * 2. sacObservationReversionRequestRefuse
   * 3. clientObservation
   *
   * @memberof ViewCommentComponent
   */
  public getMessage(): void {
    const { sacObservationReceiptRefuse, sacObservationReversionRequestRefuse, clientObservation } = this.historical;
    this.message = sacObservationReceiptRefuse || sacObservationReversionRequestRefuse || clientObservation || '';
  }

  /**
   * Evento para cerrar el modal
   * @memberof HistoricalDevolutionComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}