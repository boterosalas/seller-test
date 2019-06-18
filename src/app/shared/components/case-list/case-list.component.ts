import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {
  panelOpenState = false;

  constructor() { }

  ngOnInit() {
  }

}
