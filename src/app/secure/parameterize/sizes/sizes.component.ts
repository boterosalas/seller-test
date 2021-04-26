import { Component, OnInit } from '@angular/core';

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


  constructor() { }

  ngOnInit() {
  }

}
