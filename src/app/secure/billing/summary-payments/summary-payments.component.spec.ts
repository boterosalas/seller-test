import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPaymentsComponent } from './summary-payments.component';

describe('SummaryPaymentsComponent', () => {
  let component: SummaryPaymentsComponent;
  let fixture: ComponentFixture<SummaryPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
