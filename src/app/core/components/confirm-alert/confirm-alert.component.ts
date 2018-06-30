/* 3rd party components */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

/**
 * Componente que permite emplear un html de alerta, se emplea para mostrar un modal de confirmación
 * @export
 * @class ConfirmAlertComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-confirm-alert',
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['./confirm-alert.component.scss']
})

// Componente para despelgar un modal
export class ConfirmAlertComponent implements OnInit {

  /**
   * Información a emplear en el modal
   */
  info: any;

  /**
   * Creates an instance of ConfirmAlertComponent.
   * @param {MatDialogRef<ConfirmAlertComponent>} dialogRef
   * @param {*} data
   * @memberof ConfirmAlertComponent
   */
  constructor(public dialogRef: MatDialogRef<ConfirmAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.info = data;
  }

  /**
   * ngOnInit
   * @memberof ConfirmAlertComponent
   */
  ngOnInit() {
  }

  /**
   * onNoClick, método para cerrar el modal
   * @memberof ConfirmAlertComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * confirmClick, evento para el confirm del modal
   * @memberof ConfirmAlertComponent
   */
  confirmClick(): void {
    this.dialogRef.close(true);
  }
}
