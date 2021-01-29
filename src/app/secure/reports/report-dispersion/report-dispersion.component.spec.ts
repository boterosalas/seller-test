import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/material.module';
import { ReportDispersionComponent } from './report-dispersion.component';
import { SharedModule } from '@app/shared/shared.module';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { CognitoUtil, EndpointService, LoadingService, UserLoginService, UserParametersService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { Observable, of } from 'rxjs';
import { ReportDispersionService } from './report-dispersion.service';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';

describe('ReportCommissionComponent', () => {

    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStores']);
    const mockReportService = jasmine.createSpyObj('ReportDispersionService', ['sendReportDispersion']);
    const mockMyProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);
    let component: ReportDispersionComponent;
    let fixture: ComponentFixture<ReportDispersionComponent>;

    const response = {
        data: true,
        errors: [],
        message: null,
        pendingResponse: false,
    };

    const responseListDispersion = {
        data: true
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
            declarations: [ReportDispersionComponent],
            providers: [
                { provide: StoresService, useValue: mockStoresService },
                EndpointService,
                UserParametersService,
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: UserLoginService, useValue: mockUserLoginService },
                { provide: ReportDispersionService, useValue: mockReportService },
                { provide: MyProfileService, useValue: mockMyProfileService },
                SupportService,
                ShellComponent,
                ComponentsService,
                EventEmitterOrders,
                CognitoUtil
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportDispersionComponent);
        mockStoresService.getAllStores.and.returnValue(of(response));
        mockReportService.sendReportDispersion.and.returnValue(of(responseListDispersion));
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
