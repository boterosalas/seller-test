import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material'
@Component({
  selector: 'app-case-filter',
  templateUrl: './case-filter.component.html',
  styleUrls: ['./case-filter.component.scss']
})
export class CaseFilterComponent implements OnInit {

  @ViewChild('sidenavfilter') navFilter: MatSidenav;

  @Input()
  stateFilter: boolean;

  constructor() { }

  ngOnInit() {
  }

  openFilter(){

  }

}
