import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-payments',
  templateUrl: './summary-payments.component.html',
  styleUrls: ['./summary-payments.component.scss']
})
export class SummaryPaymentsComponent implements OnInit {

  public displayedColumns = [
    'check',
    'number_bill',
    'quantity_orders',
    'payment_date',
    'total_discounted_value',
    'total_to_pay'
  ];

  constructor() { }

  ngOnInit() {
  }

}
