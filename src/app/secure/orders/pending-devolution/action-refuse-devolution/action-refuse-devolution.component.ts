/* 3rd party components */
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/* our own custom components */
import { PendingDevolutionService } from '../pending-devolution.service';
import {
  OrderDevolutionsModel,
  ListReasonRejectionResponseEntity,
  ComponentsService,
  FAKE,
  UserInformation,
} from '@app/shared';
import { Logger, UserParametersService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';

// log component
const log = new Logger('ActionRefuseDevolutionComponent');

@Component({
  selector: 'app-action-refuse-devolution',
  templateUrl: './action-refuse-devolution.component.html',
  styleUrls: ['./action-refuse-devolution.component.scss']
})

/**
 * Componente
 */
export class ActionRefuseDevolutionComponent implements OnInit {

  // Variable que almacena los datos del formulario
  myform: FormGroup;
  // Información del usuario.
  public user: UserInformation;
  // Información de la orden actual
  public currentOrder: OrderDevolutionsModel;
  // Lista de opciones para realizar el rechazo de una solicitud
  public reasonRejection: Array<ListReasonRejectionResponseEntity>;

  /**
   * Creates an instance of ActionRefuseDevolutionComponent.
   * @param {FormBuilder} fb
   * @param {ComponentsService} componentsService
   * @param {MatDialogRef<ActionRefuseDevolutionComponent>} dialogRef
   * @param {*} data
   * @memberof ActionRefuseDevolutionComponent
   */
  constructor(
    private fb: FormBuilder,
    public componentsService: ComponentsService,
    public dialogRef: MatDialogRef<ActionRefuseDevolutionComponent>,
    public pendingDevolutionService: PendingDevolutionService,
    public userParams: UserParametersService,
    private languageService: TranslateService,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentOrder = data.order || FAKE.FAKEPENDINGDEVOLUTION;
    this.reasonRejection = data.reasonRejection;
  }

  /**
   * ngOnInit
   * @memberof ActionRefuseDevolutionComponent
   */
  ngOnInit() {
    this.getDataUser();
    this.createForm();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Método para crear el formulario de envío
   * @memberof ActionRefuseDevolutionComponent
   */
  createForm() {
    this.myform = this.fb.group({
      'observation': [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(1)])],
      'reason': [null, Validators.compose([Validators.required])]
    });
  }

  /**
   * Método para limpiar el formulario
   * @memberof ActionRefuseDevolutionComponent
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
   * @memberof ActionRefuseDevolutionComponent
   */
  refuseOrder(myform: any) {

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
    this.pendingDevolutionService.acceptOrDeniedDevolution(information).subscribe(res => {
      this.dialogRef.close(true);
      this.componentsService.openSnackBar(this.languageService.instant('secure.orders.in_devolution.action_report_novelty.rejected_request'), this.languageService.instant('actions.accpet_min'), 12000);
    }, error => {
      log.error(error);
      this.dialogRef.close(false);
      this.componentsService.openSnackBar(this.languageService.instant('secure.orders.in_devolution.action_report_novelty.error_rejected'), this.languageService.instant('actions.accpet_min'), 12000);
    });
  }

}
