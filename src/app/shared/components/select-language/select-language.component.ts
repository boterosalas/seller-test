import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
// import { LanguageService } from './language.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SelectLanguageService } from './select-language.service';
import { DateAdapter } from '@angular/material';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

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

  constructor(private translate: SelectLanguageService, private fb: FormBuilder, private dateAdapter: DateAdapter<Date>,   private languageService: TranslateService){
    this.form = this.fb.group({
      lang: ['']
    });
    this.langs = this.translate.getLangs();
    this.getLang().setValue(this.translate.getCurrentLanguage());
    const subschange = this.getLang().valueChanges.subscribe(val => {
      val !== this.translate.getCurrentLanguage() && this.translate.setLanguage(val);
      const languageDatePicker = this.setText(val);
      this.dateAdapter.setLocale(languageDatePicker);
    });
    const subsLang = this.translate.language$.subscribe(val => {
      if (localStorage.getItem('culture_current')) {
        const languageCurrent = localStorage.getItem('culture_current')
        this.getLang().value !== languageCurrent && this.getLang().setValue(languageCurrent);
        this.lang = languageCurrent;
        this.setLocalStorageCulture(val);
      } else {
        this.getLang().value !== val && this.getLang().setValue(val);
        this.lang = val;
        this.setLocalStorageCulture(val);
      }
    });
    this.subs.push(subsLang, subschange);
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

}
