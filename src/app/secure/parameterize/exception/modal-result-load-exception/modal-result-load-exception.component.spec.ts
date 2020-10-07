import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResultLoadExceptionComponent } from './modal-result-load-exception.component';

describe('ModalResultLoadExceptionComponent', () => {
  let component: ModalResultLoadExceptionComponent;
  let fixture: ComponentFixture<ModalResultLoadExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalResultLoadExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalResultLoadExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
