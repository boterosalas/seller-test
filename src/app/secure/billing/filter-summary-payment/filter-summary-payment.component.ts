import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
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
  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;

  _stateSideNavOrder = false;
  public filterBillingSummary: FormGroup;
  @Input() set stateSideNavOrder(value: boolean) {
    this.sidenavSearchOrder.toggle();
  }

  @Input() informationToForm: any;

  constructor() { }

  ngOnInit() {
    this.createFormControls();
  }

  createFormControls() {
    this.filterBillingSummary = new FormGroup({
      date: new FormControl(''),
      numberOrder: new FormControl('')
    });
  }

  date = new FormControl(moment());

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

}
