/* 3rd party components */
import { ShellComponent } from '../../secure/seller-center/shell/shell.component';
import { Component, Input, Output, EventEmitter, ViewChild, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog, MatPaginator, MatPaginatorIntl } from '@angular/material';

/* our own custom components */
import { SearchFormEntity } from '../models/order';
import { Logger } from '../../secure/seller-center/utils/logger.service';
import { getDutchPaginatorIntl } from '../../secure/seller-center/utils/services/common/components/mat-table.config';
// tslint:disable-next-line:max-line-length
import { DownloadOrderModalComponent } from '../../secure/seller-center/components/orders/download-order-modal/download-order-modal.component';


// log component
const log = new Logger('ToolbarOptionsComponent');

@Component({
  selector: 'app-toolbar-options',
  templateUrl: './toolbar-options.component.html',
  styleUrls: ['./toolbar-options.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }],
})

export class ToolbarOptionsComponent {

  //  Elemento paginador para la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Variable que almacena la configuración para el formulario
  @Input() informationToForm: SearchFormEntity;


  // Boolean que indica si hay ordenes o no
  @Input() orderListLength: boolean;
  // Evento que permite consultar las ordenes
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
  ) { }

  /**
   * Funcionalidad para despelgar el menu de filtro de ordenes.
   * @memberof ToolbarOptionsComponent
   */
  toggleMenuOrderSearch() {
    this.shellComponent.toggleMenuSearchOrder(this.informationToForm);
  }

  /**
   * Funcionalidad para desplegar el modal que permita descargar las ordenes actuales del usuario
   * @memberof ToolbarOptionsComponent
   */
  openModalDownloadOrder(): void {
    const dialogRef = this.dialog.open(DownloadOrderModalComponent, {
      data: {
        limit: this.lengthOrder,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail order was closed');
    });
  }

  /**
   * Método que permite actualizar el valor del pageSize de la tabla de acuerdo al valor pasado,
   *  luego se emite un evento que le indica al contenedor padre si se debe consultar un nuevo limite de ordenes.
   * @memberof ToolbarOptionsComponent
   */
  changeSizeOrderTable() {
    log.info('Emit changeSizeOrderTable');
    this.paginator.pageSize = this.pageSizeOrder;
    this.OnChangeSizeOrderTable.emit(this.paginator);
  }

  /**
   * Método que permite emitir un evento al contenedor padre para saber cuando consultar la lista de ordenes.
   * @param {any} [category]: parametro opcional. solo para la pagina ordenes.
   * @memberof ToolbarOptionsComponent
   */
  getOrdersList(category?) {
    log.info('Even Emit getOrdersList');
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
}

