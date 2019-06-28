import { Component, OnInit, ContentChildren, QueryList } from "@angular/core";
import { ItemConversationDirective } from "./item-conversation.directive";

@Component({
  selector: "app-conversation-list",
  templateUrl: "./conversation-list.component.html",
  styleUrls: ["./conversation-list.component.scss"]
})
export class ConversationListComponent implements OnInit {
  @ContentChildren(ItemConversationDirective)
  items: QueryList<ItemConversationDirective>;

  constructor() {}

  ngOnInit() {}
}
