import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductsCaseDialogComponent } from "./products-case-dialog.component";

describe("ProductsCaseDialogComponent", () => {
  let component: ProductsCaseDialogComponent;
  let fixture: ComponentFixture<ProductsCaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsCaseDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsCaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
