import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tab-product',
  templateUrl: './tab-product.component.html',
  styleUrls: ['./tab-product.component.scss']
})
export class TabProductComponent implements OnInit, AfterViewInit {


  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    const principalToolbar = document.getElementsByClassName('mat-tab-label');
    principalToolbar[0].classList.add('mat-tab-label-size');
    principalToolbar[1].classList.add('mat-tab-label-size');
  }

}
