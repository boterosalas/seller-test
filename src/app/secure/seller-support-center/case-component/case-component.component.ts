import { Component } from "@angular/core";

@Component({
  selector: "app-case-component",
  templateUrl: "./case-component.component.html",
  styleUrls: ["./case-component.component.scss"]
})

export class CaseComponentComponent {

  filter: boolean;

  openFilter(stateFilter: boolean){

    this.filter = stateFilter;
    console.log(this.filter);
  }
}
