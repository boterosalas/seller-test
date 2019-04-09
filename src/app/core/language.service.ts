import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export const AVAILABLE_LENGUAGES = [
        {
          name: 'Español',
          id: 'es'
        },
        {
          name: 'Inglés',
          id: 'en'
        }
      ];

@Injectable()
export class LanguageService {

    lenguage$ = new BehaviorSubject('es');

    constructor() {

    }
};