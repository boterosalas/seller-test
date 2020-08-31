import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList
} from '@angular/core';

import { Const } from '@app/shared';
import { ItemDropDownListDirective } from '@app/shared/components/drop-down-list/content-drop-down-list.directive';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {

  @Input() data: Array<any> = new Array();

  public const = Const;

  @ContentChildren(ItemDropDownListDirective)
  items: QueryList<ItemDropDownListDirective>;

  constructor() {
    this.data = [];
   }

  ngOnInit() {
  }

}
