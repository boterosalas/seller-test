import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList
} from '@angular/core';
import { ItemDropDownListDirective } from './content-drop-down-list.directive';

@Component({
  selector: 'app-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss']
})
export class DropDownListComponent implements OnInit {
  @Input() data: Array<any> = new Array();

  @Input() options: Array<any>;

  @Input() configurations: Array<ColumnConfiguration>;

  @ContentChildren(ItemDropDownListDirective)
  items: QueryList<ItemDropDownListDirective>;

  constructor() {
    this.data = [];
    this.options = [];
  }
  ngOnInit() { }
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
