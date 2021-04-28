import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { AwsUtil, CognitoUtil, LoadingService, Logger, UserLoginService, UserParametersService, ModalService, } from '@app/core';
import { CategoryList, ComponentsService, Const, InformationToForm, Order, RoutesConst, SearchFormEntity, UserInformation, } from '@app/shared';
import { ShellComponent } from '@core/shell';

import { MenuModel, readFunctionality, downloadFunctionality, sendFunctionality, attachmentFunctionality, allName, idSended, idToSend, sendedName, toSendName, marketFuncionality, visualizeFunctionality } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { OrderService } from '@app/secure/orders/orders-list/orders.service';
import { FraudNotificationService } from './fraud-notification.service';
import { UploadFraudComponent } from './components/upload-fraud/upload-fraud.component';


const log = new Logger('FraudNotificationComponent');

@Component({
  selector: 'app-fraud-notification',
  templateUrl: './fraud-notification.component.html',
  styleUrls: ['./fraud-notification.component.scss']
})
export class FraudNotificationComponent implements OnInit {

   // Constantes
   public const = Const;
   // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
   @ViewChild(MatSort, {static: false}) sort: MatSort;
   // Toolbar Options Componente: Permite acceder a los metodos de este compomente
   @ViewChild('toolbarOptions', {static: false}) toolbarOption;
   // Columnas que se visualizan en la tabla
   public displayedColumns = [
    'name',
    'creationDate'
  ];
   //  Creo el elemento que se empleara para la tabla
   dataSource: MatTableDataSource<Order>;
   // Contiene la información de las órdenes consultadas
   currentOrderList: Array<Order>;

   //  Variable que almacena el numero de elementos de la tabla
   numberElements = 0;
   // estado por defecto para listar las órdenes
   stateToListOrders: CategoryList;
   // Variable que contiene la categoría por defecto que se empleara en la consulta inicial
   currentCategory: any = {
     name: 'secure.orders.order_list.order_page.all_orders',
     id: ''
   };
 
   public idSeller = '';
   public event: any;
   public paginationToken = '{}';
   public params: any;
   public onlyOne = true;
   public onlyOneCall = true;
   public call = true;
   public positionPagination: any;
   public arrayPosition = [];
   public listOrdens: any;
   public dateOrderInitial = '';
   public dateOrderFinal = '';
   public fileName = '';
   public orderNumber = '';
   public idStatus = '';
   public identificationCard = '';
   public processedOrder = '';
   public bill = '';
 
 
   public length = 0;
   public pageSize = 50;
   public querySearch = '';
 
   // ------------------------------------------------------------
   dataListOrder = [];
 
   // Variables con los permisos que este componente posee.
   permissionComponent: MenuModel;
   read = readFunctionality;
   download = downloadFunctionality;
   attachment = attachmentFunctionality;
   send = sendFunctionality;
   market = marketFuncionality;
   visualizeFunctionality = visualizeFunctionality;
   readPermission: boolean;
   downloadPermission: boolean;
   sendPermission: boolean;
   attachmentPermission: boolean;
   marketPermission: boolean;
   visualizePermission: boolean;
   showMenssage = false;
   isClear = false;
   pageIndexChange = 0;
   isFullSearch = false;
 
 
   typeProfile: number;
   // Fin de variables de permisos.
 
   // varialbe que almacena el número de órdenes obtenidas
   orderListLength = false;
   // suscriptions vars
   public subStateOrder: any;
   public subFilterOrder: any;
   public subOrderList: any;
   // Información del usuario
   public user: UserInformation;
   // Variable que permite indicar si mostrar la opción de check o no
   optionCheckInTable = false;
   // Variable que almacena la ruta actual para saber la categoría que se esta consultando
   currentRootPage: any;
   // Variable que almacena el objeto de paginación actual para listar las órdenes.
   currentEventPaginate: any;
   // Variable para almacenar los filtros seleccionados
   allFilter: any;
 
   public informationToForm: SearchFormEntity = {
    title: 'Reportes',
    subtitle: 'menu.Notificación de Fraudes',
    btn_title: 'Reportes',
    title_for_search: 'Filtros reporte',
    type_form: 'fraud-notification',
    information: new InformationToForm,
    count: this.numberElements.toString()
  };
 
