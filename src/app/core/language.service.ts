import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { distinctUntilChanged } from "rxjs/operators";
import { MatSnackBar } from "@angular/material";
import { LoadingService } from "./global";

export const AVAILABLE_LANGUAGES = [
        {
          id: 'Es'
        },
        {
          id: 'En'
        }
      ];

@Injectable()
export class LanguageService {

    lenguage$ = new BehaviorSubject(null);
    esData;
    enData;

    constructor(private http: HttpClient,
      private snackBar: MatSnackBar,
      private loadingService: LoadingService) {
      this.http.get('./assets/locale/es.json').subscribe(data => {
        this.esData = data;
        this.http.get('./assets/locale/en.json').subscribe(dataEn => {
          this.enData = dataEn;
          this.setLanguage('Es');
        });
      });
    }

    setLanguage(languageId: string) {
      this.loadingService.viewProgressBar();
      const language = AVAILABLE_LANGUAGES.find(lang => lang.id === languageId);
      !!language && this.lenguage$.next(language.id);
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

    getValue(key: string): string {
      const properties = key.split('.');
      const val = this.lenguage$.getValue();
      const value = properties.reduce((past, current) => {
        return past[current];
      }, (val === 'Es' ? this.esData : this.enData));
      return !!value ? value : key;
    }
}