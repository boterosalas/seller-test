import { Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';

import { Const } from '@app/shared';
import { ItemDropDownListDirective } from '@app/shared/components/drop-down-list/content-drop-down-list.directive';

@Component({
  selector: 'app-list-product-multi-ofert',
  templateUrl: './list-product-multi-ofert.component.html',
  styleUrls: ['./list-product-multi-ofert.component.scss']
})
export class ListProductMultiOfertComponent implements OnInit {
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
