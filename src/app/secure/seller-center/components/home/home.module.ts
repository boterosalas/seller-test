/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* our own custom components */
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home.routing.module';
import {OrdersModule} from '../orders/orders-list/orders.module';
import { MaterialModule } from '../material-components';
import { HttpErrorHandlingService } from '../../utils/http/http-error-handling.service';
import { EndpointService } from '../../utils/http/endpoint.service';
import { UserService } from '../../utils/services/common/user/user.service';
import { ShellComponent } from '../../shell/shell.component';



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
