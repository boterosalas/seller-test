import {
  Component,
  OnInit,
  Output,
  ContentChildren,
  QueryList, EventEmitter
} from "@angular/core";
import { ContentDropDownBoxDirective } from "./content-drop-down-box.directive";

@Component({
  selector: "app-drop-down-box",
  templateUrl: "./drop-down-box.component.html",
  styleUrls: ["./drop-down-box.component.scss"]
})
export class DropDownBoxComponent implements OnInit {

  panelOpenState = false;
  @ContentChildren(ContentDropDownBoxDirective) items: QueryList<
    ContentDropDownBoxDirective
  >;

  constructor() {}
  ngOnInit() {}

}
