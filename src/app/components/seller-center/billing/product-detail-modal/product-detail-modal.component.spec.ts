/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { BillingModule } from '../billing.module';
import { ProductDetailBillingModalComponent } from './product-detail-modal.component';


describe('ProductDetailBillingModalComponent', () => {
  let component: ProductDetailBillingModalComponent;
  let fixture: ComponentFixture<ProductDetailBillingModalComponent>;

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
    fixture = TestBed.createComponent(ProductDetailBillingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});