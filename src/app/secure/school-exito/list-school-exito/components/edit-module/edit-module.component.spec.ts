import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { EndpointService } from "@app/core";
import { MaterialModule } from "@app/material.module";
import { SchoolExitoService } from "@app/secure/school-exito/school-exito.service";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs/internal/observable/of";

import { EditModuleComponent } from "./edit-module.component";

describe("EditModuleComponent", () => {
  let component: EditModuleComponent;
  let fixture: ComponentFixture<EditModuleComponent>;

  const mockDialog = {
    close: () => {},
  };

  const mockschoolExitoService = jasmine.createSpyObj("SchoolExitoService", [
    "editModules",
  ]);

  let data = {
    ModuleName: "prueba",
  };

  let editModule = {
    statusCode: 200,
    headers: null,
    multiValueHeaders: null,
    body: '{"Errors":[],"Data":true,"Message":"","PaginationToken":null}',
    isBase64Encoded: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditModuleComponent],
      imports: [
        MaterialModule,
        TranslateModule.forRoot({}),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        EndpointService,
        ComponentsService,
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: SchoolExitoService, useValue: mockschoolExitoService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("close modal", () => {
    let spy = spyOn(component.dialogRef, "close").and.callThrough();
    component.close();
    expect(spy).toHaveBeenCalled();
  });

  it("changeValue with values", () => {
    component.formEditModule.controls.moduleName.setValue("prueba2");
    component.changeValue();
    expect(component.changeValueEdit).toBeTruthy();
  });

  it("edit module", () => {
    component.dataToEdit = {
      ModuleName: "prueba",
    };

    spyOn(component.dialogRef, "close").and.callThrough();
    mockschoolExitoService.editModules.and.returnValue(of(editModule));
    component.editModule();
    expect(mockschoolExitoService.editModules).toHaveBeenCalled();
  });
});
