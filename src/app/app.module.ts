import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeModule } from '@app/public';
import { SecureModule } from '@app/secure/secure.module';
import { CoreModule } from '@core/core.module';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes.routing';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserAnimationsModule,
    CoreModule,
    HomeModule,
    SecureModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
