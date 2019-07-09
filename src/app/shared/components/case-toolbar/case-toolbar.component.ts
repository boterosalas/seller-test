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

@Component({
  selector: 'app-case-toolbar',
  templateUrl: './case-toolbar.component.html',
  styleUrls: ['./case-toolbar.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }]
})
export class CaseToolbarComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() length: number;

  @Input() pageIndex: number;

  @Input() pageSize: number;

  @Output() changePagination = new EventEmitter();

  @Output() toggleFilter = new EventEmitter();

  isHandset$: Observable<boolean>;

  stateFilter = false;

  constructor(private breakpointObserver: BreakpointObserver) {
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
