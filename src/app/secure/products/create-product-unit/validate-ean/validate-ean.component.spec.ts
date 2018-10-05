import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateEanComponent } from './validate-ean.component';

describe('ValidateEanComponent', () => {
  let component: ValidateEanComponent;
  let fixture: ComponentFixture<ValidateEanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateEanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateEanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
