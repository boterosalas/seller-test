import { Component, Output, EventEmitter, Input, ViewChild, OnInit  } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatDialog, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { getDutchPaginatorIntl } from '@shared/services';

@Component({
  selector: "app-case-toolbar",
  templateUrl: "./case-toolbar.component.html",
  styleUrls: ["./case-toolbar.component.scss"],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class CaseToolbarComponent implements OnInit{

  @Output() eventFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  stateFilter: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() totalPages;
  @Input() pages;
  @Input() pageSize;
  // Evento que permite saber cuando el usuario cambia el número de registros por pagina
  @Output() OnChangeSizeCaseList = new EventEmitter<object>();

  ngOnInit(){
    this.paginator.page.subscribe(this.changeSizeCaseList);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) { }

  toggleFilter() {
    this.eventFilter.emit(!this.stateFilter);
  }

  changeSizeCaseList(event) {
    this.OnChangeSizeCaseList.emit(event);
  }

}
