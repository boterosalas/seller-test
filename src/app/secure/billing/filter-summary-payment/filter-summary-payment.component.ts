import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSidenav, MatDatepicker } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// tslint:disable-next-line:no-duplicate-imports
import { Moment} from 'moment';
import moment from 'moment';


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
/**
 * funcion para crear el formulario
 *
 * @memberof FilterSummaryPaymentComponent
 */
createFormControls() {
    this.filterBillingSummary = new FormGroup({
      date: this.date
    });
  }
/**
 * funcion para seleccionar años y mes en el datePicker
 *
 * @param {Moment} normalizedYear
 * @memberof FilterSummaryPaymentComponent
 */
chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }
/**
 * funcion para seleccionar años y mes en el datePicker
 *
 * @param {Moment} normalizedMonth
 * @param {MatDatepicker<Moment>} datepicker
 * @memberof FilterSummaryPaymentComponent
 */
chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
/**
 * filtrar por fecha
 *
 * @param {*} form
 * @memberof FilterSummaryPaymentComponent
 */
filterSummary (form: any) {
    let dateFormt = '';
    if (form) {
      if (form.date) {
        dateFormt = form.date.format('YYYY/MM/DD');
      }
    }
    this.OnGetFilter.emit({
      'filterDate': dateFormt
    });
   this.toggleFilterSummaryPayment();
  }
/**
 * funcion mostrar filter
 *
 * @memberof FilterSummaryPaymentComponent
 */
toggleFilterSummaryPayment() {
    this.sidenavSearchOrder.toggle();
  }
/**
 * funcion para limpiar el formulario
 *
 * @memberof FilterSummaryPaymentComponent
 */
clearForm() {
    this.OnGetFilter.emit({
      'filterDate': moment().format('YYYY/MM/DD')
    });
    this.toggleFilterSummaryPayment();
    this.filterBillingSummary.controls.date.setValue(moment());
  }

}
