import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appContentDropDownDetailOrderDirective]'
})
export class ContentDropDownDetailOrderDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
