import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';

import { ModalAdvertisementsComponent } from './modal-advertisements.component';

describe('ModalAdvertisementsComponent', () => {
  let component: ModalAdvertisementsComponent;
  let fixture: ComponentFixture<ModalAdvertisementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAdvertisementsComponent],
      imports: [
        MaterialModule,
        SharedModule
      ]
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
