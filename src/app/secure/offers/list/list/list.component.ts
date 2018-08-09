/* 3rd party components */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
/* our own custom components */
import { ModelFilter } from '../components/filter/filter.model';
import { ShellComponent } from '@core/shell/shell.component';
import {
    UserLoginService,
    LoggedInCallback,
    Callback,
    UserParametersService,
    RoutesConst
} from '@app/shared';
import { ListService } from '../list.service';
/**
 * Component que permite realizar la carga de guías, consta de tres componentes mas
 * FinishUploadProductInformationComponent
 * TableLoadComponent
 * TableErrorsComponent
 * Estos componentes se emplean para separar
 * el comportamiento de la carga de guías, se
 * emplea "TableErrorsComponent" para visualizar la
 * lista de errores capturados al momento de subir el archivo excel.
 * se emplea "TableLoadComponent" para visualizar la lista de datos
 * con errores en una tabla y visualizar el total de registros correctos
 * y se emplea "FinishUploadProductInformationComponent" para desplegar un modal
 * donde se visualicen los logs generados por el back al momento de envíar
 * las guías. en FinishUploadProductInformationComponent se permite generar un excel
 * con el log obtenido.
 */

@Component({
    selector: 'app-list-component',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit, LoggedInCallback, Callback {

    @ViewChild('sidenav') sidenav: MatSidenav;
    public user: any;
    public viewDetailOffer = false;
    public dataOffer: any;
    public filterActive = false;
    public paramData: ModelFilter;
    public filterRemove: any;
    public listOffer: any;
    public inDetail: boolean;
    public numberPages: any;
  /**
   * Creates an instance of BulkLoadProductComponent.
   * @param {ComponentsService} componentService
   * @param {BulkLoadProductService} BulkLoadProductService
   * @param {MatDialog} dialog
   * @param {ShellComponent} shellComponent
   * @memberof BulkLoadProductComponent
   */
    constructor(
        public shellComponent?: ShellComponent,
        public userService?: UserLoginService,
        public router?: Router,
        public offerService?: ListService,
        public userParams?: UserParametersService
    ) {
        this.paramData = new ModelFilter();
        this.user = {};
    }

    /**
     * @method ngOnInit
     * @description Metodo que se llama mientras se inicia el componente
     * @memberof ListComponent
     */
    ngOnInit() {
        this.userService.isAuthenticated(this);
    }

    /**
     * @method isLoggedIn
     * @description Metodo para validar si el usuario esta logeado
     * @param message
     * @param isLoggedIn
     * @memberof ListComponent
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
     * @memberof ListComponent
     */
    getDataUser() {
        this.userParams.getUserData(this);
    }

    /**
     * @method callback
     * @description Metodo necesario para recibir el callback de getDataUser()
     * @memberof ListComponent
     */
    callback() { }

    /**
     * @method callbackWithParam
     * @description metodo que se ejecuta en el callback de getDataUser().
     * Es utilizado para almacenar los datos del usuario en una variable y luego validar
     * si es Administrador o Vendedor.
     * @param userData
     * @memberof ListComponent
     */
    callbackWithParam(userData: any) {
        this.user = userData;
        if (this.user.sellerProfile === 'administrator') {
            this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
        } else {
            this.getListOffers();
        }
    }

    /**
     * @method openDetailOffer
     * @param item
     * @description Metodo para ver el detalle de la oferta
     * @memberof ListComponent
     */
    openDetailOffer(item) {
        this.viewDetailOffer = true;
        this.dataOffer = item;
        this.inDetail = true;
    }

    /**
     * @method filterOffers
     * @param params
     * @description Metodo para filtrar el listado de ofertas
     * @memberof ListComponent
     */
    filterOffers(params) {
        this.filterActive = true;
        this.paramData.product = params.product;
        this.paramData.ean = params.ean;
        this.paramData.stock = params.stock;
        this.getListOffers(this.paramData);
        this.sidenav.toggle();
    }

    /**
     * @method removeFilter
     * @param filter
     * @description Metodo para remover filtros
     * @memberof ListComponent
     */
    removeFilter(filter) {
        switch (filter) {
            case 'filterProduct':
                this.paramData.product = undefined;
                break;
            case 'filterEan':
                this.paramData.ean = undefined;
                break;
            case 'filterStock':
                this.paramData.stock = undefined;
                break;
        }
        this.filterRemove = filter;

        if (this.paramData.product === undefined && this.paramData.ean === undefined && this.paramData.stock === undefined) {
            this.filterActive = false;
        }
        this.getListOffers(this.paramData);
    }

    /**
     * @method getListOffers
     * @description Metodo para consumir el servicio de listado de ofertas
     * @memberof ListComponent
     */
    getListOffers(params?: any) {
        this.shellComponent.loadingComponent.viewLoadingSpinner();
        this.offerService.getOffers(params).subscribe(
            (result: any) => {
                if (result.status === 200 && result.body !== undefined) {
                    const response = result.body.data;
                    this.numberPages = this.paramData.limit === undefined || this.paramData.limit === null ? response.total / 30 : response.total / this.paramData.limit;
                    this.numberPages = Math.ceil(this.numberPages);
                    this.listOffer = response.sellerOfferViewModels;
                    this.shellComponent.loadingComponent.closeLoadingSpinner();
                } else {
                    this.shellComponent.loadingComponent.closeLoadingSpinner();
                    this.shellComponent.modalComponent.showModal('errorService');
                }
            }
        );
    }

    /**
     * @method setDataPaginate
     * @description Metodo para el funcionamiento del páginador
     * @param params
     * @memberof ListComponent
     */
    setDataPaginate(params) {
        this.paramData.currentPage = params === undefined || params.currentPage === undefined ? null : params.currentPage;
        this.paramData.limit = params === undefined || params.limit === undefined ? null : params.limit;
        this.getListOffers(this.paramData);
    }
}
