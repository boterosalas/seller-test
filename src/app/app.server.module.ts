/* 3rd party components */
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

/* our own custom components */
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }

