/* 3rd party components */
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-historical-component',
    templateUrl: './historical.component.html',
    styleUrls: ['./historical.component.scss']
})

export class HistoricalComponent implements OnInit {

    /*Componente necesario para el funcionamiento del filtro*/
    // @ViewChild('sidenav') sidenav: MatSidenav;

    /*Variable para almacenar los datos del usuario logeado*/
    public user: any;

    /*Variable que se usa para ir al componente de detalle de la oferta*/
    public viewDetailOffer = false;

    /*Variable en la que se guardara los datos de la oferta de la cual se esta viendo el detalle*/
    public dataOffer: any;

    /*Variable utilizada para  saber si estas dentro del detalle de la oferta o no*/
    public inDetail: boolean;

    /*Variable para mostrar los filtros aplicados*/
    public filterActive = false;

    /*Variable donde se almacenan los parametros que se le envian al servicio de listado de ofertas para filtrar o paginar*/
    // public paramData: ModelFilter;

    /*Variable que se usa para controlar que filtro se esta removiendo*/
    public filterRemove: any;

    /*Variable en la que se guarda la respuesta del servicio de listado de ofertas*/
    public listOffer: any;

    /*Variable en la que se almacena cuantas páginas trae el servicio de listado de ofertas*/
    public numberPages: any;

    /*Variable que se le envia al toolbar para volver a ponerlo en la página 1*/
    public currentPage: any;

    ngOnInit () {}
}
