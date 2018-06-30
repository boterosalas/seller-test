/* 3rd party components */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';

/* our own custom components */
import { OrderDevolutionsModel } from './../../../../shared/models/order';
import { FAKE } from '../../../../../core/utilities/fakeData.model';

@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.scss']
})
export class ViewCommentComponent {

  // Order information
  order: OrderDevolutionsModel;

  constructor(
    public dialogRef: MatDialogRef<ViewCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
    // ya que al usar el mimso json estaba presentando cambios en ambas vistas
    this.order = _.cloneDeep(data.order);
    this.order = this.order || FAKE.FAKEPENDINGDEVOLUTION;
  }

  /**
   * Evento para cerrar el modal
   * @memberof ProductPendingDevolutionModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
