import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[itemCaseList]"
})
export class ItemCaseListDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
