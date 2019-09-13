import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  language$ = new BehaviorSubject(this.translate.currentLang);
 
  constructor(private translate: TranslateService) { 
    console.log('instance'); 
  } 
 
  setLanguage(lang: string) { 
    if (lang !== this.translate.currentLang) { 
      this.translate.use(lang); 
      this.language$.next(lang); 
    } 
  } 
 
  getCurrentLanguage() { 
    return this.translate.currentLang; 
  } 
 
  getLangs() { 
    return this.translate.getLangs(); 
  } 
 
  instant(key: string) { 
    return this.translate.instant(key); 
  } 
}
