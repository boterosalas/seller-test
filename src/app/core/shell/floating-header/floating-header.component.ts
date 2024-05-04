import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-floating-header',
  templateUrl: './floating-header.component.html',
  styleUrls: ['./floating-header.component.scss']
})
export class FloatingHeaderComponent implements OnInit {
  menuOpened: number = 0;

  constructor() { }

  ngOnInit() {
  }

  openMenu(menu: number) {
    if (this.menuOpened === menu) {
      this.menuOpened = 0;
      return;
    }
    this.menuOpened = menu;
  }

}
