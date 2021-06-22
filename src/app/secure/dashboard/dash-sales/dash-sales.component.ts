import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LoadingService, Logger, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ModalDashboardComponent } from '../modal-dashboard/modal-dashboard.component';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dash-sales',
  templateUrl: './dash-sales.component.html',
  styleUrls: ['./dash-sales.component.scss']
})
export class DashSalesComponent implements OnInit {

  // Variable que almacena el objeto que contiene los datos de las órdenes del vendedor.
  public orders: any;

  // Variable que almacena un arreglo con los datos de ventas de los tres últimos meses del vendedor.
  public last_sales: any[];
  public last_ordens: any[];

  // Variable para almacenar los datos del vendedor.
  private user: any;

  // Instancia de Logger
  public log: Logger;

  // Fecha inicial del datepicker
  public startDate: Date;

  // Fecha inicial del datepicker
  public visibleDate: string;

  public dateCurrent: any;
  public position = 'left';

  public showOrdersChart = false;
  public showOrdersChartSales = false;
  public showOrdersChartSeller = false;
  public params: any;
  public totalCount = 0;
  public sumatoryTotal = 0;

  public showOrdens = false;
  public dateOrdens = '';
  public showSales = false;
  public dateSales = '';
  public showMore = true;
  public selectTypeFilter = '';

  public startDateDiary: any;

  public displayedColumns = [
    'PLU',
    'Nombre',
    'Uds. Vendidas',
    'Uds. Disponibles'
  ];

  // Fecha máxima del datePicker
  public dateMax: Date;

  public monthEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  lang = 'ES';
  public isLoad = true;
  public isLoading = false;

  public periodsEN = [
    { value: 'Trimester' },
    { value: 'Monthly' },
    { value: 'Weekly' },
    { value: 'Daily' }
  ];
  public periodsES = [
    { value: 'Trimestral' },
    { value: 'Mensual' },
    { value: 'Semanal' },
    { value: 'Diaria' }
  ];

  selected: any;
  selectedSales: any;
  selectedValue: string;
  public typeFilter = '1';
  public showCalenderQ = true;
  public showCalenderD = false;

  public typeFilterSales = '4';
  public showCalenderQSales = false;
  public showCalenderDSales = true;

  public showChartSales = false;
  public showChartOrdens = false;

  public sales: string;
  public ordens: string;

  public visibleDateSales: string;
  public startDateSales: any;
  public startDateDiarySales: any;

  public topProduct = [];
  public promedTicket = '0';

  public paramsIndicators = {
    idSeller: null,
    consult: true,
    type: 'seller'
  };

  /**
   * Variable para observar el input del filtro inicial
   * @memberof FilterComponent
   */
  @ViewChild('picker', { static: false }) picker;
  @ViewChild('pickerDiary', { static: false }) pickerDiary;

  @ViewChild('pickerSales', { static: false }) pickerSales;
  @ViewChild('pickerDiarySales', { static: false }) pickerDiarySales;
  @ViewChild('containerScrollTop', { static: false }) containerScrollTop: ElementRef;

  // Variable para ocultar temporalmente indicadores para vendedores
  hideIndicators = false;

  /**
   * @method constructor
   * @description crea una instancia del componente.
   * @param {UserLoginService} [userService]
   * @param {UserParametersService} [userParams]
   * @memberof DashboardComponent
   */
  constructor(
    private _dashboard: DashboardService,
    private languageService: TranslateService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public userService?: UserLoginService,
    public userParams?: UserParametersService,
    private loadingService?: LoadingService,
    private modalService?: ModalService,
    public router?: Router,
  ) {
    this.orders = {
      all: 0,
      pending: 0,
      delivered: 0,
      expired: 0
    };

    this.last_sales = [];
    this.last_ordens = [];

    this.startDate = new Date();
    this.dateMax = this.startDate;
    this.getMonthVisibleSales(this.startDate.getMonth());
  }


  ngOnInit() {
    this.log = new Logger('DashboardComponent');
    this.getUserData();
    this.changeLanguage();
    this.setSelectFilterOrders();
    this.getSalesSummary();
  }

  /**
   * funcion para selecionar por defecto una opcion en el listado de periodicidad
   * @memberof DashSalesComponent
   */
   setSelectFilterOrders() {
    this.selected = '1';
    this.selectedSales = '4';
  }
  /**
   * funcion para calcular el total de cantidad de un producto
   * @param {*} res
   * @memberof DashSalesComponent
   */
  calculateCountSales(res: any) {
    this.totalCount = 0;
    if (res && res.length > 0) {
      res.forEach(element => {
        this.totalCount += element.quantity;
      });
    }
  }



