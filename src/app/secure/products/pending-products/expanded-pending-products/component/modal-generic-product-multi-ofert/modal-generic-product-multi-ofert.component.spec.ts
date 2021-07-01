import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenericProductMultiOfertComponent } from './modal-generic-product-multi-ofert.component';

describe('ModalGenericProductMultiOfertComponent', () => {
  let component: ModalGenericProductMultiOfertComponent;
  let fixture: ComponentFixture<ModalGenericProductMultiOfertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGenericProductMultiOfertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGenericProductMultiOfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
