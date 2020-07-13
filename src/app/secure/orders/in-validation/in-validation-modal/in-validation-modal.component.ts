
/* 3rd party components */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';

/* our own custom components */
import { OrderDevolutionsModel, FAKE } from '@app/shared';
import { Subject } from 'rxjs';

/**
 * Component
 */
@Component({
  selector: 'app-in-validation-modal',
  templateUrl: './in-validation-modal.component.html',
  styleUrls: ['./in-validation-modal.component.scss']
})

/**
 * Componente
 */
export class InValidationModalComponent {

  // User information
  public user: any;
  // Order information
  public order: OrderDevolutionsModel;

  public showMessage= false;
  processFinish$ = new Subject<any>();

  /**
   * Creates an instance of ProductPendingDevolutionModalComponent.
   * @param {MatDialogRef<ProductPendingDevolutionModalComponent>} dialogRef
   * @param {*} data
   * @memberof ProductPendingDevolutionModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<InValidationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.order = _.cloneDeep(data.order);
    this.user = data.user;

    this.order = this.order || FAKE.FAKEPENDINGDEVOLUTION;
  }

  /**
   * Evento para cerrar el modal
   * @memberof ProductPendingDevolutionModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * funcion para descargar el archivo .zip por medio de una url
   *
   * @param {string} urlDownload
   * @memberof ProductDevolutionModalComponent
   */
  cloudDownload(urlDownload: any) {
     if (urlDownload && urlDownload.length > 0) {
      urlDownload.forEach(element => {
        window.open(element);
      });
    } else {
      this.showMessage = true;
    }
  }
}
