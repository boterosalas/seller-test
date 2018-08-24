/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { DownloadHistoryModalComponent } from './download-history-modal.component';
import { DownloadHistoryModalModule } from '@app/secure/offers/history/components/download-history-modal/download-history-modal.module';


describe('DownloadOrderModalComponent', () => {
  let component: DownloadHistoryModalComponent;
  let fixture: ComponentFixture<DownloadHistoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DownloadHistoryModalModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
