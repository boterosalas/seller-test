/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { DownloadHistoricalModalComponent } from './download-historical-modal.component';
import { DownloadHistoricalModalModule } from '@app/secure/offers/historical/download-historical-modal/download-historical-modal.module';


describe('DownloadHistoricalModalComponent', () => {
  let component: DownloadHistoricalModalComponent;
  let fixture: ComponentFixture<DownloadHistoricalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DownloadHistoricalModalModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadHistoricalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
