import { TemplateRef, Directive } from "@angular/core";

@Directive({
  selector: "[itemConversation]"
})
export class ItemConversationDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
