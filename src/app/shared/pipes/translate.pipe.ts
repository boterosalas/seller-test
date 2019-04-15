import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { LanguageService } from '../../core/translate/language.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subscribable, Subscription } from 'rxjs';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform, OnDestroy {

  resultValue = new Observable<string>();
  subscription: Subscription;

  constructor(private languageService: LanguageService) {

  }

  transform(value: any, args?: any): any {
    return new Observable((observe) => {
      this.subscription = this.languageService.lenguage$.pipe(distinctUntilChanged()).subscribe(() => {
        observe.next(this.languageService.getValue(value));
      });
    });
  }

  ngOnDestroy() {
    !!this.subscription && this.subscription.unsubscribe();
  }
}
