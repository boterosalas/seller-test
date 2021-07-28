import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EndpointService, LoadingService } from "@app/core";
import { SearchOrderMenuService } from "@app/core/shell/search-order-menu/search-order-menu.service";
import { MaterialModule } from "@app/material.module";
import { MyProfileService } from "@app/secure/aws-cognito/profile/myprofile.service";
import { EventEmitterSeller } from "@app/shared/events/eventEmitter-seller.service";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

import { ReportOrderComponent } from "./report-order.component";
import { ReportOrderService } from "./report-order.service";

describe("ReportOrderComponent", () => {
  let component: ReportOrderComponent;
  let fixture: ComponentFixture<ReportOrderComponent>;

  const respondeRegex = {
    body: {
      body: '{"Errors":[],"Data":[],"Message":""}',
      isBase64Encoded: false,
      statusCode: 200,
    },
    ok: true,
    status: 200,
    statusText: "OK",
  };

  const reponseSYNC = {
    body: {
      body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
      isBase64Encoded: false,
      statusCode: 200,
    }
  };

  const mockMyProfileService = jasmine.createSpyObj("MyProfileService", [
    "getUser",
  ]);

  const mockLoadingService = jasmine.createSpyObj("LoadingService", [
    "viewSpinner",
    "closeSpinner",
  ]);

  const mockDialogRef = jasmine.createSpyObj("MatDialogRef", [
    "close",
    "afterClosed",
    "componentInstance",
  ]);

  const mockReportOrderService = jasmine.createSpyObj("ReportOrderService", [
    "sendReportOrdersToEmail",
  ]);

  const mockStatusOrdersService = jasmine.createSpyObj(
    "SearchOrderMenuService",
    ["getIdOrders"]
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportOrderComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        EndpointService,
        LoadingService,
        EventEmitterSeller,
        MyProfileService,
        { provide: SearchOrderMenuService, useValue: mockStatusOrdersService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ReportOrderService, useValue: mockReportOrderService },
        { provide: MyProfileService, useValue: mockMyProfileService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOrderComponent);
    component = fixture.componentInstance;
    mockMyProfileService.getUser.and.returnValue(of(reponseSYNC));
    mockReportOrderService.sendReportOrdersToEmail.and.returnValue(
      of(respondeRegex)
    );
    mockStatusOrdersService.getIdOrders.and.returnValue(
      of(respondeRegex)
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
