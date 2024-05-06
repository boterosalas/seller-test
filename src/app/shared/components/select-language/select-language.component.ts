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
  onLangChange$: Subscription = new Subscription();
  language$: Subscription = new Subscription();
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

  constructor(
    private translate: SelectLanguageService,
    private dateAdapter: DateAdapter<Date>,
    private languageService: TranslateService,
    private storeService: StoreService
  ) {
    this.languages = this.translate.getLangs();
    this.language$ = this.translate.language$.subscribe(val => {
      this.storeService.changeLanguage(val);
    });
  }

  ngOnInit() {
    const langCurrent = localStorage.getItem('culture_current');
    if (langCurrent) {
      this.currentLanguage = langCurrent;
    }
    this.onLangChange$ = this.languageService.onLangChange.subscribe((event: LangChangeEvent) => {
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

  ngOnDestroy(): void {
    this.onLangChange$.unsubscribe();
    this.language$.unsubscribe();
  }

}
