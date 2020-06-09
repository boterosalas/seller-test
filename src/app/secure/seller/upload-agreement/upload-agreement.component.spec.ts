import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAgreementComponent } from './upload-agreement.component';

describe('UploadAgreementComponent', () => {
  let component: UploadAgreementComponent;
  let fixture: ComponentFixture<UploadAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
