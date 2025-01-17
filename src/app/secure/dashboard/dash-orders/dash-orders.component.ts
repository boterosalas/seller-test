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
    selector: 'app-dash-orders',
    templateUrl: './dash-orders.component.html',
    styleUrls: ['./dash-orders.component.scss']
})
export class DashOrdersComponent implements OnInit {

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

    public initialDateSend: any;
    public finalDateSend: any;


    @ViewChild('picker', { static: false }) picker;
    @ViewChild('pickerDiary', { static: false }) pickerDiary;

    @ViewChild('pickerSales', { static: false }) pickerSales;
    @ViewChild('pickerDiarySales', { static: false }) pickerDiarySales;
    @ViewChild('containerScrollTop', { static: false }) containerScrollTop: ElementRef;

    // Variable para ocultar temporalmente indicadores para vendedores
    hideIndicators = false;
    // Variables cards Por enviar
    onTimeSend: any;
    toExpireSend: any;
    totalToSend: number;
    overComeSend: any;
    // Variables cards entregado
    totalDelivered: any;
    onTimeDelivered: any;
    overComeDelivered: any;
    toExpireDelivered: any;
    // Variables cards por transporte
    totalInTransport: any;
    onTimeInTransport: any;
    overComeInTransport: any;
    toExpireInTransport: any;

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
    }

    ngOnInit() {
        this.log = new Logger('DashOrdersComponent');
        this.getUserData();
        this.changeLanguage();
        this.setSelectFilterOrders();
        this.getOrdensSummary();
    }

    /**
     * funcion para selecionar por defecto una opcion en el listado de periodicidad
     * @memberof DashOrdersComponent
     */
    setSelectFilterOrders() {
        this.selected = '1';
        this.selectedSales = '4';
    }

    /**
     * funcion para mostrar los diferentes calendarios dependiendo del filtro
     * @param {*} filter
     * @memberof DashOrdersComponent
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
     * Ordenes estado asignado, redirigiendo modulo de ordedes: Por enviar
     * @memberof DashOrdersComponent
     */
    goToSendOrders(type: any) {
        if (this.typeFilter) {
            if (this.typeFilter === '1') {
                this.dateCurrent = this.dateCurrent ? this.dateCurrent : new Date();
                const dateFinal = new Date(this.dateCurrent.getFullYear(), this.dateCurrent.getMonth() + 1, 0);
                const dateInit = new Date(this.dateCurrent.getFullYear(), this.dateCurrent.getMonth() - 2, 1);
                const initialDate = this.datepipe.transform(this.addOrSubtractDays(new Date(dateInit), 0), 'yyyy/MM/dd');
                const finalDate = this.datepipe.transform(this.addOrSubtractDays(new Date(dateFinal), 0), 'yyyy/MM/dd');
                this.initialDateSend = this.datepipe.transform(new Date(initialDate), 'yyyy/MM/dd');
                this.finalDateSend = this.datepipe.transform(new Date(finalDate), 'yyyy/MM/dd');
            } else if (this.typeFilter === '2') {
                this.dateCurrent = this.dateCurrent ? this.dateCurrent : new Date();
                const dateFinal = new Date(this.dateCurrent.getFullYear(), this.dateCurrent.getMonth() + 1, 0);
                const dateInit = new Date(this.dateCurrent.getFullYear(), this.dateCurrent.getMonth(), 1);
                const initialDate = this.datepipe.transform(this.addOrSubtractDays(new Date(dateInit), 0), 'yyyy/MM/dd');
                const finalDate = this.datepipe.transform(this.addOrSubtractDays(new Date(dateFinal), 0), 'yyyy/MM/dd');
                this.initialDateSend = this.datepipe.transform(new Date(initialDate), 'yyyy/MM/dd');
                this.finalDateSend = this.datepipe.transform(new Date(finalDate), 'yyyy/MM/dd');
            } else if (this.typeFilter === '3') {
                this.dateOrdens = this.datepipe.transform(this.dateCurrent, 'yyyy/MM/dd');
                const initialDate = this.datepipe.transform(this.addOrSubtractDays(new Date(this.dateOrdens), -6), 'yyyy/MM/dd');
                const finallDate = this.datepipe.transform(this.addOrSubtractDays(new Date(this.dateOrdens), 0), 'yyyy/MM/dd');
                this.initialDateSend = initialDate;
                this.finalDateSend = finallDate;
            } else {
                this.dateOrdens = this.datepipe.transform(this.dateCurrent, 'yyyy/MM/dd');
                const initialDate = this.datepipe.transform(this.addOrSubtractDays(new Date(this.dateOrdens), 0), 'yyyy/MM/dd');
                const finallDate = this.datepipe.transform(this.addOrSubtractDays(new Date(this.dateOrdens), 0), 'yyyy/MM/dd');
                this.initialDateSend = initialDate;
                this.finalDateSend = finallDate;
            }

            if (type === 1) {
                this.router.navigate(['securehome/seller-center/ordenes/estado/35', { dateInitial: this.initialDateSend, dateFinal: this.finalDateSend, type: type }]);

            } else if (type === 2) {
                this.router.navigate(['securehome/seller-center/ordenes/estado/170', { dateInitial: this.initialDateSend, dateFinal: this.finalDateSend, type: type }]);

            } else {
                this.router.navigate(['securehome/seller-center/ordenes', { dateInitial: this.initialDateSend, dateFinal: this.finalDateSend, type: type }]);
            }
        }

    }

    /**
     * Funcion para restar fechas
     * @param {*} date
     * @param {*} days
     * @returns
     * @memberof DashOrdersComponent
     */
    addOrSubtractDays(date: any, days: any) {
        date.setDate(date.getDate() + days);
        return date;
    }

    /**
     * funcion para obtener todas las ordenes
     * @param {*} [params]
     * @memberof DashOrdersComponent
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
            this.last_ordens = res.reportOrdersSalesType ? this.parseLastOrdens(res.reportOrdersSalesType.reverse()) : [];
            this.calculateCountOrders(res.reportOrdersSalesType);
            this.calculateDataCards(res.ordersIndicators);
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
     * @param {*} params
     * @returns
     * @memberof DashOrdersComponent
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
     * @param {*} res
     * @memberof DashOrdersComponent
     */
    calculateCountOrders(res: any) {
        this.totalCount = 0;
        if (res && res.length > 0) {
            res.forEach(element => {
                this.totalCount += element.quantity;
            });
        }
    }

    /**
     * Setear valores de los cards Por enviar, por transporte, entregado
     * @param {*} res
     * @memberof DashOrdersComponent
     */
    calculateDataCards(res: any) {
        this.totalToSend = 0;
        this.onTimeSend = 0;
        this.overComeSend = 0;
        this.toExpireSend = 0;
        this.totalDelivered = 0;
        this.onTimeDelivered = 0;
        this.overComeDelivered = 0;
        this.toExpireDelivered = 0;
        this.totalInTransport = 0;
        this.onTimeInTransport = 0;
        this.overComeInTransport = 0;
        this.toExpireInTransport = 0;
        if (res) {
            this.totalToSend = res.toSend.onTime + res.toSend.overcome + res.toSend.toExpire;
            this.onTimeSend = res.toSend.onTime;
            this.overComeSend = res.toSend.overcome;
            this.toExpireSend = res.toSend.toExpire;
            this.totalDelivered = res.delivered.onTime + res.delivered.overcome + res.delivered.toExpire;
            this.onTimeDelivered = res.delivered.onTime;
            this.overComeDelivered = res.delivered.overcome;
            this.toExpireDelivered = res.delivered.toExpire;
            this.totalInTransport = res.inTransport.onTime + res.inTransport.overcome + res.inTransport.toExpire;
            this.onTimeInTransport = res.inTransport.onTime;
            this.overComeInTransport = res.inTransport.overcome;
            this.toExpireInTransport = res.inTransport.toExpire;
        }
    }


    /**
     * @method getUserData
     * @description Método que carga los datos del vendedor para obtener la sellerId.
     * @memberof DashOrdersComponent
     */
    private async getUserData() {
        this.user = await this.userParams.getUserData();
        if (this.user && this.user.sellerProfile !== 'seller') {
            this.hideIndicators = true;
        } else {
            this.hideIndicators = false;
        }
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

    /**
     * Actualizar info cuando cambia de lenguaje
     * @memberof DashOrdersComponent
     */
    changeLanguage() {
        this.languageService.onLangChange.subscribe((e: Event) => {
            this.isLoad = false;
            this.isLoading = true;
            localStorage.setItem('culture_current', e['lang']);

            if ('ES' === e['lang']) {
                this.selectTypeFilter = this.periodsES[3].value;
            } else if ('FR' === e['lang']) {
                this.selectTypeFilter = this.periodsEN[3].value;
            } else {
                this.selectTypeFilter = this.periodsEN[3].value;
            }
            this.getOrdensSummary();
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
            } else if ('FR' === event.lang) {
                this.selectTypeFilter = this.monthEN[month];
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
            this.router.navigate([`/${RoutesConst.home}`]);
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
     * modal para mostrar el detalle
     * @param {*} data
     * @param {*} type
     * @param {*} filter
     * @memberof DashOrdersComponent
     */
    public modalOpenChart(data: any, type: any, filter: any) {
        this.openDialog(data, type, filter);
    }

    /**
     * modal para mostrar el detalle
     * @param {*} data
     * @param {*} type
     * @param {*} filter
     * @memberof DashOrdersComponent
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
     * @memberof DashOrdersComponent
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
