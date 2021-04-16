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

import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { QualityIndicatorsComponent } from './quality-indicators.component';
import { DashboardService } from '../services/dashboard.service';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { InfoIndicatorsComponent } from '../info-indicators/info-indicators.component';

describe('qualityIndicator', () => {

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'getAllStores']);
  const mockDashService = jasmine.createSpyObj('DashboardService', ['getIndicators']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
  const mockMyProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);
  let component: QualityIndicatorsComponent;
  let fixture: ComponentFixture<QualityIndicatorsComponent>;

  const response = {
    data: true,
    errors: [],
    message: null,
    pendingResponse: false,
  };
  ;

  const responseListIndicators = {
    'message': 'Operación Realizada Correctamente',
    'errors': null,
    'data': [
      {
        'sellerId': 12264,
        'initialDate': 'December 15, 2020',
        'finalDate': 'December 15, 2020',
        'value': 0.0,
        'indicatorName': 'Total Claims Rate %',
        'goal': 9.0,
        'measureUnit': '%',
        'calcInformation': 'Total claims generated / Total orders generated to your store',
        'color': 'Green',
        'percentageBar': 0.0
      },
      {
        'sellerId': 12264,
        'initialDate': 'December 15, 2020',
        'finalDate': 'December 15, 2020',
        'value': 0.0,
        'indicatorName': 'Attributable Claims Rate %',
        'goal': 9.0,
        'measureUnit': '%',
        'calcInformation': 'Total claims where the responsibility lies with the seller / Total orders generated to your store',
        'color': 'Green',
        'percentageBar': 0.0
      },
      {
        'sellerId': 12264,
        'initialDate': 'December 15, 2020',
        'finalDate': 'December 15, 2020',
        'value': 0.0,
        'indicatorName': 'Defective Orders Rate %',
        'goal': 3.0,
        'measureUnit': '%',
        'calcInformation': 'Total claims associated with defective orders considered so by the appearance of the product, functionality of the product, blocked cell phone, processing warranty, packaging in good condition and damaged product / Total orders generated to your store',
        'color': 'Green',
        'percentageBar': 0.0
      },
      {
        'sellerId': 12264,
        'initialDate': 'December 15, 2020',
        'finalDate': 'December 15, 2020',
        'value': 67.78,
        'indicatorName': 'Average Collection Request Times',
        'goal': 48.0,
        'measureUnit': 'Hours',
        'calcInformation': 'Average time between the date of order generation and the date when the store requests collection from the carrier',
        'color': 'Red',
        'percentageBar': 70.817350250811448804957214520
      },
      {
        'sellerId': 12264,
        'initialDate': 'December 15, 2020',
        'finalDate': 'December 15, 2020',
        'value': 0.0,
        'indicatorName': 'Cancellation Rate %',
        'goal': 2.0,
        'measureUnit': '%',
        'calcInformation': 'Total orders in cancelled / Total orders generated to your store.',
        'color': 'Green',
        'percentageBar': 0.0
      },
      {
        'sellerId': 12264,
        'initialDate': 'December 15, 2020',
        'finalDate': 'December 15, 2020',
        'value': 11.48,
        'indicatorName': 'Average Delivery times',
        'goal': 48.0,
        'measureUnit': 'Hours',
        'calcInformation': 'Average time between the date of the request for collection and when the guide is in transport.',
        'color': 'Green',
        'percentageBar': 418.11846689895470383275261324
      },
      {
        'sellerId': 12264,
        'initialDate': 'December 15, 2020',
        'finalDate': 'December 15, 2020',
        'value': 43.48,
        'indicatorName': 'Out of Time Delivery rate %',
        'goal': 6.0,
        'measureUnit': '%',
        'calcInformation': 'Total orders that do not comply with the delivery promise / Total orders generated   to your store.',
        'color': 'Red',
        'percentageBar': 13.799448022079116835326586940
      },
      {
        'sellerId': 12264,
        'initialDate': 'December 15, 2020',
        'finalDate': 'December 15, 2020',
        'value': 0.0,
        'indicatorName': 'Rate Guide Orders %',
        'goal': 5.0,
        'measureUnit': '%',
        'calcInformation': 'Total orders with guide in the seller and with maximum delivery date fulfilled / Total orders generated to your store with maximum delivery date fulfilled.',
        'color': 'Red',
        'percentageBar': 0.0
      }
    ]
  };

  const respondeRegex = {
    body: {
      body: '{"Errors":[],"Data":[],"Message":""}',
      isBase64Encoded: false,
      statusCode: 200
    },
    ok: true,
    status: 200,
    statusText: 'OK',
    type: 4
  };

  const reponseSYNC = {
    body: {
      body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
      isBase64Encoded: false,
      statusCode: 200,
    }
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
      declarations: [QualityIndicatorsComponent],
      providers: [
        { provide: StoresService, useValue: mockStoresService },
        EndpointService,
        UserParametersService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: DashboardService, useValue: mockDashService },
        { provide: SupportService, useValue: mockSupportService },
        { provide: MyProfileService, useValue: mockMyProfileService },
        ShellComponent,
        ComponentsService,
        EventEmitterOrders,
        CognitoUtil
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityIndicatorsComponent);
    mockStoresService.getAllStores.and.returnValue(of(response));
    mockDashService.getIndicators.and.returnValue(of(responseListIndicators));
    mockSupportService.getRegexFormSupport.and.returnValue(of(respondeRegex));
    mockMyProfileService.getUser.and.returnValue(of(reponseSYNC));
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
