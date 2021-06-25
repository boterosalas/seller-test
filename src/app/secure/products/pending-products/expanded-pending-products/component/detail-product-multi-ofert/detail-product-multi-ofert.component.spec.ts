import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProductMultiOfertComponent } from './detail-product-multi-ofert.component';

describe('DetailProductMultiOfertComponent', () => {
  let component: DetailProductMultiOfertComponent;
  let fixture: ComponentFixture<DetailProductMultiOfertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProductMultiOfertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProductMultiOfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
