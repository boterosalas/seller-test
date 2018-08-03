/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { OrderBillingDetailModalComponent } from './order-detail-modal.component';
import { BillingModule } from '../billing.module';


describe('OrderBillingDetailModalComponent', () => {
  let component: OrderBillingDetailModalComponent;
  let fixture: ComponentFixture<OrderBillingDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BillingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBillingDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
