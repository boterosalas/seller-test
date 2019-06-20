import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[itemCaseList]"
})
export class ContentDropDownBoxDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
