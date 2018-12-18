import { Component, OnInit } from '@angular/core';
import { BillingOrdersService, BillingOrders } from './billing-orders.service';
import { Logger } from '@core/util/logger.service';

const log = new Logger('BillingOrderComponent');

@Component({
    selector: 'app-billing-orders',
    styleUrls: ['billing-orders.component.scss'],
    templateUrl: 'billing-orders.component.html'
})

export class BillingOrderComponent implements OnInit {
    sellerData: any;
    billingOrdersSeller: BillingOrders[] = [];
    constructor(
        private billingOrdersService: BillingOrdersService
    ) { }
    ngOnInit() {
    }

    public chargeBillingOrders(order: number): void {
        this.billingOrdersService.getBillingOrders(order).subscribe(data => {
            if (data) {
                this.billingOrdersSeller = data as BillingOrders[];
            }
        }, error => {
            log.error('Error al obtener los acuerdos:', error);
        });
    }
    public getPDF(model: any): void {
        this.billingOrdersService.getPDFOrders().subscribe(data => {
        }, error => {
            log.error('Error al obtener los acuerdos:', error);
        });
    }


}
