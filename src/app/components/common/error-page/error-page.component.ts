/* 3rd party components */
import { Component, OnInit } from '@angular/core';

/* our own custom components */
import { ShellComponent } from '../../../core/shell/shell.component';

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
export class ErrorPageComponent implements OnInit {
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
    this.shellComponent.viewToolbarPrincipal = false;
  }

  /**
   * @memberof ErrorPageComponent
   */
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    /**
     * Visualizo la toolbar de la aplicación
     */
    this.shellComponent.viewToolbarPrincipal = true;
  }
}
