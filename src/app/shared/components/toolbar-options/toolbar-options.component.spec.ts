
// /* 3rd party components */
// import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// /* our own custom components */
// import { ToolbarOptionsComponent } from './toolbar-options.component';
// import { ToolbarOptionsModule } from './toolbar-options.module';
// import { ShellComponent } from '@app/core/shell';
// import { MatSidenavModule, MatTooltipModule, MatIconModule, MatExpansionModule, MatListModule, MatCardModule, MatToolbarModule, MatMenuModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatSlideToggleModule, MatTableModule } from '@angular/material';
// import { SidebarComponent } from '@app/core/shell/sidebar/sidebar.component';
// import { SearchOrderMenuComponent } from '@app/core/shell/search-order-menu/search-order-menu.component';
// import { HeaderComponent } from '@app/core/shell/header/header.component';
// import { ToolbarLinkComponent } from '@app/core/shell/toolbar-link';
// import { TranslateModule } from '@ngx-translate/core';
// import { SelectLanguageComponent } from '../select-language/select-language.component';
// import { NotificationCircleComponent } from '../notification-circle/notification-circle.component';
// import { SearchOrderFormComponent } from '@app/core/shell/search-order-menu/search-order-form/search-order-form.component';
// import { SearchPendingDevolutionFormComponent } from '@app/core/shell/search-order-menu/search-pending-devolution-form/search-pending-devolution-form.component';
// import { SearchEnviosExitoFormComponent } from '@app/core/shell/search-order-menu/search-envios-exito-form/search-envios-exito-form.component';
// import { HistoricalDevolutionComponent } from '@app/secure/orders/historical-devolution/historical-devolution-page/historical-devolution.component';
// import { SearchBillingFormComponent } from '@app/core/shell/search-order-menu/search-billing-form/search-billing-form.component';
// import { SearchHistoricalDevolutionFormComponent } from '@app/core/shell/search-order-menu/search-historical-devolution-form/search-historical-devolution-form.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { StoreService } from '@app/store/store.service';
// import { ConfigurationState } from '@app/store/configuration';
// import { of } from 'rxjs';
// import { LoadingService } from '@app/core';
// import { StoresService } from '@app/secure/offers/stores/stores.service';
// import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
// import { EventEmitter } from '@angular/core';
// import { EventEmitterOrders } from '@app/shared/services';
// import { before } from 'selenium-webdriver/testing';

// let GLOBAL_STATUS = 200;

// describe('ToolbarOptionsComponent', () => {
//   let component: ToolbarOptionsComponent;
//   let fixture: ComponentFixture<ToolbarOptionsComponent>;

//   beforeEach(fakeAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         ShellComponent,
//         SidebarComponent,
//         SearchOrderMenuComponent,
//         HeaderComponent,
//         ToolbarLinkComponent,
//         SelectLanguageComponent,
//         NotificationCircleComponent,
//         SearchOrderFormComponent,
//         SearchPendingDevolutionFormComponent,
//         SearchEnviosExitoFormComponent,
//         HistoricalDevolutionComponent,
//         SearchBillingFormComponent,
//         SearchHistoricalDevolutionFormComponent
//       ],
//       imports: [
//         TranslateModule.forRoot({}),
//         ToolbarOptionsModule,
//         RouterTestingModule,
//         MatSidenavModule,
//         MatTooltipModule,
//         MatIconModule,
//         MatExpansionModule,
//         MatListModule,
//         MatCardModule,
//         MatToolbarModule,
//         MatMenuModule,
//         MatSelectModule,
//         MatOptionModule,
//         MatDatepickerModule,
//         MatSlideToggleModule,
//         MatTableModule,
//         FormsModule,
//         ReactiveFormsModule,
//       ],
//       providers: [
//         { provide: StoresService, useClass: StoresServiceTest },
//         { provide: EventEmitterSeller, useClass: EventEmitterSellerTest },
//         { provide: ShellComponent, useClass: ShellComponentTest },
//         { provide: LoadingService, useClass: LoadingServiceTest },
//         { provide: EventEmitterOrders, useClass: EventEmitterOrdersTest }
//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ToolbarOptionsComponent);
//     component = fixture.componentInstance;
//     component.informationToForm = {
//       title: "string",
//       subtitle: "string",
//       type_form: "string",
//       btn_title: "string",
//       title_for_search: "string",
//       information: {
//         reversionRequestStatusId: 2
//       },
//       count: "string"
//     }
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should isFullSearch to be false', () => {
//     component.isFullSearch = false;
//     fixture.detectChanges();
//     component.ngOnInit();
//     expect(component.isFullSearch).toBeFalsy();
//   });

//   it('should listSellers be equal to data', () => {
//     const data = [1, 2, 3, 4];
//     expect(JSON.stringify(component.listSellers)).toBe(JSON.stringify(data));
//   });


// });

// class StoreServiceTest {
//   getStateConfiguration() {
//     const configurationState: ConfigurationState = { language: 'US', statusCases: [] };
//     return of({
//       appConfiguration: configurationState,
//       configuration: { modules: [] },
//       notification: {
//         sumaUnreadDevolutions: 2,
//         unreadCases: 2,
//         unreadDevolutions: 2,
//         unreadPendings: 2
//       }
//     });
//   }
// }

// class StoresServiceTest {

//   constructor() { }

//   getAllStoresFull(user: any) {
//     const bodyJSON = {
//       Data: [1, 2, 3, 4]
//     };

//     const response = {
//       status: 200,
//       body: {
//         body: JSON.stringify(bodyJSON)
//       }
//     };

//     return of(response);
//   }

//   getAllStores(user: any) {
//     const bodyJSON = { Data: [1, 2, 3, 4] };

//     const response = {
//       status: GLOBAL_STATUS,
//       body: {
//         body: JSON.stringify(bodyJSON)
//       }
//     };

//     return of(response);
//   }
// }

// class LoadingServiceTest {

//   viewSpinner() { }
//   closeSpinner() { }

// }

// class EventEmitterSellerTest {

//   filterParams = new EventEmitter<any>();

//   constructor() {
//     // this.filterParams.next("data")
//   }

// }

// class ShellComponentTest {

//   eventEmitterOrders: EventEmitterOrdersTest = new EventEmitterOrdersTest;

//   objectToEmit = {
//     data: {
//       nombre: "Manuel",
//       title: "hello"
//     }
//   }

//   constructor() {
//     this.eventEmitterOrders.filterParams.emit(this.objectToEmit)
//   }

// }

// class EventEmitterOrdersTest {

//   filterParams: EventEmitter<any> = new EventEmitter<any>();

//   objectToEmit = {
//     data: {
//       nombre: "Manuel",
//       title: "hello"
//     }
//   }

//   constructor() {
//     this.filterParams.emit(this.objectToEmit)
//   }

// }
