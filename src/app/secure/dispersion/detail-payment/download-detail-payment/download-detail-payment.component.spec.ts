import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDetailPaymentComponent } from './download-detail-payment.component';

describe('DownloadDetailPaymentComponent', () => {
  let component: DownloadDetailPaymentComponent;
  let fixture: ComponentFixture<DownloadDetailPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadDetailPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDetailPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
