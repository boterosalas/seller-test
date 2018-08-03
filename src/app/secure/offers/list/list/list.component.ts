import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ModelFilter } from '../components/filter/filter.model';
import { ShellComponent } from '@core/shell/shell.component';
import {
    UserLoginService,
    LoggedInCallback,
    Callback,
    UserParametersService,
    RoutesConst
} from '@app/shared';
import { Router } from '@angular/router';
import { ListService } from '../list.service';

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

    ngOnInit() {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.getDataUser();
        } else if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.home}`]);
        }
    }

    callback() { }

    getDataUser() {
        this.userParams.getUserData(this);
    }

    callbackWithParam(userData: any) {
        this.user = userData;
        if (this.user.sellerProfile === 'administrator') {
            this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
        } else {
            this.getListOffers();
        }
    }

    /**
     * @method openDetailOffer()
     * @param item
     * @memberof ListComponent
     * @description Metodo para ver el detalle de la oferta si no esta agotada
     */
    openDetailOffer(item) {
        this.viewDetailOffer = true;
        this.dataOffer = item;
        this.inDetail = true;
    }

    /**
     * @method filterOffers
     * @param params
     * @memberof ListComponent
     * @description Metodo para filtrar el listado de ofertas
     */
    filterOffers(params) {
        this.filterActive = true;
        this.paramData.product = params.product;
        this.paramData.ean = params.ean;
        this.paramData.stock = params.stock === '1' ? 'Con inventario' : params.stock === '0' ? 'Agotado' : undefined;
        this.sidenav.toggle();
    }

    /**
     * @method removeFilter
     * @param filter
     * @memberof ListComponent
     * @description Metodo para remover filtros
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
            this.getListOffers();
        }
    }

    /**
     * @method getListOffers
     * @memberof ListComponent
     * @description Metodo para consumir el servicio de listado de ofertas
     */
    getListOffers() {
        this.shellComponent.loadingComponent.viewLoadingSpinner();
        this.offerService.getOffers().subscribe(
            (result: any) => {
                if (result.status === 200) {
                    const data_response = result.body.data;
                    this.listOffer = data_response.sellerOfferViewModels;
                    this.shellComponent.loadingComponent.closeLoadingSpinner();
                } else {
                    this.shellComponent.loadingComponent.closeLoadingSpinner();
                    this.shellComponent.modalComponent.showModal('errorService');
                }
            }
        );
    }
}
