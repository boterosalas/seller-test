import { Directive, Input, ElementRef, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { LanguageService } from '@app/core/translate/language.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[translate]'
})
export class TranslateDirective implements AfterViewInit, OnDestroy {

  key: string;
  subscription: Subscription;

  constructor( private element: ElementRef ,private languageService: LanguageService) {
   }

   ngAfterViewInit() {
    this.getContent();
      this.languageService.lenguage$.pipe(distinctUntilChanged()).subscribe(val => {
        const value = !!this.key && this.languageService.getValue(this.key);
        this.updateContent(value);
      });
   }

   getContent() {
     this.key = this.element.nativeElement.innerHTML;
   }

   updateContent(value: string) {
     this.element.nativeElement.innerHTML = !!value && value;
   }

   ngOnDestroy() {
     !!this.subscription && this.subscription.unsubscribe();
   }

}
