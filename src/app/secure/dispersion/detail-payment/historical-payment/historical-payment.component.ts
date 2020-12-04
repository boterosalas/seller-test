import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-historical-payment',
  templateUrl: './historical-payment.component.html',
  styleUrls: ['./historical-payment.component.scss']
})
export class HistoricalPaymentComponent implements OnInit {

  @Input() sellerData: any;


  constructor() { }

  ngOnInit() {
    console.log(1, this.sellerData);

  }

}
