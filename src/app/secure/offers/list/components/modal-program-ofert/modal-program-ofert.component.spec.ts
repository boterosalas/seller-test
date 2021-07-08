import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProgramOfertComponent } from './modal-program-ofert.component';

describe('ModalProgramOfertComponent', () => {
  let component: ModalProgramOfertComponent;
  let fixture: ComponentFixture<ModalProgramOfertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProgramOfertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProgramOfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
