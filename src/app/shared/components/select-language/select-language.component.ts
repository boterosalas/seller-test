import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectLanguageService } from './select-language.service';
import { DateAdapter } from '@angular/material';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { StoreService } from '@app/store/store.service';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent implements OnInit, OnDestroy {

  languages: string[];
  subs: Subscription[] = [];
  currentLanguage = 'ES';
  languagesDictionary = {
    US: {
      US: 'English',
      ES: 'Spanish'
    },
    ES: {
      US: 'Inglés',
      ES: 'Español'
    }
  }

  constructor(private translate: SelectLanguageService, private dateAdapter: DateAdapter<Date>, private languageService: TranslateService, private storeService: StoreService) {
    this.languages = this.translate.getLangs();
    console.log({ languages: this.languages });
    this.setLanguegeCurrent();
    const subsLang = this.translate.language$.subscribe(val => {
      if (localStorage.getItem('culture_current')) {
        const languageCurrent = localStorage.getItem('culture_current');
        this.currentLanguage = languageCurrent;
        this.setLocalStorageCulture(val);
      } else {
        this.currentLanguage = val;
        this.setLocalStorageCulture(val);
      }
      storeService.changeLanguage(val);
    });
    this.subs.push(subsLang);
  }

  /**
   * Metodo para setear el idioma en el localstorage
   *
   * @param {string} culture
   * @memberof SelectLanguageComponent
   */
  setLocalStorageCulture(culture: string) {
    let userId = 'current';
    if (localStorage.getItem('userId')) {
      userId = localStorage.getItem('userId');
    }
    if (culture) {
      localStorage.setItem('culture_' + userId, culture);
      localStorage.setItem('culture_current', culture);
    } else {
      localStorage.setItem('culture_' + userId, 'es');
      localStorage.setItem('culture_current', 'es');
    }
  }

  ngOnInit() {
    if (localStorage.getItem('culture_current')) {
      const langCurrent = localStorage.getItem('culture_current');
      this.currentLanguage = localStorage.getItem('culture_current');
    }
    this.languageService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLanguage = event['lang'];
    });
  }

  /**
   * Metodo para retornar la Palabra EN para pintarla ya que el flag aparece en US.
   */
  setText(lang: String) {
    if (lang === 'US') {
      return 'EN';
    } else {
      return lang;
    }
  }

  select(lang: any) {
    this.translate.setLanguage(lang);
    const languageDatePicker = this.setText(lang);
    this.dateAdapter.setLocale(languageDatePicker);
  }

  setLanguegeCurrent() {
    if (localStorage.getItem('culture_current')) {
      const currentLanguege = localStorage.getItem('culture_current');
      this.translate.setLanguage(currentLanguege);
    } else {
      this.translate.setLanguage(this.translate.getCurrentLanguage());
    }
  }

  ngOnDestroy(): void {
    !!this.subs && this.subs.forEach(sub => {
      !!sub && sub.unsubscribe();
    });
  }

}
