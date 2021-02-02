import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSchoolExitoComponent } from './list-school-exito.component';

describe('ListSchoolExitoComponent', () => {
  let component: ListSchoolExitoComponent;
  let fixture: ComponentFixture<ListSchoolExitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSchoolExitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSchoolExitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
