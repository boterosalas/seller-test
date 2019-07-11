import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  Output,
  Input
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSidenav } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Filter } from './models/Filter';

@Component({
  selector: 'app-case-filter',
  templateUrl: './case-filter.component.html',
  styleUrls: ['./case-filter.component.scss'],
  providers: [DatePipe]
})
export class CaseFilterComponent implements OnInit {
  filter: Filter = {
    CaseNumber: '',
    OrderNumber: null,
    ReasonPQR: null,
    Status: [],
    DateInit: '', //   dd/mm/yyyy
    DateEnd: '' //   dd/mm/yyyy
  };

  value: string;

  @ViewChild('sidenavfilter') sideFilter: MatSidenav;
  @Output() eventFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() stateFilter: boolean;
  @Output() eventSubmitFilter: EventEmitter<any> = new EventEmitter<any>();

  @Input() options: any;
  @ViewChild('filterForm') filterForm: NgForm;
  @ViewChild('dateInitial') dateInitial: any;
  @ViewChild('dateFinal') dateFinal: any;

  public regexNoSpaces = /^((?! \s+|\s+$).)*$/;
  public rangeDays = 14;
  public milisecondsRangeDays = 1000 * 60 * 60 * 24 * this.rangeDays;
  public rangeDateMax;
  public rangeError = false;

  constructor(private datePipe: DatePipe) {
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
    if (this.value !== undefined) {
      if (this.value !== null) {
        this.filter.Status.push(this.value);
      }
    } else {
      this.filter.Status = [];
    }

    this.eventFilter.emit(!this.stateFilter);
    this.filter.DateInit = this.datePipe.transform(
      this.filter.DateInit,
      'MM-d-y'
    );
    this.filter.DateEnd = this.datePipe.transform(
      this.filter.DateEnd,
      'MM-d-y'
    );
    this.eventSubmitFilter.emit(this.filter);

    this.value = '';
    this.filter.Status.pop();
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
