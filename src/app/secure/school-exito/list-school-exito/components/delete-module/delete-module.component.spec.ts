import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";
import { EndpointService } from "@app/core";
import { ShellModule } from "@app/core/shell/shell.module";
import { MaterialModule } from "@app/material.module";
import { SchoolExitoService } from "@app/secure/school-exito/school-exito.service";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs/internal/observable/of";

import { DeleteModuleComponent } from "./delete-module.component";

describe("DeleteModuleComponent", () => {
  let component: DeleteModuleComponent;
  let fixture: ComponentFixture<DeleteModuleComponent>;

  const mockDialog = {
    close: () => {},
  };

  const mockschoolExitoService = jasmine.createSpyObj("SchoolExitoService", [
    "deleteModule",
  ]);

  let data = {};

  let deleteModules = {
    headers: { normalizedNames: {}, lazyUpdate: null },
    status: 200,
    statusText: "OK",
    url:
      "https://ezuk98aqii.execute-api.us-east-1.amazonaws.com/dev/DeleteSubModule/prueba/prueba/?culture=es-CO",
    ok: true,
    type: 4,
    body: {
      statusCode: 200,
      headers: null,
      multiValueHeaders: null,
      body: '{"Errors":[],"Data":true,"Message":"","PaginationToken":null}',
      isBase64Encoded: false,
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteModuleComponent],
      imports: [
        MaterialModule,
        TranslateModule.forRoot({}),
        HttpClientTestingModule,
        ShellModule,
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
    fixture = TestBed.createComponent(DeleteModuleComponent);
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

  it("delete module", () => {
    component.dataToDelete = {
      Id: "prueba",
    };

    spyOn(component.dialogRef, "close").and.callThrough();
    mockschoolExitoService.deleteModule.and.returnValue(of(deleteModules));
    component.deleteModule();
    expect(mockschoolExitoService.deleteModule).toHaveBeenCalled();
  });
});
