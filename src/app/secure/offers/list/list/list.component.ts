import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';

import { LoadingService, LoggedInCallback, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { ModelFilter } from '../components/filter/filter.model';
import { ListService } from '../list.service';


@Component({
  selector: 'app-list-component',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit, LoggedInCallback {

  // Componente necesario para el funcionamiento del filtro.
  @ViewChild('sidenav') sidenav: MatSidenav;

  // Variable para almacenar los datos del usuario logeado.
  public user: any;

  // Variable que se usa para ir al componente de detalle de la oferta.
  public viewDetailOffer = false;

  // Variable en la que se guardara los datos de la oferta de la cual se esta viendo el detalle.
  public dataOffer: any;

  // Variable utilizada para  saber si estas dentro del detalle de la oferta o no.
  public inDetail: boolean;

  // Variable para mostrar los filtros aplicados.
  public filterActive = false;

  // Variable donde se almacenan los parámetros que se le envian al servicio de listado de ofertas para filtrar o paginar.
  public paramData: ModelFilter;

  // Variable que se usa para controlar que filtro se esta removiendo.
  public filterRemove: any;

  // Variable en la que se guarda la respuesta del servicio de listado de ofertas.
  public listOffer: any;

  // Variable en la que se almacena cuantas páginas trae el servicio de listado de ofertas.
  public numberPages: any;

  // Variable que se le envia al toolbar para volver a ponerlo en la página 1.
  public currentPage: any;


  constructor(
    private loadingService?: LoadingService,
    private modalService?: ModalService,
    private userService?: UserLoginService,
    private router?: Router,
    private offerService?: ListService,
    private userParams?: UserParametersService
  ) {
    this.paramData = new ModelFilter();
    this.user = {};
  }

  /**
   * @method ngOnInit
   * @description Método que se llama mientras se inicia el componente
   * @memberof ListComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  /**
   * @method isLoggedIn
   * @description Método para validar si el usuario esta logeado
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
   * @description Método para ir al servicio de userParams y obtener los datos del usuario
   * @memberof ListComponent
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'administrator') {
      this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
    } else {
      this.getListOffers();
    }
  }

  /**
   * @method openDetailOffer
   * @param item
   * @description Método para ver el detalle de la oferta
   * @memberof ListComponent
   */
  openDetailOffer(item: any) {
    this.viewDetailOffer = true;
    this.dataOffer = item;
    this.inDetail = true;
  }

  /**
   * @method filterOffers
   * @param params
   * @description Método para filtrar el listado de ofertas
   * @memberof ListComponent
   */
  filterOffers(params: any) {
    this.currentPage = 1;
    this.filterActive = true;
    this.paramData.product = params.product !== undefined && params.product !== null ? params.product.trim() : params.product;
    this.paramData.ean = params.ean !== undefined && params.ean !== null ? params.ean.trim() : params.ean;
    this.paramData.stock = params.stock;
    this.paramData.currentPage = this.currentPage;
    this.getListOffers(this.paramData);
    this.sidenav.toggle();
  }

  /**
   * @method removeFilter
   * @param filter
   * @description Método para remover filtros
   * @memberof ListComponent
   */
  removeFilter(filter: any) {
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
   * @description Método para consumir el servicio de listado de ofertas
   * @memberof ListComponent
   */
  getListOffers(params?: any) {
    this.loadingService.viewSpinner();
    this.offerService.getOffers(params).subscribe(
      (result: any) => {
        if (result.status === 200 && result.body !== undefined) {
          const response = result.body.data;
          this.numberPages = this.paramData.limit === undefined || this.paramData.limit === null ? response.total / 30 : response.total / this.paramData.limit;
          this.numberPages = Math.ceil(this.numberPages);
          this.listOffer = response.sellerOfferViewModels;
          this.loadingService.closeSpinner();
        } else {
          this.loadingService.closeSpinner();
          this.modalService.showModal('errorService');
        }
      }
    );
  }

  /**
   * @method setDataPaginate
   * @description Método para el funcionamiento del paginador.
   * @param params
   * @memberof ListComponent
   */
  setDataPaginate(params: any) {
    this.paramData.currentPage = params === undefined || params.currentPage === undefined ? null : params.currentPage;
    this.paramData.limit = params === undefined || params.limit === undefined ? null : params.limit;
    this.getListOffers(this.paramData);
  }

  /**
   * @method receiveVarConsumeList
   * @description Metodo que recibe un booleano y si es true consume el listado de ofertas.
   * @param event
   * @memberof ListComponent
   */
  receiveVarConsumeList(event: any) {
    if (event && event !== undefined && event !== null) {
      this.listOffer = [];
      this.currentPage = 1;
      this.filterActive = false;
      this.filterRemove = 'all';
      this.paramData.clear();
      this.getListOffers();
    }
  }
}
