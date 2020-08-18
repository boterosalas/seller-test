import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BulkLoadBillingComponent } from './bulk-load-billing.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BulkLoadBillingService } from './bulk-load-billing.service';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@app/secure/auth/auth.routing';
import { of } from 'rxjs';
import {  MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SharedModule } from '@app/shared/shared.module';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { StoresService } from '@app/secure/offers/stores/stores.service';

export const registerRegex = [
  { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
];
describe('BulkLoadBillingComponent', () => {

  const registerMenu = {
    Functionalities: [{
      NameFunctionality: 'Crear',
      ShowFunctionality: true,
      nameFunctionalityBack: 'Crear'
    }],
  };

  const mockBulkLoadBillingService = jasmine.createSpyObj('BulkLoadBillingService', ['sendBulkLoadBilling', 'verifyStatusBulkLoad']);
  const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  const formBuilder: FormBuilder = new FormBuilder();

  const data = {
    title: '',
    message: '',
    icon: '',
    form: null,
    btnConfirmationText: null,
    showButtons: false
  };

  const response = {
    data: true,
    errors: [],
    message: null,
    pendingResponse: false,
  };

  const responseStatus = {
    data: {
      checked: 'false',
      date: '18/08/2020 12:47:21',
      expirationTime: 1597927641,
      fileName: 'ticket_637333696420160323_11216',
      idSeller: 11216,
      status: 3,
      response: '{"TotalProcess":0,"Error":0,"Successful":0,"ListError":[{"OrderNumber":"1234567891098","Sku":null,"Message":"OrderNumber: 1234567891098. Número de orden no está asociada al vendedor."}]}',
      type: 'SetBillingMassive'
    },
    errors: [],
    message: '',
    pendingResponse: false
  };


  // Create Variables for services and component
  let fixture: ComponentFixture<BulkLoadBillingComponent>;
  let bulkLoadBillingComponent: BulkLoadBillingComponent;
  let bulkLoadBillingService: BulkLoadBillingService;
  let supportService: SupportService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule
      ],
      declarations: [
        BulkLoadBillingComponent,
      ],
      providers: [
        { provide: BulkLoadBillingService, useValue: mockBulkLoadBillingService },
        EndpointService,
        { provide: LoadingService, useValue: mockLoadingService },
        SupportService,
        { provide: AuthService, useValue: mockAuthService },
        UserParametersService,
        CognitoUtil,
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: ModalService, useValue: mockDialogError },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: mockDialogRef },
        ShellComponent,
        ComponentsService,
        EventEmitterOrders,
        StoresService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach((() => {
    mockAuthService.getMenu.and.returnValue(registerMenu);
    fixture = TestBed.createComponent(BulkLoadBillingComponent);
    bulkLoadBillingComponent = fixture.componentInstance;
    bulkLoadBillingService = TestBed.get(BulkLoadBillingService);
    supportService = TestBed.get(SupportService);
    mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
    mockBulkLoadBillingService.sendBulkLoadBilling.and.returnValue(of(response));
    mockBulkLoadBillingService.verifyStatusBulkLoad.and.returnValue(of(responseStatus));
    fixture.detectChanges();
  }));

  it('should create', (done) => {
    expect(bulkLoadBillingService).toBeTruthy();
    expect(bulkLoadBillingComponent).toBeTruthy();
    done();
  });
});
