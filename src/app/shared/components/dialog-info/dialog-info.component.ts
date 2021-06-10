import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService } from '@app/core';
import { DialogData } from '@app/secure/support-modal/support-modal.component';
import { ListModalService } from './dialog-ingo.component.service';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent implements OnInit {

  public icon: string;
  public title: string;
  public message: string;
  public cancelButtonText: string;
  public confirmButtonText: string;
  public closeButtonText: string;
  public dataInfo: any;
  public name: any;
  public method: any;
  public dataToSend: any;
  public dataError: any;
  deleteButtonText: any;
  acceptButtonText: any;

  constructor(
    public listModalService: ListModalService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dataInfo = this.data;
  }

  ngOnInit() {
    this.setTextDialog();
  }

  /**
   * Boton cancelar o cerrar, cierra modal, envía false
   * @memberof DialogInfoComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Boton confirmacion, cierra modal, envía true
   * @memberof DialogInfoComponent
   */
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  /**
   * Metodo eliminar talla
   * @memberof DialogInfoComponent
   */
  confirmDelete(): void {
    this.dialogRef.close('deleteSize');
  }

  /**
   * Seteo variables del modal
   * @memberof DialogInfoComponent
   */
  setTextDialog() {
    console.log('this.dataInfo: ', this.dataInfo);

    if (this.dataInfo) {
      this.icon = this.dataInfo.icon || null;
      this.title = this.dataInfo.title || null;
      this.message = this.dataInfo.message || null;
      this.confirmButtonText = this.dataInfo.buttonText.ok || null;
      this.cancelButtonText = this.dataInfo.buttonText.cancel || null;
      this.closeButtonText = this.dataInfo.buttonText.close || null;
      this.deleteButtonText = this.dataInfo.buttonText.delete || null;
      this.acceptButtonText = this.dataInfo.buttonText.accept || null;
      this.dataToSend = this.dataInfo.data || null;
      this.dataError = this.dataInfo.dataError || null;
      this.name = this.dataInfo.services ? this.dataInfo.services.name : null;
      this.method = this.dataInfo.services ? this.dataInfo.services.method : null;
    }
  }

  /**
   * Servicio Path abre modal cargando
   * @memberof DialogInfoComponent
   */
  sendDataPatch() {
    this.loadingService.viewSpinner();
    this.listModalService.servicePatch(this.name, this.dataToSend).subscribe(res => {
      this.onConfirmClick();
    });
  }

}
