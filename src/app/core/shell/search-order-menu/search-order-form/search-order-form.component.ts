import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchFormEntity } from '@app/shared/models';
import { ComponentsService } from '@app/shared/services';
import { ShellComponent } from '@core/shell/shell.component';

import { SearchOrderMenuService } from '../search-order-menu.service';
import { UserParametersService, LoadingService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-search-order-form',
  templateUrl: './search-order-form.component.html',
  styleUrls: ['./search-order-form.component.scss']
})

export class SearchOrderFormComponent implements OnInit {

  // Formulario para realizar la busqueda
  public myform: FormGroup;
  // user info
  public user: any;
  // Configuración para el formato de fecha
  public locale = 'es-CO';
  // Variable que almacena los datos que se le pueden pasar al formulario
  @Input() informationToForm: SearchFormEntity;

  @Input() idSeller: number;
  @Input() typeProfiel: number;
  @Input() state: number;

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
    private fb: FormBuilder,
    private userParams: UserParametersService,
    private languageService: TranslateService,
    private loadingService: LoadingService,
  ) { }

  /**
   * ngOnInit
   * @memberof SearchOrderFormComponent
   */
  ngOnInit() {
    // Obtengo la información del usuario
    this.getDataUser();
    this.createForm();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
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
      'processedOrder': [null, Validators.compose([])],
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
    this.loadingService.viewSpinner();
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

    if (data.value.processedOrder !== null && data.value.processedOrder !== '') {
      stringSearch += `&processedOrder=${data.value.processedOrder}`;
      objectSearch.processedOrder = data.value.processedOrder;
    }

    if (stringSearch !== '') {
      let status = '';
      stringSearch += '&paginationToken=' + encodeURI('{}');
      if (this.state && this.state !== undefined) {
        status = '&idStatusOrder=' + this.state;
      }
      stringSearch += status;
      // Guardo el filtro aplicado por el usuario.
      this.searchOrderMenuService.setCurrentFilterOrders(objectSearch);
      // obtengo las órdenes con el filtro indicado
      this.searchOrderMenuService.getOrdersFilter(100, stringSearch, this.idSeller).subscribe((res: any) => {
        if (res != null) {
          // indico a los elementos que esten suscriptos al evento.
          this.shellComponent.eventEmitterOrders.filterOrderListResponse(res);
          this.toggleMenu();
          this.loadingService.closeSpinner();
        } else {
          this.componentsService.openSnackBar(this.languageService.instant('secure.orders.in_devolution.in_devolution_page.no_found_orders'), this.languageService.instant('actions.close'), 3000);
        }
      }, err => {
        this.componentsService.openSnackBar(this.languageService.instant('errors.error_check_orders'), this.languageService.instant('actions.close'), 3000);
      });
    } else {
      this.componentsService.openSnackBar(this.languageService.instant('errors.error_no_searh_criteria'), this.languageService.instant('actions.close'), 3000);
    }
  }

}
