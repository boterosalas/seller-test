import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportErrorsVtexComponent } from './report-errors-vtex.component';

describe('ReportErrorsVtexComponent', () => {
  let component: ReportErrorsVtexComponent;
  let fixture: ComponentFixture<ReportErrorsVtexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportErrorsVtexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportErrorsVtexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
