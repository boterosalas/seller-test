import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EndpointService } from "@app/core";
import { ShellModule } from "@app/core/shell/shell.module";
import { MaterialModule } from "@app/material.module";
import { schoolExitoModule } from "@app/secure/auth/auth.consts";
import { MyProfileService } from "@app/secure/aws-cognito/profile/myprofile.service";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { SchoolExitoModule } from "../school-exito.module";

import { ListSchoolExitoComponent } from "./list-school-exito.component";

describe("ListSchoolExitoComponent", () => {
  let component: ListSchoolExitoComponent;
  let fixture: ComponentFixture<ListSchoolExitoComponent>;

  const mockMyProfileService = jasmine.createSpyObj("MyProfileService", [
    "getUser",
  ]);

  const reponseSYNC = {
    body: {
      body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
      isBase64Encoded: false,
      statusCode: 200,
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        SchoolExitoModule,
        ShellModule,
      ],
      providers: [
        EndpointService,
        ComponentsService,
        { provide: MyProfileService, useValue: mockMyProfileService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSchoolExitoComponent);
    component = fixture.componentInstance;
    mockMyProfileService.getUser.and.returnValue(of(reponseSYNC));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
