/* 3rd party components */
import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatSidenav, MatDialog } from '@angular/material';
/* our own custom components */
import { HistoryComponent } from '../../history/history.component';
import { Logger } from '../../../../../shared/services';
import { ModelFilter } from './../filter/filter.model';
import { DownloadHistoryModalComponent } from '@secure/offers/history/components/download-history-modal/download-history-modal.component';

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
    public subtitleBar: String = 'Histórico de Carga de Ofertas';

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

    lengthOrder = 100;
    // Numero de paginas por defecto
    pageSizeOrder = 5;

    /**
     *Creates an instance of ToolbarComponent.
     * @param {HistoryComponent} list
     * @param {ChangeDetectorRef} cdRef
     * @memberof ToolbarComponent
     */
    constructor(
        public list: HistoryComponent,
        private cdRef: ChangeDetectorRef,
        public dialog: MatDialog,
    ) {
        this.dataPaginate = new ModelFilter();
        this.dataPaginate.limit = '30';
        this.currentPage = 1;
    }

    /**
     * @method ngOnInit
     * @description Metodo que se llama mientras se inicia el componente
     * @memberof ToolbarComponent
     */
    ngOnInit() {
        this.numberPages = this.numberPages === undefined ? 0 : this.numberPages;
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
     * @method changeSize
     * @description Metodo para cambiar el número de ofertas que se ven en pantalla 30 - 60 - 120 - 600
     * @memberof ToolbarComponent
     */
    changeSize() {
        this.currentPage = 1;
        this.dataPaginate.currentPage = this.currentPage;
        // this.list.setDataPaginate(this.dataPaginate);
    }

    /**
     * @method changePage
     * @param dir
     * @description Metodo para pasar la página adelante o atras.
     * Recibe el parametro dir, este se usa para saber la dirección en que cambio las páginas: next - prev
     * @memberof ToolbarComponent
     */
    changePage(dir) {
        switch (dir) {
            case 'next':
                this.currentPage += 1;
                this.dataPaginate.currentPage = this.currentPage;
                // this.list.setDataPaginate(this.dataPaginate);
                break;
            case 'prev':
                this.currentPage -= 1;
                this.dataPaginate.currentPage = this.currentPage;
                // this.list.setDataPaginate(this.dataPaginate);
                break;
        }
    }

    /**
     * @method toggleMenu
     * @description Metodo para abrir o cerrar el menúr
     * @memberof ToolbarComponent
     */
    toggleMenu() {
        this.sidenav.toggle();
    }

    /**
     * @method goBack
     * @description metodo para volver atras desde la vista de detalle hasta el filtro de ofertas
     * @memberof ToolbarComponent
     */
    goBack() {
        // this.list.viewDetailOffer = false;
        // this.list.inDetail = false;
    }

    /**
   * Funcionalidad para desplegar el modal que permita descargar las órdenes actuales del usuario
   * @memberof ToolbarOptionsComponent
   */
   openModalDownloadHistoryOffer(): void {
        const dialogRef = this.dialog.open(DownloadHistoryModalComponent, {
            data: {
                limit: this.lengthOrder,
            },
        });
        dialogRef.afterClosed().subscribe(result => {
            log.info('The modal detail order was closed');
        });
    }

}
