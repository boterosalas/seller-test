import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalErrorsComponent } from './modal-errors.component';

describe('ModalErrorsComponent', () => {
  let component: ModalErrorsComponent;
  let fixture: ComponentFixture<ModalErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
