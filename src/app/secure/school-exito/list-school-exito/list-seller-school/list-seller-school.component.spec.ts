import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EndpointService } from "@app/core";
import { MaterialModule } from "@app/material.module";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";

import { ListSellerSchoolComponent } from "./list-seller-school.component";

describe("ListSellerSchoolComponent", () => {
  let component: ListSellerSchoolComponent;
  let fixture: ComponentFixture<ListSellerSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSellerSchoolComponent],
      imports: [
        MaterialModule,
        TranslateModule.forRoot({}),
        HttpClientTestingModule,
      ],
      providers: [EndpointService, ComponentsService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSellerSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
