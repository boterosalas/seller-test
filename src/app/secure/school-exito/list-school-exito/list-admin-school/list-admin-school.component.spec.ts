import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdminSchoolComponent } from './list-admin-school.component';

describe('ListAdminSchoolComponent', () => {
  let component: ListAdminSchoolComponent;
  let fixture: ComponentFixture<ListAdminSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAdminSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdminSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
