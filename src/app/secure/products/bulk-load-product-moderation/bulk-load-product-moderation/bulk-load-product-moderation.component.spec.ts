import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation.component';

describe('BulkLoadProductModerationComponent', () => {
  let component: BulkLoadProductModerationComponent;
  let fixture: ComponentFixture<BulkLoadProductModerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkLoadProductModerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkLoadProductModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
