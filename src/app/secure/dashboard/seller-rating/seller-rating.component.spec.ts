import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRatingComponent } from './seller-rating.component';

describe('SellerRatingComponent', () => {
  let component: SellerRatingComponent;
  let fixture: ComponentFixture<SellerRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
