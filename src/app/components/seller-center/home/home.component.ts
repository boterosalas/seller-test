/* 3rd party components */
import {Component, OnInit} from '@angular/core';

/* our own custom components */
import {ShellComponent} from '../../../core/shell/shell.component';
import {Logger} from '../../../core/utilities/logger.service';

// log component
const log = new Logger('HomeComponent');

/**
 * Component Principal
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

/**
 * Componente principal de la aplicación
 */
export class HomeComponent implements OnInit {

  /**
   * Creates an instance of HomeComponent.
   * @param {ShellComponent} shellComponent
   * @memberof HomeComponent
   */
  constructor(
    public shellComponent: ShellComponent
  ) {
  }

  /**
   * Método que se despliega al cargar el componente
   * @memberof HomeComponent
   */
  ngOnInit() {
    // Valido si el usuario se encuentra logeado y puede ingresar a la vista.
    this.shellComponent.validateAccesUser().subscribe(res => {
      log.info('El usuario posee sesión activa');
    }, err => {
      log.info('Error de autentificación', err);
    });
  }
}
