// 3rd party components
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

// our own custom components
import { DownloadHistoricalService } from './download-historical.service';
import {
  Logger,
  UserParametersService,
  Callback
} from '@app/core';
import { ComponentsService } from '@app/shared';

// log component
const log = new Logger('DownloadHistoricalComponent');

/**
 * Componente para realizar la descarga de las órdenes actuales del usuario, este componente permite capturar
 * el correo electronico del usuario, por defecto se emplea el correo de la cuenta del usuario. luego
 * de capturar el correo se consume un servicio web que permite enviar los filtros aplicados por
 * el usuario al momento de listar las órdenes, posteriormente se realiza el envió de un
 * correo con las órdenes aplicando los filtros obtenidos
 */
@Component({
  selector: 'app-download-historical-modal',
  templateUrl: './download-historical-modal.component.html',
  styleUrls: ['./download-historical-modal.component.scss'],
  providers: [DownloadHistoricalService]
})

/**
 * @memberof DownloadHistoricalModalComponent
 */
export class DownloadHistoricalModalComponent implements OnInit, Callback {

  // Formulario para realizar la busqueda
  myform: FormGroup;

  // user info
  public user: any;

  // Limite de registros para descargar
  public limitLengthHistorical: any = 0;

  /**
   * Creates an instance of DownloadHistoricalModalComponent.
   * @param {MatDialogRef<DownloadHistoricalModalComponent>} dialogRef
   * @param {DownloadHistoricalService} DownloadHistoricalService
   * @param {ComponentsService} componentsService
   * @param {FormBuilder} fb
   * @param {*} data
   * @memberof DownloadHistoricalModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<DownloadHistoricalModalComponent>,
    public downloadHistoricalService: DownloadHistoricalService,
    public componentsService: ComponentsService,
    private fb: FormBuilder,
    public userParams: UserParametersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Capturo el limite de registros indicados por el usuario
    this.limitLengthHistorical = data.limit;
    this.user = {};
  }

  /**
   * @memberof DownloadHistoricalModalComponent
   */
  ngOnInit() {
    this.getDataUser();
    this.createForm();
  }

  callback() { }

  getDataUser() { // TODO: Revisar
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
  }

  /**
   * @method onNoClick
   * @description Funcionalidad para cerrar el modal
   * @memberof DownloadHistoricalModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * @method createForm
   * @description Funcionalidad para crear el formulario
   * @memberof DownloadHistoricalModalComponent
   */
  createForm() {
    const email = this.user.sellerEmail;
    this.myform = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }

  /**
   * @method downloadHistorical
   * @description Método para realizar la descarga del histórico
   * @param {any} form
   * @memberof DownloadHistoricalModalComponent
   */
  downloadHistorical(form: any) {
    log.info(this.downloadHistoricalService.getCurrentFilterHistorical());
    const email = form.get('email').value;
    this.downloadHistoricalService.downloadHistorical(email)
    .subscribe(
      res => {
        if (res != null) {
          this.componentsService.openSnackBar('Se ha realizado la descarga del historico correctamente, revisa tu correo electrónico',
            'Cerrar', 10000);
        } else {
          this.componentsService.openSnackBar('Se han presentado un error al realizar la descarga del historico', 'Cerrar', 5000);
        }
        this.onNoClick();
      },
      err => {
        this.componentsService.openSnackBar('Se han presentado un error al realizar la descarga del historico', 'Cerrar', 5000);
        this.onNoClick();
      }
    );
  }
}
