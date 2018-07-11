/* 3rd party components */
import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { Input } from '@angular/core';

/* our own custom components */
import {ShellComponent} from '../../shell.component';
import { User } from '../../../../../shared/models/login.model';
import { SearchFormEntity } from '../../../../../shared/models/order';
import { UserService } from '../../../utils/services/common/user/user.service';
import { BillingService } from '../../../components/billing/billing.service';
import { ComponentsService } from '../../../utils/services/common/components/components.service';

@Component({
  selector: 'app-search-billing-form',
  templateUrl: './search-billing-form.component.html',
  styleUrls: ['./search-billing-form.component.scss']
})

export class SearchBillingFormComponent implements OnInit {

  // Formulario para realizar la busqueda
  myform: FormGroup;
  // user info
  user: User;
  // Configuración para el formato de fecha
  locale = 'es-CO';
  // Variable que almacena los datos que se le pueden pasar al formulario
  @Input() informationToForm: SearchFormEntity;

  /**
   * Creates an instance of SearchBillingFormComponent.
   * @param {UserService} userService
   * @param {ComponentsService} componentsService
   * @param {Router} route
   * @param {BillingService} billingService
   * @param {ShellComponent} shellComponent
   * @param {FormBuilder} fb
   * @memberof SearchBillingFormComponent
   */
  constructor(
    public userService: UserService,
    public componentsService: ComponentsService,
    private route: Router,
    private billingService: BillingService,
    private shellComponent: ShellComponent,
    private fb: FormBuilder
  ) {
  }

  /**
   * ngOnInit
   * @memberof SearchOrderFormComponent
   */
  ngOnInit() {
    // Obtengo la información del usuario
    this.user = this.userService.getUser();
    this.createForm();
  }

  /**
   * Método para crear el formulario
   * @memberof SearchOrderFormComponent
   */
  createForm() {
    // Estructura para los datos del formulario de consulta.
    this.myform = this.fb.group({
      'paymentDate': [null, Validators.compose([])],
      'billingNumber': [null, Validators.compose([Validators.minLength(1), Validators.maxLength(30)])],
    });
  }

  /**
   * Método para limpiar el formulario
   * @memberof SearchOrderFormComponent
   */
  clearForm() {
    this.myform.reset();
  }

  /**
   * Método para desplegar el menú
   * @memberof SearchOrderFormComponent
   */
  toggleMenu() {
    this.shellComponent.sidenavSearchOrder.toggle();
  }

  /**
   * Método para obtener las ordenes
   * @param {any} state
   * @memberof SearchOrderFormComponent
   */
  getOrderList(state) {
    this.shellComponent.eventEmitterOrders.getOrderList(state);
  }

  /**
   * Método para filtrar las ordenes
   * @param {any} data
   * @memberof SearchOrderFormComponent
   */
  filterOrder(data) {

    const datePipe = new DatePipe(this.locale);

    // aplico el formato para la fecha a emplear en la consulta
    const paymentDate = datePipe.transform(data.value.paymentDate, 'yyyy/MM/dd');

    // creo el string que indicara los parametros de la consulta
    let stringSearch = '';
    const objectSearch: any = {};

    if (paymentDate != null && paymentDate !== '') {
      stringSearch += `&paymentDate=${paymentDate}`;
      objectSearch.paymentDate = paymentDate;
    }

    if (data.value.billingNumber !== null && data.value.billingNumber !== '') {
      stringSearch += `&billingNumber=${data.value.billingNumber}`;
      objectSearch.billingNumber = data.value.billingNumber;
    }

    if (stringSearch !== '') {

      // Guardo el filtro aplicado por el usuario.
      this.billingService.setCurrentFilterOrders(objectSearch);
      // obtengo las ordenes con el filtro indicado
      this.billingService.getOrdersBillingFilter(this.user, 100, stringSearch).subscribe((res: any) => {

        if (res != null) {
          // indico a los elementos que esten suscriptos al evento.
          this.shellComponent.eventEmitterOrders.filterBillingListResponse(res);
          this.toggleMenu();
        } else {
          this.componentsService.openSnackBar('No se han encontrado ordenes.', 'Cerrar', 3000);
        }
      }, err => {
        this.componentsService.openSnackBar('Se ha presentado un error al consultar las ordenes.', 'Cerrar', 3000);
      });
    } else {
      this.componentsService.openSnackBar('No se ha indicado ningún criterio de búsqueda.', 'Cerrar', 3000);
    }
  }
}
