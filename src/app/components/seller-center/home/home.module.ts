/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* our own custom components */
import {MaterialModule} from './../../../core/components/material-components';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home.routing.module';
import {ShellComponent} from '../../../core/shell/shell.component';
import {HttpErrorHandlingService} from '../../../core/http/http-error-handling.service';
import {EndpointService} from '../../../core/http/endpoint.service';
import {UserService} from '../../../core/services/common/user/user.service';
import {OrdersModule} from '../orders/orders-list/orders.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HomeRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OrdersModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    HttpErrorHandlingService,
    EndpointService,
    UserService,
    ShellComponent
  ]
})
export class HomeModule {
}
