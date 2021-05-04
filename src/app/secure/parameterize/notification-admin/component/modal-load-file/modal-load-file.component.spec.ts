import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLoadFileComponent } from './modal-load-file.component';

describe('ModalLoadFileComponent', () => {
  let component: ModalLoadFileComponent;
  let fixture: ComponentFixture<ModalLoadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLoadFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLoadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
