import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";
import { EndpointService } from "@app/core";
import { ShellModule } from "@app/core/shell/shell.module";
import { MaterialModule } from "@app/material.module";
import { SchoolExitoModule } from "@app/secure/school-exito/school-exito.module";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";

import { EditItemModuleComponent } from "./edit-item-module.component";

xdescribe("EditItemModuleComponent", () => {
  let component: EditItemModuleComponent;
  let fixture: ComponentFixture<EditItemModuleComponent>;

  const mockDialog = jasmine.createSpyObj("MatDialogRef", [
    "open, close, afterClosed",
  ]);
  let data = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MaterialModule,
        TranslateModule.forRoot({}),
        HttpClientTestingModule,
        ShellModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SchoolExitoModule
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
    fixture = TestBed.createComponent(EditItemModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
