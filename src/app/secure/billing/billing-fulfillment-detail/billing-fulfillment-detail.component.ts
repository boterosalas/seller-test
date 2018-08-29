import { Component, OnInit, Input } from '@angular/core';
import { Billing } from '@app/shared';

@Component({
  selector: 'app-billing-fulfillment-detail',
  templateUrl: './billing-fulfillment-detail.component.html',
  styleUrls: ['./billing-fulfillment-detail.component.scss']
})
export class BillingFulfillmentDetailComponent implements OnInit {

  // Información de la factura con concepto de pago "Logística Éxito".
  @Input() data: Billing;

  constructor() { }

  ngOnInit() {
  }

}
