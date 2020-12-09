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

describe('PaymentSummaryComponent', () => {
  const mockDispersionService = jasmine.createSpyObj('DispersionService', ['getAllPaymentSummary', 'excludeSellerPayoneer']);
  let component: PaymentSummaryComponent;
  let fixture: ComponentFixture<PaymentSummaryComponent>;

 const responseDispersion =  {
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
};


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
        SupportService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(PaymentSummaryComponent);
    mockDispersionService.getAllPaymentSummary.and.returnValue(of(responseDispersion));
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
