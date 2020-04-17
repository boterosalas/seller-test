import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CaseDetailComponent } from "./case-detail.component";
import { SharedModule } from "@app/shared/shared.module";
import { BasicCardComponent } from "../basic-card/basic-card.component";
import { MaterialModule } from "@app/material.module";

describe("CaseDetailComponent", () => {
  let component: CaseDetailComponent;
  let fixture: ComponentFixture<CaseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseDetailComponent],
      imports: [
        MaterialModule,
        BasicCardComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

