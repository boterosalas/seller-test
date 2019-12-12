import { Injectable } from '@angular/core';
import { ConfigurationActions, ConfigurationState } from './configuration';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { CoreState } from './reducers';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private store: Store<CoreState>) { }

  public changeLanguage(language: string): void {
    this.store.dispatch(new ConfigurationActions.ChangeLanguage(language));
  }

  public getStateConfiguration(): Observable<ConfigurationState> {
    return this.store.pipe(
      select(
        (state: CoreState): any => state.appConfiguration
      )
    );
  }
}
