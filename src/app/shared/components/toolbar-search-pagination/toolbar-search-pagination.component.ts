import { Component, EventEmitter, Input, Output, ViewChild, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog, MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material';
import { Logger } from '@app/core/util';
import { ShellComponent } from '@core/shell/shell.component';
import { DownloadOrderModalComponent } from '@secure/orders/download-order-modal';
import { DownloadBillingpayModalComponent } from '@secure/billing/download-billingpay-modal/download-billingpay-modal.component';
import { map, startWith } from 'rxjs/operators';
import { SearchFormEntity } from '@shared/models';
import { getDutchPaginatorIntl } from '@shared/services';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { LoadingService } from '@app/core';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';


const log = new Logger('ToolbarOptionsComponent');


@Component({
  selector: 'app-toolbar-search-pagination',
  templateUrl: './toolbar-search-pagination.component.html',
  styleUrls: ['./toolbar-search-pagination.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    }
  ],
})
export class ToolbarSearchPaginationComponent implements OnInit, OnChanges {

  // variable que almacena el texto que se obtiene del input al buscar.
  public textForSearch: FormControl;

  // Información del usuario
  public user: any;
  // variable que almacena la lista de tiendas disponibles para buscar
  public listSellers: any;

  pageEvent: PageEvent;

  // variable que almacena los resultados obtenidos al realizar el filtro del autocomplete
  public filteredOptions: Observable<string[]>;

  @Input() searchSellerInput;

  // Para identificar qué tipo de búsqueda se va a realizar.
  @Input() isFullSearch: boolean;
   public _showContainerDetail: boolean;
  @Input() set showContainerDetail(value: boolean) {
      this._showContainerDetail = value;
  }

  @Input() customerFilterCalifications = false;



  //  Elemento paginador para la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Variable que almacena la configuración para el formulario
  @Input() informationToForm: SearchFormEntity;
  @Input() billingType: boolean;
  @Input() downloadPermission: boolean;
  @Input() downloadBillingPay: boolean;
  @Input() idSeller: number;
  @Input() Typeprofile: number;
  @Input() state: number;
  @Input() loadSeller = true;
  @Input() set isClear(value: boolean) {
    if (value) {
      this.paginator.firstPage();
    }
  }

  @Input() set pageIndexChange(value: number){
    // this.paginator.pageIndex = value;
  }

  // Boolean que indica si hay órdenes o no
  @Input() orderListLength: boolean;
  // Evento que permite consultar las órdenes
  @Output() OnGetOrdersList = new EventEmitter<object>();
  @Output() paginationListOrdens = new EventEmitter<object>();
  @Output() filterCalifications = new EventEmitter<any>();
  // Evento que permite saber cuando el usuario cambia el número de paginas
  @Output() OnChangeSizeOrderTable = new EventEmitter<object>();
  // Limite de registros
  // lengthOrder = 100;
  @Input() lengthOrder: number;
  // Numero de paginas por defecto
  pageSizeOrder: number;

  /**
   * Creates an instance of ToolbarOptionsComponent.
   * @param {MatDialog} dialog
   * @param {ShellComponent} shellComponent
   * @memberof ToolbarOptionsComponent
   */
  constructor(
    public dialog: MatDialog,
    public shellComponent: ShellComponent,
    public eventsSeller: EventEmitterSeller,
    public storeService: StoresService,
    public shell: ShellComponent,
    private loadingService: LoadingService,
  ) {
    this.textForSearch = new FormControl();
    this.user = {};
    this.listSellers = [];
    this.isFullSearch = true;
  }


  ngOnInit() {
    this.filteredOptions = this.textForSearch.valueChanges
      .pipe(
        startWith(''),
        map((val: any) =>
          this.filter(val)
        )
      );
      if (this.loadSeller) {
        this.getAllSellers();
      }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchSellerInput && changes.searchSellerInput.currentValue && changes.searchSellerInput.currentValue !== undefined &&
      changes.searchSellerInput.currentValue !== null) {
      this.viewStoreInformation(this.searchSellerInput);
    }
  }

  /**
   * Funcionalidad para despelgar el menu de filtro de órdenes.
   * @memberof ToolbarOptionsComponent
   */
  toggleMenuOrderSearch() {
    this.shellComponent.toggleMenuSearchOrder(this.informationToForm, this.idSeller, this.Typeprofile, this.state);
  }
  toggleMenuCalifications() {
    this.filterCalifications.emit();
  }

  /**
   * Funcionalidad para desplegar el modal que permita descargar las órdenes actuales del usuario
   * @memberof ToolbarOptionsComponent
   */
  openModalDownloadOrder(): void {
    const dialogRef = this.dialog.open(DownloadOrderModalComponent, {
      data: {
        limit: this.lengthOrder,
        billingType: this.billingType
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
   *  luego se emite un evento que le indica al contenedor padre si se debe consultar un nuevo limite de órdenes.
   * @memberof ToolbarOptionsComponent
   */
  changeSizeOrderTable() {
    this.paginator.pageSize = this.pageSizeOrder;
    this.OnChangeSizeOrderTable.emit(this.paginator);
  }

  /**
   * Método que permite emitir un evento al contenedor padre para saber cuando consultar la lista de órdenes.
   * @param {any} [category]: parametro opcional. solo para la pagina órdenes.
   * @memberof ToolbarOptionsComponent
   */
  getOrdersList(category?: any) {
    this.paginator.firstPage();
    this.OnGetOrdersList.emit({
        'limit': this.lengthOrder + '&paginationToken=' + encodeURI('{}'),
        'idSeller': this.idSeller,
        'state': category,
        'callOne': true
      }
    );
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
   * Método para obtener la paginación actual de la tabla donde este cargado el componente
   * @returns {object}
   * @memberof ToolbarOptionsComponent
   */
  getPaginator(): object {
    return this.paginator;
  }


  /**
   * Método empleado para consultar la lista de tiendas disponibles
   * @memberof SearchStoreComponent
   */
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
   * Evento que permite escuchar los cambios en el input de busqueda para saber si no hay un valor ingresado y setear el campo
   * @param {any} event
   * @memberof SearchStoreComponent
   */
  public whatchValueInput(event: any): void {
    if (event === '') {
      this.textForSearch.reset();
    }
  }

  /**
   * Método que retorna el resultado dentro del array de tiendas disponible
   * @param {string} val
   * @returns {string[]}
   * @memberof SearchStoreComponent
   */
  public filter(val: string): string[] {
    if (val !== null && this.listSellers) {
      return this.listSellers.filter(option =>
        option.Name && option.Name.toLowerCase().includes(val.toLowerCase()));
    }
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
   * Método que se encarga de ejecutar el event que le indica a los componentes que esten escuchando cualquier cambio
   * En la busqueda de tiendas
   * @param {any} search_seller
   * @memberof SearchStoreComponent
   */
  public viewStoreInformation(search_seller: StoreModel) {
    // llamo el eventEmitter que se emplea para notificar cuando una tienda ha sido consultada
    this.eventsSeller.searchSeller(search_seller);
  }

/**
 * funcion que emite el cambio de la paginacion y rango de busqueda
 *
 * @param {*} param
 * @returns {*}
 * @memberof ToolbarSearchPaginationComponent
 */
public changePaginatorOrdens(param: any): any {
    this.paginationListOrdens.emit({ param });
  }
}
