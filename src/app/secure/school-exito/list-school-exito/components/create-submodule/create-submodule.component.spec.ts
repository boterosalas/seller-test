import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "@app/material.module";
import { TranslateModule } from "@ngx-translate/core";
import { ngfModule } from "angular-file";

import { CreateSubmoduleComponent } from "./create-submodule.component";

describe("CreateSubmoduleComponent", () => {
  let component: CreateSubmoduleComponent;
  let fixture: ComponentFixture<CreateSubmoduleComponent>;

  const mockDialog = jasmine.createSpyObj('MatDialogRef', ['open, close, afterClosed']);
  let data = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSubmoduleComponent],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({}),
        ngfModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
