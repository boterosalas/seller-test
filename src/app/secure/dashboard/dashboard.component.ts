import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-component',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public orders: any;

    public last_sales: any;

    public startDate: any;

    constructor() {
        this.orders = {
            all: 0,
            pending: 0,
            delivered: 0,
            expired: 0
        };

        this.last_sales = {
            Mes3: 0,
            Mes2: 0,
            Mes1: 0
        };
    }

    ngOnInit(): void {
        this.getOrdersData();
        this.getLastSales();
    }

    private getOrdersData() {
        this.orders = {
            all: 1300000,
            pending: 300,
            delivered: 1500,
            expired: 1296700
        };
    }

    private getLastSales() {
        this.last_sales = [
            {
                value: 30000000,
                monthName: 'Julio'
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

    public chosenMonthHandler(month: any, dp: any) {
        console.log(month);
        dp.close();
    }
}
