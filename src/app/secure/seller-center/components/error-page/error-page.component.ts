/* 3rd party components */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShellComponent } from '../../shell/shell.component';
import { RoutesConst } from '../../../../shared/util/routes.constants';

/* our own custom components */


/**
 * Component
 */
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})

/**
 * Componente para visualizar la pestaña de error, esta pagina se visualiza cuando el usuario ingresa una url erronea.
 */
export class ErrorPageComponent implements OnInit, OnDestroy {
  public routes: any;
  /**
   * Creates an instance of ErrorPageComponent.
   * @param {ShellComponent} shellComponent
   * @memberof ErrorPageComponent
   */
  constructor(
    private shellComponent: ShellComponent
  ) { }

  /**
   * @memberof ErrorPageComponent
   */
  ngOnInit() {
    // Oculto la barra toolbar de la aplicación
    this.routes = RoutesConst;
    this.shellComponent.viewToolbarPrincipal = false;
  }

  /**
   * @memberof ErrorPageComponent
   */
  ngOnDestroy() {
    /**
     * Visualizo la toolbar de la aplicación
     */
    this.shellComponent.viewToolbarPrincipal = true;
  }
}
