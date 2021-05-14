import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdvertisementsComponent } from './modal-advertisements.component';

describe('ModalAdvertisementsComponent', () => {
  let component: ModalAdvertisementsComponent;
  let fixture: ComponentFixture<ModalAdvertisementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAdvertisementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
