import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReportListCancelsComponent } from './download-report-list-cancels.component';

describe('DownloadReportListCancelsComponent', () => {
  let component: DownloadReportListCancelsComponent;
  let fixture: ComponentFixture<DownloadReportListCancelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadReportListCancelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadReportListCancelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
