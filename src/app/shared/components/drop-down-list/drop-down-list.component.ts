import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-drop-down-list",
  templateUrl: "./drop-down-list.component.html",
  styleUrls: ["./drop-down-list.component.scss"]
})
export class DropDownListComponent implements OnInit {
  @Input() data: Array<any>;

  @Input() configurations: Array<ColumnConfiguration>;

  constructor() {
    this.data = [];
  }

  ngOnInit() {}
}
//columns 12
export interface ColumnConfiguration {
  name: string;
  displayName: String;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}
