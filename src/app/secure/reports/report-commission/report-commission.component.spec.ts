import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCommissionComponent } from './report-commission.component';

describe('ReportCommissionComponent', () => {
  let component: ReportCommissionComponent;
  let fixture: ComponentFixture<ReportCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
