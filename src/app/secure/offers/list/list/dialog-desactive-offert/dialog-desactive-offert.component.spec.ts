import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDesactiveOffertComponent } from './dialog-desactive-offert.component';

describe('DialogDesactiveOffertComponent', () => {
  let component: DialogDesactiveOffertComponent;
  let fixture: ComponentFixture<DialogDesactiveOffertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDesactiveOffertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDesactiveOffertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
