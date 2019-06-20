import { Component, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material";

@Component({
  selector: "app-list-of-case",
  templateUrl: "./list-of-case.component.html",
  styleUrls: ["./list-of-case.component.scss"]
})
export class ListOfCaseComponent {
  filter: boolean;

  toggleFilter(stateFilter: boolean) {
    this.filter = stateFilter;
    console.log(this.filter);
  }
}
