import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

export interface Calification {
  calification: string;
  date_calificate: string;
  date_issued: string;
}

const ELEMENT_DATA: Calification[] = [
  {calification: 'Excelente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Excelente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Excelente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Excelente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Aceptable', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Aceptable', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Aceptable', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Deficiente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Deficiente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Deficiente', date_calificate: '12-12-12', date_issued: '12-12-12'},
];

@Component({
  selector: 'app-seller-rating',
  templateUrl: './seller-rating.component.html',
  styleUrls: ['./seller-rating.component.scss']
})
export class SellerRatingComponent implements OnInit {

  displayedColumns: string[] = ['calification', 'date_calificate', 'date_issued', 'downloadPDF', 'apelation'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor() { }

  ngOnInit() {
  }

}
