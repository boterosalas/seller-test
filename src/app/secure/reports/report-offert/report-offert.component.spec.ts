import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOffertComponent } from './report-offert.component';

describe('ReportOffertComponent', () => {
  let component: ReportOffertComponent;
  let fixture: ComponentFixture<ReportOffertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOffertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOffertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
