import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService, UserParametersService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DetailPaymentService } from '../detail-payment.service';

import { DownloadDetailPaymentComponent } from './download-detail-payment.component';

fdescribe('DownloadDetailPaymentComponent', () => {
  let component: DownloadDetailPaymentComponent;
  let fixture: ComponentFixture<DownloadDetailPaymentComponent>;

  const data = {
    sellerId: '11618',
    IdSeller: '11618',
    sellerProfile: 'seller',
    sellerNit: '123',
    sellerName: 'la tienda de cristian 2019 vs 512',
    sellerEmail: 'ccbustamante221@misena.edu.co',
  };

  const dataToSendDownloadDetailPaymentOk = {
    body: {data: true}
  };
  const dataToSendDownloadDetailPaymentKo = {
    body: {data: false}
  };

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockDetailPaymentService = jasmine.createSpyObj('DetailPaymentService', ['downloadDetailPayment']);
  const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);
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
      declarations: [DownloadDetailPaymentComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        FormBuilder,
        ComponentsService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: DetailPaymentService, useValue: mockDetailPaymentService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDetailPaymentComponent);
    component = fixture.componentInstance;
    mockUserParameterService.getUserData.and.returnValue(of(data));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should be closed after onNoClick()', () => {
    component.onNoClick();
    expect(component).toBeTruthy();
  });

  describe('Funcion obtener descarga de detalle de pagos()', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.myform = myform;
      const dataToSend = {
        dataSeller: {IdSeller: 11618},
        dataFilterTab1: {},
        dataFilterTab2: {}
      };
      component.sellerData = dataToSend;
      mockDetailPaymentService.downloadDetailPayment.and.returnValue(of(dataToSendDownloadDetailPaymentOk));
    });
    it('Detalle de pagos función()', () => {
      component.sendExportDownloadDetailPayment();
    });
  });

  describe('Funcion obtener descarga de detalle de pagos FALSE ()', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.myform = myform;
      const dataToSend = {
        dataSeller: {IdSeller: 11618},
        dataFilterTab1: {},
        dataFilterTab2: {}
      };
      component.sellerData = dataToSend;
      mockDetailPaymentService.downloadDetailPayment.and.returnValue(of(dataToSendDownloadDetailPaymentKo));
    });
    it('Detalle de pagos función FALSE ()', () => {
      component.sendExportDownloadDetailPayment();
    });
  });

  describe('Funcion obtener descarga de detalle de pagos no DATA ()', () => {
    beforeEach(() => {
      const myform = formBuilder.group({
        email: { value: '' },
      });
      component.myform = myform;
      const dataToSend = {
        dataSeller: {IdSeller: 11618},
        dataFilterTab1: {},
        dataFilterTab2: {}
      };
      component.sellerData = dataToSend;
      mockDetailPaymentService.downloadDetailPayment.and.returnValue(of(false));
    });
    it('Detalle de pagos función no DATA ()', () => {
      component.sendExportDownloadDetailPayment();
    });
  });
});
