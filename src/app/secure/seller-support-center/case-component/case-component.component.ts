import { Component, ViewChild } from "@angular/core";
import {trigger, state, style, transition, animate} from '@angular/animations';


@Component({
  selector: "app-case-component",
  templateUrl: "./case-component.component.html",
  styleUrls: ["./case-component.component.scss"],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})

export class CaseComponentComponent {

  menuState: string;
  filter: boolean;

  constructor() { }

  ngOnInit(): void {
  this.toggleFilter(this.filter);
  }

  toggleFilter(stateFilter: boolean){

    this.filter = stateFilter;
    this.menuState = stateFilter ? 'in' : 'out';
    console.log(this.filter, this.menuState);
  }
}
