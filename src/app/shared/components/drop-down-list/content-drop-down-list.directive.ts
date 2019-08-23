import { Directive, TemplateRef } from "@angular/core";

@Directive({
  selector: "[itemDropDownList]"
})
export class ItemDropDownListDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
