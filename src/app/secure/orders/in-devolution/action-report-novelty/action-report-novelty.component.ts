/* 3rd party components */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/* our own custom components */

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  OrderDevolutionsModel,
  ListReasonRejectionResponseEntity,
  Logger,
  ComponentsService,
  UserService,
  FAKE,
  Callback,
  UserParametersService
} from '@app/shared';
import { InDevolutionService } from '../id-devolution.service';

// log component
const log = new Logger('ActionReportNoveltyComponent');

/** Component */
@Component({
  selector: 'app-action-report-novelty',
  templateUrl: './action-report-novelty.component.html',
  styleUrls: ['./action-report-novelty.component.scss']
})

/**
 * Component para la acción a realizar con una novedad
 */
export class ActionReportNoveltyComponent implements OnInit, Callback {
  // Variable que almacena los datos del formulario
  myform: FormGroup;
  // Información del usuario.
  public user: any;
  // Información de la orden actual
  public currentOrder: OrderDevolutionsModel;
  // Lista de opciones para realizar el rechazo de una solicitud
  public reasonRejection: Array<ListReasonRejectionResponseEntity>;

  /**
   * Creates an instance of ActionReportNoveltyComponent.
   * @param {FormBuilder} fb
   * @param {ComponentsService} componentsService
   * @param {MatDialogRef<ActionReportNoveltyComponent>} dialogRef
   * @param {*} data
   * @memberof ActionReportNoveltyComponent
   */
  constructor(
    private fb: FormBuilder,
    public componentsService: ComponentsService,
    public dialogRef: MatDialogRef<ActionReportNoveltyComponent>,
    public inDevolutionService: InDevolutionService,
    public userService: UserService,
    public userParams: UserParametersService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentOrder = data.order || FAKE.FAKEPENDINGDEVOLUTION;
    this.reasonRejection = data.reasonRejection;
    this.user = {};
  }

  /**
   * ngOnInit
   * @memberof ActionReportNoveltyComponent
   */
  ngOnInit() {
    this.getDataUser();
    this.createForm();
  }

  callback() { }

  getDataUser() {
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
  }

  /**
   * Método para crear el formulario de envío
   * @memberof ActionReportNoveltyComponent
   */
  createForm() {
    this.myform = this.fb.group({
      'observation': [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(1)])],
      'reason': [null, Validators.compose([Validators.required])]
    });
  }

  /**
   * Método para limpiar el formulario
   * @memberof ActionReportNoveltyComponent
   */
  clearForm() {
    this.myform.reset();
    this.createForm();
  }

  /**
   * Funcionalidad para cerrar el modal actual de envio
   * @memberof SupportModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Método para rechazar una orden
   * @memberof ActionReportNoveltyComponent
   */
  reportNovelty(myform) {
    console.log(this.currentOrder);
    // busco la razon seleccionada por el usuario
    const reason = this.reasonRejection.find(x => x.idMotivoSolicitudReversion === myform.value.reason);

    // Armo el json para realizar el envio
    const information = {
      DescriptionReasonRejection: reason.nombreMotivoSolicitudReversion,
      IdReasonRejection: reason.idMotivoSolicitudReversion,
      IsAcceptanceRequest: false,
      ObservationRejectionSeller: myform.value.observation,
      Id: this.currentOrder.id
    };
    this.inDevolutionService.reportNovelty(this.user, information).subscribe(res => {
      this.dialogRef.close(true);
      this.componentsService.openSnackBar('La solicitud ha sido rechazada, nuestro equipo evaluará tu respuesta.', 'Aceptar', 12000);
    }, error => {
      log.error(error);
      this.dialogRef.close(false);
      this.componentsService.openSnackBar('Se ha presentado un error al realizar el rechazo de la solicitud.', 'Aceptar', 12000);
    });
  }
}