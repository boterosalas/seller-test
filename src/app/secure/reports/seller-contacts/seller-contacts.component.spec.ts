import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EndpointService, LoadingService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { SellerSupportCenterService } from '@app/secure/seller-support-center/services/seller-support-center.service';
import { SupportService } from '@app/secure/support-modal/support.service';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { SharedModule } from '@app/shared/shared.module';
import { ConfigurationState } from '@app/store/configuration';
import { StoreService } from '@app/store/store.service';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { SellerContactsComponent } from './seller-contacts.component';
import { SellerContactsService } from './seller-contacts.service';

class StoreServiceTest {
  getStateConfiguration() {
    const configurationState: ConfigurationState = { language: 'US', statusCases: [] };
    return of({
      appConfiguration: configurationState,
      configuration: { modules: [] },
      notification: {
        sumaUnreadDevolutions: 2,
        unreadCases: 2,
        unreadDevolutions: 2,
        unreadPendings: 2
      }
    });
  }
}

describe('SellerContactsComponent', () => {
  let component: SellerContactsComponent;
  let fixture: ComponentFixture<SellerContactsComponent>;

  
  const mockMyProfileService = jasmine.createSpyObj("MyProfileService", [
    "getUser",
  ]);

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);

  const reponseSYNC = {
    body: {
      body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
      isBase64Encoded: false,
      statusCode: 200,
    }
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

  const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerContactsComponent ],
      imports:[
        SharedModule,
        TranslateModule.forRoot(),
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot({})
      ],
      providers: [
        EventEmitterSeller,
        EndpointService,
        SellerSupportCenterService,
        SellerContactsService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: StoreService, useClass: StoreServiceTest },
        { provide: MyProfileService, useValue: mockMyProfileService },
        { provide: SupportService, useValue: mockSupportService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerContactsComponent);
    component = fixture.componentInstance;
    mockSupportService.getRegexFormSupport.and.returnValue(of(respondeRegex));
    mockMyProfileService.getUser.and.returnValue(of(reponseSYNC));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
