import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { MatDialog, MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material';
import { Logger } from '@app/core/util';
import { ShellComponent } from '@core/shell/shell.component';
import { DownloadOrderModalComponent } from '@secure/orders/download-order-modal';

import { SearchFormEntity } from '@shared/models';
import { getDutchPaginatorIntl } from '@shared/services';
import { DownloadBillingpayModalComponent } from '@secure/billing/download-billingpay-modal/download-billingpay-modal.component';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoadingService } from '@app/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';


// log component
const log = new Logger('ToolbarOptionsComponent');

interface DataEventPaginator {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  length: number;
}

@Component({
  selector: 'app-toolbar-options',
  templateUrl: './toolbar-options.component.html',
  styleUrls: ['./toolbar-options.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    }
  ],
})

export class ToolbarOptionsComponent implements OnInit {

  public textForSearch: FormControl;
  //  Elemento paginador para la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;
  _idSeller: any;
  // Variable que almacena la configuración para el formulario
  @Input() informationToForm: SearchFormEntity;
  @Input() billingType: boolean;
  @Input() searchComponent: Boolean = false;
  @Input() downloadPermission: boolean;
  @Input() downloadBillingPay: boolean;
  @Input() set idSeller(value: number) {
    if (value !== undefined) {
      this._idSeller = value;
    }
  }
  @Input() Typeprofile: number;


  // Boolean que indica si hay órdenes o no
  @Input() orderListLength: boolean;
  // Evento que permite consultar las órdenes
  @Output() OnGetOrdersList = new EventEmitter<object>();
  // Evento que permite saber cuando el usuario cambia el número de paginas
  @Output() OnChangeSizeOrderTable = new EventEmitter<object>();

  @Input() isFullSearch: boolean;
  // Limite de registros
  lengthOrder = 100;
  @Input() set _lengthOrder(value: number) {
    if (value !== undefined) {
      this.lengthOrder = value;
    }
  }
  state = undefined;

  public user: any;

  // variable que almacena los resultados obtenidos al realizar el filtro del autocomplete
  public filteredOptions: Observable<string[]>;
  // Numero de paginas por defecto
  pageSizeOrder = 50;
  listSellers = [];
  pageEvent: PageEvent;

  filterParams: any;

  /**
   * Creates an instance of ToolbarOptionsComponent.
   * @param {MatDialog} dialog
   * @param {ShellComponent} shellComponent
   * @memberof ToolbarOptionsComponent
   */
  constructor(
    public dialog: MatDialog,
    public shellComponent: ShellComponent,
    private loadingService: LoadingService,
    public storeService: StoresService,
    public eventsSeller: EventEmitterSeller,
    public eventSearchSellerHistoric: EventEmitterSeller,
  ) {
    this.textForSearch = new FormControl();
    this.isFullSearch = true;
    this.user = {};
  }


  ngOnInit() {
    this.filteredOptions = this.textForSearch.valueChanges
      .pipe(
        startWith(''),
        map((val: any) =>
          this.filter(val)
        )
      );
    this.getAllSellers();
    this.getFilterParams();
    // consulto las tiendas disponibles
  }



  public getAllSellers() {
    this.loadingService.viewSpinner();
    if (this.isFullSearch) {
      this.storeService.getAllStoresFull(this.user).subscribe((res: any) => {
        if (res.status === 200) {
          if (res && res.body && res.body.body) {
            const body = JSON.parse(res.body.body);
            this.listSellers = body.Data;
          }
        } else {
          this.listSellers = res.message;
        }
        this.loadingService.closeSpinner();
      });
    } else {
      this.storeService.getAllStores(this.user).subscribe((res: any) => {
        if (res.status === 200) {
          const body = JSON.parse(res.body.body);
          this.listSellers = body.Data;
        } else {
          this.listSellers = res.message;
        }
        this.loadingService.closeSpinner();
      });
    }
  }

  /**
   * Funcionalidad para despelgar el menu de filtro de órdenes.
   * @memberof ToolbarOptionsComponent
   */
  toggleMenuOrderSearch() {
    if (this._idSeller === undefined) {
      this._idSeller = null;
    }
    this.shellComponent.toggleMenuSearchOrder(this.informationToForm, this._idSeller, this.Typeprofile, this.state, this.paginator);
  }

