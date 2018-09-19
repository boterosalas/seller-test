import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

/**
 * Una estrategia reutilización de rutas, para permitir rutas explcitas.
 * Usado como una solución para https://github.com/angular/angular/issues/18374.
 * Para reutilizar una ruta determinada, añadir 'data: { reuse: true }' a la definición de la ruta.
 */
export class RouteReusableStrategy extends RouteReuseStrategy {

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle | null): void { }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return (future.routeConfig === curr.routeConfig) || future.data.reuse;
  }

}
