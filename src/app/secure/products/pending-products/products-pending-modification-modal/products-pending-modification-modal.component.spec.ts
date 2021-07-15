/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProductsPendingModificationModalComponent } from "./products-pending-modification-modal.component";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "@app/material.module";
import { EndpointService } from "@app/core";
import { PendingProductsService } from "../pending-products.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { of } from "rxjs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
describe("ProductsPendingModificationModalComponent", () => {
  let component: ProductsPendingModificationModalComponent;
  let fixture: ComponentFixture<ProductsPendingModificationModalComponent>;

  const mockProductPendingService = jasmine.createSpyObj(
    "PendingProductsService",
    ["getCategoriesToDownloadProductsPendingModification"]
  );
  const mockDialogRef = jasmine.createSpyObj("MatDialogRef", [
    "close",
    "afterClosed",
    "componentInstance",
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        EndpointService,
        {
          provide: PendingProductsService,
          useValue: mockProductPendingService,
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      declarations: [ProductsPendingModificationModalComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ProductsPendingModificationModalComponent
    );
    mockProductPendingService.getCategoriesToDownloadProductsPendingModification.and.returnValue(of([1,2,3]));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
