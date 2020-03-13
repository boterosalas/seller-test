import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { LoadingService, ModalService, UserLoginService, UserParametersService, EndpointService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatesService } from '@app/shared/components/states/states.service';
import { CitiesServices } from '@app/shared/components/cities/cities.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { detectChanges } from '@angular/core/src/render3';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { ManageSellerComponent } from "./manage-seller.component";
import { RegisterService } from '../../register/register.service';
import { PayoneerService } from '../../register/payoneer.service';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { ManageSellerService } from '../manage.service';

export const registerRegex = [
    { Identifier: 'phoneNumber', Value: '^[0-9+\-\s]*$', Module: 'vendedores' },
    { Identifier: 'contactName', Value: '^[0-9A-Za-zá é í ó ú ü ñà è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$', Module: 'vendedores' },
    { Identifier: 'email', Value: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9]?(?:[a-zA-Z0-9-]{0,}[a-zA-Z0-9]+\.)+[a-z]{2,}$', Module: 'vendedores' },
    { Identifier: 'nameStore', Value: '^((?!\.com$)(?!\.co$)(?!\.net$)(?!\.gov$)(?!\.edu$)(?!\ss\.a\.s$)(?!\ss\.a$)(?!\ss\.a\.$)(?!\ss\.a\.$)(?!\ssa\.s$)(?!\ssas$)(?!\ssa$)(?!\sltda$)(?!\sltda\.$).)*$', Module: 'vendedores' },
    { Identifier: 'integerNumber', Value: '^[0-9]*$', Module: 'vendedores' },
    { Identifier: 'internationalIdentifier', Value: '^[0-9a-zA-Z-]*$', Module: 'vendedores' },
    { Identifier: 'internationalPostalCode', Value: '^[0-9a-zA-Z]*$', Module: 'vendedores' },
    { Identifier: 'payoneer', Value: '^[\w_\-\.\^@!\? \'\']+$', Module: 'vendedores' },
    { Identifier: 'internationalLocation', Value: '^([^\/])*$', Module: 'vendedores' }
];

describe('ManageSellerComponent', () => {
    const userData = { sellerProfile: 'administrator' };
    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
    };
    // Mock Services
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockCitiesService = jasmine.createSpyObj('CitiesServices', ['fetchData']);
    const mockStatesSiervice = jasmine.createSpyObj('StatesService', ['fetchData']);
    const mockRegisterService = jasmine.createSpyObj('RegisterService', ['fetchData', 'typeProfile', 'registerUser']);
    const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getRegexInformationBasic']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockPayoneerService = jasmine.createSpyObj('PayoneerService', ['getStatusById']);

    // Components and fixtures
    let component: ManageSellerComponent;
    let fixture: ComponentFixture<ManageSellerComponent>;
    let spyValidateNotColombia;

    // Services
    let cityService: CitiesServices;
    let stateService: StatesService;
    let registerService: RegisterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ManageSellerComponent,
            ],
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                SharedModule,
                TranslateModule.forRoot({})
            ],
            providers: [
                { provide: RegisterService, useValue: mockRegisterService },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: ModalService, useValue: mockDialogError },
                { provide: UserLoginService, useValue: mockUserLoginService },
                { provide: UserParametersService, useValue: UserParametersService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: CitiesServices, useValue: mockCitiesService },
                { provide: StatesService, useValue: mockStatesSiervice },
                { provide: BasicInformationService, useValue: mockBasicInformationService },
                { provide: PayoneerService, useValue: mockPayoneerService },
                EndpointService,
                StoresService,
                ManageSellerService
            ],
            // No_Errors_schema (Evita errores de importación de otros Componentes)
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        // Injección de servicios por medio de TestBed
        registerService = TestBed.get(RegisterService);
        cityService = TestBed.get(CitiesServices);
        stateService = TestBed.get(StatesService);
        fixture = TestBed.createComponent(ManageSellerComponent);
        component = fixture.componentInstance;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });

    it('should create', () => {
        expect(registerService).toBeTruthy();
        expect(stateService).toBeTruthy();
        expect(cityService).toBeTruthy();
        expect(component).toBeTruthy();
    });

    describe('is not Colombia Select', () => {

        it('Should be fail Port with /', () => {
            fixture.whenStable().then(() => {
                tick();
                expect(component.isColombiaSelect).toBeFalsy();
                const portsField = fixture.debugElement.query(By.css('#register-ports'));
                expect(portsField).toBeTruthy();
                const portNativeElement = portsField.nativeElement;
                portNativeElement.value = 'Port /';
                portNativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(component.IdDispatchPort.errors).toBeTruthy();
            })
        })

        it('Should be fail IdDispatchPort with \\', () => {
            fixture.whenStable().then(() => {
                tick();
                expect(component.isColombiaSelect).toBeFalsy();
                const portsField = fixture.debugElement.query(By.css('#register-ports'));
                expect(portsField).toBeTruthy();
                const portNativeElement = portsField.nativeElement;
                portNativeElement.value = 'IdDispatchPort \\';
                portNativeElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                expect(component.IdDispatchPort.errors).toBeTruthy();
            })
        })

        it('Should call receivePortItem when port select value change', () => {
            fixture.whenStable().then(() => {
                tick();
                expect(component.isColombiaSelect).toBeFalsy();
                const select: HTMLSelectElement = fixture.debugElement.query(By.css('#register-cities')).nativeElement;
                select.value = select.options[3].value;  // <-- select a new value
                select.dispatchEvent(new Event('change'));
                fixture.detectChanges();
                expect(component.receivePortItem(select.value)).toHaveBeenCalled();
            })
        })
    });
});
