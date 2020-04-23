
// import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { PortComponent } from './port.component';
// import { PortCollectionService } from './port-collection.service';
// import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService } from '@app/core';
// import { SupportService } from '@app/secure/support-modal/support.service';
// import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
// import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MaterialModule } from '@app/material.module';
// import { HttpClientModule } from '@angular/common/http';
// import { AuthService } from '@app/secure/auth/auth.routing';
// import { of, throwError } from 'rxjs';
// import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBarModule } from '@angular/material';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { SharedModule } from '@app/shared/shared.module';
// import { ToolbarSearchPaginationComponent } from '@app/shared/components/toolbar-search-pagination/toolbar-search-pagination.component';
// import { ShellComponent } from '@app/core/shell';
// import { ComponentsService, EventEmitterOrders } from '@app/shared';
// import { StoresService } from '@app/secure/offers/stores/stores.service';

// export const registerRegex = [
//   { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
// ];

// describe('PortComponent', () => {

//   const registerMenu = {
//     Functionalities: [{
//       NameFunctionality: 'Crear',
//       ShowFunctionality: true,
//       nameFunctionalityBack: 'Crear'
//     }],
//   };

//   const responseEmpty = {
//     body: '{"Message":"Operación realizada éxitosamente.","Errors":[],"Data":null}',
//     headers: null,
//     isBase64Encoded: false,
//     multiValueHeaders: null,
//     statusCode: 200
//   };
//   const response = {
//     body: '{"Message":"Operación realizada éxitosamente.","Errors":[],"Data":[{},{},{}]}',
//     headers: null,
//     isBase64Encoded: false,
//     multiValueHeaders: null,
//     statusCode: 200
//   };

//   const data = {
//     title: '',
//     message: '',
//     icon: '',
//     form: null,
//     btnConfirmationText: null,
//     showButtons: false
//   };




//   const mockPortCollectionService = jasmine.createSpyObj('PortCollectionService', ['getAllPort', 'changeApplyCountry', 'savePort']);
//   const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
//   const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
//   const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
//   const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
//   const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
//   const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
//   const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);


//   let fixture: ComponentFixture<PortComponent>;
//   let portComponent: PortComponent;
//   let portCollectionService: PortCollectionService;
//   let dialogFixture: ComponentFixture<DialogWithFormComponent>;
//   let dialogComponent: DialogWithFormComponent;
//   let supportService: SupportService;




//   beforeEach(fakeAsync(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         MaterialModule,
//         ReactiveFormsModule,
//         FormsModule,
//         RouterTestingModule,
//         BrowserAnimationsModule,
//         HttpClientModule,
//         SharedModule,
//         MatSnackBarModule
//       ],
//       declarations: [
//         PortComponent
//       ],
//       providers: [
//         { provide: PortCollectionService, useValue: mockPortCollectionService },
//         EndpointService,
//         { provide: LoadingService, useValue: mockLoadingService },
//         SupportService,
//         { provide: AuthService, useValue: mockAuthService },
//         UserParametersService,
//         CognitoUtil,
//         { provide: UserLoginService, useValue: mockUserLoginService },
//         { provide: ModalService, useValue: mockDialogError },
//         { provide: MatDialog, useValue: mockDialog },
//         { provide: MAT_DIALOG_DATA, useValue: data },
//         { provide: MatDialogRef, useValue: mockDialogRef },
//         ShellComponent,
//         ComponentsService,
//         EventEmitterOrders,
//         StoresService
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//     }).compileComponents();

//     TestBed.overrideModule(BrowserDynamicTestingModule, {
//       set: {
//         entryComponents: [DialogWithFormComponent]
//       }
//     });
//   }));

//   beforeEach(() => {
//     mockAuthService.getMenu.and.returnValue(registerMenu);
//     fixture = TestBed.createComponent(PortComponent);
//     portComponent = fixture.componentInstance;
//     portCollectionService = TestBed.get(PortCollectionService);
//     supportService = TestBed.get(SupportService);
//     dialogFixture = TestBed.createComponent(DialogWithFormComponent);
//     dialogComponent = dialogFixture.componentInstance;
//     mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
//     mockPortCollectionService.getAllPort.and.returnValue(of(response));
//     portComponent.keywords = ['PARIS', 'MEXICO', 'ESPAÑA'];
//     fixture.detectChanges();
//   });


//   it('should create', function (done: any) {
//     expect(portComponent).toBeTruthy();
//     done();
//   });

//   it('toggle Filter', function () {
//     portComponent.toggleFilterPorts();
//   });
//   it('Delete key', function () {
//     portComponent.deleteKeywork(1);
//   });

//   describe('inputs edit', () => {
//     beforeEach(() => {
//       portComponent.keywords = [];
//       fixture.detectChanges();
//     });

//     it('Edit offert', () => {
//       portComponent.deleteKeywork(1);
//     });
//     it('Edit offert', () => {
//       portComponent.resetFormModal();
//     });
//     it('on no click', () => {
//       portComponent.onNoClick();
//     });
//     it('clear form', () => {
//       portComponent.clearFormFilter();
//     });
//   });
//   // describe('inputs edit', () => {
//   //   beforeEach(() => {
//   //     mockPortCollectionService.savePort.and.returnValue(of(true));
//   //     portComponent.formPort = new FormGroup({
//   //       country: new FormControl(''),
//   //       applyCountry: new FormControl(''),
//   //       address: new FormControl(''),
//   //       phone: new FormControl(''),
//   //       insurance_freight: new FormControl(''),
//   //       preparation: new FormControl(''),
//   //       shippingCost: new FormControl(''),
//   //       national_transportation: new FormControl(''),
//   //       insurance_CIF: new FormControl(''),
//   //       tariffByKg: new FormControl(''),
//   //       tariff: new FormControl(''),
//   //       iva: new FormControl(''),
//   //     });
//   //   });

//   //   it('save Port', () => {
//   //     portComponent.savePort();
//   //   });
//   // });
//   // describe('set Edit', () => {
//   //   beforeEach(() => {
//   //     mockPortCollectionService.savePort.and.returnValue(of(true));
//   //     portComponent.formPort = new FormGroup({
//   //       country: new FormControl(''),
//   //       applyCountry: new FormControl('CHINA'),
//   //       address: new FormControl(''),
//   //       phone: new FormControl(''),
//   //       insurance_freight: new FormControl(''),
//   //       preparation: new FormControl(''),
//   //       shippingCost: new FormControl(''),
//   //       national_transportation: new FormControl(''),
//   //       insurance_CIF: new FormControl(''),
//   //       tariffByKg: new FormControl(''),
//   //       tariff: new FormControl(''),
//   //       iva: new FormControl(''),
//   //     });
//   //     portComponent.data = {
//   //       data: {
//   //         id: '',
//   //         country: '',
//   //         address: '',
//   //         phone: '',
//   //         insurance_freight: '',
//   //         preparation: '',
//   //         shippingCost: '',
//   //         national_transportation: '',
//   //         insurance_CIF: '',
//   //         tariffByKg: '',
//   //         tariff: '',
//   //         iva: '',
//   //         countrys: ['MEXICO', 'PANAMA']
//   //       },
//   //       typeModal : 2
//   //     };
//   //   });

//   //   it('save Port', () => {
//   //     portComponent.setEdit();
//   //   });
//   //   it('save Keyword', () => {
//   //     portComponent.saveKeyword();
//   //   });
//   // });
// });
