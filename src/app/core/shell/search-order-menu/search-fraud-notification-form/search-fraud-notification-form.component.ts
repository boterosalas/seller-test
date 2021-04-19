import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService, Logger } from '@app/core';
import { SearchFormEntity, ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { ShellComponent } from '../..';
import { SearchOrderMenuService } from '../search-order-menu.service';

// log component
const log = new Logger('SearchFraudFormComponent');

@Component({
  selector: 'app-search-fraud-notification-form',
  templateUrl: './search-fraud-notification-form.component.html',
  styleUrls: ['./search-fraud-notification-form.component.scss']
})
export class SearchFraudNotificationFormComponent implements OnInit {

  // Formulario para realizar la busqueda
  myform: FormGroup;
  // user info
  public user: any;
  // Configuración para el formato de fecha
  locale = 'es-CO';
  // Variable que almacena los datos que se le pueden pasar al formulario
  @Input() informationToForm: SearchFormEntity;

  @Input() idSeller: number;
  @Input() paginator: any;

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
    private loadingService: LoadingService,
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
      'dateOrderInitial': [null, Validators.compose([])],
      'dateOrderFinal': [null, Validators.compose([])],
      'fileName': [null, Validators.compose([Validators.minLength(1), Validators.maxLength(30)])],
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
    this.shellComponent.eventEmitterOrders.filterFraudList(state);
  }

  /**
   * Método para filtrar las órdenes
   * @param {any} data
   * @memberof SearchOrderFormComponent
   */
  filterOrder(data: any) {
    this.loadingService.viewSpinner();
    // Obtengo la información del usuario
    // this.user = this.userService.getUser();
    const datePipe = new DatePipe(this.locale);
    // aplico el formato para la fecha a emplear en la consulta
    const dateOrderFinal = datePipe.transform(data.value.dateOrderFinal, 'yyyy/MM/dd');
    const dateOrderInitial = datePipe.transform(data.value.dateOrderInitial, 'yyyy/MM/dd');

    // creo el string que indicara los parametros de la consulta
    let stringSearch = `?limit=${this.paginator.pageSize}`;
    const objectSearch: any = {};
    if (dateOrderInitial != null && dateOrderInitial !== '') {
      stringSearch += `&dateOrderInitial=${dateOrderInitial}`;
      objectSearch.dateOrderInitial = dateOrderInitial;
    }
    if (dateOrderFinal != null && dateOrderFinal !== '') {
      stringSearch += `&dateOrderFinal=${dateOrderFinal}`;
      objectSearch.dateOrderFinal = dateOrderFinal;
    }

    if (data.value.fileName != null && data.value.fileName !== '') {
      stringSearch += `&fileName=${data.value.fileName}`;
      objectSearch.fileName = data.value.fileName;

    }

    if (this.idSeller === undefined) {
      this.idSeller = null;
    }

    if (stringSearch !== '') {

      stringSearch += `&paginationToken=${encodeURI('{}')}`;

      // Guardo el filtro aplicado por el usuario.
      this.searchOrderMenuService.setCurrentFilterOrders(objectSearch);

      // obtengo las órdenes con el filtro indicado
      if (this.informationToForm.information.reversionRequestStatusId === 1) {
        this.searchOrderMenuService.getFraudList(stringSearch).subscribe((res: any) => {
          if (res != null) {
            res.filter = {
              dateOrderFinal: dateOrderFinal,
              dateOrderInitial: dateOrderInitial,
              fileName: data.value.fileName,
            };
            // indico a los elementos que esten suscriptos al evento.
            this.shellComponent.eventEmitterOrders.filterOrdersWithStatusResponse(res);
            this.toggleMenu();
          } else {
            this.componentsService.openSnackBar(this.languageService.instant('secure.orders.order_list.order_page.no_orders_found'), this.languageService.instant('actions.close'), 5000);
          }
          this.loadingService.closeSpinner();
        }, err => {
          this.componentsService.openSnackBar(this.languageService.instant('errors.error_check_orders'), this.languageService.instant('actions.close'), 5000);
        });
      } else {
        this.searchOrderMenuService.getFraudList(stringSearch).subscribe((res: any) => {

          if (res != null) {
            // indico a los elementos que esten suscriptos al evento.
            this.shellComponent.eventEmitterOrders.filterOrdersWithStatusResponse(res);
            this.toggleMenu();
          } else {
            this.componentsService.openSnackBar(this.languageService.instant('secure.orders.order_list.order_page.no_orders_found'), this.languageService.instant('actions.close'), 5000);
          }
          this.loadingService.closeSpinner();
        }, err => {
          this.componentsService.openSnackBar(this.languageService.instant('errors.error_check_orders'), this.languageService.instant('actions.close'), 5000);
        });
      }
    } else {
      this.componentsService.openSnackBar(this.languageService.instant('errors.error_no_searh_criteria'), this.languageService.instant('actions.close'), 5000);
    }
  }


}
