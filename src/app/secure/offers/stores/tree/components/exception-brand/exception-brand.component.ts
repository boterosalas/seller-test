import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exception-brand',
  templateUrl: './exception-brand.component.html',
  styleUrls: ['./exception-brand.component.scss']
})
export class ExceptionBrandComponent implements OnInit {

  displayedColumns = ['brand', 'exception', 'options'];
  dataSource = [
    {exception: 1, brand: 'Hydrogen'},
    {exception: 2, brand: 'Helium'},
    {exception: 3, brand: 'Lithium'},
    {exception: 4, brand: 'Beryllium'},
    {exception: 5, brand: 'Boron'},
    {exception: 6, brand: 'Carbon'},
    {exception: 7, brand: 'Nitrogen'},
    {exception: 8, brand: 'Oxygen'},
    {exception: 9, brand: 'Fluorine'},
    {exception: 10, brand: 'Neon'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
