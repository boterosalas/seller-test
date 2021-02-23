import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "@app/material.module";
import { TranslateModule } from "@ngx-translate/core";

import { EditModuleComponent } from "./edit-module.component";

describe("EditModuleComponent", () => {
  let component: EditModuleComponent;
  let fixture: ComponentFixture<EditModuleComponent>;

  const mockDialog = jasmine.createSpyObj("MatDialogRef", [
    "open, close, afterClosed",
  ]);
  let data = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditModuleComponent],
      imports: [
        MaterialModule,
        TranslateModule.forRoot({}),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data },
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
});
