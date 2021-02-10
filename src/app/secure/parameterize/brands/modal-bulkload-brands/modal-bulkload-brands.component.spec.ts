import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBulkloadBrandsComponent } from './modal-bulkload-brands.component';

describe('ModalBulkloadBrandsComponent', () => {
  let component: ModalBulkloadBrandsComponent;
  let fixture: ComponentFixture<ModalBulkloadBrandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBulkloadBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBulkloadBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
