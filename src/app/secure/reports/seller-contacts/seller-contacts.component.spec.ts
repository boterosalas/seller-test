import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerContactsComponent } from './seller-contacts.component';

describe('SellerContactsComponent', () => {
  let component: SellerContactsComponent;
  let fixture: ComponentFixture<SellerContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
