import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EndpointService } from "@app/core";
import { MaterialModule } from "@app/material.module";
import { ComponentsService } from "@app/shared";
import { TranslateModule } from "@ngx-translate/core";
import { ngfModule } from "angular-file";

import { UploadFileComponent } from "./upload-file.component";

describe("UploadFileComponent", () => {
  let component: UploadFileComponent;
  let fixture: ComponentFixture<UploadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFileComponent],
      imports: [ngfModule, MaterialModule, TranslateModule.forRoot({})],
      providers: [EndpointService, ComponentsService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
