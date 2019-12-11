import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-drop-down-list-header",
  templateUrl: "./drop-down-list-header.component.html",
  styleUrls: ["./drop-down-list-header.component.scss"]
})
export class DropDownListHeaderComponent implements OnInit {
  @Input() configurations: Array<Configuration>;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.configurations;
    debugger
  }
}

export interface Configuration {
  name: string;
  displayName: String;
  xs?: number; //No implemented
  sm?: number; //No implemented
  md?: number;
  lg?: number; //No implemented
  xl?: number; //No implemented
}
