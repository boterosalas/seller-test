import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLoadAgreementComponent } from './modal-load-agreement.component';

describe('ModalLoadAgreementComponent', () => {
  let component: ModalLoadAgreementComponent;
  let fixture: ComponentFixture<ModalLoadAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLoadAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLoadAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
