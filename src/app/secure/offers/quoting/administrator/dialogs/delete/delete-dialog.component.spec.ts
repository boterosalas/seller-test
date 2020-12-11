import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { of } from 'rxjs';
import { SupportService } from '@app/secure/support-modal/support.service';
import { EndpointService, LoadingService, UserLoginService, UserParametersService } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { DeleteDialogComponent } from './delete-dialog.component';
import { ListTransporterService } from '../../list-transporter/list-transporter.service';
import { ListZonesService } from '../../list-zones/list-zones.service';

    const resListTransport = {
        status: 200,
        body: {
            statusCode: 200,
            Errors: [],
            body: {
                Data: [
                    { Id: 29, Name: 'aja', IdShippingMethod: 1, Method: 'Hola' },
                ]
            }
        }
    };

        const resListZones = {
        status: 200,
        body: {
            statusCode: 200,
            Errors: [],
            body: {
                Data: [
                    { Id: 9, Name: 'Antioquia', DaneCode: '12345678,50000000,10000000' },
                ]
            }
        }
    };

    export const registerRegex = [
    { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
  ];

describe('deleteDialogComponent', () => {

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
  const mockListTransporterService = jasmine.createSpyObj('ListTransporterService', ['getListTransporters', 'getDialogType']);
  const mockListZonesService = jasmine.createSpyObj('ListZonesService', ['getListZones', 'getDialogType']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;


  beforeEach(fakeAsync(() => {
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
      declarations: [ DeleteDialogComponent ],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: ListTransporterService, useValue: mockListTransporterService },
        { provide: ListZonesService, useValue: mockListZonesService },
        { provide: SupportService, useValue: mockSupportService },
        
        StoresService,
        EndpointService,
        ShellComponent,
        ComponentsService,
        EventEmitterOrders,

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(DeleteDialogComponent);
    mockListTransporterService.getListTransporters.and.returnValue(of(resListTransport));
    mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
    mockListTransporterService.getDialogType.and.returnValue(of(1));
    mockListZonesService.getDialogType.and.returnValue(of(2));
    mockListZonesService.getListZones.and.returnValue(of(resListZones));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
