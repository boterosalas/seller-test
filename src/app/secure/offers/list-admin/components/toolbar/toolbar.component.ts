// 3rd party components
import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatSidenav, MatDialog } from '@angular/material';
// our own custom components
import { Logger } from '@app/core/util/logger.service';
import { ModelFilter } from './../filter/filter.model';
import { DownloadHistoricalModalComponent } from '@secure/offers/historical-admin/download-historical-modal/download-historical-modal.component';
import { ListAdminComponent } from '@app/secure/offers/list-admin/list-admin/list-admin.component';
import { MenuModel, readFunctionality, bulkLoadHistoryNameAdmin, downloadFunctionality } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';

// log component
const log = new Logger('ToolbarOptionsComponent');

/**
 * @export
 * @class ToolbarComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit, OnChanges {
  /**
   * Variable que almacena el texto que se mostrara en el titulo
   * @memberof ToolbarComponent
   */
  public tittleBar: String = 'Ofertas';

  /**
   * Variable que almacena el texto que se mostrara en el subtitulo
   * @memberof ToolbarComponent
   */
  public subtitleBar: String = 'Listado de Ofertas';

  /**
   * Variable que almacena las varibales del páginados que se enviaran al servicio
   * @memberof ToolbarComponent
   */
  public dataPaginate: ModelFilter;

  /**
   * Variable que almacena la página en la que se encuentra actualmente
   * @memberof ToolbarComponent
   */
  public currentPage: any;

  public historicalOfferLength: any;

  /**
   * Variable que se usa para el funcionmiento correcto del filtro
   * @memberof ToolbarComponent
   */
  @Input() sidenav;

  /**
   * Variable que se usa para detectar si esta en el detalle de la oferta
   * @memberof ToolbarComponent
   */
  @Input() inDetail: boolean;

  /**
   * Variable que almacena el número de páginas que trae el filtro de ofertas
   * @memberof ToolbarComponent
   */
  @Input() numberPages: any;

  /**
   * Variable que recibe la posicion de la página cuando se aplica un filtro
   * @memberof ToolbarComponent
   */
  @Input() currentPageInput: any;

  /**
   * Variable que permite habilitar/deshabilitar el filtro.
   */
  @Input() isEnabled: boolean;

  // Limite de registros por petición
  lengthHistorical = null;

   // Variables con los permisos que este componente posee
   permissionComponent: MenuModel;
   read = readFunctionality;
   download = downloadFunctionality;

  /**
   * Creates an instance of ToolbarComponent.
   * @param {HistoricalComponent} list
   * @param {ChangeDetectorRef} cdRef
   * @memberof ToolbarComponent
   */
  constructor(
    public list: ListAdminComponent,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public authService: AuthService
  ) {
    this.dataPaginate = new ModelFilter();
    this.dataPaginate.limit = 100;
    this.currentPage = 1;
    this.isEnabled = true;
  }

  /**
   * @method ngOnInit
   * @description Metodo que se llama mientras se inicia el componente
   * @memberof ToolbarComponent
   */
  ngOnInit() {
    this.permissionComponent = this.authService.getMenu(bulkLoadHistoryNameAdmin);
    this.numberPages = this.numberPages === undefined ? 0 : this.numberPages;
  }

  /**
   * Funcion que verifica si la funcion del modulo posee permisos
   *
   * @param {string} functionality
   * @returns {boolean}
   * @memberof ToolbarComponent
   */
  public getFunctionality(functionality: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
  }

  /**
   * @method ngOnChanges
   * @param {SimpleChanges} changes
   * @description Metodo para controlar el cambio de la página (Input)
   * @memberof ToolbarComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.inDetail) {
      this.currentPage = this.currentPageInput === undefined ? 1 : this.currentPageInput;
      this.cdRef.detectChanges();
    }

  }

  /**
   * @method changePage
   * @param dir
   * @description Metodo para pasar la página adelante o atras.
   *              Recibe el parametro dir, este se usa para saber la dirección en que cambio las páginas: next - prev
   * @memberof ToolbarComponent
   */
  changePage(dir: string) {
    switch (dir) {
      case 'next':
        this.currentPage += 1;
        this.dataPaginate.currentPage = this.currentPage;
        this.list.setDataPaginate(this.dataPaginate);
        break;
      case 'prev':
        this.list.removeLastPaginationToken(this.currentPage);
        this.currentPage -= 1;
        this.dataPaginate.currentPage = this.currentPage;
        this.list.setDataPaginate(this.dataPaginate);
        break;
    }
  }

  /**
   * @method toggleMenu
   * @description Metodo para abrir o cerrar el menú
   * @memberof ToolbarComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
  }

  /**
   * Funcionalidad para desplegar el modal que permite descargar el histórico
   * @memberof ToolbarOptionsComponent
   */
  openModalDownloadHistoricalOffer(): void {
    const dialogRef = this.dialog.open(DownloadHistoricalModalComponent, {
      data: {
        limit: this.lengthHistorical,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail order was closed');
    });
  }

}
