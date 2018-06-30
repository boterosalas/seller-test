import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCommisionComponent } from './input-commision.component';

describe('InputCommisionComponent', () => {
  let component: InputCommisionComponent;
  let fixture: ComponentFixture<InputCommisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputCommisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCommisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
