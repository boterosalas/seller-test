import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingFulfillmentDetailComponent } from './billing-fulfillment-detail.component';
import { BillingModule } from '../billing.module';
import { DatePipe, CurrencyPipe } from '@angular/common';

describe('BillingFulfillmentDetailComponent', () => {
  let component: BillingFulfillmentDetailComponent;
  let fixture: ComponentFixture<BillingFulfillmentDetailComponent>;
  const dataMock = {
    'id': 636561345858929047,
    'idBillingPicking': 69,
    'idSeller': 10302,
    'billingNumber': '9405101322',
    'orderNumber': null,
    'payOrderNumber': null,
    'concept': 'Logística Éxito',
    'paymentDate': '2017-10-02T16:12:35.497+00:00',
    'commission': -149294.12,
    'billingTotal': 120000,
    'detail': null,
    'fulfillment': {
      'totalStorage': 100000,
      'totalMovement': 200000
    },
    'paginationToken': '636561345858929047|10034'
  };

  const getTextElementFromCollapsible = (classElement: string): string => {
    const element: HTMLElement = fixture.nativeElement.querySelector(`.${classElement}`);
    return element.textContent;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BillingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingFulfillmentDetailComponent);
    component = fixture.componentInstance;
    component.data = dataMock;
    fixture.detectChanges();
  });

  /**
   * Creción del módulo.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verificar que se esta mostrando el id de la factura.
   */
  it('should be shown billing number in the collapsible', () => {
    const valueEl = getTextElementFromCollapsible('billingNumber');
    expect(valueEl).toBe(component.data.billingNumber);
  });

  /**
   * Verificar que se esta mostrando la fecha de facturación
   * usando el pipe 'DatePipe'.
   */
  it('should be shown payment date in the collapsible', () => {
    const valueEl = getTextElementFromCollapsible('paymentDate');
    const formattedData = new DatePipe('en-US').transform(component.data.paymentDate);
    expect(valueEl).toBe(formattedData);
  });

  /**
   * Verificar que se esta mostrando el cobro total por movimiento.
   */
  it('should be shown total movement date in the collapsible', () => {
    const valueEl = getTextElementFromCollapsible('totalMovement');
    const formattedData = new CurrencyPipe('en-US').transform(component.data.fulfillmentDetail.totalMovement, 'COP');
    expect(valueEl).toBe(formattedData);
  });

  /**
   * Verificar que se esta mostrando el cobro total por almacenamiento.
   */
  it('should be shown total storage date in the collapsible', () => {
    const valueEl = getTextElementFromCollapsible('totalStorage');
    const formattedData = new CurrencyPipe('en-US').transform(component.data.fulfillmentDetail.totalStorage, 'COP');
    expect(valueEl).toBe(formattedData);
  });
});
