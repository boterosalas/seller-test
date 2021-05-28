import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContactPerfilComponent } from './modal-contact-perfil.component';

describe('ModalContactPerfilComponent', () => {
  let component: ModalContactPerfilComponent;
  let fixture: ComponentFixture<ModalContactPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContactPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContactPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
