import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HistoricalDevolutionEntity, UserInformation, FAKE } from '@app/shared';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { HistoricalDevolutionService } from '../historical-devolution.service';
import { TranslateService } from '@ngx-translate/core';

interface DialogData {
  user: UserInformation;
  historical: HistoricalDevolutionEntity;
}

@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.scss']
})
export class ViewCommentComponent implements OnInit {
  public historical: HistoricalDevolutionEntity;
  public message: string;
  public load = true;
  processFinish$ = new Subject<any>();

  constructor(
    public historicalDevolutionService: HistoricalDevolutionService,
    public snackBar: MatSnackBar,
    private languageService: TranslateService,
    public dialogRef: MatDialogRef<ViewCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getAllCommentRefuse();
    /**
     * _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
     *  ya que al usar el mimso json estaba presentando cambios en ambas vistas
     */
  }


  ngOnInit() {
  }
  /**
   * funcion para consultar los comentarios devoluciones
   *
   * @memberof ViewCommentComponent
   */
  getAllCommentRefuse() {
    const params = {
      TypeTranslation: 'Commentary',
      Content: this.data.historical
    };
    this.historicalDevolutionService.getAllCommentRefuse(params).subscribe((res: any) => {
      if (res) {
        this.load = false;
        this.historical = _.cloneDeep(res);
        this.historical = this.historical || (FAKE.FAKEPENDINGDEVOLUTION as HistoricalDevolutionEntity);
        this.message = '';
        this.getMessage();
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
