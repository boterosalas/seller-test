// import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';

import { effects } from './effects';
export { CoreState } from './reducers';

@NgModule({
  imports: [
    StoreModule.forRoot(CoreReducers),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
  ],
  declarations: [],
  exports: [StoreModule],
  providers: []
})
export class CoreStoreModule { }
