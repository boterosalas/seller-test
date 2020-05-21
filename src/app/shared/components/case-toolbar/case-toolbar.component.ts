import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnInit
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatPaginator, MatPaginatorIntl } from '@angular/material';
import { getDutchPaginatorIntl } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

@Component({
  selector: 'app-case-toolbar',
  templateUrl: './case-toolbar.component.html',
  styleUrls: ['./case-toolbar.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    }
  ]
})
export class CaseToolbarComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() length: number;

  @Input() pageIndex: number;

  @Input() pageSize: number;

  @Input() pageLabel: string;

  @Output() changePagination = new EventEmitter();

  @Output() sellerDataSearch = new EventEmitter();

  @Output() toggleFilter = new EventEmitter();

  isHandset$: Observable<boolean>;

  stateFilter = false;

  isAdmin: boolean;
  constructor(private breakpointObserver: BreakpointObserver, public translateService: TranslateService,
    private emitterSeller?: EventEmitterSeller,
    ) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
      console.log('local: ', localStorage);
      if (localStorage.getItem('typeProfile') && localStorage.getItem('typeProfile') === 'administrator') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
  }

  ngOnInit() {
    this.paginator.page.subscribe(pagination =>
      this.changePagination.emit(pagination)
    );

    this.emitterSeller.eventSearchSeller.subscribe(data => {
      this.sellerDataSearch.emit(data);
    });
  }

  onToggleFilter() {
    this.toggleFilter.emit(!this.stateFilter);
  }
}
