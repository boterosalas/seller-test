import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/translate/language.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  resultValue = new Observable<string>();

  constructor(private languageService: LanguageService) {

  }
  
  transform(value: any, args?: any): any {
    return new Observable((observe) => {
      this.languageService.lenguage$.pipe(distinctUntilChanged()).subscribe(() => {
        observe.next(this.languageService.getValue(value));
      });
    });
  }

}
