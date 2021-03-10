import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EndpointService } from "@app/core";
import { ShellModule } from "@app/core/shell/shell.module";
import { MaterialModule } from "@app/material.module";
import { schoolExitoModule } from "@app/secure/auth/auth.consts";
import { MyProfileService } from "@app/secure/aws-cognito/profile/myprofile.service";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";
import { SchoolExitoModule } from "../school-exito.module";

import { ListSchoolExitoComponent } from "./list-school-exito.component";

describe("ListSchoolExitoComponent", () => {
  let component: ListSchoolExitoComponent;
  let fixture: ComponentFixture<ListSchoolExitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MaterialModule,
        TranslateModule.forRoot({}),
        HttpClientTestingModule,
        SchoolExitoModule,
        ShellModule,
      ],
      providers: [EndpointService, ComponentsService, MyProfileService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSchoolExitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
