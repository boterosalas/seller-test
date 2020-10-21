import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReportHistCancelsComponent } from './download-report-hist-cancels.component';

describe('DownloadReportHistCancelsComponent', () => {
  let component: DownloadReportHistCancelsComponent;
  let fixture: ComponentFixture<DownloadReportHistCancelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadReportHistCancelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadReportHistCancelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
