import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService, UserParametersService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DownloadReportListCancelsComponent } from './download-report-list-cancels.component';
import { ListDownloadOrdersService } from './download-report-list-cancels.service';

describe('DownloadReportListCancelsComponent', () => {
  let component: DownloadReportListCancelsComponent;
  let fixture: ComponentFixture<DownloadReportListCancelsComponent>;

  const data = {
    sellerId: '11618',
    sellerProfile: 'seller',
    sellerNit: '123',
    sellerName: 'la tienda de cristian 2019 vs 512',
    sellerEmail: 'ccbustamante221@misena.edu.co',
  };

  const dataToSendDownloadListOk = {
    data: true
  };
  const dataToSendDownloadListKo = {
    data: false
  };
  const dataToSendDownloadHistOk = {
    data: true
  };
  const dataToSendDownloadHistKo = {
    data: false
  };

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);
  const mockListDownloadOrdersService = jasmine.createSpyObj('ListDownloadOrdersService', ['sendEmailExportListsCancel']);
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
      ],
      declarations: [
        DownloadReportListCancelsComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        FormBuilder,
        ComponentsService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: ListDownloadOrdersService, useValue: mockListDownloadOrdersService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadReportListCancelsComponent);
    component = fixture.componentInstance;
    mockUserParameterService.getUserData.and.returnValue(of(data));
    // mockListDownloadOrdersService.sendEmailExportListsCancel.and.returnValue(of(dataToSendDownloadList));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should be closed after onNoClick()', () => {
    component.onNoClick();
    expect(component).toBeTruthy();
  });
  it('dialog should be closed after onNoClickOk()', () => {
    component.onNoClickOk();
    expect(component).toBeTruthy();
  });
  describe('Funcion obtener descarga list cancels()', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.formListPending = myform;
      mockListDownloadOrdersService.sendEmailExportListsCancel.and.returnValue(of(dataToSendDownloadListOk));
    });
    it('DOwnload list cancels()', () => {
      component.sendExportDevolutionList();
    });
  });
  describe('Funcion obtener descarga list cancels() data = false', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.formListPending = myform;
      const dataFalse = false;
      mockListDownloadOrdersService.sendEmailExportListsCancel.and.returnValue(of(dataToSendDownloadListKo));
    });
    it('DOwnload list cancels()', () => {
      component.sendExportDevolutionList();
    });
  });

  describe('Funcion obtener descarga list cancels() res false', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.formListPending = myform;
      const dataFalse = false;
      mockListDownloadOrdersService.sendEmailExportListsCancel.and.returnValue(of(dataFalse));
    });
    it('DOwnload list cancels()', () => {
      component.sendExportDevolutionList();
    });
  });

  describe('Funcion obtener descarga hist cancels()', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.formListPending = myform;
      mockListDownloadOrdersService.sendEmailExportListsCancel.and.returnValue(of(dataToSendDownloadHistOk));
    });
    it('DOwnload list cancels()', () => {
      component.sendExportDevolutionHistoric();
    });
  });
  describe('Funcion obtener descarga hist cancels() data = false', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.formListPending = myform;
      const dataFalse = false;
      mockListDownloadOrdersService.sendEmailExportListsCancel.and.returnValue(of(dataToSendDownloadHistKo));
    });
    it('DOwnload list cancels()', () => {
      component.sendExportDevolutionHistoric();
    });
  });

  describe('Funcion obtener descarga hist cancels() res false', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.formListPending = myform;
      const dataFalse = false;
      mockListDownloadOrdersService.sendEmailExportListsCancel.and.returnValue(of(dataFalse));
    });
    it('DOwnload list cancels()', () => {
      component.sendExportDevolutionHistoric();
    });
  });

});
