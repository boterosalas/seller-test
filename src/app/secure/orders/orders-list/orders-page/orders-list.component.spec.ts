// /* 3rd party components */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { OrdersListComponent } from './orders-list.component';
// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { OrderService } from '../orders.service';
// import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService, AwsUtil } from '@app/core';
// import { SupportService } from '@app/secure/support-modal/support.service';
// import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
// import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MaterialModule } from '@app/material.module';
// import { HttpClientModule } from '@angular/common/http';
// import { AuthService } from '@app/secure/auth/auth.routing';
// import { of, throwError } from 'rxjs';
// import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { ShellComponent } from '@app/core/shell';
// import { ComponentsService, EventEmitterOrders } from '@app/shared';
// import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

// const responseRegexbody = {
//   body: {
//       Errors: [],
//       Data: [
//           {
//               Id: 69,
//               Identifier: 'formatNumber',
//               Module: 'ofertas',
//               Value: '^[0-9]+([.][0-9]{2})?$',
//               Description: 'Validación number format FRONT Ofertas',
//               ErrorMessage: 'No es válido'
//           },
//       ]
//   },
//   headers: null,
//   isBase64Encoded: false,
//   statusCode: 200
// };



// fdescribe('BrandsComponent', () => {
//     const registerMenu = {
//       Functionalities: [
//         {
//             NameFunctionality: 'Consultar',
//             ShowFunctionality: true,
//             nameFunctionalityBack: 'Consultar'
//         },
//         {
//             NameFunctionality: 'Visualizar',
//             ShowFunctionality: true,
//             nameFunctionalityBack: 'Visualizar'
//         },
//         {
//             NameFunctionality: 'Habilitar',
//             ShowFunctionality: true,
//             nameFunctionalityBack: 'Habilitar'
//         },
//         {
//             NameFunctionality: 'Deshabilitar',
//             ShowFunctionality: true,
//             nameFunctionalityBack: 'Deshabilitar'
//         },
//         {
//             NameFunctionality: 'Vacaciones',
//             ShowFunctionality: true,
//             nameFunctionalityBack: 'Vacaciones'
//         }
//     ]
//     };

//     const userData = {sellerProfile: 'seller'};
//     // Mock Services
//     const mockOrderService = jasmine.createSpyObj('OrderService', ['getOrderList', 'getOrdersFilter', 'sendProductOrder', 'sendAllProductInOrder', 'getCarries', 'recordProcesSedOrder', 'getCurrentFilterOrders', 'setCurrentFilterOrders']);
//     const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu', 'getMenuProfiel', 'getPermissionForMenu']);
//     const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
//     const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
//     const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
//     const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
//     const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//     const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
//     const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openSnackBar']);
//     const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);
//     const data = {
//         title: '',
//         message: '',
//         icon: '',
//         form: null,
//         btnConfirmationText: null,
//         showButtons: false
//     };
//     const formBuilder: FormBuilder = new FormBuilder();

//     // Create Variables for services and component
//     let fixture: ComponentFixture<OrdersListComponent>;
//     let orderComponent: OrdersListComponent;
//     let orderService: OrderService;
//     let dialogFixture: ComponentFixture<DialogWithFormComponent>;
//     let dialogComponent: DialogWithFormComponent;
//     let supportService: SupportService;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 MaterialModule,
//                 ReactiveFormsModule,
//                 FormsModule,
//                 RouterTestingModule,
//                 BrowserAnimationsModule,
//                 HttpClientModule
//             ],
//             declarations: [
//               OrdersListComponent,
//               DialogWithFormComponent
//             ],
//             providers: [
//                 { provide: ComponentsService, useValue: mockComponentsService },
//                 { provide: OrderService, useValue: mockOrderService },
//                 EndpointService,
//                 EventEmitterOrders,
//                 { provide: LoadingService, useValue: mockLoadingService },
//                 // { provide: SupportService, useValue: mockSupportService },
//                 SupportService,
//                 // { provide: AuthService, useValue: mockAuthService },
//                 AuthService,
//                 UserParametersService,
//                 CognitoUtil,
//                 AwsUtil,
//                 EventEmitterSeller,
//                 { provide: UserLoginService, useValue: mockUserLoginService },
//                 { provide: ModalService, useValue: mockDialogError },
//                 { provide: MatDialog, useValue: mockDialog },
//                 { provide: MAT_DIALOG_DATA, useValue: data },
//                 { provide: MatDialogRef, useValue: mockDialogRef },
//                 { provide: UserParametersService, useValue: mockUserParameterService },
//                 ShellComponent
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//         }).compileComponents();

//         TestBed.overrideModule(BrowserDynamicTestingModule, {
//             set: {
//                 entryComponents: [DialogWithFormComponent]
//             }
//         });
//     }));

//     beforeEach(() => {
//         mockAuthService.getMenu.and.returnValue(registerMenu);
//         fixture = TestBed.createComponent(OrdersListComponent);
//         orderComponent = fixture.componentInstance;
//         orderService = TestBed.get(OrderService);
//         supportService = TestBed.get(SupportService);
//         dialogFixture = TestBed.createComponent(DialogWithFormComponent);
//         dialogComponent = dialogFixture.componentInstance;
//         mockAuthService.getPermissionForMenu.and.returnValue(true);
//         mockSupportService.getRegexFormSupport.and.returnValue(of(responseRegexbody));
//         // mockBrandsService.getAllBrands.and.returnValue(of(response));

//         const mockUser = Object.assign({}, userData);
//     const responseGetUser = {
//       body: {
//         body: JSON.stringify({ Data: mockUser })
//       }
//     };
//     // Define la respuesta de la información de un usuario
//     mockUserParameterService.getUserData.and.returnValue(of(responseGetUser));
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(orderService).toBeTruthy();
//         expect(orderComponent).toBeTruthy();
//     });
// });
