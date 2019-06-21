import {
  Component,
  OnInit,
  Output,
  ContentChildren,
  QueryList
} from "@angular/core";
import { ItemCaseListDirective } from "./item-case-list.directive";

@Component({
  selector: "app-case-list",
  templateUrl: "./case-list.component.html",
  styleUrls: ["./case-list.component.scss"]
})
export class CaseListComponent implements OnInit {
  panelOpenState = false;
  @ContentChildren(ItemCaseListDirective) items: QueryList<
    ItemCaseListDirective
  >;

  constructor() {}
  ngOnInit() {}
}
