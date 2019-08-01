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
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DownloadOrderService } from './download-order.service';
import { ComponentsService } from '@app/shared';
import { UserParametersService, LoadingService, EndpointService, CognitoUtil } from '@app/core';
import { of, throwError } from 'rxjs';


fdescribe('DownloadOrderModalComponent', () => {
  let component: DownloadOrderModalComponent;
  let fixture: ComponentFixture<DownloadOrderModalComponent>;

  const currentSeller = {
    email: 'ccbustamante221@misena.edu.co',
    idSeller: '11618',
    sellerName: 'la tienda de cristian 2019 vs 512',
  };

  const data = {
    sellerId: '11618',
    sellerProfile: 'seller',
    sellerNit: '123',
    sellerName: 'la tienda de cristian 2019 vs 512',
    sellerEmail: 'ccbustamante221@misena.edu.co',
  };

  const res = 1954570;

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockDownloadOrderService = jasmine.createSpyObj('DownloadOrderService', ['downloadOrders', 'getCurrentFilterOrders', 'downloadBilling']);
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
      declarations: [
        DownloadOrderModalComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: DownloadOrderService, useValue: mockDownloadOrderService },
        ComponentsService,
        FormBuilder,
        UserParametersService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserParametersService, useValue: mockUserParameterService },
        EndpointService,
        CognitoUtil,
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: FormBuilder, useValue: formBuilder }
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
    // mockDownloadOrderService.downloadOrders.and.returnValue(of(res));
    mockUserParameterService.getUserData.and.returnValue(of(data));
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Funciones', () => {
    const myform = formBuilder.group({
      email: { value: 'ccbustamante221@misena.edu.co' }
    });
    beforeEach(() => {
      mockDownloadOrderService.downloadOrders.and.returnValue(of(res));
      mockDownloadOrderService.getCurrentFilterOrders.and.returnValue(of(currentSeller));
      component.user = data;
      fixture.detectChanges();
    });
    it('Método para realizar la descarga de las órdenes.', () => {
      component.downloadOrders(myform);
    });
  });

  describe('Funciones', () => {
    beforeEach(() => {
      mockDownloadOrderService.downloadOrders.and.returnValue(of(res));
      mockDownloadOrderService.getCurrentFilterOrders.and.returnValue(of(currentSeller));
      fixture.detectChanges();
    });
    it('Metodo para enviar al back el correo por el cual desea obtener las facturas', () => {
      component.downloadOrdersByService(currentSeller);
    });
    afterAll(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('Funciones', () => {
    beforeEach(() => {
      // mockDownloadOrderService.downloadOrders.and.returnValue(of(res));
      // mockDownloadOrderService.getCurrentFilterOrders.and.returnValue(of(currentSeller));
      mockDownloadOrderService.getCurrentFilterOrders.and.returnValue(throwError('falle'));
      fixture.detectChanges();
    });
    it('Error servicio', () => {
      component.downloadOrdersByService(currentSeller);
    });
    afterAll(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('Funciones', () => {
    beforeEach(() => {
      mockDownloadOrderService.downloadOrders.and.returnValue(of(null));
      mockDownloadOrderService.getCurrentFilterOrders.and.returnValue(of(currentSeller));
      fixture.detectChanges();
    });
    it('Metodo para enviar al back el correo por el cual desea obtener las facturas ELSE', () => {
      component.downloadOrdersByService(currentSeller);
    });
  });

  describe('Funciones', () => {
    beforeEach(() => {
      mockDownloadOrderService.downloadBilling.and.returnValue(of(currentSeller));
      fixture.detectChanges();
    });
    it('Metodo para enviar al back el correo por el cual desea obtener las facturas', () => {
      component.downBillingByService(currentSeller);
    });
  });
});

