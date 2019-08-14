import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadModalOffertReportComponent } from './download-modal-offert-report.component';

describe('DownloadModalOffertReportComponent', () => {
  let component: DownloadModalOffertReportComponent;
  let fixture: ComponentFixture<DownloadModalOffertReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadModalOffertReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadModalOffertReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
