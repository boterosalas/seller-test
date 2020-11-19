import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDonwloadEmailComponent } from './modal-donwload-email.component';

describe('ModalDonwloadEmailComponent', () => {
  let component: ModalDonwloadEmailComponent;
  let fixture: ComponentFixture<ModalDonwloadEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDonwloadEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDonwloadEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
