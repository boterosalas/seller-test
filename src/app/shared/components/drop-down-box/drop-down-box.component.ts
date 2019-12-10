import {
  Component,
  ContentChildren,
  QueryList,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { ContentDropDownBoxDirective } from './content-drop-down-box.directive';
import { IData } from './models/data.model';

@Component({
  selector: 'app-drop-down-box',
  templateUrl: './drop-down-box.component.html',
  styleUrls: ['./drop-down-box.component.scss']
})
export class DropDownBoxComponent {
  @ContentChildren(ContentDropDownBoxDirective)
  items: QueryList<ContentDropDownBoxDirective>;

  @Input() isOpen: boolean;

  @Input() data: IData;

  @Input() read;

  @Input() index;

  @Output() opened = new EventEmitter();

  panelOpenState = false;
}
