import { Route as ngRoute, Routes } from '@angular/router';

import { ShellComponent } from './../shell/shell.component';

/**
 * Proporciona métodos de ayuda para crear rutas.
 */
export class Route {

  /**
   * Crea rutas utilizando el componente de shell
   * 
   * @param routes Las rutas para agregar
   * @return {Route} La nueva ruta usando shell como base.
   */
  static withShell(routes: Routes): ngRoute {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      // Reutilizar instancia de ShellComponent al navegar entre vistas secundarias.
      data: { reuse: true }
    };
  }

}
