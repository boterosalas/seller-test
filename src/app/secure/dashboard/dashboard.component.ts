// 3rd party components
import { Component, OnInit } from '@angular/core';
// Our own custom components
import { UserLoginService, UserParametersService, LoadingService, ModalService } from '@app/core';
import { Logger } from '@core/util/logger.service';
import { DashboardService } from './services/dashboard.service';

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

    // Variable para almacenar los datos del vendedor.
    private user: any;

    // Instancia de Logger
    public log: Logger;

    /**
     * @description crea una instancia del componente.
     * @param {UserLoginService} [userService]
     * @param {UserParametersService} [userParams]
     * @memberof DashboardComponent
     */
    constructor(
        private _dashboard: DashboardService,
        public userService?: UserLoginService,
        public userParams?: UserParametersService,
        private loadingService?: LoadingService,
        private modalService?: ModalService,
    ) {
        this.orders = {
            all: 0,
            pending: 0,
            delivered: 0,
            expired: 0
        };

        this.last_sales = [];
    }

    /**
     * @description Método que inicializa los datos.
     * @memberof DashboardComponent
     */
    ngOnInit(): void {
        this.getUserData();
        this.log = new Logger('DashboardComponent');
    }

    /**
     * @description Método que carga los datos del vendedor para obtener la sellerId.
     * @memberof DashboardComponent
     */
    private async getUserData() {
        this.user = await this.userParams.getUserData();

        this.getOrdersData();
        this.getLastSales();
    }

    /**
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
     * @description Método que carga los datos de las ventas de los últimos tres meses a parir de la fecha indicada.
     * @memberof DashboardComponent
     */
    private getLastSales(date?: any) {
        this.loadingService.viewSpinner();
        this._dashboard.getLastSales(this.user.sellerId, date)
            .subscribe((res: any[]) => {
                this.loadingService.closeSpinner();
                this.last_sales = this.parseLastSales(res.reverse());
            }, err => {
                this.loadingService.closeSpinner();
                this.log.debug(err);
                this.modalService.showModal('errorService');
            });
    }

    /**
     * @description Método organiza la información de las ventas de los últimos 3 meses para encontrar
     *  las proporciones adecuadas para pintar los datos en la gráfica.
     * @param last datos sin procesar de los últimos tres meses.
     * @memberof DashboardComponent
     */
    private parseLastSales(last: any) {
        const last_array: any = last;

        let max: any;
        let max_index: number;

        for (let f = 0; f < last_array.length; f++) {
            if (!max || parseInt(last_array[f].value, 10) > parseInt(max.value, 10)) {
                max = last_array[f];
                max_index = f;
            }
        }

        if (parseInt(last_array[max_index].value, 10) !== 0) {
            last_array[max_index].percent = 100 + '%';

            last_array.forEach((e, f) => {
                if (f !== max_index) {
                    e.percent = ((e.value / max.value) * 100) + '%';
                }
            });
        } else {
            last_array.forEach(e => {
                e.percent = 0 + '%';
            });
        }

        return last_array;
    }

    /**
     * @description Método que se encarga de responder al evento que se produce al seleccionar un mes en el date picker.
     * @param month Fecha correspondiente al mes seleccionado en el date picker.
     * @param dp El elemento date picker.
     * @memberof DashboardComponent
     */
    public chosenMonthHandler(month: any, dp: any) {
        const date = new Date(month);
        this.getLastSales(date);
        dp.close();
    }
}