  /**
   * Método que carga los datos del vendedor para obtener la sellerId.
   * @private
   * @memberof DashSalesComponent
   */
  private async getUserData() {
    this.user = await this.userParams.getUserData();
    if (this.user && this.user.sellerProfile !== 'seller') {
      this.hideIndicators = true;
    } else {
      this.hideIndicators = false;
    }
  }


  /**
   * Metodo cambio lenguaje, seteo info
   * @memberof DashSalesComponent
   */
  changeLanguage() {
    this.languageService.onLangChange.subscribe((e: Event) => {
      this.isLoad = false;
      this.isLoading = true;
      localStorage.setItem('culture_current', e['lang']);
      this.getSalesSummary();
    });

    this.lang = localStorage.getItem('culture_current');
    if (this.lang === 'ES') {
      this.selectTypeFilter = this.periodsES[3].value;
    } else if (this.lang === 'FR') {
      this.selectTypeFilter = this.periodsEN[3].value;
    } else {
      this.selectTypeFilter = this.periodsEN[3].value;
    }
  }


  /**
   * Método que retorna el mes actual en forma de string.
   * @private
   * @param {number} month El mes actual en número. (0-11)
   * @memberof DashSalesComponent
   */
  private getVisibleDate(month: number) {
    switch (month) {
      case 0:
        return 'Enero';
      case 1:
        return 'Febrero';
      case 2:
        return 'Marzo';
      case 3:
        return 'Abril';
      case 4:
        return 'Mayo';
      case 5:
        return 'Junio';
      case 6:
        return 'Julio';
      case 7:
        return 'Agosto';
      case 8:
        return 'Septiembre';
      case 9:
        return 'Octubre';
      case 10:
        return 'Noviembre';
      case 11:
        return 'Diciembre';
    }
  }