  /**
   * Funcionalidad para desplegar el modal que permita descargar las órdenes actuales del usuario
   * @memberof ToolbarOptionsComponent
   */
  openModalDownloadOrder(): void {
    const dialogRef = this.dialog.open(DownloadOrderModalComponent, {
      data: {
        limit: this.lengthOrder,
        billingType: this.billingType,
        type: 1
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail order was closed');
    });
  }

  openModalDownloadBillPay(): void {
    const dialogRef = this.dialog.open(DownloadBillingpayModalComponent, {
      data: {
        limit: this.lengthOrder,
        billingType: this.billingType
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail billing was closed');
    });
  }

  /**
   * Método que permite actualizar el valor del pageSize de la tabla de acuerdo al valor pasado,
   * luego se emite un evento que le indica al contenedor padre si se debe consultar un nuevo limite de órdenes.
   *
   * @param {DataEventPaginator} $event
   * @memberof ToolbarOptionsComponent
   */
  changeSizeOrderTable($event?: any): any {
    this.paginator.pageSize = $event.pageSize;
    const customData = {
      paginator: this.paginator,
      filter: this.filterParams
    };
    this.OnChangeSizeOrderTable.emit(customData);
  }
  /*
   *
   * Evento que permite escuchar los cambios en el input de busqueda para saber si no hay un valor ingresado y setear el campo
   * @param {*} event
   * @memberof ToolbarOptionsComponent
   */
  public whatchValueInput(event: any): void {
    if (event === '') {
      this.textForSearch.reset();
    }
  }

  /**
   * Método que permite emitir un evento al contenedor padre para saber cuando consultar la lista de órdenes.
   * @param {any} [category]: parametro opcional. solo para la pagina órdenes.
   * @memberof ToolbarOptionsComponent
   */
  getOrdersList(category?: any) {
    this.OnGetOrdersList.emit({ lengthOrder: this.lengthOrder, paginator: this.paginator, category: category, callOne: true });
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
   * Evento que permite capturar cuando un usuario presiona enter al estar en el input,
   * Este evento se agrega para poder obtener el primer resultado que se encuentre en la lista al momento de presionar enter
   * @param {any} event
   * @memberof SearchStoreComponent
   */
  public keyDownFunction(event: any): void {
    // keyCode 13 -> Enter
    if (event.keyCode === 13) {
      // Obtengo los ultimos registros almacenados sobre la lista de busqueda
      const suscribe = this.filteredOptions.subscribe((res: any) => {
        // busco dentro de los registro el que conincida con el cricterio de busqueda actual
        const found = res.find((x: StoreModel) => x.Name === this.textForSearch.value);
        // si hay algun resultado de busqueda, paso a visualizar la información de la tienda
        if (found !== undefined) {
          this.viewStoreInformation(found);
        }
      });
      suscribe.unsubscribe();
    }
  }

  /**
   * Método para obtener la paginación actual de la tabla donde este cargado el componente
   * @returns {object}
   * @memberof ToolbarOptionsComponent
   */
  getPaginator(): object {
    return this.paginator;
  }

  /**
   * Método que se encarga de ejecutar el event que le indica a los componentes que esten escuchando cualquier cambio
   * En la busqueda de tiendas
   * @param {any} search_seller
   * @memberof SearchStoreComponent
   */
  public viewStoreInformation(search_seller: StoreModel) {
    console.log('event toolbar: ', search_seller);
    if (this.searchComponent === true) {
      this.eventSearchSellerHistoric.searchSellerHistoric(search_seller);
    } else {
      this.eventsSeller.searchSeller(search_seller);
    }
  }

  public filter(val: string): string[] {
    if (val !== null && this.listSellers) {
      return this.listSellers.filter(option =>
        option.Name && option.Name.toLowerCase().includes(val.toLowerCase()));
    }
  }

  public getFilterParams() {
    this.shellComponent.eventEmitterOrders.filterParams.subscribe(((data: any) => this.filterParams = data));
  }
}

