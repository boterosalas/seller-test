import { Component, OnInit, ContentChildren, Input, Output, EventEmitter } from '@angular/core';
import { Const } from '@app/shared';

@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  styleUrls: ['./box-list.component.scss']
})
export class BoxListComponent implements OnInit {

  // @ContentChildren(ContentDropDownBoxDirective)
  // items: QueryList<ContentDropDownBoxDirective>;

  public const = Const;

  @Input() isOpen: boolean;

  @Input() data: any;

  @Input() read;

  @Input() index;

  @Output() opened = new EventEmitter();

  @Output() showDetail = new EventEmitter();

  panelOpenState = false;
  hideStatus: any;


  constructor() { }

  ngOnInit() {
  }

  public getDateWithOutGMT(date: any): any {
    const timezone = new Date().getTimezoneOffset();
    const time = new Date(date).getTime(); // new Date('2019-02-03T00:42:06.177+00:00').getTime();
    return new Date(time + (timezone * 60 * 1000));
  }

}
