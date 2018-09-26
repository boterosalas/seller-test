// 3rd party components
import { Component, OnInit } from '@angular/core';
// our own custom components
import { UserLoginService, UserParametersService } from '@app/core';

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

    /**
     * @description crea una instancia del componente.
     * @param {UserLoginService} [userService]
     * @param {UserParametersService} [userParams]
     * @memberof DashboardComponent
     */
    constructor(
        public userService?: UserLoginService,
        public userParams?: UserParametersService
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
        this.orders = {
            all: 1300000,
            pending: 300,
            delivered: 1500,
            expired: 1296700
        };
    }

    /**
     * @description Método que carga los datos de las ventas de los últimos tres meses a parir de la fecha indicada.
     * @memberof DashboardComponent
     */
    private getLastSales(date?: any) {
        this.last_sales = [
            {
                value: 30000000,
                monthName: 'Junio' 
            },
            {
                value: 100000000,
                monthName: 'Agosto'
            },
            {
                value: 90000000,
                monthName: 'Septiembre'
            }
        ];

        this.last_sales = this.parseLastSales(this.last_sales);
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

        last_array[max_index].percent = 100 + '%';

        for (let f = 0; f < last_array.length; f++) {
            if (f !== max_index) {
                last_array[f].percent = ((last_array[f].value / max.value) * 100) + '%';
            }
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
        console.log(month);
        this.getLastSales(new Date(month));
        dp.close();
    }
}
