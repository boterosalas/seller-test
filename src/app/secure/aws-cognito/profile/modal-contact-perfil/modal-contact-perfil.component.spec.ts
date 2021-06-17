import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { CognitoUtil, EndpointService, LoadingService, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { of } from 'rxjs';

import { AuthService } from '@app/secure/auth/auth.routing';
import { ModalContactPerfilComponent } from './modal-contact-perfil.component';
import { MyProfileService } from '../myprofile.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('ModalContactPerfilComponent', () => {

    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull']);
    const mockMyProfielService = jasmine.createSpyObj('MyProfileService', ['getUser', 'getAllContactData', 'createContactData', 'updateContactData']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);

    let component: ModalContactPerfilComponent;
    let fixture: ComponentFixture<ModalContactPerfilComponent>;

    const mockDialog = jasmine.createSpyObj("MatDialogRef", [
        "open, close, afterClosed",
      ]);

    let data = {
        contact: {
            Traduction:'',
            ContactName:'',
            Role:'',
            Email:'',
            Cellphone:'',
            Phone:''
        }
      };

    const responseAllContactData = {
        body: {
            body: '{"Message":"OK","Errors":[],"Data":[{"Id":0,"NameList":"Gerente General","ContactName":"Marcador","Role":"suplentes","Email":"israel@pragma.co","Cellphone":"8797698689","Phone":"980090","IdSeller":0,"SellerName":null,"CreationDate":"2021-05-31T16:32:09.185+00:00","Traduction":"Gerente General"}],"SellerId":null}',
            isBase64Encoded: false,
            statusCode: 200
        },
        headers: null,
        ok: true,
        status: 200,
        statusText: 'OK',
        type: 4,
        url: 'https://abc89jo3oa.execute-api.us-east-1.amazonaws.com/dev/GetSellerContacts/?culture=es-CO'
    };

    const reponseSYNC = {
        body: {
            body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
            isBase64Encoded: false,
            statusCode: 200,
        }
    };

    const responseData = {
        Data: true,
        Errors: [],
        Message: ''
    };

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

    const responseListCommission = {
        // tslint:disable-next-line: max-line-length
        body: '{Message:"Operación realizada éxitosamente.","Errors":[],"Data":{"AuditCommissionExcViewModels":[{"Type":"Brand","SellerId":12390,"SellerAudit":12395,"SellerNameAudit":"raul vergara admin","SellerNit":"1117555556","Operation":"Create","Data":{"Commission":23.5,"IdVTEX":"57","Brand":"ADIDAS","InitialDate":null,"FinalDate":null,"Ean":null},"IdVTEX":"ADIDAS","Date":"2020-11-15T18:38:49.118+00:00"},{"Type":"Plu","SellerId":12390,"SellerAudit":12395,"SellerNameAudit":"raul vergara admin","SellerNit":"1117555556","Operation":"Create","Data":{"Commission":2.0,"IdVTEX":"1384715","Brand":"1384715","InitialDate":"2020-11-15 19:47","FinalDate":"2020-11-18 19:47","Ean":null},"IdVTEX":"1384715","Date":"2020-11-15T19:47:34.672+00:00"},{"Type":"Brand","SellerId":12390,"SellerAudit":12395,"SellerNameAudit":"raul vergara admin","SellerNit":"1117555556","Operation":"Delete","Data":{"Commission":23.0,"IdVTEX":"57","Brand":"ADIDAS","InitialDate":null,"FinalDate":null,"Ean":null},"IdVTEX":"ADIDAS","Date":"2020-11-26T18:44:40.892+00:00"},{"Type":"Brand","SellerId":12390,"SellerAudit":12395,"SellerNameAudit":"raul vergara admin","SellerNit":"1117555556","Operation":"Create","Data":{"Commission":23.0,"IdVTEX":"57","Brand":"ADIDAS","InitialDate":"2020-11-26 18:50","FinalDate":"2020-11-27 18:45","Ean":null},"IdVTEX":"ADIDAS","Date":"2020-11-26T18:45:08.651+00:00"},{"Type":"Plu","SellerId":11226,"SellerAudit":1,"SellerNameAudit":"madrid emperador","SellerNit":"54813456222","Operation":"Create","Data":{"Commission":18.0,"IdVTEX":"100001006","Brand":"100001006","InitialDate":"2020-11-13 11:47","FinalDate":"2020-11-20 11:48","Ean":null},"IdVTEX":"100001006","Date":"2020-11-13T11:48:28.205+00:00"},{"Type":"Plu","SellerId":11226,"SellerAudit":1,"SellerNameAudit":"madrid emperador","SellerNit":"54813456222","Operation":"Update","Data":{"Commission":18.12,"IdVTEX":"100001006","Brand":"100001006","InitialDate":"2020-11-13 11:47","FinalDate":"2020-11-20 11:48","Ean":null},"IdVTEX":"100001006","Date":"2020-11-23T15:41:57.583+00:00"},{"Type":"Brand","SellerId":11226,"SellerAudit":1,"SellerNameAudit":"madrid emperador","SellerNit":"54813456222","Operation":"Create","Data":{"Commission":10.0,"IdVTEX":"105707","Brand":"APPLE","InitialDate":"2020-11-23 15:42","FinalDate":"2020-11-24 15:42","Ean":null},"IdVTEX":"APPLE","Date":"2020-11-23T15:44:21.828+00:00"},{"Type":"Plu","SellerId":11226,"SellerAudit":1,"SellerNameAudit":"madrid emperador","SellerNit":"54813456222","Operation":"Update","Data":{"Commission":18.12,"IdVTEX":"100001006","Brand":"100001006","InitialDate":"2020-11-13 11:47","FinalDate":"2020-11-24 11:48","Ean":null},"IdVTEX":"100001006","Date":"2020-11-23T15:46:28.164+00:00"}],"PaginationToken":"{}","PaginationTokens":[],"Count":8}}',
        headers: null,
        isBase64Encoded: false,
        multiValueHeaders: null,
        statusCode: 200,
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

    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
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
            declarations: [ModalContactPerfilComponent],
            providers: [
                { provide: StoresService, useValue: mockStoresService },
                EndpointService,
                UserParametersService,
                { provide: ModalService, useValue: mockDialogError },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: UserLoginService, useValue: mockUserLoginService },
                { provide: MyProfileService, useValue: mockMyProfielService },
                { provide: SupportService, useValue: mockSupportService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: data },
                ShellComponent,
                ComponentsService,
                EventEmitterOrders,
                CognitoUtil
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalContactPerfilComponent);
        mockSupportService.getRegexFormSupport.and.returnValue(of(respondeRegex));
        mockStoresService.getAllStoresFull.and.returnValue(of(response));
        mockMyProfielService.getUser.and.returnValue(of(reponseSYNC));
        mockMyProfielService.getAllContactData.and.returnValue(of(responseAllContactData));
        mockMyProfielService.createContactData.and.returnValue(of(responseData));
        mockMyProfielService.updateContactData.and.returnValue(of(responseData));
        mockAuthService.getMenu.and.returnValue(registerMenu);
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

// import { HttpClientModule } from "@angular/common/http";
// import { async, ComponentFixture, TestBed } from "@angular/core/testing";
// import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { RouterTestingModule } from "@angular/router/testing";
// import { LoadingService } from "@app/core";
// import { MaterialModule } from "@app/material.module";
// import { SupportService } from "@app/secure/support-modal/support.service";
// import { SharedModule } from "@app/shared/shared.module";
// import { of } from "rxjs";
// import { MyProfileService } from "../myprofile.service";

// import { ModalContactPerfilComponent } from "./modal-contact-perfil.component";

// describe("ModalContactPerfilComponent", () => {
//   let component: ModalContactPerfilComponent;
//   let fixture: ComponentFixture<ModalContactPerfilComponent>;

//   const mockMyProfielService = jasmine.createSpyObj('MyProfileService', ['getUser', 'getAllContactData', 'createContactData', 'updateContactData']);
//   const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
//   const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);

//       const reponseSYNC = {
//         body: {
//             body: '{"Message":"OK","Errors":[],"Data":{"IdSeller":1,"Name":"Madrid Emperador","DaneCode":"12345670","Address":null,"GotoExito":false,"GotoCarrulla":false,"GotoCatalogo":false,"IsShippingExito":true,"IsLogisticsExito":true,"Nit":"54813456222","Email":"avecesar@emperador.com","Status":"Enable","StartVacations":"0001-01-01T00:00:00","EndVacations":"0001-01-01T00:00:00","City":"","Country":null,"Payoneer":null,"DaneCodesNonCoverage":null,"Profile":"administrator","IdDispatchPort":0},"SellerId":null}',
//             isBase64Encoded: false,
//             statusCode: 200,
//         }
//     };

//         const respondeRegex = {
//         body: {
//             body: '{"Errors":[],"Data":[],"Message":""}',
//             isBase64Encoded: false,
//             statusCode: 200
//         },
//         ok: true,
//         status: 200,
//         statusText: 'OK',
//         type: 4
//     };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ModalContactPerfilComponent],
//       imports: [
//         MaterialModule,
//         ReactiveFormsModule,
//         FormsModule,
//         RouterTestingModule,
//         BrowserAnimationsModule,
//         HttpClientModule,
//         SharedModule,
//       ],
//       providers:[
//         { provide: MyProfileService, useValue: mockMyProfielService },
//         { provide: SupportService, useValue: mockSupportService },
//         { provide: LoadingService, useValue: mockLoadingService },
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ModalContactPerfilComponent);
//     component = fixture.componentInstance;
//     mockMyProfielService.getUser.and.returnValue(of(reponseSYNC));
//     mockSupportService.getRegexFormSupport.and.returnValue(of(respondeRegex));
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });
// });
