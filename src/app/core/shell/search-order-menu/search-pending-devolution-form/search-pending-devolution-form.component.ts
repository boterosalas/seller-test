import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ComponentsService, Logger, SearchFormEntity, UserService } from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';

import { SearchOrderMenuService } from '../search-order-menu.service';



// log component
const log = new Logger('SearchPendingDevolutionFormComponent');

@Component({
  selector: 'app-search-pending-devolution-form',
  templateUrl: './search-pending-devolution-form.component.html',
  styleUrls: ['./search-pending-devolution-form.component.scss']
})

export class SearchPendingDevolutionFormComponent implements OnInit {

  // Formulario para realizar la busqueda
  myform: FormGroup;
  // user info
  public user: any;
  // Configuración para el formato de fecha
  locale = 'es-CO';
  // Variable que almacena los datos que se le pueden pasar al formulario
  @Input() informationToForm: SearchFormEntity;

  /**
   * Creates an instance of SearchOrderFormComponent.
   * @param {UserService} userService
   * @param {ComponentsService} componentsService
   * @param {Router} route
   * @param {SearchOrderMenuService} SearchOrderMenuService
   * @param {ShellComponent} shellComponent
   * @param {FormBuilder} fb
   * @memberof SearchOrderFormComponent
   */
  constructor(
    public userService: UserService,
    public componentsService: ComponentsService,
    private route: Router,
    public searchOrderMenuService: SearchOrderMenuService,
    private shellComponent: ShellComponent,
    private fb: FormBuilder) {
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
      'dateReversionRequestInitial': [null, Validators.compose([])],
      'dateReversionRequestFinal': [null, Validators.compose([])],
      'identificationCard': [null, Validators.compose([])],
      'orderNumber': [null, Validators.compose([Validators.minLength(1), Validators.maxLength(30)])],
    });
  }

  /**
   * Método para limpiar el formulario
   *
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
   * Método para obtener las órdenes
   * @param {any} state
   * @memberof SearchOrderFormComponent
   */
  getOrderList(state) {
    this.shellComponent.eventEmitterOrders.getOrderList(state);
  }

  /**
   * Método para filtrar las órdenes
   * @param {any} data
   * @memberof SearchOrderFormComponent
   */
  filterOrder(data) {

    // Obtengo la información del usuario
    this.user = this.userService.getUser();

    const datePipe = new DatePipe(this.locale);

    // aplico el formato para la fecha a emplear en la consulta
    const dateReversionRequestFinal = datePipe.transform(data.value.dateReversionRequestFinal, 'yyyy/MM/dd');
    const dateReversionRequestInitial = datePipe.transform(data.value.dateReversionRequestInitial, 'yyyy/MM/dd');

    // creo el string que indicara los parametros de la consulta
    let stringSearch = '';
    const objectSearch: any = {};
    if (dateReversionRequestInitial != null && dateReversionRequestInitial !== '') {
      stringSearch += `&dateReversionRequestInitial=${dateReversionRequestInitial}`;
      objectSearch.dateReversionRequestInitial = dateReversionRequestInitial;
    }
    if (dateReversionRequestFinal != null && dateReversionRequestFinal !== '') {
      stringSearch += `&dateReversionRequestFinal=${dateReversionRequestFinal}`;
      objectSearch.dateReversionRequestFinal = dateReversionRequestFinal;
    }

    if (data.value.orderNumber != null && data.value.orderNumber !== '') {
      stringSearch += `&orderNumber=${data.value.orderNumber}`;
      objectSearch.orderNumber = data.value.orderNumber;

    }
    if (data.value.identificationCard != null && data.value.identificationCard !== '') {
      stringSearch += `&identificationCard=${data.value.identificationCard}`;
      objectSearch.identificationCard = data.value.identificationCard;
    }

    if (stringSearch !== '') {

      stringSearch += `&reversionRequestStatusId=${this.informationToForm.information.reversionRequestStatusId}`;

      // Guardo el filtro aplicado por el usuario.
      this.searchOrderMenuService.setCurrentFilterOrders(objectSearch);
      // obtengo las órdenes con el filtro indicado
      this.searchOrderMenuService.getOrdersPendingDevolutionFilter(this.user, 100, stringSearch).subscribe((res: any) => {

        if (res != null) {
          // indico a los elementos que esten suscriptos al evento.
          this.shellComponent.eventEmitterOrders.filterOrdersWithStatusResponse(res);
          this.toggleMenu();
        } else {
          this.componentsService.openSnackBar('No se han encontrado órdenes.', 'Cerrar', 3000);
        }
      }, err => {
        this.componentsService.openSnackBar('Se ha presentado un error al consultar las órdenes.', 'Cerrar', 3000);
      });
    } else {
      this.componentsService.openSnackBar('No se ha indicado ningún criterio de búsqueda.', 'Cerrar', 3000);
    }
  }

}
