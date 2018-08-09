import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ListComponent } from '../../list/list.component';
import { ModelFilter } from './../filter/filter.model';
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
export class ToolbarComponent implements OnInit {

    public tittleBar: String = 'Ofertas';
    public subtitleBar: String = 'Listado de ofertas';
    public dataPaginate: ModelFilter;
    public currentPage: any;

    @Input() sidenav;
    @Input() inDetail: boolean;
    @Input() numberPages: any;

    constructor(
        public list: ListComponent
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
     * @method changeSize
     * @description Metodo para cambiar el número de ofertas que se ven en pantalla 30 - 60 - 120 - 600
     * @memberof ToolbarComponent
     */
    changeSize() {
        this.list.setDataPaginate(this.dataPaginate);
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
                this.list.setDataPaginate(this.dataPaginate);
                break;
            case 'prev':
                this.currentPage -= 1;
                this.dataPaginate.currentPage = this.currentPage;
                this.list.setDataPaginate(this.dataPaginate);
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
     * @description metodo para volver atras desde la vista de detalle hasta el listado de ofertas
     * @memberof ToolbarComponent
     */
    goBack() {
        this.list.viewDetailOffer = false;
        this.list.inDetail = false;
    }

}
