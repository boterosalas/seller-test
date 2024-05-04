import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingHeaderComponent } from './floating-header.component';

describe('FloatingHeaderComponent', () => {
  let component: FloatingHeaderComponent;
  let fixture: ComponentFixture<FloatingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
