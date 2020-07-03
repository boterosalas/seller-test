import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSidenav, MatDatepicker } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _moment from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM',
  },
  display: {
    dateInput: 'YYYY/MM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-filter-summary-payment',
  templateUrl: './filter-summary-payment.component.html',
  styleUrls: ['./filter-summary-payment.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class FilterSummaryPaymentComponent implements OnInit {



  public dateMax= new Date();
  public orderNumbers = [];
  public _stateSideNavOrder = false;
  public filterBillingSummary: FormGroup;
  public date = new FormControl(moment());

  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;
  @Input() set stateSideNavOrder(value: boolean) {
    this.sidenavSearchOrder.toggle();
  }
  @Input() informationToForm: any;
  @Output() OnGetFilter = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
    this.createFormControls();
  }

  createFormControls() {
    this.filterBillingSummary = new FormGroup({
      date: this.date,
      numberOrder: new FormControl('')
    });
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  filterSummary (form: any) {
    let dateFormt = '';
    if (form) {
      if (form.date) {
        dateFormt = form.date.format('YYYY/MM/DD');
      }
      if (form.numberOrder) {
        let orderList = form.numberOrder;
        orderList = orderList.trim();
        if (orderList.search(',') === -1) {
          this.orderNumbers.push(orderList);
        } else {
          const counter = orderList.split(',');
          counter.forEach(element => {
            if (element) {
              this.orderNumbers.push(element);
            }
          });
        }
      }
    }
    this.OnGetFilter.emit({
      'orderNumbers': this.orderNumbers,
      'filterDate': dateFormt
    });
    this.filterBillingSummary.reset();
    this.orderNumbers = [];
    this.toggleFilterSummaryPayment();
  }

  toggleFilterSummaryPayment() {
    this.sidenavSearchOrder.toggle();
  }

}
