import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Logger } from '@app/core';
import { SearchFormEntity } from '@app/shared/models';
import { ComponentsService } from '@app/shared/services';
import { ShellComponent } from '@core/shell/shell.component';

import { SearchOrderMenuService } from '../search-order-menu.service';
import { TranslateService } from '@ngx-translate/core';


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

  @Input() idSeller: number;

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
    public componentsService: ComponentsService,
    private route: Router,
    public searchOrderMenuService: SearchOrderMenuService,
    private shellComponent: ShellComponent,
    private languageService: TranslateService,
    private fb: FormBuilder) {
  }

  /**
   * ngOnInit
   * @memberof SearchOrderFormComponent
   */
  ngOnInit() {
    // Obtengo la información del usuario
    // this.user = this.userService.getUser();
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
    this.shellComponent.eventEmitterOrders.getClear();
    this.shellComponent.sidenavSearchOrder.toggle();
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
  getOrderList(state: any) {
    this.shellComponent.eventEmitterOrders.getOrderList(state);
  }

  /**
   * Método para filtrar las órdenes
   * @param {any} data
   * @memberof SearchOrderFormComponent
   */
  filterOrder(data: any) {

    // Obtengo la información del usuario
    // this.user = this.userService.getUser();
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

    if (this.idSeller === undefined) {
      this.idSeller = null;
    }

    if (stringSearch !== '') {

      stringSearch += `&reversionRequestStatusId=${this.informationToForm.information.reversionRequestStatusId}&idSeller=${this.idSeller}`;

      // Guardo el filtro aplicado por el usuario.
      this.searchOrderMenuService.setCurrentFilterOrders(objectSearch);
      // obtengo las órdenes con el filtro indicado
      this.searchOrderMenuService.getOrdersPendingDevolutionFilter(100, stringSearch).subscribe((res: any) => {

        if (res != null) {
          // indico a los elementos que esten suscriptos al evento.
          this.shellComponent.eventEmitterOrders.filterOrdersWithStatusResponse(res);
          this.toggleMenu();
        } else {
          this.componentsService.openSnackBar(this.languageService.instant('secure.orders.order_list.order_page.no_orders_found'), this.languageService.instant('actions.close'), 5000);
        }
      }, err => {
        this.componentsService.openSnackBar(this.languageService.instant('errors.error_check_orders'), this.languageService.instant('actions.close'), 5000);
      });
    } else {
      this.componentsService.openSnackBar(this.languageService.instant('errors.error_no_searh_criteria'), this.languageService.instant('actions.close'), 5000);
    }
  }

}
