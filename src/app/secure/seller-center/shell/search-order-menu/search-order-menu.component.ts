/* 3rd party components */
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatSidenav } from '@angular/material';

/* our own custom components */
import { ShellComponent } from '../shell.component';
import { Logger } from '../../utils/logger.service';
import { SearchFormEntity } from '../../../../shared';

// log components
const log = new Logger('SideBarSearchOrdersComponent');

/**
 * Component Que permite realizar el filtro personalizado por el usaurio para realizar la busqueda de una orden.
 * este componente puede ser llamado desde diferentes Componentes así que sus filtros varian de acuerdo de donde se llame
 */
@Component({
  selector: 'app-search-order-menu',
  templateUrl: './search-order-menu.component.html',
  styleUrls: ['./search-order-menu.component.scss'],
})

/**
 * Component
 */
export class SearchOrderMenuComponent implements OnInit {

  // Sidenav principal
  @Input() sidenavSearchOrder: MatSidenav;
  // Variable que almacena los datos que se le pueden pasar al formulario
  @Input() informationToForm: SearchFormEntity;

  /**
   * Creates an instance of SearchOrderMenuComponent.
   * @param {ShellComponent} shellComponent
   * @memberof SearchOrderMenuComponent
   */
  constructor(
    public shellComponent: ShellComponent
  ) {
  }

  /**
   * @memberof SearchOrderMenuComponent
   */
  ngOnInit() {
  }

  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof SidebarComponent
   */
  toggleMenu(): void {
    this.sidenavSearchOrder.toggle();
  }
}
