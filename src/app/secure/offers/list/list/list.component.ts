import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { LoadingService, LoggedInCallback, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { ModelFilter } from '../components/filter/filter.model';
import { ListService } from '../list.service';
import { environment } from '@env/environment';
import { MenuModel, readFunctionality, updateFunctionality, offerListName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { DialogDesactiveOffertComponent } from './dialog-desactive-offert/dialog-desactive-offert.component';
import { NullAstVisitor } from '@angular/compiler';
import { BulkLoadService } from '../../bulk-load/bulk-load.service';
import { FinishUploadInformationComponent } from '../../bulk-load/finish-upload-information/finish-upload-information.component';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-list-component',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  // Componente necesario para el funcionamiento del filtro.
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

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
  public listOffer: any[];

  // Variable en la que se almacena cuantas páginas trae el servicio de listado de ofertas.
  public numberPages: any;

  // Variable que se le envia al toolbar para volver a ponerlo en la página 1.
  public currentPage: any;

  // Domains images
  public domainImages = environment.domainImages;

  public listErrorStatus: any = [];


  applyFilter = false;

  valueCheckdesactive: any;
  // Variables con los permisos que este componente posee.
  permissionComponent: MenuModel;
  read = readFunctionality;
  update = updateFunctionality;
  updatePermission: boolean;
  readPermission: boolean;
  activeCheck: Boolean = false;
  allOffer: Boolean = false;
  totalOffers: any;
  listToSend = [];
  sumItemCount: number;

  // Fin de variables de permisos.


  constructor(
    private loadingService?: LoadingService,
    private modalService?: ModalService,
    private offerService?: ListService,
    public authService?: AuthService,
    public bulkLoadService?: BulkLoadService,
    public dialog?: MatDialog,
    private languageService?: TranslateService,
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
    this.getListOffers();
    this.verifyProccesDesactiveOffert();
    this.permissionComponent = this.authService.getMenu(offerListName);
    this.updatePermission = this.getFunctionality(this.update);
    this.readPermission = this.getFunctionality(this.read);
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
    this.paramData.pluVtex = params.pluVtex !== undefined && params.pluVtex !== null ? params.pluVtex.trim() : params.pluVtex;
    this.paramData.reference = params.reference !== undefined && params.reference !== null ? params.reference.trim() : params.reference;
    this.paramData.stock = params.stock;
    this.paramData.sellerSku = params.sellerSku;
    this.paramData.currentPage = this.currentPage;
    this.paramData.product = this.paramData.product;
    const dataToSend = {
      currentPage: this.paramData.currentPage,
      ean: this.paramData.ean,
      limit: undefined,
      pluVtex: this.paramData.pluVtex,
      product: encodeURIComponent(this.paramData.product),
      sellerSku: encodeURIComponent(this.paramData.sellerSku),
      reference: this.paramData.reference,
      stock: this.paramData.stock
    };
    this.getListOffers(dataToSend);
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
      case 'filterPluVtex':
        this.paramData.pluVtex = undefined;
        break;
      case 'filterReference':
        this.paramData.reference = undefined;
        break;
      case 'filterSellerSku':
        this.paramData.sellerSku = undefined;
        break;
      case 'filterStock':
        this.paramData.stock = undefined;
        break;
    }
    this.filterRemove = filter;

    if (this.paramData.product === undefined && this.paramData.ean === undefined && this.paramData.stock === undefined && this.paramData.pluVtex === undefined && this.paramData.sellerSku === undefined && this.paramData.reference === undefined) {
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
          this.totalOffers = response.total;
          this.listOffer = response.sellerOfferViewModels;
          this.addDomainImages();
          this.loadingService.closeSpinner();
          this.setCheckedTrue();
        } else {
          this.loadingService.closeSpinner();
          this.modalService.showModal('errorService');
        }
      }
    );
  }

  /**
   * Agrega el dominio de imagenes a las ofertas nuevas.
   */
  addDomainImages() {
    this.listOffer.map(el => {
      if (el.imageUrl.indexOf('https') === -1) {
        el.imageUrl = `${this.domainImages}${el.imageUrl}`;
      }
    });
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
      if (event.reference === true) {
        this.verifyProccesApplyOffert();
      } else {
      this.getListOffers();
      }
    }
  }

  /**
   * Funcion que limia parametros del filtro para obtener la data del listado de ofertas completo.
   * @memberof ListComponent
   */
  public cleanAllFilter() {
    this.applyFilter = false;
    this.paramData.ean = null;
    this.paramData.stock = null;
    this.paramData.product = null;
    this.paramData.reference = null;
    this.paramData.pluVtex = null;
    this.paramData.sellerSku = null;
    this.filterOffers(this.paramData);
  }

  /**
   * Booleano que selecciona todas las ofertas para desactivar
   * @memberof ListComponent
   */
  allOffersSelected() {
    this.allOffer = true;
  }

  /**
   * Booleano que selecciona algunas ofertas a desactivar
   * @memberof ListComponent
   */
  someOffersSelected() {
    this.allOffer = false;
  }

  /**
   * Función para mostrar modal de confirmación de desactivacion de ofertas
   * @memberof ListComponent
   */
  openDialogDesactiveOffer() {
    const dataToSend = {
      desactiveOffers: this.allOffer,
      eans: null,
      paramsFilters: {
        ean: null,
        plu: null,
        product: null,
        stock: null,
        reference: null,
        sellerSku: null
      }
    };
    dataToSend.paramsFilters.ean = this.paramData.ean || null;
    dataToSend.paramsFilters.plu = this.paramData.pluVtex || null;
    dataToSend.paramsFilters.plu = this.paramData.reference || null;
    dataToSend.paramsFilters.stock = this.paramData.stock || null;
    dataToSend.paramsFilters.sellerSku = this.paramData.sellerSku || null;
    dataToSend.paramsFilters.product = this.paramData.product || null;

    this.allOffer ? this.sumItemCount = this.totalOffers : this.sumItemCount = this.sumItemCount;
    const dialogRef = this.dialog.open(DialogDesactiveOffertComponent, {
      data: {
        count: this.sumItemCount
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.listToSend.length === 0) {
          dataToSend.eans = null;
        } else {
          dataToSend.eans = this.listToSend;
        }
        dataToSend.desactiveOffers = this.allOffer;
        this.loadingService.viewSpinner();
        this.offerService.desactiveMassiveOffers(dataToSend).subscribe(res => {
          if (res) {
            if ((res['body'].data.successful === res['body'].data.totalProcess) && (res['body'].data.error === 0)) {
              this.openModal(1, null);
            } else {
              const { offerNotifyViewModels } = res['body'].data;
              this.openModal(3, offerNotifyViewModels);
            }
          }
          this.loadingService.closeSpinner();
        });
        this.getListOffers();
      }
    });
    this.activeCheck = false;
  }

  /**
   * Metodo que recibe como parametro el item del nfgor de los card de ofertas
   * @param {*} statusOffer
   * @memberof ListComponent
   */
  onvalueCheckdesactiveChanged(statusOffer: any) {
    statusOffer.checked = !statusOffer.checked;
    this.sumItemCount = 0;
    this.listOffer.forEach(item => {
      if (item.checked) {
        this.listToSend.push(item.ean);
      }
      if (item.checked === false) {
        this.listToSend.splice(item, 1);
      }
    });
    const newListArray = Array.from(new Set(this.listToSend));
    this.listToSend = newListArray;
    this.sumItemCount = this.listToSend.length;
  }

  /**
   * Metodo para checkear la oferta y no perderla al cambiar de pagina.
   * @memberof ListComponent
   */
  setCheckedTrue() {
    this.listToSend.forEach(res => {
      this.listOffer.forEach(result => {
        if (result.ean === res) {
          result['checked'] = true;
        }
      });
    });
  }

  /**
   * Funcion para activar masivamente las ofertas a seleccionar
   * @memberof ListComponent
   */
  activeMultipleOffer() {
    this.activeCheck = true;
  }

  /**
   * Funcion para validar el estado del proceso de desactivacion de ofertas
   * @memberof ListComponent
   */
  verifyProccesDesactiveOffert() {
    this.bulkLoadService.verifyStatusBulkLoad().subscribe((res) => {
      try {
        if (res && res.status === 200) {
          const { status, checked } = res.body.data;
          if ((status === 1 || status === 4) && checked !== 'true') {
            const statusCurrent = 1;
            setTimeout(() => { this.openModal(statusCurrent, null); });
          } else if (status === 2 && checked !== 'true') {
            setTimeout(() => { this.openModal(status, null); });
          } else if (status === 3 && checked !== 'true') {
            const response = res.body.data.response;
            if (response) {
              this.listErrorStatus = JSON.parse(response).Data.OfferNotify;
            } else {
              this.listErrorStatus = null;
            }
            setTimeout(() => { this.openModal(status, this.listErrorStatus); });
          } else {
            this.loadingService.closeSpinner();
          }
        }
      } catch {
        this.loadingService.viewSpinner();
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Funcion para validar el estado del proceso de aplicar una ofertas
   * @memberof ListComponent
   */
  verifyProccesApplyOffert() {
    this.bulkLoadService.verifyStatusBulkLoad().subscribe((res) => {
      try {
        if (res && res.status === 200) {
          const { status, checked } = res.body.data;
          if ((status === 1 || status === 4 || status === 0) && checked !== 'true') {
            const statusCurrent = 1;
            setTimeout(() => { this.openModalApplyOffer(statusCurrent, null); });
          } else if (status === 2 && checked !== 'true') {
            setTimeout(() => { this.openModalApplyOffer(status, null); });
          } else if (status === 3 && checked !== 'true') {
            const response = res.body.data.response;
            if (response) {
              this.listErrorStatus = JSON.parse(response).Data.OfferNotify;
            } else {
              this.listErrorStatus = null;
            }
            setTimeout(() => { this.openModalApplyOffer(status, this.listErrorStatus); });
          } else {
            this.loadingService.closeSpinner();
          }
        }
      } catch {
        this.loadingService.viewSpinner();
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Metodo para abrir modal de OK, carga en proceso o con errores.
   * @param {number} type
   * @param {*} listError
   * @memberof ListComponent
   */
  openModal(type: number, listError: any) {
    this.loadingService.closeSpinner();
    const intervalTime = 6000;
    const data = {
      successText: this.languageService.instant('secure.offers.list.list.desactive_OK'),
      failText: this.languageService.instant('secure.offers.list.list.desactive_KO'),
      processText: this.languageService.instant('secure.offers.list.list.desactive_in_progress'),
      initTime: 500,
      intervalTime: intervalTime,
      listError: listError,
      typeStatus: type,
      responseDiferent: false
    };
    const dialog = this.dialog.open(FinishUploadInformationComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      disableClose: type === 1,
      data: data
    });
    const dialogIntance = dialog.componentInstance;
    dialogIntance.request = this.bulkLoadService.verifyStatusBulkLoad();
    dialogIntance.processFinish$.subscribe((val) => {
      dialog.disableClose = false;
    });
  }

  /**
   * Modal para abrirOk, errores o carga en proceso de aplicar una oferta.
   * @param {number} type
   * @param {*} listError
   * @memberof ListComponent
   */
  openModalApplyOffer(type: number, listError: any) {
    this.loadingService.closeSpinner();
    const intervalTime = 6000;
    const data = {
      // successText: this.languageService.instant('secure.offers.list.list.desactive_OK'),
      successText: 'Aplico una oferta correctamente.',
      // failText: this.languageService.instant('secure.offers.list.list.desactive_KO'),
      failText: 'Error al intentar aplicar una oferta',
      processText: 'Carga en proceso, aplicando oferta(s)',
      goList: true,
      initTime: 500,
      intervalTime: intervalTime,
      listError: listError,
      typeStatus: type,
      responseDiferent: false
    };
    const dialog = this.dialog.open(FinishUploadInformationComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      disableClose: type === 1 || type === 2 || type === 3,
      data: data
    });

    const dialogIntance = dialog.componentInstance;
    dialogIntance.request = this.bulkLoadService.verifyStatusBulkLoad();
    dialogIntance.processFinish$.subscribe((val) => {
      if (val === null) {
        this.getListOffers();
      }
    });
  }

}
