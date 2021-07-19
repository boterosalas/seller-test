import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService, UserParametersService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { AuthService } from '@app/secure/auth/auth.routing';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { BillingOrdersService } from '@app/secure/orders/billing-orders/billing-orders.service';
import { ComponentsService } from '@app/shared';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AgreementComponent } from './agreement.component';
import { AgreementService } from './agreement.component.service';


describe('AgreementComponent', () => {
    let component: AgreementComponent;
    let fixture: ComponentFixture<AgreementComponent>;

    const agreementMenu = {
        Functionalities: [{
            NameFunctionality: 'Consultar',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Consultar'
        }],
    };

    const reponseUserSYNC = {
        sellerEmail: 'exitoregresion@gmail.com',
        sellerId: '11226',
        sellerName: 'pruebas qa test',
        sellerNit: '9852410170',
        sellerProfile: 'seller'
    };

    const reponseUserAdminSYNC = {
        sellerEmail: 'exitoregresion@gmail.com',
        sellerId: '11226',
        sellerName: 'pruebas qa test',
        sellerNit: '9852410170',
        sellerProfile: 'admin'
    };

    const userData = { sellerProfile: 'seller' };

    const mockUser = Object.assign({}, userData);

    const responseGetUser = {
        body: {
            body: JSON.stringify({ Data: mockUser })
        }
    };

    const dataServicesAgreement = {
        body: {
            Data: [
                {
                    ContractName: "AcuerdoMarketplace - pruebas qa 12092019.pdf",
                    ContractcUrl: "https://s3.amazonaws.com/seller.center.exito.seller/ContractDev/AcuerdoMarketplace%20-%20pruebas%20qa%2012092019.pdf"
                }],
            Errors: [],
            Message: 'OK',
            SellerId: null,
        }
    };

    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockAgreementService = jasmine.createSpyObj('AgreementService', ['getAgreements']);
    const mockBillingOrdersService = jasmine.createSpyObj('BillingOrdersService', ['getDownnLoadBilling']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientModule,
                SharedModule,
                RouterTestingModule,
                TranslateModule.forRoot({}),
            ],
            declarations: [AgreementComponent],
            providers: [
                ComponentsService,
                EventEmitterSeller,
                StoresService,
                { provide: UserParametersService, useValue: mockUserParameterService },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: MatDialog, useValue: mockDialog },
                { provide: AgreementService, useValue: mockAgreementService },
                { provide: BillingOrdersService, useValue: mockBillingOrdersService },
                { provide: AuthService, useValue: mockAuthService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        mockAuthService.getMenu.and.returnValue(agreementMenu);
        mockUserParameterService.getUserData.and.returnValue(of(reponseUserSYNC));
        mockAgreementService.getAgreements.and.returnValue(of(dataServicesAgreement));
        fixture = TestBed.createComponent(AgreementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Método cargar acuerdos.', () => {
        component.chargeAgreements(null);
    });

    // it('open pdf', () => {
    //     component.getPDF2('docs.google.com/document/d/1HQx56fbvQMFuw34vgTQrnCuwEBf8SYNk17yjJogaLNI/edit');
    // });

    describe('Error servicio cargar acuerdos', () => {
        beforeEach(() => {
            mockUserParameterService.getUserData.and.returnValue(of(null));
            mockUserParameterService.getUserData.and.returnValue(of(reponseUserAdminSYNC));
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
        it('Método para traer la informacion .', () => {
            component.user = reponseUserAdminSYNC;
            component.getDataUser();
        });
    });
});

