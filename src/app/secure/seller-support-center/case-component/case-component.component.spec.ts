import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CaseComponentComponent } from "./case-component.component";

describe("CaseComponentComponent", () => {
  let component: CaseComponentComponent;
  let fixture: ComponentFixture<CaseComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseComponentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
