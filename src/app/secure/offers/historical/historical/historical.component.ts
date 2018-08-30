/* 3rd party components */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
/* our own custom components */
import { ModelFilter } from '../components/filter/filter.model';
import { ShellComponent } from '@core/shell/shell.component';
import {
    UserLoginService,
    UserParametersService,
    RoutesConst
} from '@app/shared';
import { HistoricalService } from '../historical.service';

@Component({
    selector: 'app-historical-component',
    templateUrl: './historical.component.html',
    styleUrls: ['./historical.component.scss']
})

export class HistoricalComponent implements OnInit {

    /*Componente necesario para el funcionamiento del filtro*/
    @ViewChild('sidenav') sidenav: MatSidenav;

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
    public paramData: ModelFilter;

    /*Variable que se usa para controlar que filtro se esta removiendo*/
    public filterRemove: any;

    /*Variable en la que se guarda la respuesta del servicio historico de ofertas*/
    public historicalOffer: any;

    /*Variable en la que se almacena cuantas páginas trae el servicio de listado de ofertas*/
    public numberPages: any;

    /*Variable que se le envia al toolbar para volver a ponerlo en la página 1*/
    public currentPage: any;

    /**
     *Creates an instance of HistoricalComponent.
     * @param {ShellComponent} [shellComponent]
     * @param {UserLoginService} [userService]
     * @param {Router} [router]
     * @param {HistoricalService} [historicalService]
     * @param {UserParametersService} [userParams]
     * @memberof HistoricalComponent
     */

    constructor(
        public shellComponent?: ShellComponent,
        public userService?: UserLoginService,
        public router?: Router,
        public historicalService?: HistoricalService,
        public userParams?: UserParametersService
    ) {
        this.paramData = new ModelFilter();
        this.user = {};
    }

    /**
     * @method ngOnInit
     * @description Metodo que se llama mientras se inicia el componente
     * @memberof HistoricalComponent
     */
    ngOnInit() {
        this.userService.isAuthenticated(this);
    }

    /**
     * @method isLoggedIn
     * @description Metodo para validar si el usuario esta logeado
     * @param message
     * @param isLoggedIn
     * @memberof HistoricalComponent
     */
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.getDataUser();
        } else if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.home}`]);
        }
    }

    /**
     * @method getDataUser
     * @description Metodo para ir al servicio de userParams y obtener los datos del usuario
     * @memberof HistoricalComponent
     */
    getDataUser() {
        this.userParams.getUserData(this);
    }

    /**
     * @method callback
     * @description Metodo necesario para recibir el callback de getDataUser()
     * @memberof HistoricalComponent
     */
    callback() { }

    /**
     * @method callbackWithParam
     * @description metodo que se ejecuta en el callback de getDataUser().
     * Es utilizado para almacenar los datos del usuario en una variable y luego validar
     * si es Administrador o Vendedor.
     * @param userData
     * @memberof HistoricalComponent
     */
    callbackWithParam(userData: any) {
        this.user = userData;
        if (this.user.sellerProfile === 'administrator') {
            this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
        } else {
            // this.getHistoricalOffers();
            this.getHistoricalOffersFake(); // TODO: Eliminar
        }
    }

    /**
     * @method getHistoricalOffers
     * @description Metodo para consumir el servicio del histirico de ofertas
     * @memberof HistoricalComponent
     */
    getHistoricalOffers(params?: any) {
        this.shellComponent.loadingComponent.viewLoadingSpinner();
        this.historicalService.getHistoricalOffers(params).subscribe(
            (result: any) => {
                if (result.status === 200 && result.body !== undefined) {
                    const response = result.body.data;
                    this.numberPages = this.paramData.limit === undefined || this.paramData.limit === null ? response.total / 100 : response.total / this.paramData.limit;
                    this.numberPages = Math.ceil(this.numberPages);
                    this.historicalOffer = response.sellerOfferViewModels;
                    this.shellComponent.loadingComponent.closeLoadingSpinner();
                    console.log(response);
                } else {
                    this.shellComponent.loadingComponent.closeLoadingSpinner();
                    this.shellComponent.modalComponent.showModal('errorService');
                }
            }
        );
    }

    /**
     * TODO: Eliminar
     */
    getHistoricalOffersFake(params?: any) {
        this.shellComponent.loadingComponent.viewLoadingSpinner();
        this.historicalService.getHistoricalOffersFake(params).subscribe(
            (result: any) => {
                if (result) {
                    // if (result.status === 200 && result.body !== undefined) {
                    const response = result;
                    this.numberPages = this.paramData.limit === undefined || this.paramData.limit === null ? response.total / 100 : response.total / this.paramData.limit;
                    this.numberPages = Math.ceil(this.numberPages);
                    this.historicalOffer = response.sellerHistoricalOffers;
                    this.shellComponent.loadingComponent.closeLoadingSpinner();
                    console.log(response);
                } else {
                    this.shellComponent.loadingComponent.closeLoadingSpinner();
                    this.shellComponent.modalComponent.showModal('errorService');
                }
            }
        );
    }
}
