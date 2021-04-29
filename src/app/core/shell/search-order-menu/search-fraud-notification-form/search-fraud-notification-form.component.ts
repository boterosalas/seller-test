import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchFormEntity } from '@app/shared/models';
import { ComponentsService } from '@app/shared/services';
import { ShellComponent } from '@core/shell/shell.component';

import { SearchOrderMenuService } from '../search-order-menu.service';
import { UserParametersService, LoadingService, Logger } from '@app/core';
import { TranslateService } from '@ngx-translate/core';


// log component
const log = new Logger("SearchFraudFormComponent");

@Component({
  selector: "app-search-fraud-notification-form",
  templateUrl: "./search-fraud-notification-form.component.html",
  styleUrls: ["./search-fraud-notification-form.component.scss"],
})
export class SearchFraudNotificationFormComponent implements OnInit {
 
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
  showFilterStatus = false;
  @Input() paginator = 100;

  // Variable para guardar los estados de las fraudes.
  public listOrderStatus: any[];
  filterStatusOrder: Boolean = false;

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
      'dateOrderInitial': { disabled: true, value: '' },
      'dateOrderFinal': { disabled: true, value: '' },
      'fileName': [null, Validators.compose([])],
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
   * Método para filtrar los fraudes
   * @param {any} data
   * @memberof SearchOrderFormComponent
   */
  filterOrder(data: any) {
    // Obtengo la información del usuario
    const datePipe = new DatePipe(this.locale);
    this.loadingService.viewSpinner();
    // aplico el formato para la fecha a emplear en la consulta
    const dateOrderFinal = datePipe.transform(this.myform.controls.dateOrderFinal.value, 'yyyy/MM/dd');
    const dateOrderInitial = datePipe.transform(this.myform.controls.dateOrderInitial.value, 'yyyy/MM/dd');
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
    if (data.value.fileName !== null && data.value.fileName !== '') {
      stringSearch += `&fileName=${data.value.fileName}`;
      objectSearch.fileName = data.value.fileName;
    }
    
      // Guardo el filtro aplicado por el usuario.
      this.searchOrderMenuService.setCurrentFilterOrders(objectSearch);
      // obtengo las órdenes con el filtro indicado
      this.searchOrderMenuService.getFraudList(this.paginator,'&paginationToken=' + encodeURI('{}') + stringSearch).subscribe((res: any) => {
        if (res) {
          // indico a los elementos que esten suscriptos al evento.
          res.filter = {
            dateOrderFinal: dateOrderFinal,
            dateOrderInitial: dateOrderInitial,
            fileName: data.value.fileName,
          };
          this.shellComponent.eventEmitterOrders.filterOrderListResponse(res);
          this.toggleMenu();
          this.loadingService.closeSpinner();
        } else {
          this.componentsService.openSnackBar(this.languageService.instant('secure.frauds.in_devolution.in_devolution_page.no_found_frauds'), this.languageService.instant('actions.close'), 3000);
        }
      }, err => {
        this.componentsService.openSnackBar(this.languageService.instant('errors.error_check_frauds'), this.languageService.instant('actions.close'), 3000);
      });
    } 

}
