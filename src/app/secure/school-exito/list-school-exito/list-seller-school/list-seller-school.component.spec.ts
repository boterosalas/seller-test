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
import { SchoolExitoService } from '../../school-exito.service';
import { ListSellerSchoolComponent } from './list-seller-school.component';

describe('listSellerSchoolComponent', () => {

    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStores']);
    const mockSchoolService = jasmine.createSpyObj('SchoolExitoService', ['getAllModuleSchoolExito', 'editModules', 'createSubModules', 'createModules', 'editSubModules', 'updatePositionSubModules', 'deleteModule', 'deleteSubModule']);
    const mockMyProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);
    let component: ListSellerSchoolComponent;
    let fixture: ComponentFixture<ListSellerSchoolComponent>;

    const response = {
        data: true,
        errors: [],
        message: null,
        pendingResponse: false,
    };


    const reponseSYNC = {
            body: {
                body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
                isBase64Encoded: false,
                statusCode: 200,
            }
        };

        const result = {
          body: {
              body: '{"Message":"OK","Errors":[],"Data":null,"SellerId":null}',
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
            declarations: [ListSellerSchoolComponent],
            providers: [
                { provide: StoresService, useValue: mockStoresService },
                EndpointService,
                UserParametersService,
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: UserLoginService, useValue: mockUserLoginService },
                { provide: SchoolExitoService, useValue: mockSchoolService },
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
        fixture = TestBed.createComponent(ListSellerSchoolComponent);
        mockStoresService.getAllStores.and.returnValue(of(response));
        mockSchoolService.getAllModuleSchoolExito.and.returnValue(of(result));
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
