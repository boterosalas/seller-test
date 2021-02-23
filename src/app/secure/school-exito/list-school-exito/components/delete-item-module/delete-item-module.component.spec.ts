import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MaterialModule } from "@app/material.module";
import { TranslateModule } from "@ngx-translate/core";

import { DeleteItemModuleComponent } from "./delete-item-module.component";

describe("DeleteItemModuleComponent", () => {
  let component: DeleteItemModuleComponent;
  let fixture: ComponentFixture<DeleteItemModuleComponent>;

  const mockDialog = jasmine.createSpyObj("MatDialogRef", [
    "open, close, afterClosed",
  ]);
  let data = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteItemModuleComponent],
      imports: [MaterialModule, TranslateModule.forRoot({})],
      providers: [
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteItemModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
