import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkLoadBillingComponent } from './bulk-load-billing.component';

describe('BulkLoadBillingComponent', () => {
  let component: BulkLoadBillingComponent;
  let fixture: ComponentFixture<BulkLoadBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkLoadBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkLoadBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
