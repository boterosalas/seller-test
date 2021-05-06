import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPreviewNotificationComponent } from './modal-preview-notification.component';

describe('ModalPreviewNotificationComponent', () => {
  let component: ModalPreviewNotificationComponent;
  let fixture: ComponentFixture<ModalPreviewNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPreviewNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPreviewNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
