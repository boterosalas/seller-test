// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ListAdminComponent } from './list-admin.component';
// import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ShellComponent } from '@app/core/shell';
// import { ComponentsService, EventEmitterOrders } from '@app/shared';
// import { UserLoginService, DynamoDBService, CognitoUtil, EndpointService, UserParametersService, ModalService, LoadingService } from '@app/core';
// import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
// import { MatDialogRef, MatDialogModule, MatSnackBarModule } from '@angular/material';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { DatePipe } from '@angular/common';
// import { AuthService } from '@app/secure/auth/auth.routing';
// import { of } from 'rxjs';
// import { TranslateModule } from '@ngx-translate/core';
// import { HttpClientTestingModule } from '@angular/common/http/testing';

// describe('ListAdminComponent', () => {
//   let component: ListAdminComponent;
//   let fixture: ComponentFixture<ListAdminComponent>;

//   const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//   const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
//   const dialogMock = { close: () => { } };
//   const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
//   const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
//   const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);

//   const userData = { sellerProfile: 'administrator' };
//   const registerMenu = {
//     Functionalities: [{
//       NameFunctionality: 'Crear',
//       ShowFunctionality: true,
//       nameFunctionalityBack: 'Crear'
//     }],
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         ListAdminComponent
//       ],
//       imports: [
//         MatDialogModule,
//         MatSnackBarModule,
//         RouterTestingModule,
//         HttpClientModule,
//         HttpClientTestingModule,
//         TranslateModule.forRoot({})
//       ],
//       providers: [
//         { provide: ModalService, useValue: mockDialogError },
//         { provide: LoadingService, useValue: mockLoadingService },
//         { provide: MatDialogRef, useValue: dialogMock },
//         { provide: UserLoginService, useValue: mockUserLoginService },
//         { provide: UserParametersService, useValue: UserParametersService },
//         { provide: AuthService, useValue: mockAuthService },
//         EventEmitterSeller,
//         ShellComponent,
//         ComponentsService,
//         EventEmitterOrders,
//         UserLoginService,
//         DynamoDBService,
//         CognitoUtil,
//         EndpointService,
//         UserParametersService,
//         DatePipe
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ListAdminComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('Admin login', () => {
//     // BeforeEach asincrono debido a la ejecución del metodo de logeo
//     beforeEach(async () => {
//       // clona el modelo de respuesta de un usuario
//       const mockUser = Object.assign({}, userData);
//       // construccion del modelo de respuesta del regex del servicio

//       const responseGetUser = {
//         body: {
//           body: JSON.stringify({ Data: mockUser })
//         }
//       };
//       // Define la respuesta del metodo getMenu
//       mockAuthService.getMenu.and.returnValue(registerMenu);
//       // Define la respuesta de la información de un usuario
//       mockUserParameterService.getUserData.and.returnValue(of(responseGetUser));
//       mockUserLoginService.isAuthenticated.and.returnValue(true);
//       // espera la respuesta del metodo isLoggedIn para continuar
//       await component.isLoggedIn('', true);
//     });

//   });
// });
