import { SearchBillingFormComponent } from './search-billing-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchOrderMenuModule } from '../search-order-menu.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsService } from '@app/shared';
import { SharedModule } from '@shared/shared.module';
import { BillingService } from '@secure/billing/billing.service';
import { EndpointService, UserLoginService, DynamoDBService, UserParametersService, LoadingService } from '@app/core';
import { DatePipe } from '@angular/common';
import { ShellModule } from '@app/core/shell/shell.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingModule } from '@app/secure/billing/billing.module';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('SearchBillingFormComponent', () => {
  let component: SearchBillingFormComponent;
  let fixture: ComponentFixture<SearchBillingFormComponent>;

  const userData = { sellerProfile: 'seller' };
  // Mock Services
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
  const mockBillingService = jasmine.createSpyObj('BillingService', ['getBilling']);

  const responseGetBilling = {
    billingNumber: '9406165195',
    billingTotal: 95925,
    commission: 8975,
    concept: 'Venta Marketplace',
    detail: [{
      commission: 8975,
      detailName: 'Videojuego Grand Theft Auto V PS4',
      ean: 'MP02080000000035',
      enviosExito: false,
      id: 636863783488493700,
      idBillingDetailPicking: 1036,
      price: 104900,
      quantity: 1,
      shippingCost: 1557,
      totalShippingCost: 1557,
    }],
    fulfillmentDetail: null,
    id: 636863783488493600,
    idBillingPicking: 1009,
    idSeller: 11618,
    iva: -1705.25,
    orderNumber: '704359035',
    paginationToken: '636863783488493620|11618',
    payOrderNumber: '6200006051',
    paymentDate: '2019-02-08T16:44:04.677+00:00'
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SearchOrderMenuModule,
        SharedModule,
        ShellModule,
        FormsModule,
        ReactiveFormsModule,
        BillingModule
      ],
      declarations: [
      ],
      providers: [
        ComponentsService,
        EndpointService,
        DatePipe,
        DynamoDBService,
        { provide: BillingService, useValue: mockBillingService },
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: LoadingService, useValue: mockLoadingService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBillingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('User log in', () => {

    beforeEach(() => {
      const mockUser = Object.assign({}, userData);
      const responseGetUser = {
        body: {
          body: JSON.stringify({ Data: mockUser })
        }
      };
      // Define la respuesta de la información de un usuario
      mockUserParameterService.getUserData.and.returnValue(of(responseGetUser));
      mockUserLoginService.isAuthenticated.and.returnValue(true);
      mockBillingService.getBilling.and.returnValue(of(responseGetBilling));
    });

    it('valid initial date', () => {
      const initialDate = fixture.debugElement.query(By.css('#input-filter-paymentDateInitial'));
      expect(initialDate).toBeTruthy();
      const initialDateNativeElement = initialDate.nativeElement;
      initialDateNativeElement.value = '01/02/2019';
      initialDateNativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.myform.controls.paymentDateInitial.errors).toBeNull();
    });

    it('invalid initial date', () => {
      const initialDate = fixture.debugElement.query(By.css('#input-filter-paymentDateInitial'));
      expect(initialDate).toBeTruthy();
      const initialDateNativeElement = initialDate.nativeElement;
      initialDateNativeElement.value = 'test';
      initialDateNativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.myform.controls.paymentDateInitial.errors).toBeNull();
    });

    it('valid final date', () => {
      const paymentDateFinal = fixture.debugElement.query(By.css('#paymentDate-input-search-order'));
      expect(paymentDateFinal).toBeTruthy();
      const paymentDateFinalNativeElement = paymentDateFinal.nativeElement;
      paymentDateFinalNativeElement.value = '01/02/2019';
      paymentDateFinalNativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.myform.controls.paymentDateFinal.errors).toBeNull();
    });

    it('invalid final date', () => {
      const paymentDateFinal = fixture.debugElement.query(By.css('#paymentDate-input-search-order'));
      expect(paymentDateFinal).toBeTruthy();
      const paymentDateFinalNativeElement = paymentDateFinal.nativeElement;
      paymentDateFinalNativeElement.value = 'test';
      paymentDateFinalNativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.myform.controls.paymentDateFinal.errors).toBeNull();
    });

    it('valid bill', () => {
      const bill = fixture.debugElement.query(By.css('#input-filter-billingNumber'));
      expect(bill).toBeTruthy();
      const billNativeElement = bill.nativeElement;
      billNativeElement.value = '123456789';
      billNativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.myform.controls.billingNumber.errors).toBeNull();
    });

    it('invalid bill', () => {
      const bill = fixture.debugElement.query(By.css('#input-filter-billingNumber'));
      expect(bill).toBeTruthy();
      const billNativeElement = bill.nativeElement;
      billNativeElement.value = 'hola';
      billNativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.myform.controls.billingNumber.errors).toBeTruthy();
    });

  });

});
