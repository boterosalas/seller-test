import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { CognitoUtil, EndpointService, LoadingService, UserLoginService, UserParametersService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { of } from 'rxjs';
import { NotificationFormComponent } from './notification-form.component';
import { NotificationAdminService } from '../../notification-admin.service';



describe('notificationFormComponent', () => {

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull']);
  const mockNotificationService = jasmine.createSpyObj('NotificationAdminService', ['getAllNotification', 'createNew', 'saveImgNotification', 'updateNotification', 'deleteNotification']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  let component: NotificationFormComponent;
  let fixture: ComponentFixture<NotificationFormComponent>;

  const response = {
    data: true,
    errors: [],
    message: null,
    pendingResponse: false,
  };
  const responseSendReport = {
    headers: null,
    isBase64Encoded: false,
    multiValueHeaders: null,
    statusCode: 200
  };


  const respondeRegex = {
    body: {
        body : '{"Errors":[],"Data":[],"Message":""}',
        isBase64Encoded: false,
        statusCode: 200
    },
    ok: true,
    status: 200,
    statusText: 'OK',
    type: 4
  };

const responseEdit = {
    Data: true,
    Errors: [],
    Message: 'Anuncio creado exitosamente.'
};

const responseCreate = {
    Data: true,
    Errors: [],
    Message: 'Anuncio creado exitosamente.'
};


const responseSaveImg = {
    body: {
        Data: {
            Response: true,
            Url: 'https://s3.amazonaws.com/seller.center.exito.images/imagesDev/NewsImages/seta-de-mario-bros.jpg'
        },
        Errors: [],
        Message: ''
    },
    headers: null,
    ok: true,
    status: 200,
    statusText: 'OK',
    type: 4,
    url: 'https://oi3ylqu9t0.execute-api.us-east-1.amazonaws.com/Dev-SC-News/SaveImage/?culture=es-CO'
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
      declarations: [NotificationFormComponent],
      providers: [
        { provide: StoresService, useValue: mockStoresService },
        EndpointService,
        UserParametersService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: NotificationAdminService, useValue: mockNotificationService },
        { provide: SupportService, useValue: mockSupportService },
        ShellComponent,
        ComponentsService,
        EventEmitterOrders,
        CognitoUtil
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationFormComponent);
    mockStoresService.getAllStoresFull.and.returnValue(of(response));
    mockNotificationService.createNew.and.returnValue(of(responseCreate));
    mockNotificationService.saveImgNotification.and.returnValue(of(responseSaveImg));
    mockNotificationService.updateNotification.and.returnValue(of(responseEdit));
    mockSupportService.getRegexFormSupport.and.returnValue(of(respondeRegex));
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
