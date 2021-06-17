import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  public infoDataForm: any;
  status: any;
  typeCards: any;
  @Input() set informationToForm(value: any) {
    if (value) {
      this.infoDataForm = value;
      if (this.myform) {
        this.getFilterOrderDate();
      }
    }
  }


  @Input() idSeller: number;
  @Input() typeProfiel: number;
  showFilterStatus = false;
  _state: number;
  dateInit: any;
  dateFinal: any;
  @Input() set state(value: number) {
    if (value) {
      if (value.toString() === '170') {
        this.showFilterStatus = false;
      } else if (value.toString() === '35') {
        this.showFilterStatus = false;
      } else {
        this.showFilterStatus = true;
      }
      this._state = value;
    } else {
      this.showFilterStatus = true;
      this._state = value;
    }
  }
  @Input() paginator = 100;

  // Variable para guardar los estados de las ordenes.
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
    public router: Router,
    private route: ActivatedRoute,
    public searchOrderMenuService: SearchOrderMenuService,
    private shellComponent: ShellComponent,
    private fb: FormBuilder,
    private userParams: UserParametersService,
    private languageService: TranslateService,
    private loadingService: LoadingService,
    public datepipe: DatePipe,
  ) {
    this.createForm();
  }

  /**
   * ngOnInit
   * @memberof SearchOrderFormComponent
   */
  ngOnInit() {
    // Obtengo la información del usuario
    this.getDataUser();
    this.getOrdersStatus();
  }


  /**
   * Metodo para obtener info usuario
   * @memberof SearchOrderFormComponent
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }


  /**
   * Metodo para retornar formato de fecha
   * @param {*} date
   * @returns {*}
   * @memberof SearchOrderFormComponent
   */
  public getDate(date: any): any {
    const day = this.addsZeroDate(date.getDate().toString());
    const months = this.addsZeroDate((date.getMonth() + 1).toString());
    const year = date.getFullYear();
    return year + '-' + months + '-' + day;
  }

  /**
   * Metodo para agregar 0 a la fecha si le hace falta
   * @param {*} param
   * @returns {*}
   * @memberof SearchOrderFormComponent
   */
  public addsZeroDate(param: any): any {
    if (param.length < 2) {
      return '0' + param;
    }
    return param;
  }

  /**
   * Seteo valores al formulario por parametroSeteo valores al formulario por parametro de la url
   * @memberof SearchOrderFormComponent
   */
  getFilterOrderDate() {
    this.dateInit = this.infoDataForm ? this.infoDataForm.information.dateInit : null;
    this.dateFinal = this.infoDataForm ? this.infoDataForm.information.dateFinal : null;
    this.status = this.infoDataForm ? this.infoDataForm.information.category : null;
    this.typeCards = this.infoDataForm ? this.infoDataForm.information.type : null;
    const date1 = this.addOrSubtractDays(new Date(this.dateInit), +1);
    const date2 = this.addOrSubtractDays(new Date(this.dateFinal), +1);
    const viewDateInitial = this.getDate(date1);
    const viewDateFinal = this.getDate(date2);

    this.myform.controls.dateOrderInitial.setValue(viewDateInitial);
    this.myform.controls.dateOrderFinal.setValue(viewDateFinal);

    if (this.listOrderStatus && this.typeCards) {
      this.listOrderStatus.forEach(el => {
        if (Number(this.typeCards) === 3 && el.idStatusOrder === 60) {
          this.myform.controls.idStatusOrder.setValue(el.idStatusOrder.toString());
        }
      });
    }
  }

  /**
   * Sumar 1 dia a la fecha para pintar
   * @param {*} date
   * @param {*} days
   * @returns
   * @memberof SearchOrderFormComponent
   */
  addOrSubtractDays(date: any, days: any) {
    date.setDate(date.getDate() + days);
    return date;
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
      'processedOrder': [null, Validators.compose([])],
      'noBills': [null, Validators.compose([])],
      'identificationCard': [null, Validators.compose([])],
      // 'typeOrder': [null, Validators.compose([])],
      'idChannel': [null, Validators.compose([])],
      'idStatusOrder': [null, Validators.compose([])],
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
    if (this.infoDataForm && this.infoDataForm.information.status === '35') {
      this.router.navigate(['securehome/seller-center/ordenes/estado/35', {}]);
    } else if (this.infoDataForm && this.infoDataForm.information.status === '170') {
      this.router.navigate(['securehome/seller-center/ordenes/estado/170', {}]);
    } else {
      this.router.navigate(['securehome/seller-center/ordenes']);
    }
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
   * Metodo para consultar todos los estados de las ordenes.
   * @memberof SearchOrderFormComponent
   */
  getOrdersStatus() {
    this.loadingService.viewSpinner();
    this.searchOrderMenuService.getIdOrders().subscribe((res: any) => {
      if (res && res.status === 200 || res.status === 201) {
        this.listOrderStatus = res.body.data;
      } else {
        this.componentsService.openSnackBar(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), 3000);
      }
      this.loadingService.closeSpinner();
    }, err => {
      this.componentsService.openSnackBar(this.languageService.instant('errors.error_check_orders'), this.languageService.instant('actions.close'), 3000);
    });
  }

  /**
   * Método para filtrar las órdenes
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
    if (data.value.idChannel !== null && data.value.idChannel !== '') {
      stringSearch += `&idChannel=${data.value.idChannel}`;
      objectSearch.idChannel = data.value.idChannel;
    }
    if (data.value.idStatusOrder !== null && data.value.idStatusOrder !== '') {
      this.filterStatusOrder = true;
      stringSearch += `&idStatusOrder=${data.value.idStatusOrder}`;
      objectSearch.idStatusOrder = data.value.idStatusOrder;
    } else {
      this.filterStatusOrder = false;
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
    if (data.value.noBills !== null && data.value.noBills !== '') {
      stringSearch += `&bill=${data.value.noBills}`;
      objectSearch.bill = data.value.noBills;
    }
    if (stringSearch !== '') {
      let status = '';
      stringSearch += '&paginationToken=' + encodeURI('{}');
      if (!this.filterStatusOrder) {
        if (this._state && this._state !== undefined) {
          status = '&idStatusOrder=' + this._state;
        }
      }
      stringSearch += status;
      // Guardo el filtro aplicado por el usuario.
      this.searchOrderMenuService.setCurrentFilterOrders(objectSearch);
      // obtengo las órdenes con el filtro indicado
      this.searchOrderMenuService.getOrdersFilter(this.paginator, stringSearch, this.idSeller).subscribe((res: any) => {
        if (res != null) {
          // indico a los elementos que esten suscriptos al evento.
          res.filter = {
            dateOrderFinal: dateOrderFinal,
            dateOrderInitial: dateOrderInitial,
            idChannel: data.value.idChannel,
            idStatusOrder: data.value.idStatusOrder,
            orderNumber: data.value.orderNumber,
            identificationCard: data.value.identificationCard,
            processedOrder: data.value.processedOrder,
            noBills: data.value.noBills
          };
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
