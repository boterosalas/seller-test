/* 3rd party components */
import {DatePipe} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { Input } from '@angular/core';

/* our own custom components */
import {ShellComponent} from '../../shell.component';
import {SearchOrderMenuService} from '../search-order-menu.service';
import { User } from '../../../../../shared/models/login.model';
import { SearchFormEntity } from '../../../../../shared/models/order';
import { UserService } from '../../../utils/services/common/user/user.service';
import { ComponentsService } from '../../../utils/services/common/components/components.service';

@Component({
  selector: 'app-search-envios-exito-form',
  templateUrl: './search-envios-exito-form.component.html',
  styleUrls: ['./search-envios-exito-form.component.scss']
})

export class SearchEnviosExitoFormComponent implements OnInit {

  // Formulario para realizar la busqueda
  myform: FormGroup;
  // user info
  user: User;
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
      'dateOrderInitial': [null, Validators.compose([])],
      'dateOrderFinal': [null, Validators.compose([])],
      'identificationCard': [null, Validators.compose([])],
      // 'typeOrder': [null, Validators.compose([])],
      'idChannel': [null, Validators.compose([])],
      'orderNumber': [null, Validators.compose([Validators.minLength(1), Validators.maxLength(30)])],
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
    // Obtengo la información del usuario
    this.user = this.userService.getUser();

    const datePipe = new DatePipe(this.locale);

    // aplico el formato para la fecha a emplear en la consulta
    const dateOrderFinal = datePipe.transform(data.value.dateOrderFinal, 'yyyy/MM/dd');
    const dateOrderInitial = datePipe.transform(data.value.dateOrderInitial, 'yyyy/MM/dd');

    // creo el string que indicara los parametros de la consulta
    let stringSearch = '';
    const objectSearch: any = {};

    if (dateOrderInitial !== null && dateOrderInitial !== '') {
      stringSearch += `&dateOrderInitial=${dateOrderInitial}`;
      objectSearch.dateOrderInitial = dateOrderInitial;
    }
    if (dateOrderFinal !== null && dateOrderFinal !== '') {
      stringSearch += `&dateOrderFinal=${dateOrderFinal}`;
      objectSearch.dateOrderFinal = dateOrderFinal;
    }
    if (data.value.idChannel !== null && data.value.idChannel !== '') {
      stringSearch += `&idChannel=${data.value.idChannel}`;
      objectSearch.idChannel = data.value.idChannel;
    }
    if (data.value.orderNumber !== null && data.value.orderNumber !== '') {
      stringSearch += `&orderNumber=${data.value.orderNumber}`;
      objectSearch.orderNumber = data.value.orderNumber;

    }
    if (data.value.identificationCard !== null && data.value.identificationCard !== '') {
      stringSearch += `&identificationCard=${data.value.identificationCard}`;
      objectSearch.identificationCard = data.value.identificationCard;
    }

    if (stringSearch !== '') {

      // Guardo el filtro aplicado por el usuario.
      this.searchOrderMenuService.setCurrentFilterOrders(objectSearch);
      // obtengo las ordenes con el filtro indicado
      this.searchOrderMenuService.getOrdersFilter(this.user, 100, stringSearch).subscribe((res: any) => {

        if (res != null) {
          // indico a los elementos que esten suscriptos al evento.
          this.shellComponent.eventEmitterOrders.filterOrderListResponse(res);
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