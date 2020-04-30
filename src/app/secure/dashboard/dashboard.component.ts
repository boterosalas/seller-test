// 3rd party components
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// Our own custom components
import { UserLoginService, UserParametersService, LoadingService, ModalService } from '@app/core';
import { Logger } from '@core/util/logger.service';
import { DashboardService } from './services/dashboard.service';
import { RoutesConst } from '@app/shared';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ModalDashboardComponent } from './modal-dashboard/modal-dashboard.component';
import { MatDialog } from '@angular/material';


/**
 * @export
 * @class DashboardComponent
 */
@Component({
    selector: 'app-dashboard-component',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

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
    public position= 'left';

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
    public selectTypeFilter= '';

    public startDateDiary: any;

    public displayedColumns= [
        'PLU',
        'Nombre',
        'Uds. Vendidas',
        'Uds. Disponibles'
    ];

    public arrayTop10= [
        {
            name: 'Huawei P20 lite dual sin 64gb',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Golty Balon de football blanco naranja',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Bicicleta Gw Jackal 27.5 Suspension 2.2',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Bicicleta Gw Jackal 27.5 Suspension 2.2',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Bicicleta Gw Jackal 27.5 Suspension 2.2',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Bicicleta Gw Jackal 27.5 Suspension 2.2',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Bicicleta Gw Jackal 27.5 Suspension 2.2',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Bicicleta Gw Jackal 27.5 Suspension 2.2',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Bicicleta Gw Jackal 27.5 Suspension 2.2',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
        {
            name: 'Bicicleta Gw Jackal 27.5 Suspension 2.2',
            PLU: '############',
            unit_seller: '###',
            unit_available: '###'
        },
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
    public showCalenderQSales = true;
    public showCalenderDSales = false;

    public showChartSales = false;
    public showChartOrdens = false;

    public sales: string;
    public ordens: string;

    public visibleDateSales: string;
    public startDateSales: any;
    public startDateDiarySales: any;

    public topProduct= [];
    public promedTicket = '0';

    /**
     * Variable para observar el input del filtro inicial
     * @memberof FilterComponent
     */
    @ViewChild('picker') picker;
    @ViewChild('pickerDiary') pickerDiary;

    @ViewChild('pickerSales') pickerSales;
    @ViewChild('pickerDiarySales') pickerDiarySales;
    @ViewChild('containerScrollTop') containerScrollTop: ElementRef;

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
        this.getMonthVisible(this.startDate.getMonth());
        this.getMonthVisibleSales(this.startDate.getMonth());
    }

    /**
     * @method ngOnInit
     * @description Método que inicializa los datos.
     * @memberof DashboardComponent
     */
    ngOnInit(): void {
        this.log = new Logger('DashboardComponent');
        this.getUserData();
        this.changeLanguage();
        this.setSelectFilterOrders();
        this.getSalesSummary();
        this.getOrdensSummary();
    }
/**
 * funcion para selecionar por defecto una opcion en el listado de periodicidad
 *
 * @memberof DashboardComponent
 */
setSelectFilterOrders() {
        this.selected = '1';
        this.selectedSales = '4';
    }
/**
 * funcion para mostrar los diferentes calendarios dependiendo del filtro
 *
 * @param {*} filter
 * @memberof DashboardComponent
 */
select(filter: any) {
        this.typeFilter = filter;
        if (filter === '1' || filter === '2') {
            this.showCalenderQ = true;
            this.showCalenderD = false;
        } else {
            this.showCalenderQ = false;
            this.showCalenderD = true;
        }
        this.getOrdensSummary();
    }
/**
 * funcion para obtener todas las ordenes
 *
 * @param {*} [params]
 * @memberof DashboardComponent
 */
getOrdensSummary(params?: any) {
        this.params = this.setParameters(params);
        this.showChartOrdens = false;
        this._dashboard.getOrdensSummary(this.params).subscribe((res: any) => {
            if (this.isLoad) {
                this.loadingService.closeSpinner();
            } else {
                this.isLoading = false;
            }
            this.last_ordens = res ? this.parseLastOrdens(res.reverse()) : [];
            this.calculateCountSales(res);
            this.showChartOrdens = true;
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
 * funcion para setear los parametros
 *
 * @param {*} params
 * @returns
 * @memberof DashboardComponent
 */
setParameters(params: any) {
        let paramsOrdersSummary = 'null/';
        if (this.dateCurrent === '' || this.dateCurrent === undefined) {
            this.dateCurrent = new Date();
            const latest_date = this.datepipe.transform(this.dateCurrent, 'yyyy-MM-dd');
            paramsOrdersSummary += latest_date + '/';
        } else {
            paramsOrdersSummary += this.datepipe.transform(this.dateCurrent, 'yyyy-MM-dd') + '/';
        }
        if (this.typeFilter !== undefined && this.typeFilter !== null) {
            paramsOrdersSummary += this.typeFilter;
        }
        if (this.typeFilter === '4' || this.typeFilter === '3') {
            this.dateOrdens = this.datepipe.transform(this.dateCurrent, 'yyyy-MM-dd');
            this.showOrdens = true;
        } else {
            this.dateOrdens = '';
            this.showOrdens = false;
        }
        return paramsOrdersSummary;
    }
/**
 * funcion para calcular el total de cantidad de un producto
 *
 * @param {*} res
 * @memberof DashboardComponent
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
     * @method getUserData
     * @description Método que carga los datos del vendedor para obtener la sellerId.
     * @memberof DashboardComponent
     */
    private async getUserData() {
        this.user = await this.userParams.getUserData();
        this.getOrdersData();
    }

    /**
     * @method getOrdersData
     * @description Método que carga los datos de las órdenes.
     * @memberof DashboardComponent
     */
    private getOrdersData() {
        this.loadingService.viewSpinner();
        this._dashboard.getOrdersByStatus(this.user.sellerId)
            .subscribe(res => {
                this.orders = res;
                this.loadingService.closeSpinner();
            }, err => {
                this.loadingService.closeSpinner();
                this.log.debug(err);
                this.modalService.showModal('errorService');
            });
    }

    /**
     * @method getLastSales
     * @description Método que carga los datos de las ventas de los últimos tres meses a parir de la fecha indicada.
     * @memberof DashboardComponent
     */
    private getLastOrdens(date?: any) {
        this.dateCurrent = date;
        this.getOrdensSummary();
    }
    changeLanguage() {
        this.languageService.onLangChange.subscribe((e: Event) => {
            this.isLoad = false;
            this.isLoading = true;
            localStorage.setItem('culture_current', e['lang']);
            this.getLastSales(this.dateCurrent);

            if ('ES' === e['lang']) {
                this.selectTypeFilter = this.periodsES[3].value;
            } else {
                this.selectTypeFilter = this.periodsEN[3].value;
            }
        });

        this.lang = localStorage.getItem('culture_current');
        if (this.lang === 'ES') {
            this.selectTypeFilter = this.periodsES[3].value;
        } else {
            this.selectTypeFilter = this.periodsEN[3].value;
        }
    }

    /**
     * @method parseLastSales
     * @description Método organiza la información de las ventas de los últimos 3 meses para encontrar
     *  las proporciones adecuadas para pintar los datos en la gráfica.
     * @param last datos sin procesar de los últimos tres meses.
     * @memberof DashboardComponent
     */
    private parseLastOrdens(last: any) {
        if (last && last.length > 0) {
            let sumatory = 0;
            last.forEach(element => {
                sumatory += element.quantity;
                element.percent = 0 + '%';
            });
            last.forEach(element => {
                element.percent = ((element.quantity / sumatory) * 100) + '%';
            });
        } else {
            last.forEach(element => {
                element.percent = '0%';
            });
        }
        return last;
    }

    /**
     * @method chosenMonthHandler
     * @description Método que se encarga de responder al evento que se produce al seleccionar un mes en el date picker.
     * @param month Fecha correspondiente al mes seleccionado en el date picker.
     * @param dp El elemento date picker.
     * @memberof DashboardComponent
     */
    public chosenMonthHandler(month: any, dp: any) {
        const date = new Date(month);
        this.startDate = date;
        this.getMonthVisible(date.getMonth());
        this.getLastOrdens(date);
        dp.close();
    }
    public chosenMonthHandlerDiary(month: any, dp: any) {
        const date = new Date(month.value);
        this.startDate = date;
        this.getMonthVisible(date.getMonth());
        this.getLastOrdens(date);
        dp.close();
    }


    /**
     * @method openDatePicker
     * @description Método que abre el date picker.
     * @memberof DashboardComponent
     */
    public openDatePicker() {
        this.picker.open();
    }

    /**
     * @method openDatePicker
     * @description Método que abre el date picker diario.
     * @memberof DashboardComponent
     */
    public openDatePickerDiary() {
        this.pickerDiary.open();
    }

    getMonthVisible(month: any) {
        this.languageService.onLangChange.subscribe((event: LangChangeEvent) => {
            if ('ES' === event.lang) {
                this.visibleDate = this.monthES[month];
            } else {
                this.visibleDate = this.monthEN[month];
            }
        });
        this.lang = localStorage.getItem('culture_current');
        if (this.lang === 'ES') {
            this.visibleDate = this.monthES[month];
        } else {
            this.visibleDate = this.monthEN[month];
        }
    }

    /**
     * @method getVisibleDate
     * @description Método que retorna el mes actual en forma de string.
     * @param month El mes actual en número. (0-11)
     * @memberof DashboardComponent
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
     * @method isLoggedIn
     * @description Metodo para validar si el usuario esta logeado
     * @param message
     * @param isLoggedIn
     * @memberof DashboardComponent
     */
    public isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            // this.router.navigate([`/${RoutesConst.home}`]);
        } else {
            this.getUserData();
        }
    }
    /**
     * funcion para mostrar las diferentes vistas de movil a escritorio
     *
     * @param {boolean} show
     * @memberof DashboardComponent
     */
    public showChangeView(show: boolean) {
        this.showOrdersChart = !show;
    }
    /**
     * funcion para mostrar las grafias de ventas
     *
     * @param {boolean} show
     * @memberof DashboardComponent
     */
    public showChangeViewSales(show: boolean) {
        this.showOrdersChartSales = !show;
    }
    /**
     * funcion para mostrar las graficas de ventas
     *
     * @param {boolean} show
     * @memberof DashboardComponent
     */
    public showChangeViewSeller(show: boolean) {
        this.showOrdersChartSeller = !show;
    }
    /**
     * funcion que obtiene los registros de ventas del vendedor logeado
     *
     * @param {*} [params]
     * @memberof DashboardComponent
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
                    this.promedTicket = '';
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
     *
     * @param {*} filter
     * @memberof DashboardComponent
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
     *
     * @param {*} params
     * @returns
     * @memberof DashboardComponent
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
     *
     * @private
     * @param {*} last
     * @returns
     * @memberof DashboardComponent
     */
    private parseLastSales(last: any) {
        let sumatory = 0;
        let total = '0';
        if (last && last.length > 0) {
            last.forEach(element => {
                sumatory += element.sales;
                element.percent = 0 + '%';
            });
            last.forEach(element => {
                total = ((element.sales / sumatory) * 100).toString();
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
     *
     * @private
     * @param {*} [date]
     * @memberof DashboardComponent
     */
    private getLastSales(date?: any) {
        this.dateCurrent = date;
        this.getSalesSummary();
    }
    /**
     * funcion para buscar por medio de un array las traducion de los meses
     *
     * @param {*} month
     * @memberof DashboardComponent
     */
    getMonthVisibleSales(month: any) {
        this.languageService.onLangChange.subscribe((event: LangChangeEvent) => {
            if ('ES' === event.lang) {
                this.visibleDateSales = this.monthES[month];
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
     *
     * @memberof DashboardComponent
     */
    public openDatePickerDiarySales() {
        this.pickerDiarySales.open();
    }
    /**
     * funcion para abrir el datapicker (diario)
     *
     * @memberof DashboardComponent
     */
    public openDatePickerSales() {
        this.pickerSales.open();
    }


    /**
     * funcion para seleccionar el mes  y consultar de nuevo los datos con ese mes (mes)
     *
     * @param {*} month
     * @param {*} dp
     * @memberof DashboardComponent
     */
    public chosenMonthHandlerSales(month: any, dp: any) {
        const date = new Date(month);
        this.startDate = date;
        this.getMonthVisibleSales(date.getMonth());
        this.getLastSales(date);
        dp.close();
    }

    /** funcion para seleccionar el mes  y consultar de nuevo los datos con ese mes (diario)
     *
     *
     * @param {*} month
     * @param {*} dp
     * @memberof DashboardComponent
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
 * @memberof DashboardComponent
 */
public modalOpenChart(data: any, type: any, filter: any) {
        this.openDialog(data, type, filter);
    }
/**
 * modal para mostrar el detalle
 *
 * @param {*} data
 * @param {*} type
 * @param {*} filter
 * @memberof DashboardComponent
 */
public openDialog(data: any, type: any, filter: any) {
        if (!!data) {
            const dialogRef = this.dialog.open(ModalDashboardComponent, {
                height: '530px',
                data: {data: data, type: type, filter: filter}
            });
        }
    }
/**
 * funcion para agregar un clase que permita el scroll en el contenedor
 *
 * @param {boolean} show
 * @memberof DashboardComponent
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
