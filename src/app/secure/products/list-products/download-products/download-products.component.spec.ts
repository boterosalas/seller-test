import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadProductsComponent } from './download-products.component';

describe('DownloadProductsComponent', () => {
  let component: DownloadProductsComponent;
  let fixture: ComponentFixture<DownloadProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
