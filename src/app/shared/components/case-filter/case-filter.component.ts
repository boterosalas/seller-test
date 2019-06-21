import { Component, OnInit, EventEmitter, ViewChild, Output, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: "app-case-filter",
  templateUrl: "./case-filter.component.html",
  styleUrls: ["./case-filter.component.scss"],
})
export class CaseFilterComponent implements OnInit {

  @Output()
  eventFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  stateFilter: boolean;

  @ViewChild('sidenavfilter') sideFilter: MatSidenav;

  menuState: string;

  constructor() { }

  ngOnInit() {
    this.sideFilter.toggle();
  }

  toggleFilter() {
    this.eventFilter.emit(!this.stateFilter);
  }

}
