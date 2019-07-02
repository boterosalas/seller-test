import { Component, OnInit, EventEmitter, ViewChild, Output, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Filter } from './models/Filter';

@Component({
  selector: "app-case-filter",
  templateUrl: "./case-filter.component.html",
  styleUrls: ["./case-filter.component.scss"]
})
export class CaseFilterComponent implements OnInit {

  filter: Filter = {
    CaseNumber: '',
    OrderNumber: '',
    ReasonPQR: '',
    Status: [],
    DateInit: '', //   dd/mm/yyyy
    DateEnd: '' //   dd/mm/yyyy
  };

  @ViewChild('sidenavfilter') sideFilter: MatSidenav;
  @Output() eventFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() stateFilter: boolean;
  @Output() eventSubmitFilter: EventEmitter<any> = new EventEmitter<any>();

  @Input() options;
  @ViewChild('filterForm') filterForm: NgForm;
  @ViewChild('dateInitial') dateInitial;
  @ViewChild('dateFinal') dateFinal;

  public regexNoSpaces = /^((?! \s+|\s+$).)*$/;
  public rangeDays = 14;
  public milisecondsRangeDays = 1000 * 60 * 60 * 24 * this.rangeDays;
  public rangeDateMax;
  public rangeError = false;

  constructor() {
    this.options = [];
  }

  ngOnInit() {
    this.sideFilter.toggle();
    this.cleanFilter();
  }

  toggleFilter() {
    this.cleanFilter();
    this.eventFilter.emit(!this.stateFilter);
  }

  submitFilter() {
    this.eventFilter.emit(!this.stateFilter);
    this.eventSubmitFilter.emit(this.filter);
    this.cleanFilter();
  }
  cleanFilter() {
    this.filterForm.reset();
  }
  openDateInitial() {
    this.dateInitial.open();
  }
  openDateFinal() {
    this.dateFinal.open();
  }
}
