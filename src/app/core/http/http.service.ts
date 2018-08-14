import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';

// HttpClient se declara en un módulo reexportado, por lo que debemos ampliar 
// el módulo original para que funcione correctamente.
// Más info: https://github.com/Microsoft/TypeScript/issues/13897
declare module '@angular/common/http/src/client' {

  // Métodos personalizados los cuales se implementan en la clase 'HttpService'.
  export interface HttpClient {

    /**
     * Habilita el almacenamiento en caché para esta solicitud.
     * 
     * @param {boolean} forceUpdate Obliga a realizar la solicitud y actualiza la entrada de caché.
     * @return {HttpClient} La nueva instancia.
     */
    cache(forceUpdate?: boolean): HttpClient;

    /**
     * Omite el controlador de errores predeterminado para esta solicitud.
     * 
     * @return {HttpClient} La nueva instancia.
     */
    skipErrorHandler(): HttpClient;

    /**
     * No agrega el token de autenticación a la solicitud.
     * 
     * @return {HttpClient} La nueva instancia.
     */
    disableAuth(): HttpClient;

  }

}

// @angular/common/http/src/interceptor: permite encadenar interceptores.
class HttpInterceptorHandler implements HttpHandler {

  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) { }

  handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(request, this.next);
  }

}

/**
 * Permite anular interceptores dinámicos predeterminados que se pueden deshabilitar con la extensión HTTPService
 * a excepción de las necesidades muy específicas, es mejor configurar estos interceptores directamente en el
 * constructor de abajo para una mejor legibilidad.
 *
 * Para los interceptores estáticos que siempre deben estar habilitados, utilice HTTP_INTERCEPTORS.
 */
export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>('HTTP_DYNAMIC_INTERCEPTORS');

/**
 * Amplía HttpClient con configuración por solicitud mediante interceptores dinámicos.
 */
@Injectable()
export class HttpService extends HttpClient {

  constructor(
    private httpHandler: HttpHandler,
    private injector: Injector,
    @Optional() @Inject(HTTP_DYNAMIC_INTERCEPTORS) private interceptors: HttpInterceptor[] = []
  ) {
    super(httpHandler);

    if (!this.interceptors) {
      // Configurar los interceptores predeterminados que se pueden deshabilitar.
      this.interceptors = [
        this.injector.get(AuthInterceptor),
        this.injector.get(ErrorHandlerInterceptor)
      ];
    }
  }

  cache(forceUpdate?: boolean): HttpClient {
    const cacheInterceptor = this.injector.get(CacheInterceptor).configure({ update: forceUpdate });
    return this.addInterceptor(cacheInterceptor);
  }

  skipErrorHandler(): HttpClient {
    return this.removeInterceptor(ErrorHandlerInterceptor);
  }

  disableAuth(): HttpClient {
    return this.removeInterceptor(AuthInterceptor);
  }

  // Remplaza el método original para cablear los nuevos interceptors.
  request(method?: any, url?: any, options?: any): any {
    const handler = this.interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor),
      this.httpHandler
    );
    return new HttpClient(handler).request(method, url, options);
  }

  private removeInterceptor(interceptorType: Function): HttpService {
    return new HttpService(
      this.httpHandler,
      this.injector,
      this.interceptors.filter(i => !(i instanceof interceptorType))
    );
  }

  private addInterceptor(interceptor: HttpInterceptor): HttpService {
    return new HttpService(
      this.httpHandler,
      this.injector,
      this.interceptors.concat([interceptor])
    );
  }

}
