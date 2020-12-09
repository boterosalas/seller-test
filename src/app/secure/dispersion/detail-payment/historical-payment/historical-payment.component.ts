import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-historical-payment',
  templateUrl: './historical-payment.component.html',
  styleUrls: ['./historical-payment.component.scss']
})
export class HistoricalPaymentComponent implements OnInit {

  @Input() sellerData: any;

  public displayedColumns = [
    'datePay',
    'idPayonner',
    'order',
    'seller',
    'description',
    'sale',
    'comission',
    'totalToPay',
  ];

  constructor() { }

  ngOnInit() {
    console.log(1, this.sellerData);

  }

}
