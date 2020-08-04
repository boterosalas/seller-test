/* 3rd party components */
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
// Load the full build.
import * as _ from 'lodash';

/* our own custom components */
import { FAKE, OrderDevolutionsModel } from '@app/shared';
import { Subject } from 'rxjs';
import { InValidationService } from '../in-validation.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.scss']
})
export class ViewCommentComponent implements OnInit {

  // Order information
  order: OrderDevolutionsModel;
  processFinish$ = new Subject<any>();
  public load = true;
  public snackBar: MatSnackBar;

  constructor(
    public dialogRef: MatDialogRef<ViewCommentComponent>,
    public inValidationService: InValidationService,
    private languageService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
    // ya que al usar el mimso json estaba presentando cambios en ambas vistas
    // this.getAllCommentRefuse();
  }

  ngOnInit() {
    this.getAllCommentRefuse();
  }
  /**
   * funcion para consultar los comentarios devoluciones
   *
   * @memberof ViewCommentComponent
   */
  getAllCommentRefuse() {
    const params = {
      TypeTranslation: 'Commentary',
      Content: this.data.order
    };
    this.inValidationService.getAllCommentRefuse(params).subscribe((res: any) => {
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
