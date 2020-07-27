/* 3rd party components */
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import * as _ from 'lodash';
/* our own custom components */
import { OrderDevolutionsModel, FAKE } from '@app/shared';
import { Subject } from 'rxjs';
import { PendingDevolutionService } from '../pending-devolution.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.scss']
})
export class ViewCommentComponent implements OnInit {


  // Order information
  order: OrderDevolutionsModel;
  public load = true;
  public snackBar: MatSnackBar;
  processFinish$ = new Subject<any>();

  constructor(
    private pendingDevolutionService: PendingDevolutionService,
    private languageService: TranslateService,
    public dialogRef: MatDialogRef<ViewCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list, ya que al usar
    // el mimso json estaba presentando cambios en ambas vistas
    this.getAllCommentRefuse();
  }

  ngOnInit() {
  }

  getAllCommentRefuse() {
    const params = {
      TypeTranslation:  'Commentary',
      Content : this.data.order
    };
    this.pendingDevolutionService.getAllCommentRefuse(params).subscribe((res: any) => {
      if (res) {
        this.load = false;
        this.order = _.cloneDeep(res);
        this.order = this.order || FAKE.FAKEPENDINGDEVOLUTION;
        this.processFinish$.next(res);
      } else {
        this.load = false;
        this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
        this.onNoClick();
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
