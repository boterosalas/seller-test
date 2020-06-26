import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSummaryPaymentComponent } from './filter-summary-payment.component';

describe('FilterSummaryPaymentComponent', () => {
  let component: FilterSummaryPaymentComponent;
  let fixture: ComponentFixture<FilterSummaryPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSummaryPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSummaryPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
