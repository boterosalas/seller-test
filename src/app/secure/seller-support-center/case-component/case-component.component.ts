import { Component, ViewChild } from "@angular/core";
import {MatSidenav} from '@angular/material';

@Component({
  selector: "app-case-component",
  templateUrl: "./case-component.component.html",
  styleUrls: ["./case-component.component.scss"]
})

export class CaseComponentComponent {

  filter: boolean;

  toggleFilter(stateFilter: boolean){
    this.filter = stateFilter;
    console.log(this.filter);
  }
}
