import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSellerSchoolComponent } from './list-seller-school.component';

describe('ListSellerSchoolComponent', () => {
  let component: ListSellerSchoolComponent;
  let fixture: ComponentFixture<ListSellerSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSellerSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSellerSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
