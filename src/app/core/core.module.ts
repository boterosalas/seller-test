import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LOCALE_ID, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';
import { LoadingComponent, LoadingService, ModalComponent, ModalService } from '@core/global';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';

import { AwsUtil, CognitoUtil, DynamoDBService, UserLoginService, UserParametersService, UserRegistrationService } from './aws-cognito';
import { AuthInterceptor } from './http/auth.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { EndpointService } from './http/endpoint.service';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { HttpCacheService } from './http/http-cache.service';
import { HttpService } from './http/http.service';
import { ShellModule } from './shell/shell.module';
import { RouteReusableStrategy } from './util/route-reusable-strategy';
import { DialogTokenExpiredComponent } from './http/dialog-token-expired/dialog-token-expired';
import { LanguageService } from './language.service';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  decimal: ',',
  precision: 0,
  prefix: '$ ',
  suffix: '',
  thousands: '.'
};

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ShellModule,
    RouterModule,
  ],
  declarations: [
    LoadingComponent,
    ModalComponent,
    DialogTokenExpiredComponent
  ],
  exports: [
    LoadingComponent,
    ModalComponent,
    DialogTokenExpiredComponent
  ],
  entryComponents: [
    ModalComponent,
    DialogTokenExpiredComponent
  ],
  providers: [
    HttpCacheService,
    AuthInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    LanguageService,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    },
    EndpointService,
    LoadingService,
    ModalService,
    CognitoUtil,
    AwsUtil,
    DynamoDBService,
    UserRegistrationService,
    UserLoginService,
    UserParametersService,
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Impide que se vuelva importar el módulo Core en un lugar diferente de AppModule.
    if (parentModule) {
      throw new Error(`${parentModule} ya ha sido cargado. Importar el módulo Core en el AppModule solamente.`);
    }
  }

}
