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
import { NotificationAdminComponent } from './notification-admin.component';
import { NotificationAdminService } from './notification-admin.service';

describe('notificationAdminComponent', () => {

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull']);
  const mockNotificationService = jasmine.createSpyObj('NotificationAdminService', ['getAllNotification', 'createNew', 'saveImgNotification', 'updateNotification', 'deleteNotification']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  let component: NotificationAdminComponent;
  let fixture: ComponentFixture<NotificationAdminComponent>;

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

  const responseDelete = {
    Data: true,
    Errors: [],
    Message: 'Msg_SuccessfulDeleteNews'
};

const responseListNotification = {
    body: {
        Count: 136,
        PaginationTokens: [],
        PaginationToken: '{"CreationDate":{"S":"2021-05-07T10:16:36.596Z"},"Target":{"S":"International"},"PartitionGrouper":{"S":"News"},"InitialDate":{"S":"2021-03-02T15:16:36.596Z"}}',
        ViewModel: {
            BackgroundColor: null,
            Body: 'diplocatucios',
            CreationDate: '2021-05-20T09:40:29.971+00:00',
            FinalDate: '2021-05-26T05:00:00+00:00',
            Id: '637571004299713787',
            InitialDate: '2021-05-20T14:40:29.971+00:00',
            IsNew: true,
            IsRead: false,
            Link: null,
            NewsContentType: 1,
            Target: 'National',
            Title: 'Monos pequeños',
            UrlImage: 'https://s3.amazonaws.com/seller.center.exito.images/imagesDev/NewsImages/seta-de-mario-bros.jpg'
        }
    },
    headers: null,
    ok: true,
    status: 200,
    statusText: 'OK',
    type: 4,
    url: 'https://oi3ylqu9t0.execute-api.us-east-1.amazonaws.com/Dev-SC-News/GetPaginatedNews?limit=50&paginationToken=%257B%257D&culture=es-CO'
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
      declarations: [NotificationAdminComponent],
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
    fixture = TestBed.createComponent(NotificationAdminComponent);
    mockStoresService.getAllStoresFull.and.returnValue(of(response));
    mockNotificationService.getAllNotification.and.returnValue(of(responseListNotification));
    mockNotificationService.deleteNotification.and.returnValue(of(responseDelete));
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
