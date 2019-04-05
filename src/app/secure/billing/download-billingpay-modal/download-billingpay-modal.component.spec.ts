import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadBillingpayModalComponent } from './download-billingpay-modal.component';

describe('DownloadBillingpayModalComponent', () => {
  let component: DownloadBillingpayModalComponent;
  let fixture: ComponentFixture<DownloadBillingpayModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadBillingpayModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadBillingpayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
