import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResponseCaseDialogComponent } from "./response-case-dialog.component";

describe("ResponseCaseDialogComponent", () => {
  let component: ResponseCaseDialogComponent;
  let fixture: ComponentFixture<ResponseCaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResponseCaseDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseCaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
