import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { LanguageService } from './Language.service';
import { BehaviorSubject, Subscription } from 'rxjs';

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
  lang= 'ES';

  constructor(private translate: LanguageService, private fb: FormBuilder) {
    this.form = this.fb.group({
      lang: ['']
    });
    this.langs = this.translate.getLangs();
    this.getLang().setValue(this.translate.getCurrentLanguage());
    const subschange = this.getLang().valueChanges.subscribe(val => {
      val !== this.translate.getCurrentLanguage() && this.translate.setLanguage(val);
    });
    const subsLang = this.translate.language$.subscribe(val => {
      this.getLang().value !== val && this.getLang().setValue(val);
      this.setLocalStorageCulture(val);
    });
    this.subs.push(subsLang, subschange);
  }
  setLocalStorageCulture(culture: string) {
    let userId  = 'current';
    if (localStorage.getItem('userId')) {
       userId = localStorage.getItem('userId');
    }
    if (culture) {
      localStorage.setItem('culture_' + userId, culture);
    } else {
      localStorage.setItem('culture_' + userId, 'es');
    }
  }

  getLang() {
    return this.form.get('lang') as FormControl;
  }

  ngOnInit() {
  }

}
