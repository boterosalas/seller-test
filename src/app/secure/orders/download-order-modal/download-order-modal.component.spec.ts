/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { DownloadOrderModalComponent } from './download-order-modal.component';
import { DownloadOrderModalModule } from './download-order-modal.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { MaterialModule } from '@app/material.module';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DownloadOrderService } from './download-order.service';
import { ComponentsService } from '@app/shared';
import { UserParametersService, LoadingService, EndpointService, CognitoUtil } from '@app/core';


fdescribe('DownloadOrderModalComponent', () => {
  let component: DownloadOrderModalComponent;
  let fixture: ComponentFixture<DownloadOrderModalComponent>;

  const currentSeller = {
    email: 'ccbustamante221@misena.edu.co',
    idSeller: '11618',
    sellerName: 'la tienda de cristian 2019 vs 512'
  };

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);


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
      declarations: [
        DownloadOrderModalComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        DownloadOrderService,
        ComponentsService,
        FormBuilder,
        UserParametersService,
        { provide: LoadingService, useValue: mockLoadingService },
        EndpointService,
        CognitoUtil,
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DialogWithFormComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Funciones', () => {
    beforeEach(() => {
    });

    it('Validar descarga de ordenes', () => {
      fixture.detectChanges();
      component.downloadOrders(currentSeller);
    });
  });
});

