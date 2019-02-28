import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWithFormComponent } from './dialog-with-form.component';

describe('DialogWithFormComponent', () => {
  let component: DialogWithFormComponent;
  let fixture: ComponentFixture<DialogWithFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogWithFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWithFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
