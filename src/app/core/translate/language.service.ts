import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { distinctUntilChanged, takeUntil, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { LoadingService } from '../global';


export const AVAILABLE_LANGUAGES = [
  {
    id: 'Es'
  },
  {
    id: 'En'
  }
];

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  lenguage$ = new BehaviorSubject(null);
  esData;
  enData;
  currentLanguage;
  existFiles$ = new BehaviorSubject(null);

  constructor(private http: HttpClient,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService) {
    console.log('me instancio');
    this.getLanguagesFile();
  }

  getLanguagesFile() {
    this.currentLanguage = this.getLanguageLocalStorage();
    if (!this.currentLanguage && !this.lenguage$.getValue()) {
      this.currentLanguage = navigator.language.toString().toLowerCase().includes('es') ? 'Es' : 'En';
    }
    const interval = setInterval(() => {
      if(!this.esData && !this.enData) {
        this.http.get('./assets/locale/es.json', {headers: {'Content-Type':  'application/json'}}).subscribe(data => {
          this.esData = data;
          this.http.get('./assets/locale/en.json', {headers: {'Content-Type':  'application/json'}}).subscribe(dataEn => {
            this.enData = dataEn;
            if (!this.currentLanguage || this.lenguage$.getValue() !== this.currentLanguage) {
              !!this.lenguage$.getValue() ? this.setLanguage(this.lenguage$.getValue()) : this.setLanguage('Es');
            }
          });
        });
      } else {
        clearInterval(interval);
      }
    }, 500);
  }

  setLanguage(languageId: string) {
    this.loadingService.viewProgressBar();
    const language = AVAILABLE_LANGUAGES.find(lang => lang.id === languageId);
    if (!!language) {
      this.lenguage$.next(language.id);
      this.setLanguageLocalSotrage(language.id);
    }
    this.loadingService.closeProgressBar();
    if (languageId === 'Es') {
      this.snackBar.open(`${this.getValue('change_language')} ${this.getValue('spanish')}`, 'Cerrar', {
        duration: 3000,
      });
    } else {
      this.snackBar.open(`${this.getValue('change_language')} ${this.getValue('english')}`, 'Cerrar', {
        duration: 3000,
      });
    }
  }

  /**
   * Metodo que busca dentro de los archivos de lenguaje .json el texto a mostrar
   * @param key Llave para obtener el texto
   */

  getValue(key: string): string {
    key = key.trim();
    key = !!key.includes(' ') ? key.split(' ').join('') : key;
    if (key.includes('menu.') || key.includes('module.')) {
      key = this.capitalizeFirstLetter(key);
    }
    const properties = key.split('.');
    const val = this.lenguage$.getValue();
    try {
      if (this.esData && this.enData) {
        const value = properties.reduce((past, current) => {
          return past[current.trim()];
        }, (val === 'Es' ? this.esData : this.enData));
        return !!value ? value : key;
      } else {
        return key;
      }
    } catch {
      //console.trace();
      console.log(key);
    }
  }

  capitalizeFirstLetter(key: string): string {
    const elements = key.split('.');
    const secondElement = elements[1].charAt(0).toUpperCase() + elements[1].substr(1, elements[1].length).toLowerCase();
    return `${elements[0]}.${secondElement}`;
  }

  private setLanguageLocalSotrage(language: string) {
    localStorage.setItem('Language', language);
  }

  private getLanguageLocalStorage(): string {
    return localStorage.getItem('Language');
  }
}

export class LanguageServiceTest {

  lenguage$ = new BehaviorSubject('Es');
  esData = {};
  enData = {};
  currentLanguage = 'Es';
  existFiles$ = new BehaviorSubject(true);

  constructor() {}
 
  /**
   * Metodo que busca dentro de los archivos de lenguaje .json el texto a mostrar
   * @param key Llave para obtener el texto
   */

  getValue(key: string): string {
    return key;
  }
}

