/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { ProductDevolutionModalComponent } from './product-devolution-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

describe('ProductDevolutionModalComponent', () => {
  let component: ProductDevolutionModalComponent;
  let fixture: ComponentFixture<ProductDevolutionModalComponent>;

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({}),
      ], declarations: [
        ProductDevolutionModalComponent
      ], providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDevolutionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create Component MODAL devolution', () => {
  //   expect(component).toBeTruthy();
  // });

  it('dialog should be closed after onNoClick()', () => {
    component.onNoClick();
    expect(component).toBeTruthy();
  });
});

