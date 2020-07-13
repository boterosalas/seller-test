/* 3rd party components */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
// Load the full build.
import * as _ from 'lodash';

/* our own custom components */
import { FAKE, OrderDevolutionsModel } from '@app/shared';
import { Subject } from 'rxjs';
import { InValidationService } from '../in-validation.service';


@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.scss']
})
export class ViewCommentComponent implements OnInit {

  // Order information
  order: OrderDevolutionsModel;
  processFinish$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<ViewCommentComponent>,
    public inValidationService: InValidationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
    // ya que al usar el mimso json estaba presentando cambios en ambas vistas
    this.order = _.cloneDeep(data.order);

    this.order = this.order || FAKE.FAKEPENDINGDEVOLUTION;
  }

  ngOnInit() {
    this.getAllCommentRefuse();
  }

  getAllCommentRefuse() {
    const params = {
      TypeTranslation:  'Commentary',
      Content : this.data.order
    };
    this.inValidationService.getAllCommentRefuse(params).subscribe((res: any) => {
      if (res) {
        this.processFinish$.next(res);
      }
    });
  }

  /**
   * Evento para cerrar el modal
   * @memberof ProductPendingDevolutionModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }


}
