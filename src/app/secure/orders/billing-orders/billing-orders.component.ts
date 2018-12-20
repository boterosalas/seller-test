import { Component, OnInit } from '@angular/core';
import { BillingOrdersService } from './billing-orders.service';
import { Logger } from '@core/util/logger.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const log = new Logger('BillingOrderComponent');

@Component({
    selector: 'app-billing-orders',
    styleUrls: ['billing-orders.component.scss'],
    templateUrl: 'billing-orders.component.html'
})

export class BillingOrderComponent implements OnInit {
    sellerData: any;
    billingGroup: FormGroup;
    billingOrders: any[];
    keysBilling: any;
    keys: any;
    // billingOrdersSeller: BillingOrders[] = [];
    constructor(
        private billingOrdersService: BillingOrdersService,
        private fb: FormBuilder,
    ) { }
    ngOnInit() {
        // this.billingOrdersSeller = [];
        this.billingGroup = this.fb.group({
            billingOrderCtrl: ['', Validators.required],
        });
        this.billingOrders = [];
        // this.chargeBillingOrders();
    }

    public chargeBillingOrders(): void {
        console.log('idOrder: ', this.billingGroup.controls.billingOrderCtrl.value);
        this.billingOrdersService.getBillingOrders(this.billingGroup.controls.billingOrderCtrl.value).subscribe(result => {
            this.sellerData = result.data;
            console.log('data billin; ', result);
            if (result.data) {
                console.log('result billin en if; ', result);
                this.keysBilling = result.data;
                console.log('this.keysBilling: ', this.keysBilling);
                // this.billingOrdersSeller = data as BillingOrders[];
            }
        });
    }

    public viewPDF(billing: any): void {
       // const link = document.createElement('a');
        // link.href = billing.billUrl;
        window.open(billing.billUrl, '_blank', 'fullscreen=yes, screenTop');
        console.log('billing.bill: ', billing.billUrl);
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // delete link;
    }


}
