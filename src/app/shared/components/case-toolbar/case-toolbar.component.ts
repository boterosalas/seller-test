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

  @Input() isAdmin = false;

  @Output() changePagination = new EventEmitter();

  @Output() toggleFilter = new EventEmitter();

  isHandset$: Observable<boolean>;

  stateFilter = false;

  constructor(private breakpointObserver: BreakpointObserver, public translateService: TranslateService) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
  }

  ngOnInit() {
    this.paginator.page.subscribe(pagination =>
      this.changePagination.emit(pagination)
    );
  }

  onToggleFilter() {
    this.toggleFilter.emit(!this.stateFilter);
  }
}
