import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export const AVAILABLE_LENGUAGES = [
        {
          id: 'Es'
        },
        {
          id: 'En'
        }
      ];

@Injectable()
export class LanguageService {

    lenguage$ = new BehaviorSubject('es');

    constructor() {
    }

    setLenguage(lenguageId: string) {
      const lenguage = AVAILABLE_LENGUAGES.find(leng => leng.id === lenguageId);
      !!lenguage && this.lenguage$.next(lenguage.id);
    }

    getValue(key: string) {

    }
}
