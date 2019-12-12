import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
// import { LanguageService } from './language.service';
import { BehaviorSubject, Subscription } from 'rxjs';
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
  ngOnDestroy(): void {
    !!this.subs && this.subs.forEach(sub => {
      !!sub && sub.unsubscribe();
    });
  }

  langs: string[];
  form: FormGroup;
  subs: Subscription[] = [];
  lang = 'ES';

  constructor(private translate: SelectLanguageService, private fb: FormBuilder, private dateAdapter: DateAdapter<Date>, private languageService: TranslateService, private storeService: StoreService) {
    this.form = this.fb.group({
      lang: ['']
    });
    this.langs = this.translate.getLangs();
    this.setLanguegeCurrent();
    const subsLang = this.translate.language$.subscribe(val => {
      if (localStorage.getItem('culture_current')) {
        const languageCurrent = localStorage.getItem('culture_current');
        this.lang = languageCurrent;
        this.setLocalStorageCulture(val);
      } else {
        this.lang = val;
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

  getLang() {
    return this.form.get('lang') as FormControl;
  }

  ngOnInit() {
    if (localStorage.getItem('culture_current')) {
      const langCurrent = localStorage.getItem('culture_current');
      this.lang = localStorage.getItem('culture_current');
      if (this.form && this.form.controls['lang']) {
        this.form.controls['lang'].setValue(langCurrent);
      }
    }
    this.languageService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event['lang'];
      if (this.form && this.form.controls['lang']) {
        this.form.controls['lang'].setValue(event['lang']);
      }
    });
  }

  /**
   * Metodo para retornar la Palabra EN para pintarla ya que el flag aparece en US.
   *
   * @param {String} lang
   * @returns
   * @memberof SelectLanguageComponent
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

}
