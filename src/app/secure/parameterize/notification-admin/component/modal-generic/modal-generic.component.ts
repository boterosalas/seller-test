import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-generic',
  templateUrl: './modal-generic.component.html',
  styleUrls: ['./modal-generic.component.scss']
})
export class ModalGenericComponent implements OnInit, OnDestroy {

  public processFinish$ = new Subject<any>();
  public delete$ = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalGenericComponent>,
  ) { }

  ngOnInit() { }
  /**
   * funcion para cerrar el modal
   *
   * @memberof ModalGenericComponent
   */
  close() {
    this.dialogRef.close();
  }
  /**
   * funcion para emitir para hacer el refrescado
   *
   * @memberof ModalGenericComponent
   */
  refresh() {
    this.processFinish$.next(true);
  }
  /**
   * funcion para eliminar las notificaciones
   *
   * @memberof ModalGenericComponent
   */
  deleteNotification() {
    this.delete$.next(true);
  }

   /**
    * funcion para destruir el componente del modal
    *
    * @memberof ExpandedProductComponent
    */
  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}
