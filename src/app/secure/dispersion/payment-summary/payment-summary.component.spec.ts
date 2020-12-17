import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { of } from 'rxjs';
import { DispersionService } from '../dispersion.service';
import { PaymentSummaryComponent } from './payment-summary.component';
import { SupportService } from '@app/secure/support-modal/support.service';
import { EndpointService, LoadingService, UserLoginService, UserParametersService } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { StoresService } from '@app/secure/offers/stores/stores.service';

export const registerRegex = {
  body: {
    body: '{"Errors":[],"Data":[]}',
    "isBase64Encoded": false,
    "statusCode": 200
  },
  ok: true,
  status: 200,
  statusText: "OK",
  type: 4,
  url: "https://n1gy42mfqa.execute-api.us-east-1.amazonaws.com/Regex/?culture=es-CO"
}

describe('PaymentSummaryComponent', () => {
  const mockDispersionService = jasmine.createSpyObj('DispersionService', ['getAllPaymentSummary', 'excludeSellerPayoneer', 'sendDispersion']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  let component: PaymentSummaryComponent;
  let fixture: ComponentFixture<PaymentSummaryComponent>;

 const responseDispersion = {
  status: 200,
  body: {
      count: 765,
      extraInfo: {TotalSellersToPayPayoneer: '2', TotalToPayPayoneer: '121'},
      paginationToken: '{"CutOffDate":{"S":"02/09/2020"},"SellerId":{"N":"100089"}}',
      paginationTokens: [],
      viewModel:
      [{
          amount: 79,
          currency: 'USD',
          cutOffDate: '02/09/2020',
          description: 'Pago Vendedores corte 02 septiembre',
          excluded: false,
          internalPaymentId: 100219,
          paid: false,
          paymentDate: '2020-10-02T14:42:07.976+00:00',
          payoneerId: '3012404164',
          sellerId: 100002,
          sellerName: 'La prueba de Israel'
        }]
      }
    } 

  const sendDispersion = {
    data:{},
    errors :[
      {code:'', message: ''}
    ],
    message: 'Dispersion ejecutada con errrores',
    pendingResponse: false
  }


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
      declarations: [ PaymentSummaryComponent ],
      providers: [
        { provide: DispersionService, useValue: mockDispersionService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: SupportService, useValue: mockSupportService },
        StoresService,
        EndpointService,
        ShellComponent,
        ComponentsService,
        EventEmitterOrders,

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(PaymentSummaryComponent);
    mockDispersionService.getAllPaymentSummary.and.returnValue(of(responseDispersion));
    mockDispersionService.sendDispersion.and.returnValue(of(sendDispersion));
    mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
