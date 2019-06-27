import {
  Component,
  OnInit,
  ContentChildren,
  QueryList,
  Input
} from "@angular/core";
import { ContentDropDownBoxDirective } from "./content-drop-down-box.directive";

@Component({
  selector: "app-drop-down-box",
  templateUrl: "./drop-down-box.component.html",
  styleUrls: ["./drop-down-box.component.scss"]
})
export class DropDownBoxComponent implements OnInit {
  @ContentChildren(ContentDropDownBoxDirective)
  items: QueryList<ContentDropDownBoxDirective>;

  panelOpenState = false;

  @Input() data: Array<any>;

  ngOnInit() {

  }
}

export interface Data {
  id: string;
  orderNumber: string;
  reasonPQR: string;
  reasonDetail: string;
  createDate: string;
  status: string;
}
