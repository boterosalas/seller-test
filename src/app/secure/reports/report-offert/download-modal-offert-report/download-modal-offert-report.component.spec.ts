import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DownloadModalOffertReportComponent } from './download-modal-offert-report.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { UserParametersService, LoadingService, EndpointService } from '@app/core';
import { ReportOffertService } from '../report-offert.service';
import { ComponentsService } from '@app/shared';

fdescribe('DownloadModalOffertReportComponent', () => {
  let component: DownloadModalOffertReportComponent;
  let fixture: ComponentFixture<DownloadModalOffertReportComponent>;

  const data = {
    sellerId: '11618',
    sellerProfile: 'seller',
    sellerNit: '123',
    sellerName: 'la tienda de cristian 2019 vs 512',
    sellerEmail: 'ccbustamante221@misena.edu.co',
  };

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
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
        HttpClientModule
      ],
      declarations: [DownloadModalOffertReportComponent],
      providers: [
        FormBuilder,
        UserParametersService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: FormBuilder, useValue: formBuilder },
        ReportOffertService,
        EndpointService,
        ComponentsService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadModalOffertReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const myform = formBuilder.group({
      email: { value: 'ccbustamante221@misena.edu.co' }
    });
  });

  it('should create DownloadModalOffertReportComponent', () => {
    expect(component).toBeTruthy();
  });

  // it('dialog should be closed after onNoClick()', () => {
  //   component.onNoClick();
  //   expect(component).toBeTruthy();
  // });

  // describe('Funciones descarga de las órdene', () => {
  //   const myform = formBuilder.group({
  //     email: { value: 'ccbustamante221@misena.edu.co' }
  //   });
  //   beforeEach(() => {
  //     component.user = data;
  //     fixture.detectChanges();
  //   });
  //   it('Método para realizar la descarga de las órdenes.', () => {
  //     component.downloadReportOffertADmin(myform);
  //   });
  // });
});
