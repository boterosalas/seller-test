import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";
import { EndpointService } from "@app/core";
import { ShellModule } from "@app/core/shell/shell.module";
import { MaterialModule } from "@app/material.module";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";

import { DeleteModuleComponent } from "./delete-module.component";

describe("DeleteModuleComponent", () => {
  let component: DeleteModuleComponent;
  let fixture: ComponentFixture<DeleteModuleComponent>;

  const mockDialog = jasmine.createSpyObj("MatDialogRef", [
    "open, close, afterClosed",
  ]);
  let data = {};

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
});
