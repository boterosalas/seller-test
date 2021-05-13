import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CognitoUtil, DynamoDBService, EndpointService, UserParametersService, UserLoginService, LoadingService, AwsUtil, ModalService } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { SearchOrderMenuService } from '@app/core/shell/search-order-menu/search-order-menu.service';
import { MaterialModule } from '@app/material.module';
import { AuthService } from '@app/secure/auth/auth.routing';
import { AuthRoutingService } from '@app/secure/auth/auth.service';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { OrderService } from '@app/secure/orders/orders-list/orders.service';
import { EventEmitterOrders, ComponentsService } from '@app/shared';
import { SharedModule } from '@app/shared/shared.module';
import { StateObservable, Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';

import { FraudNotificationComponent } from './fraud-notification.component';

describe('FraudNotificationComponent', () => {
  let component: FraudNotificationComponent;
  let fixture: ComponentFixture<FraudNotificationComponent>;

    // Mock Services
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    // const mockDownloadOrderService = jasmine.createSpyObj('DownloadOrderService', ['downloadOrders', 'getCurrentFilterOrders', 'downloadBilling']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenuProfiel']);
    const mockMyProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);


    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
    };

    const reponseSYNC = {
        body: {
          body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
          isBase64Encoded: false,
          statusCode: 200,
        }
      };

      const userData = { sellerProfile: 'seller' };

      const mockUser = Object.assign({}, userData);

      const responseGetUser = {
        body: {
          body: JSON.stringify({ Data: mockUser })
        }
      };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraudNotificationComponent ],
      imports: [
          SharedModule,
          TranslateModule.forRoot({}),
          MaterialModule,
          RouterTestingModule,
          HttpClientTestingModule,
          StoreModule.forRoot({})
      ],
      providers: [
        CognitoUtil,
        DynamoDBService,
        EventEmitterOrders,
        ShellComponent,
        ComponentsService,
        SearchOrderMenuService,
        EndpointService,     
        OrderService,
        AwsUtil,
        { provide: MyProfileService, useValue: mockMyProfileService },
        ModalService,
        StoresService,
        { provide: AuthService, useValue: mockAuthService },
        AuthRoutingService,
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: LoadingService, useValue: mockLoadingService },
        
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockAuthService.getMenuProfiel.and.returnValue(registerMenu);
    mockMyProfileService.getUser.and.returnValue(of(reponseSYNC));
    mockUserParameterService.getUserData.and.returnValue(of(responseGetUser));
    fixture = TestBed.createComponent(FraudNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
