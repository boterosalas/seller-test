/* 3rd party components */
import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/* our own custom components */
import { FAKE } from '../../../../../core/utilities/fakeData.model';
import { ListReasonRejectionResponseEntity, OrderDevolutionsModel } from '../../../../shared/models/order';
import { ComponentsService } from '../../../../../core/services/common/components/components.service';
import { Logger } from '../../../../../core/utilities/logger.service';
import { PendingDevolutionService } from '../pending-devolution.service';
import { User } from '../../../../shared/models/login.model';
import { UserService } from '../../../../../core/services/common/user/user.service';

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
export class ActionRefuseDevolutionComponent implements OnInit{

  // Variable que almacena los datos del formulario
  myform: FormGroup;
  // Información del usuario.
  public user: User;
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
    public userService: UserService,
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

  /**
  * Funcionalidad encargada de traer la información del usuario que se encuentra almacenada en localstorage.
  * @memberof BillingComponent
  */
  getDataUser() {
    this.user = this.userService.getUser();
    if (this.user.login == undefined) {
      this.userService.setUser([]);
    }
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
  refuseOrder(myform) {
    log.info(myform);

    // busco la razon seleccionada por el usuario
    const reason = this.reasonRejection.find(x => x.idMotivoSolicitudReversion === myform.value.reason);
    log.info(reason);

    // Armo el json para realizar el envio
    const information = {
      DescriptionReasonRejection: reason.nombreMotivoSolicitudReversion,
      IdReasonRejection: reason.idMotivoSolicitudReversion,
      IsAcceptanceRequest: false,
      ObservationRejectionSeller: myform.value.observation,
      Id: this.currentOrder.id
    };
    this.pendingDevolutionService.refuseDevolution(this.user, information).subscribe(res => {
      log.info(res);
      this.dialogRef.close(true);
      this.componentsService.openSnackBar('La solicitud ha sido rechazada, nuestro equipo evaluará tu respuesta.', 'Aceptar', 12000);
    }, error => {
      log.error(error);
      this.dialogRef.close(false);
      this.componentsService.openSnackBar('Se ha presentado un error al realizar el rechazo de la solicitud.', 'Aceptar', 12000);
    });
  }

}
