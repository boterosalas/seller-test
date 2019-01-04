import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatPaginatorIntl } from '@angular/material';
import { Logger } from '@app/core/util';
import { ShellComponent } from '@core/shell/shell.component';
import { DownloadOrderModalComponent } from '@secure/orders/download-order-modal';

import { SearchFormEntity } from '@shared/models';
import { getDutchPaginatorIntl } from '@shared/services';


// log component
const log = new Logger('ToolbarOptionsComponent');

@Component({
  selector: 'app-toolbar-options',
  templateUrl: './toolbar-options.component.html',
  styleUrls: ['./toolbar-options.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ],
})

export class ToolbarOptionsComponent {

  //  Elemento paginador para la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Variable que almacena la configuración para el formulario
  @Input() informationToForm: SearchFormEntity;
  @Input() billingType: boolean;


  // Boolean que indica si hay órdenes o no
  @Input() orderListLength: boolean;
  // Evento que permite consultar las órdenes
  @Output() OnGetOrdersList = new EventEmitter<object>();
  // Evento que permite saber cuando el usuario cambia el número de paginas
  @Output() OnChangeSizeOrderTable = new EventEmitter<object>();
  // Limite de registros
  lengthOrder = 100;
  // Numero de paginas por defecto
  pageSizeOrder = 5;

  /**
   * Creates an instance of ToolbarOptionsComponent.
   * @param {MatDialog} dialog
   * @param {ShellComponent} shellComponent
   * @memberof ToolbarOptionsComponent
   */
  constructor(
    public dialog: MatDialog,
    public shellComponent: ShellComponent
  ) {
  }

  /**
   * Funcionalidad para despelgar el menu de filtro de órdenes.
   * @memberof ToolbarOptionsComponent
   */
  toggleMenuOrderSearch() {
    this.shellComponent.toggleMenuSearchOrder(this.informationToForm);
  }

  /**
   * Funcionalidad para desplegar el modal que permita descargar las órdenes actuales del usuario
   * @memberof ToolbarOptionsComponent
   */
  openModalDownloadOrder(): void {
    const dialogRef = this.dialog.open(DownloadOrderModalComponent, {
      data: {
        limit: this.lengthOrder,
        billingType: this.billingType
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail order was closed');
    });
  }

  /**
   * Método que permite actualizar el valor del pageSize de la tabla de acuerdo al valor pasado,
   *  luego se emite un evento que le indica al contenedor padre si se debe consultar un nuevo limite de órdenes.
   * @memberof ToolbarOptionsComponent
   */
  changeSizeOrderTable() {
    this.paginator.pageSize = this.pageSizeOrder;
    this.OnChangeSizeOrderTable.emit(this.paginator);
  }

  /**
   * Método que permite emitir un evento al contenedor padre para saber cuando consultar la lista de órdenes.
   * @param {any} [category]: parametro opcional. solo para la pagina órdenes.
   * @memberof ToolbarOptionsComponent
   */
  getOrdersList(category?: any) {
    this.OnGetOrdersList.emit({ lengthOrder: this.lengthOrder, paginator: this.paginator, category: category });
  }

  /**
   * Funcionalidad para cancelar los propagation
   * @param {Event} event
   * @memberof ToolbarOptionsComponent
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Método para obtener la paginación actual de la tabla donde este cargado el componente
   * @returns {object}
   * @memberof ToolbarOptionsComponent
   */
  getPaginator(): object {
    return this.paginator;
  }

  reloadPage() {
    window.location.reload();
  }
}

