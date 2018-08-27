import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { SharedModule } from '@shared/shared.module';

import { ErrorPageComponent } from './error-page.component';


@NgModule({
  imports: [
    RouterModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [
    ErrorPageComponent,
  ],
  providers: [
    EventEmitterOrders,
    ShellComponent,
    ComponentsService
  ]
})

export class ErrorModule {
}
