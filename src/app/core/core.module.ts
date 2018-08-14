import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { AuthInterceptor } from './http/auth.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { HttpCacheService } from './http/http-cache.service';
import { HttpService } from './http/http.service';
import { ShellModule } from './shell/shell.module';
import { RouteReusableStrategy } from './util/route-reusable-strategy';

@NgModule({
  imports: [
    CommonModule,
    ShellModule,
    RouterModule
  ],
  declarations: [],
  providers: [
    HttpCacheService,
    AuthInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
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
