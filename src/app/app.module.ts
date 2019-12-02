import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeModule } from '@app/public/home.module';
import { SecureModule } from '@app/secure/secure.module';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes.routing';
import { MatPaginatorI18nService } from './shared/services/mat-paginator-i18n.service';
import { MatPaginatorIntl } from '@angular/material';

@NgModule({
 declarations: [
   AppComponent
 ],
 imports: [
   BrowserModule.withServerTransition({appId: 'serverApp'}),
   BrowserAnimationsModule,
   CoreModule,
   SharedModule,
   HomeModule,
   SecureModule,
   AppRoutingModule
 ],
 providers: [{
  provide: MatPaginatorIntl,
  useClass: MatPaginatorI18nService,
 }],
 bootstrap: [AppComponent]
})

export class AppModule {
}
