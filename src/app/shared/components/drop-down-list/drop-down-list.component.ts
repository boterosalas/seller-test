import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-drop-down-list",
  templateUrl: "./drop-down-list.component.html",
  styleUrls: ["./drop-down-list.component.scss"]
})
export class DropDownListComponent implements OnInit {
  @Input() data: Array<any> = new Array();

  @Input() configurations: Array<ColumnConfiguration>;

  ngOnInit() {}
}

export interface ColumnConfiguration {
  name: string;
  displayName: String;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}
