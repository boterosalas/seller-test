import { Component } from "@angular/core";

@Component({
  selector: "app-case-component",
  templateUrl: "./case-component.component.html",
  styleUrls: ["./case-component.component.scss"]
})
export class CaseComponentComponent {
  openFilter(){
    console.log("Vainas")
  }
}
