import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService, ModalService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { SupportService } from '@app/secure/support-modal/support.service';
import { SharedModule } from '@app/shared/shared.module';
import { of } from 'rxjs';

import { SizesComponent } from './sizes.component';
import { SizesService } from './sizes.service';

export const sizeRegex = [
  { Identifier: 'sizeProduct', Value: '^([\\s\\S]{1,30})$', Module: 'productos' },
];

describe('SizesComponent', () => {
  let component: SizesComponent;
  let fixture: ComponentFixture<SizesComponent>;

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockSizeService = jasmine.createSpyObj('SizesService', ['getListSizes']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  const matSnackBar: MatSnackBar = null;
  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);

  const formBuilder: FormBuilder = new FormBuilder();


  const mockDialog = jasmine.createSpyObj('MatDialogRef', [
    'open, close, afterClosed',
  ]);

  const reponseListSizesRegex = {
    body: {
      data: sizeRegex
    }
  };

  const reponseListSizes = {
    count: 262,
    paginationToken: '{"CutOffDate":{"S":"02/09/2020"},"SellerId":{"N":"100089"}}',
    paginationTokens: [],
    viewModel:
      [{
        label: "BANGUERA",
        name: "BANGUERA",
        size: "BANGUERA",
        status: false
      }]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule
      ],
      declarations: [SizesComponent],
      providers: [
        { provide: ModalService, useValue: mockDialogError },
        { provide: SizesService, useValue: mockSizeService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: SupportService, useValue: mockSupportService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizesComponent);
    mockSupportService.getRegexFormSupport.and.returnValue(of(reponseListSizesRegex));
    mockSizeService.getListSizes.and.returnValue(of(reponseListSizes));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
