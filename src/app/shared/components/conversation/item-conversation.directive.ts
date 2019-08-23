import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[itemConversation]"
})
export class ItemConversationDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
