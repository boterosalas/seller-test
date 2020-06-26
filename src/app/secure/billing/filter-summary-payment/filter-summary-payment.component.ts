import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-filter-summary-payment',
  templateUrl: './filter-summary-payment.component.html',
  styleUrls: ['./filter-summary-payment.component.scss']
})
export class FilterSummaryPaymentComponent implements OnInit {

  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;

  _stateSideNavOrder = false;
  @Input() set stateSideNavOrder(value: boolean) {
    this.sidenavSearchOrder.toggle();
  }

  @Input() informationToForm: any;

  constructor() { }

  ngOnInit() {
  }

}
