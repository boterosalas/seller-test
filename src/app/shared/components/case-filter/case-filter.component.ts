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
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    DateInit: '',
    DateEnd: ''
  };

  value: string;

  @ViewChild('sidenavfilter') sideFilter: MatSidenav;
  @Output() eventFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() stateFilter: boolean;

  @Input() options: any;
  @ViewChild('filterForm') filterForm: NgForm;
  @ViewChild('dateInitial') dateInitial: any;
  @ViewChild('dateFinal') dateFinal: any;

  public regexNoSpaces = /^((?! \s+|\s+$).)*$/;
  public rangeDays = 14;
  public milisecondsRangeDays = 1000 * 60 * 60 * 24 * this.rangeDays;
  public rangeDateMax;
  public rangeError = false;

  // Modelo de ultima respuesta
  public lastPost = [
    {value: 1, name: this.translateService.instant('secure.parametize.support_claims-filter.sac_answer')},
    {value: 2, name: this.translateService.instant('secure.parametize.support_claims-filter.seller_answer')}
  ];

  constructor(private router: Router, private route: ActivatedRoute,
    private formatDate: DatePipe, public translateService: TranslateService) {
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
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
    if (this.value !== undefined) {
      if (this.value !== null) {
        this.filter.Status.push(this.value);
      }
    } else {
      this.filter.Status = [];
    }

    this.eventFilter.emit(!this.stateFilter);
    this.filter.DateInit = this.formatDate.transform(
      this.filter.DateInit,
      'y-MM-d'
    );
    this.filter.DateEnd = this.formatDate.transform(
      this.filter.DateEnd,
      'y-MM-d'
    );

    this.router.navigate(['securehome/seller-center/support-center'], {
      queryParams: this.filter
    });

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
