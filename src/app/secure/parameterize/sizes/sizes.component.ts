import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  displayedColumns = ['Name', 'State', 'Actions'];

  dataSource = [
    { Name: 'S', State: true },
    { Name: 'S', State: true },
    { Name: 'S', State: false },
    { Name: 'S', State: false },
    { Name: 'S', State: true }];


  public paginationToken = '{}';
  public limit = 0;
  titleAgreement: any;
  length = 0;
  public pageSize = 50;

  public arrayPosition = [];
  paramsArray: any;
  pageSizeOptions: number[] = [50, 100, 200];
  pageEvent: PageEvent;
  public callOne = true;
  constructor() { }

  ngOnInit() {
  }

}
