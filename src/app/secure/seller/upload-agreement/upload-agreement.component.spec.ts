/* 3rd party components */
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UploadAgreementComponent } from './upload-agreement.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SellerService } from '../seller.service';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService, AwsUtil } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@app/secure/auth/auth.routing';
import { of, throwError } from 'rxjs';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SharedModule } from '@app/shared/shared.module';
import { ModalLoadAgreementComponent } from '../modal-load-agreement/modal-load-agreement.component';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { StoresService } from '@app/secure/offers/stores/stores.service';

export const registerRegex = [
    { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
];

export interface Sort {
    active: string;
    direction: SortDirection;
}

export interface ListFilterBrands {
    name: string;
    value: string;
    nameFilter: string;
}

export interface Brands {
    Id: number;
    Name: string;
    Status: boolean;
    PaginationToken: string;
}





const params = {
    body: JSON.stringify(
        { 'ViewModel':
                        [
                            {
                                'Id': 11896,
                                'IdSeller': 11896,
                                'Name': 'intymen',
                                'Nit': '9003615455',
                                'State': '',
                                'City': '',
                                'Status': 0
                            }
                        ],
        'Count': 1
    }),
    headers: null,
    isBase64Encoded: false,
    statusCode: 200
};


describe('UploadAgreementComponent', () => {
    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
    };

    const response = {
        body: '{"Message":"Operación realizada éxitosamente.","Errors":[],"Data":{ "Brands":[{"Id":636934381618814126,"Name":"---------","Status":0,"IdVTEX":"2000500","UpdateStatus":false}, {"Id":636934381618814126,"Name":"---------","Status":1,"IdVTEX":"2000500","UpdateStatus":false}]}}',
        headers: null,
        isBase64Encoded: false,
        multiValueHeaders: null,
        statusCode: 200
    };

    // Mock Services
    const mockUploadService = jasmine.createSpyObj('SellerService', ['getAllSellersPaginated']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const data = {
        title: '',
        message: '',
        icon: '',
        form: null,
        btnConfirmationText: null,
        showButtons: false
    };
    const formBuilder: FormBuilder = new FormBuilder();

    // Create Variables for services and component
    let fixture: ComponentFixture<UploadAgreementComponent>;
    let uploadAgreementComponent: UploadAgreementComponent;
    let sellerService: SellerService;
    let dialogFixture: ComponentFixture<ModalLoadAgreementComponent>;
    let dialogComponent: ModalLoadAgreementComponent;
    let supportService: SupportService;

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
            declarations: [
                UploadAgreementComponent,
                ModalLoadAgreementComponent
            ],
            providers: [
                { provide: SellerService, useValue: mockUploadService },
                EndpointService,
                { provide: LoadingService, useValue: mockLoadingService },
                SupportService,
                { provide: AuthService, useValue: mockAuthService },
                UserParametersService,
                CognitoUtil,
                { provide: UserLoginService, useValue: mockUserLoginService },
                { provide: ModalService, useValue: mockDialogError },
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: mockDialogRef },
                ShellComponent,
                ComponentsService,
                EventEmitterOrders,
                AwsUtil,
                StoresService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [ModalLoadAgreementComponent]
            }
        });
    }));

    beforeEach((() => {
        mockAuthService.getMenu.and.returnValue(registerMenu);
        fixture = TestBed.createComponent(UploadAgreementComponent);
        uploadAgreementComponent = fixture.componentInstance;
        sellerService = TestBed.get(SellerService);
        supportService = TestBed.get(SupportService);
        dialogFixture = TestBed.createComponent(ModalLoadAgreementComponent);
        dialogComponent = dialogFixture.componentInstance;
        mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
        mockUploadService.getAllSellersPaginated.and.returnValue(of(params));
        fixture.detectChanges();
    }));

    it('should create', (done) => {
        expect(sellerService).toBeTruthy();
        expect(uploadAgreementComponent).toBeTruthy();
        done();
    });
});