  /**
   * Metodo para validar si el usuario esta logeado
   * @param {string} message
   * @param {boolean} isLoggedIn
   * @memberof DashSalesComponent
   */
  public isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    } else {
      this.getUserData();
    }
  }

  /**
   * funcion para mostrar las grafias de ventas
   * @param {boolean} show
   * @memberof DashSalesComponent
   */
  public showChangeViewSales(show: boolean) {
    this.showOrdersChartSales = !show;
  }

  /**
   * funcion para mostrar las graficas de ventas
   * @param {boolean} show
   * @memberof DashSalesComponent
   */
  public showChangeViewSeller(show: boolean) {
    this.showOrdersChartSeller = !show;
  }

  /**
   * funcion que obtiene los registros de ventas del vendedor logeado
   * @param {*} [params]
   * @memberof DashSalesComponent
   */
  getSalesSummary(params?: any) {
    this.params = this.setParametersSales(params);
    this.showChartSales = false;
    this._dashboard.getSalesSummary(this.params).subscribe((res: any) => {
      if (res) {
        if (this.isLoad) {
          this.loadingService.closeSpinner();
        } else {
          this.isLoading = false;
        }
        this.last_sales = res.reportOrdersSalesType ? this.parseLastSales(res.reportOrdersSalesType.reverse()) : [];
        this.calculateCountSales(res.reportOrdersSalesType);

        if (res.productsBestSellings && res.productsBestSellings.length > 0) {
          this.topProduct = res.productsBestSellings;
        } else {
          this.topProduct = [];
        }

        if (res.ticketAverage) {
          this.promedTicket = res.ticketAverage;
        } else {
          this.promedTicket = '0';
        }

        this.showChartSales = true;
      }

    }, err => {
      if (this.isLoad) {
        this.loadingService.closeSpinner();
      } else {
        this.isLoading = false;
      }
      this.log.debug(err);
      this.modalService.showModal('errorService');
    }
    );
  }

  /**
   * funcion para mostrar los calendarios mes y otro permite dias
   * @param {*} filter
   * @memberof DashSalesComponent
   */
  selectSales(filter: any) {
    this.typeFilterSales = filter;
    if (filter === '1' || filter === '2') {
      this.showCalenderQSales = true;
      this.showCalenderDSales = false;
    } else {
      this.showCalenderQSales = false;
      this.showCalenderDSales = true;
    }
    if (filter) {
      this.lang = localStorage.getItem('culture_current');
      if (this.lang === 'ES') {
        this.selectTypeFilter = this.periodsES[filter - 1].value;
      } else {
        this.selectTypeFilter = this.periodsEN[filter - 1].value;
      }
    }
    this.getSalesSummary();
  }


  /**
   * funcion para setear los parametros y enviarlo al endPoint para consultar las ventas
   * @param {*} params
   * @returns
   * @memberof DashSalesComponent
   */
  setParametersSales(params: any) {
    let paramsOrdersSummary = 'null/';
    if (this.dateCurrent === '' || this.dateCurrent === undefined) {
      this.dateCurrent = new Date();
      const latest_date = this.datepipe.transform(this.dateCurrent, 'yyyy-MM-dd');
      paramsOrdersSummary += latest_date + '/';
    } else {
      paramsOrdersSummary += this.datepipe.transform(this.dateCurrent, 'yyyy-MM-dd') + '/';
    }
    if (this.typeFilterSales !== undefined && this.typeFilterSales !== null) {
      paramsOrdersSummary += this.typeFilterSales;
    }
    if (this.typeFilterSales === '4' || this.typeFilterSales === '3') {
      this.dateSales = this.datepipe.transform(this.dateCurrent, 'yyyy-MM-dd');
      this.showSales = true;
    } else {
      this.dateSales = '';
      this.showSales = false;
    }
    return paramsOrdersSummary;
  }


  /**
   * funcion para calcular el porcentaje de las barras para el grafico
   * @private
   * @param {*} last
   * @returns
   * @memberof DashSalesComponent
   */
  private parseLastSales(last: any) {
    let sumatory = 0;
    let total = '0';
    if (last && last.length > 0) {
      last.forEach(element => {
        sumatory += element.salesFull;
        element.percent = 0 + '%';
      });
      last.forEach(element => {
        total = ((element.salesFull / sumatory) * 100).toString();
        element.percent = parseFloat(total).toFixed(2) + '%';
      });
    } else {
      last.forEach(element => {
        element.percent = '0%';
      });
    }
    this.sumatoryTotal = sumatory;
    return last;
  }

  /**
   * funcion para setear la fecha en una variable global y llamar a la funcion getSalesSummary
   * @private
   * @param {*} [date]
   * @memberof DashSalesComponent
   */
  private getLastSales(date?: any) {
    this.dateCurrent = date;
    this.getSalesSummary();
  }


  /**
   * funcion para buscar por medio de un array las traducion de los meses
   * @param {*} month
   * @memberof DashSalesComponent
   */
  getMonthVisibleSales(month: any) {
    this.languageService.onLangChange.subscribe((event: LangChangeEvent) => {
      if ('ES' === event.lang) {
        this.visibleDateSales = this.monthES[month];
      } else if ('FR' === event.lang) {
        this.selectTypeFilter = this.monthEN[month];
      } else {
        this.visibleDateSales = this.monthEN[month];
      }
    });
    this.lang = localStorage.getItem('culture_current');
    if (this.lang === 'ES') {
      this.visibleDateSales = this.monthES[month];
    } else {
      this.visibleDateSales = this.monthEN[month];
    }
  }


  /**
   * funcion para abrir el datapicker (mes)
   * @memberof DashSalesComponent
   */
  public openDatePickerDiarySales() {
    this.pickerDiarySales.open();
  }

  /**
   * funcion para abrir el datapicker (diario)
   * @memberof DashSalesComponent
   */
  public openDatePickerSales() {
    this.pickerSales.open();
  }


  /**
   * funcion para seleccionar el mes  y consultar de nuevo los datos con ese mes (mes)
   * @param {*} month
   * @param {*} dp
   * @memberof DashSalesComponent
   */
  public chosenMonthHandlerSales(month: any, dp: any) {
    const date = new Date(month);
    this.startDate = date;
    this.getMonthVisibleSales(date.getMonth());
    this.getLastSales(date);
    dp.close();
  }


  /**
   * funcion para seleccionar el mes  y consultar de nuevo los datos con ese mes (diario)
   * @param {*} month
   * @param {*} dp
   * @memberof DashSalesComponent
   */
  public chosenMonthHandlerDiarySales(month: any, dp: any) {
    const date = new Date(month.value);
    this.startDate = date;
    this.getMonthVisibleSales(date.getMonth());
    this.getLastSales(date);
    dp.close();
  }



  /**
   * modal para mostrar el detalle
   *
   * @param {*} data
   * @param {*} type
   * @param {*} filter
   * @memberof DashSalesComponent
   */
  public modalOpenChart(data: any, type: any, filter: any) {
    this.openDialog(data, type, filter);
  }


  /**
   * modal para mostrar el detalle
   * @param {*} data
   * @param {*} type
   * @param {*} filter
   * @memberof DashSalesComponent
   */
  public openDialog(data: any, type: any, filter: any) {
    if (!!data) {
      const dialogRef = this.dialog.open(ModalDashboardComponent, {
        height: '530px',
        data: { data: data, type: type, filter: filter }
      });
    }
  }

  /**
   * funcion para agregar un clase que permita el scroll en el contenedor
   * @param {boolean} show
   * @memberof DashSalesComponent
   */
  public addClassScroll(show: boolean) {
    if (show) {
      this.containerScrollTop.nativeElement.classList.add('addScroll');
    } else {
      this.containerScrollTop.nativeElement.classList.remove('addScroll');
    }
    this.showMore = !this.showMore;
  }

}
