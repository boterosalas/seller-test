import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingOrdersAdminComponent } from './billing-orders-admin.component';

describe('BillingOrdersAdminComponent', () => {
  let component: BillingOrdersAdminComponent;
  let fixture: ComponentFixture<BillingOrdersAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingOrdersAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingOrdersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
