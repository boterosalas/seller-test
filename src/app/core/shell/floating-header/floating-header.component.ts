import { Component, OnInit } from '@angular/core';
import { BreakpointService } from '@app/shared/services/breakpoint.service';

@Component({
  selector: 'app-floating-header',
  templateUrl: './floating-header.component.html',
  styleUrls: ['./floating-header.component.scss']
})
export class FloatingHeaderComponent implements OnInit {
  menuOpened: number = 0;

  constructor(
    private breakpointService: BreakpointService
  ) { }

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
