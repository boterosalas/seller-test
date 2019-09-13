import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { LanguageService } from './Language.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent implements OnInit {

  langs: string[]; 
  form: FormGroup;

  constructor(private translate: LanguageService, private fb: FormBuilder) { 
    this.form = this.fb.group({ 
      lang: [''] 
    }); 
    this.langs = this.translate.getLangs(); 
    this.getLang().setValue(this.translate.getCurrentLanguage()); 
    this.getLang().valueChanges.subscribe(val => { 
      console.log('forValueChanges', val); 
      val !== this.translate.getCurrentLanguage() && this.translate.setLanguage(val); 
    }); 
    this.translate.language$.subscribe(val => { 
      console.log('forLangChange', val); 
      this.getLang().value !== val && this.getLang().setValue(val); 
    }); 
  } 
 
  getLang() { 
    return this.form.get('lang') as FormControl; 
  } 
 
  ngOnInit() { 
  } 

}
