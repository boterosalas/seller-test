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
import { BulkLoadModule, ComponentsService, EventEmitterOrders } from '@app/shared';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FinishUploadInformationComponent } from '@app/secure/offers/bulk-load/finish-upload-information/finish-upload-information.component';

export const registerRegex = {
  body: {
    body:'{ "Data": []}'
  },
  ok: true,
  status: 200,
  statusText: "OK",
  type: 4,
  url: "https://n1gy42mfqa.execute-api.us-east-1.amazonaws.com/Regex/?culture=es-CO"
}



describe('PaymentSummaryComponent', () => {
  const mockDispersionService = jasmine.createSpyObj('DispersionService', ['getAllPaymentSummary', 'excludeSellerPayoneer', 'sendDispersion', 'statusLoadDispersion']);
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
      extraInfo: { TotalSellersToPayPayoneer: '2', TotalToPayPayoneer: '121' },
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

  const statusDispersion = {
    body: {
      Errors: [],
      Message: null,
      PendingResponse: false,
      data: {
        Checked: "false",
        Date: "23/12/2020 16:53:38",
        ExpirationTime: 1608915218,
        FileName: "12390_637443572181014262",
        IdSeller: 12390,
        Type: "Product",
        status: 3,
        response:
          '{ "TotalProcess": 0, "Error": 0, "Successful": 0, "ListError": [ { "OrderNumber": "1084801656137 (1)", "Sku": null, "Message": "OrderNumber: 1084801656137 (1). Número de orden no está asociada al vendedor." }]}'

      }
    },
    ok: true,
    status: 200,
    statusText: "OK",
    type: 4,
    url: "https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing/dispersion/getstatusdispersion/?culture=es-CO"
  }

  const sendDispersion = {
    data: {},
    errors: [
      { code: '', message: '' }
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
        SharedModule,
      ],
      declarations: [PaymentSummaryComponent, FinishUploadInformationComponent],
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
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [FinishUploadInformationComponent]
      }
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(PaymentSummaryComponent);
    mockDispersionService.getAllPaymentSummary.and.returnValue(of(responseDispersion));
    mockDispersionService.sendDispersion.and.returnValue(of(sendDispersion));
    mockDispersionService.statusLoadDispersion.and.returnValue(of(statusDispersion));
    mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });
});