   public cognitoId: string;
   public numberLength: number;
   public lastState: number;
   private searchSubscription: any;
   public userCurrent: any;
   public isInternational = false;
   public arrayPermission: any;
   currentLanguage: string;
   isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
 
 
   constructor(
     private shellComponent: ShellComponent,
     private loadingService: LoadingService,
     private route: ActivatedRoute,
     private router: Router,
     public dialog: MatDialog,
     public location: Location,
     public componentService: ComponentsService,
     private orderService: OrderService,
     public awsUtil: AwsUtil,
     public userService: UserLoginService,
     public cognito: CognitoUtil,
     public userParams: UserParametersService,
     public authService: AuthService,
     private languageService: TranslateService,
     public eventsSeller: EventEmitterSeller,
     private profileService: MyProfileService,
     public modalService: ModalService,
     private __fraudService: FraudNotificationService,
   ) {
     this.getAllDataUser();
   }
 
   /**
    * ngOnInit
    * @memberof OrdersListComponent
    */
   ngOnInit() {
     this.getMenuSelected();
     this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
       if (seller) {
         if (seller.IdSeller) {
           this.idSeller = seller.IdSeller;
         }
         if (seller.Country) {
           if (seller.Country === 'Colombia' || seller.Country === 'COLOMBIA') {
             this.isInternational = false;
           } else {
             this.isInternational = true;
           }
         } else {
           this.isInternational = false;
         }
       }
       const paramsArray = {
         'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),

         'state': this.lastState,
         'callOne': true
       };
       this.getOrdersList(paramsArray);
 
     });
     this.changeLanguage();
   }
 
   async getAllDataUser() {
     if (this.profileService.getUser() && await this.profileService.getUser().toPromise()) {
       const sellerData = await this.profileService.getUser().toPromise().then(res => {
         const body: any = res.body;
         const response = JSON.parse(body.body);
         const userData = response.Data;
         return userData;
       });
       if (sellerData.Country !== 'COLOMBIA') {
         this.isInternational = true;
       } else {
         this.isInternational = false;
       }
     }
   }
   /**
    * funcion para escuchar el evento al cambiar de idioma
    *
    * @memberof OrdersListComponent
    */
   changeLanguage() {
     if (localStorage.getItem('culture_current') !== 'US') {
       this.currentLanguage = 'ES';
       localStorage.setItem('culture_current', 'ES');
     } else {
       this.currentLanguage = 'US';
       localStorage.setItem('culture_current', 'US');
     }
     this.languageService.onLangChange.subscribe((e: Event) => {
       localStorage.setItem('culture_current', e['lang']);
       const paramsArray = {
         'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
         'state': this.lastState,
         'callOne': true
       };
       this.getOrdersList(paramsArray);
     });
   }
 
 
   /**
    * Funcion para verificar el menu y los permisos que este posee.
    * Verifica si la ruta posee ID (esto indica que debe tener las ordenes de ese tipo)
    * y si no posee id trae todos los estados.
    * @memberof OrdersListComponent
    */
   public getMenuSelected(): void {
     this.route.params.subscribe(params => {
       this.currentRootPage = params['category'];
       const category = RoutesConst.CATEGORYLIST.filter(item => item.id === this.currentRootPage);
       // Mediante la categoria obtiene el menu al cual desea apuntar
       if (!category[0]) {
         this.getDataUser(allName);
       } else {
         const selected = category[0].id;
         if (selected.toString() === idSended) {
           this.getDataUser(sendedName);
         } else if (selected.toString() === idToSend) {
           this.getDataUser(toSendName);
         }
       }
       // Logica para cargar el componente
       this.getOrdersListSinceCurrentUrl();
       this.getOrdersListSinceFilterSearchOrder();
       this.clearData();
     });
   }
 
   async getDataUser(nameMenu: string) {
     this.user = await this.userParams.getUserData();
     if (this.user.sellerProfile === 'seller') {
       this.permissionComponent = this.authService.getMenuProfiel(nameMenu, 0);
       this.setPermission(0);
     } else {
       this.permissionComponent = this.authService.getMenuProfiel(nameMenu, 1);
       this.setPermission(0);
     }
   }
   /**
    * Funcion para obtener los permisos del componente
    * @param {number} typeProfile
    * @memberof OrdersListComponent
    */
   setPermission(typeProfile: number) {
     // Permisos del componente.
     this.typeProfile = typeProfile;
     this.readPermission = this.getFunctionality(this.read);
     this.downloadPermission = this.getFunctionality(this.download);
     this.sendPermission = this.getFunctionality(this.send);
     this.attachmentPermission = this.getFunctionality(this.attachment);
     this.marketPermission = this.getFunctionality(this.market);
     this.visualizePermission = this.getFunctionality(this.visualizeFunctionality);
     this.arrayPermission = {
       read: this.readPermission,
       download: this.downloadPermission,
       send: this.sendPermission,
       attachment: this.attachmentPermission,
       market: this.marketPermission,
       visualize: this.visualizePermission
     };
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
    * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro de órdenes en la opcion search-order-menu
    * @memberof OrdersListComponent
    */
   getOrdersListSinceFilterSearchOrder() {
     this.subFilterOrder = this.shellComponent.eventEmitterOrders.filterOrderList.subscribe(
       (data: any) => {
         if (data && data.count > 0) {
           if (data != null) {
             if (data && data.viewModel && data.viewModel.length === 0) {
               this.orderListLength = true;
             } else {
               this.orderListLength = false;
             }
             if ( this.dataListOrder && this.dataListOrder.length > 0) {
               this.numberElements = this.dataListOrder.length;
             } else {
               this.numberElements = 0;
             }
             this.length = data.count;
             this.isClear = true;
             this.dataSource = new MatTableDataSource(data.viewModel);
             this.dataListOrder = data.viewModel;
             const paginator = this.toolbarOption.getPaginator();
             paginator.pageIndex = 0;
             this.dataSource.paginator = paginator;
             this.dataSource.sort = this.sort;
             this.setTitleToolbar();
             this.loadingService.closeSpinner();
           }
         } else {
           this.orderListLength = true;
           this.length = 0;
           this.isClear = true;
           this.dataSource = new MatTableDataSource();
           this.dataListOrder = [];
           const paginator = this.toolbarOption.getPaginator();
           paginator.pageIndex = 0;
           this.dataSource.paginator = paginator;
           this.dataSource.sort = this.sort;
           this.setTitleToolbar();
           this.loadingService.closeSpinner();
         }
 
         if (data && data.filter) {
           this.dateOrderInitial = data.filter.dateOrderInitial;
           this.dateOrderFinal = data.filter.dateOrderFinal;
           this.fileName = data.filter.fileName;
         }
         this.allFilter = data.filter;
       });
   }
   /**
    * limpia la tabla
    *
    * @memberof OrdersListComponent
    */
   clearData() {
     this.subFilterOrder = this.shellComponent.eventEmitterOrders.clearTable.subscribe(
       (data: any) => {
         const paramsArray = {
           'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
  
           'state': this.lastState,
           'callOne': true,
           'clear': true
         };
         this.isClear = true;
         this.getOrdersList(paramsArray);
       });
   }
 
   /**
    * Evento que permite obtener los parametros pasados por la url
    * @memberof OrdersListComponent
    */
   getOrdersListSinceCurrentUrl() {
     this.subStateOrder = this.route.params.subscribe(params => {
       this.currentRootPage = params['category'];
       if (this.currentRootPage !== undefined) {
         const category = RoutesConst.CATEGORYLIST.filter(item => item.id === this.currentRootPage);
         if (category[0] !== undefined) {
           this.currentCategory = category[0];
           const data = {
             idStatusOrder: this.currentRootPage
           };
           const paramsArray = {
             'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
             'state': this.currentRootPage,
             'callOne': true
           };
           this.orderService.setCurrentFilterOrders(data);
           this.getOrdersList(paramsArray);
           this.setTitleToolbar();
         } else {
           this.orderService.setCurrentFilterOrders({});
           this.getAllOrderList();
         }
       } else {
         this.orderService.setCurrentFilterOrders({});
         this.getOrdersList();
       }
     });
     this.ngOnDestroy();
   }
 
   /**
    * Funcionalidad para dirigir a la vista principal de órdenes.
    * @memberof OrdersListComponent
    */
   getAllOrderList() {
     const paramsArray = {
       'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
       'state': this.lastState,
       'callOne': true,
       'clear': true
     };
     this.isClear = true;
     this.getOrdersList(paramsArray);
   }
 
   /**
    * Funcionalidad para cancelar los propagation .
    * @param {Event} event
    * @memberof OrdersListComponent
    */
   stopPropagation(event: Event) {
     event.stopPropagation();
   }
 
   /**
    * Método para cambiar el page size de la tabla órdenes
    * @memberof OrdersListComponent
    */
   changeSizeOrderTable($event: any) {
     this.dataSource.paginator = $event.paginator;
   }
 

   /**
    * Funcionalidad para consultar la lista de órdenes
    * @param {*} $event
    * @param {any} [state]
    * @memberof OrdersListComponent
    */
   getOrdersList(params?: any) {
     this.loadingService.viewSpinner();
     this.isClear = false;
     this.params = this.setParameters(params);
     let stateCurrent = null;
     this.__fraudService.getOrderList(this.params).subscribe((res: any) => {
       if (res) {
         if (res.pendingResponse) {
           this.getOrdersList(params);
         } else {
             stateCurrent = params ? params.state : null;
             this.lastState = stateCurrent;
             this.setTable(res);
             if (params && params.callOne) {
               this.length = res.count;
               this.isClear = true;
             }
             const paginator = { 'pageIndex': 0 };
         }
       }
     });
   }
 
   setParameters(params: any) {
     if (params && params.callOne) {
       this.paginationToken = '{}';
       this.arrayPosition = [];
     }
     if (params && params.clear) {
       this.dateOrderFinal = '';
       this.dateOrderInitial = '';
       this.fileName = '';
     }
     const paramsArray = {
       'limit': this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken) + this.querySearch,
       'dateOrderFinal': this.dateOrderFinal,
       'dateOrderInitial': this.dateOrderInitial,
       'fileName': this.fileName,
     };
     return paramsArray;
   }
 
   /**
    * funcion para resetear la data
    *
    * @param {*} res
    * @memberof OrdersListComponent
    */
   setTable(res: any) {
     if (res) {
       if (this.onlyOne) {
         this.length = res.count;
         this.arrayPosition = [];
         this.arrayPosition.push('{}');
       }
       this.dataSource = new MatTableDataSource(res.viewModel);
       res.viewModel.forEach(element => {
         element.statusLoad = false;
       });
       this.dataListOrder = res.viewModel;
       this.savePaginationToken(res.paginationToken);
       this.loadingService.closeSpinner();
     } else {
       this.clearTable();
     }
     this.onlyOne = false;
   }
   
   /**
    * funcion para salvar el token de la paginacion
    *
    * @param {string} paginationToken
    * @memberof OrdersListComponent
    */
   savePaginationToken(paginationToken: string) {
     if (paginationToken) {
       this.paginationToken = paginationToken;
     }
   }
   /**
    * limpiar el contador de la tabla
    *
    * @memberof OrdersListComponent
    */
   clearTable() {
     this.length = 0;
   }
   /**
    * funcion que escucha el cambio de paginacion y el rango de busqueda
    *
    * @param {*} event
    * @memberof OrdersListComponent
    */
   paginations(event: any) {
     const index = event.param.pageIndex;
     if (event.param.pageSize !== this.pageSize) {
       this.pageSize = event.param.pageSize;
       if (this.arrayPosition && this.arrayPosition.length > 0) {
         this.arrayPosition = [];
         this.isClear = true;
       }
     } else {
       this.querySearch = '';
     }
     if (index === 0) {
       this.paginationToken = '{}';
     }
     const isExistInitial = this.arrayPosition.includes('{}');
     if (isExistInitial === false) {
       this.arrayPosition.push('{}');
     }
     const isExist = this.arrayPosition.includes(this.paginationToken);
     if (isExist === false) {
       this.arrayPosition.push(this.paginationToken);
     }
 
     this.paginationToken = this.arrayPosition[index];
     if (this.paginationToken === undefined) {
       this.paginationToken = '{}';
       this.isClear = true;
     }
     const params = {
       'limit': this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
       'fileName': this.fileName,
       'dateOrderFinal': this.dateOrderFinal,
       'dateOrderInitial': this.dateOrderInitial,
     };
     this.getOrdersList(params);
   }
 
  
   /**
    * Método para realizar un update en los datos pasados al componente toolbar-options
    * @memberof OrdersListComponent
    */
   setTitleToolbar() {
     this.informationToForm.subtitle = `${this.currentCategory.name}`;
   }
 
   /**
    * Se crea funcion para transformar fecha dependiendo de la zona horaria. (getTimezoneOffset)
    *
    * @param {*} date
    * @returns {*}
    * @memberof OrdersListComponent
    */
   public getDateWithOutGMT(date: any): any {
     const timezone = new Date().getTimezoneOffset();
     const time = new Date(date).getTime(); // new Date('2019-02-03T00:42:06.177+00:00').getTime();
     return new Date(time + (timezone * 60 * 1000));
   }
 
   consultDetails($event: any, item: any) {
     item.statusLoad = true;
   }

     /**
  * funcion para mostrar el modal de creacion de modulo
  *
  * @memberof FraudNotificationComponent
  */
  chargeFraud() {
    const dialog = this.dialog.open(UploadFraudComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
    const dialogIntance = dialog.componentInstance;

  }
 
   /**
    * funcion para destruir las subcripciones abiertas
    *
    * @memberof OrdersListComponent
    */
   ngOnDestroy() {
     if (this.subStateOrder !== undefined) {
       this.subStateOrder.unsubscribe();
     }
     if (this.subFilterOrder !== undefined) {
       this.subFilterOrder.unsubscribe();
     }
     if (this.searchSubscription) {
       this.searchSubscription.unsubscribe();
     }
   }

}
