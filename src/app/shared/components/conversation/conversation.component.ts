import { Component, OnInit, ContentChildren, QueryList } from '@angular/core';
import { ItemConversationDirective } from './item-conversation.directive';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @ContentChildren(ItemConversationDirective)
  items: QueryList<ItemConversationDirective>;

  constructor() {}

  ngOnInit() {}
}
