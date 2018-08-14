import 'hammerjs';

import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    AwsUtil,
    CognitoUtil,
    DynamoDBService,
    UserLoginService,
    UserParametersService,
    UserRegistrationService,
} from '@app/shared';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes.routing';
import { HomeModule } from '@app/public';
import { SecureModule } from '@app/secure/secure.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        HomeModule,
        SecureModule,
        AppRoutingModule
    ],
    providers: [
        CognitoUtil,
        AwsUtil,
        DynamoDBService,
        UserRegistrationService,
        UserLoginService,
        UserParametersService,
        { provide: LOCALE_ID, useValue: 'es-CO' }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
