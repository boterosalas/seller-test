import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EndpointService, LoadingService } from "@app/core";
import { MaterialModule } from "@app/material.module";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { ProcessService } from "../component-process/component-process.service";
import { AssignVideoComponent } from "./assign-video.component";
import { AssignVideoService } from "./assign-video.service";

describe("AssignVideoComponent", () => {
  let component: AssignVideoComponent;
  let fixture: ComponentFixture<AssignVideoComponent>;

  const mockLoadingService = jasmine.createSpyObj("LoadingService", [
    "viewSpinner",
    "closeSpinner",
  ]);
  const mockProcessService = jasmine.createSpyObj("ProcessService", [
    "validaData"
  ]);
  const mockAssignVideoService = jasmine.createSpyObj("AssignVideoService", [
    "getvalidateVideo",
  ]);
  const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openConfirmAlert', 'openSnackBar']);

  let dataError = {
    statusCode: 200,
    body: '{"Errors":[],"Data":{"IsValid":false,"UrlImage":"https://img.youtube.com/vi/7m5r6TQqPPY/default.jpg"},"Message":"El Video adjunto no existe, corregir y procesar nuevamente"}',
    isBase64Encoded: false,
  };

  let dataError400 = {
    statusCode: 400,
    body: '{"Errors":[],"Data":{"IsValid":false,"UrlImage":"https://img.youtube.com/vi/7m5r6TQqPPY/default.jpg"},"Message":"El Video adjunto no existe, corregir y procesar nuevamente"}',
    isBase64Encoded: false,
  };

  let dataok = {
    statusCode: 200,
    body: '{"Errors":[],"Data":{"IsValid":true,"UrlImage":"https://img.youtube.com/vi/7m5r6TQqPPY/default.jpg"},"Message":""}',
    isBase64Encoded: false,
  };

  let dataelse = {
    statusCode: 100,
    body: '{"Errors":[],"Data":{"IsValid":true,"UrlImage":"https://img.youtube.com/vi/7m5r6TQqPPY/default.jpg"},"Message":""}',
    isBase64Encoded: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignVideoComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        MaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        EndpointService,
        { provide: ComponentsService, useValue: mockComponentsService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ProcessService, useValue: mockProcessService },
        { provide: AssignVideoService, useValue: mockAssignVideoService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Validate video ok", () => {
    mockAssignVideoService.getvalidateVideo.and.returnValue(of(dataok));
    component.validateVideo();
    expect(mockAssignVideoService.getvalidateVideo).toHaveBeenCalled();
  });

  it("Validate video not exist", () => {
    mockAssignVideoService.getvalidateVideo.and.returnValue(of(dataError));
    component.validateVideo();
    expect(mockAssignVideoService.getvalidateVideo).toHaveBeenCalled();
  });

  it("Validate video error 400", () => {
    mockAssignVideoService.getvalidateVideo.and.returnValue(of(dataError400));
    component.validateVideo();
    expect(mockAssignVideoService.getvalidateVideo).toHaveBeenCalled();
  });

  it("Validate video diferent resp", () => {
    mockAssignVideoService.getvalidateVideo.and.returnValue(of(dataelse));
    component.validateVideo();
    expect(mockAssignVideoService.getvalidateVideo).toHaveBeenCalled();
  });

});
