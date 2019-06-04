import { Directive, Input, ElementRef, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { LanguageService } from '@app/core/translate/language.service';
import { distinctUntilChanged, elementAt } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { debug } from 'util';

@Directive({
  selector: '[I18N]'
})
export class TranslateDirective implements AfterViewInit, OnDestroy {

  subscription: Subscription;

  constructor(private element: ElementRef, private languageService: LanguageService) {
  }

  ngAfterViewInit() {
    this.languageService.lenguage$.pipe(distinctUntilChanged()).subscribe(() => {
      this.translate(this.element);
    });
  }

  translate(el) {
    const existChildNode = !!el && ((!!el.nativeElement && !!el.nativeElement.childNodes && el.nativeElement.childNodes.length > 0) || (!!el.childNodes && el.childNodes.length > 0));
    if (existChildNode) {
      try {
        !!el.nativeElement.childNodes && el.nativeElement.childNodes.forEach(child => {
          this.translate(child);
        });
      } catch {
        !!el.childNodes && el.childNodes.forEach(child => {
          this.translate(child);
        });
        }
      } else {
        const newKey = this.getContent(el);
        const value = this.languageService.getValue(newKey);
        this.updateContent(el, value);
      }
    }

    getContent(element) {
    if (!element.keyTranslate) {
      element.keyTranslate = element.nodeValue;
    }
    return element.keyTranslate;
  }

  updateContent(element, value: string) {
    element.nodeValue = !!value && value;
  }

  ngOnDestroy() {
    !!this.subscription && this.subscription.unsubscribe();
  }

}
