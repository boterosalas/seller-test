import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { ContentDropDownDetailOrderDirective } from '@app/secure/orders/orders-list/orders-page/component/box-list/content-drop-down-detail-order.directive';
import { Const } from '@app/shared';

@Component({
  selector: 'app-detail-product-multi-ofert',
  templateUrl: './detail-product-multi-ofert.component.html',
  styleUrls: ['./detail-product-multi-ofert.component.scss']
})
export class DetailProductMultiOfertComponent implements OnInit {

  @ContentChildren(ContentDropDownDetailOrderDirective)
  items: QueryList<ContentDropDownDetailOrderDirective>;



  @Input() isOpen: boolean;
  @Input() data: any;
  @Input() index;
  @Output() opened = new EventEmitter();
  @Output() showDetail = new EventEmitter();
  public const = Const;
  public panelOpenState = false;
  public hideStatus: any;

  constructor() { }

  ngOnInit() {
  }

}
