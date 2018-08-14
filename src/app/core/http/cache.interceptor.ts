import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

import { HttpCacheService } from './http-cache.service';

/**
 * Caches HTTP requests.
 * Use ExtendedHttpClient fluent API to configure caching for each request.
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  private forceUpdate = false;

  constructor(private httpCacheService: HttpCacheService) { }

  /**
   * Configura las opciones del interceptor.
   * 
   * @param {{update: boolean}} options Si es true, obliga a realizar una solicitud y actualiza
   * la entrada de la memoria caché.
   * @return {CacheInterceptor} La instancia configurada.
   */
  configure(options?: { update?: boolean } | null): CacheInterceptor {
    const instance = new CacheInterceptor(this.httpCacheService);
    if (options && options.update) {
      instance.forceUpdate = true;
    }
    return instance;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable((subscriber: Subscriber<HttpEvent<any>>) => {
      const cachedData = this.forceUpdate ? null : this.httpCacheService.getCacheData(request.urlWithParams);
      if (cachedData !== null) {
        // Crea una nueva respuesta para evitar los efectos secundarios,
        subscriber.next(new HttpResponse(cachedData as Object));
        subscriber.complete();
      } else {
        next.handle(request)
          .subscribe(
            event => {
              if (event instanceof HttpResponse) {
                this.httpCacheService.setCacheData(request.urlWithParams, event);
              }
              subscriber.next(event);
            },
            error => subscriber.error(error),
            () => subscriber.complete()
          );
      }
    });
  }

}
