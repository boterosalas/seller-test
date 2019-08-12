// /* 3rd party components */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';

// /* our own custom components */
// import { InDevolutionComponent } from './in-devolution.component';
// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component } from '@angular/core';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { MaterialModule } from '@app/material.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpClientModule } from '@angular/common/http';
// import { EndpointService, LoadingService, UserParametersService, UserLoginService, DynamoDBService, CognitoUtil } from '@app/core';
// import { ShellComponent } from '@app/core/shell';
// import { ComponentsService, EventEmitterOrders } from '@app/shared';
// import { AuthService } from '@app/secure/auth/auth.routing';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { AuthRoutingService } from '@app/secure/auth/auth.service';
// import { InDevolutionService } from '../in-devolution.service';

// @Component({
//   selector: 'app-toolbar-options',
//   template: '<p>Mock User Component [informationToForm]="informationToForm"</p>'
// })

// class MockAppToolBarComponent {
// }

// describe('InDevolutionComponent', () => {
//   let component: InDevolutionComponent;
//   let fixture: ComponentFixture<InDevolutionComponent>;


//   const registerMenu = {
//     Functionalities: [{
//       NameFunctionality: 'Consultar',
//       ShowFunctionality: true,
//       nameFunctionalityBack: 'Consultar'
//     },
//     {
//       NameFunctionality: 'Aceptar',
//       ShowFunctionality: true,
//       nameFunctionalityBack: 'Aceptar'
//     },
//     {
//       NameFunctionality: 'Rechazar',
//       ShowFunctionality: true,
//       nameFunctionalityBack: 'Rechazar'
//     }
//     ]
//   };

//   const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//   const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);
//   const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
//   const mockAInDevolutionService = jasmine.createSpyObj('InDevolutionService', ['getOrders', 'acceptOrDeniedDevolution', 'getReasonsRejection']);
//   const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
//   const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openSnackBar']);
//   const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);


//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         MaterialModule,
//         ReactiveFormsModule,
//         FormsModule,
//         RouterTestingModule,
//         BrowserAnimationsModule,
//         HttpClientModule
//       ], declarations: [
//         InDevolutionComponent,
//         MockAppToolBarComponent
//       ],
//       providers: [
//         EndpointService,
//         { provide: LoadingService, useValue: mockLoadingService },
//         ShellComponent,
//         { provide: UserParametersService, useValue: mockUserParameterService },
//         { provide: InDevolutionService, useValue: mockAInDevolutionService },
//         { provide: ComponentsService, useValue: mockComponentsService },
//         { provide: UserLoginService, useValue: mockUserLoginService },
//         { provide: AuthService, useValue: mockAuthService },
//         EventEmitterOrders,
//         { provide: MatDialogRef, useValue: mockDialogRef },
//         { provide: MAT_DIALOG_DATA, useValue: [] },
//         // UserLoginService,
//         // DynamoDBService,
//         // CognitoUtil,
//         // AuthRoutingService
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     mockAuthService.getMenu.and.returnValue(registerMenu);
//     fixture = TestBed.createComponent(InDevolutionComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('', () => {
//     beforeEach(() => {
//       // component.toolbarOption.getOrdersList = undefined;
//       fixture.detectChanges();
//     });
//     // it('Método para realizar la descarga de las órdenes.', () => {
//     //   component.getOrdersListSinceFilterSearchOrder();
//     // });
//   });
// });

