import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterSellerComponent } from './register.component';
import { MaterialModule } from '@app/material.module';
import { RegisterService } from './register.service';
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

export const registerRegex = [
  {Identifier: 'phoneNumber', Value: '^[0-9+\-\s]*$', Module: 'vendedores'},
  {Identifier: 'contactName', Value: '^[0-9A-Za-zá é í ó ú ü ñà è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$', Module: 'vendedores'},
  {Identifier: 'email', Value: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9]?(?:[a-zA-Z0-9-]{0,}[a-zA-Z0-9]+\.)+[a-z]{2,}$', Module: 'vendedores'},
  {Identifier: 'nameStore', Value: '^((?!\.com$)(?!\.co$)(?!\.net$)(?!\.gov$)(?!\.edu$)(?!\ss\.a\.s$)(?!\ss\.a$)(?!\ss\.a\.$)(?!\ss\.a\.$)(?!\ssa\.s$)(?!\ssas$)(?!\ssa$)(?!\sltda$)(?!\sltda\.$).)*$', Module: 'vendedores'},
  {Identifier: 'nit', Value: '^[0-9]*$', Module: 'vendedores'},
  {Identifier: 'rut', Value: '^[0-9]*$', Module: 'vendedores'},
  {Identifier: 'internationalNit', Value: '^[0-9a-zA-Z-]*$', Module: 'vendedores'},
  {Identifier: 'internationalRut', Value: '^[0-9a-zA-Z-]*$', Module: 'vendedores'},
  {Identifier: 'internationalPostalCode', Value: '^[0-9a-zA-Z]*$', Module: 'vendedores'},
  {Identifier: 'payoneer', Value: '^[\w_\-\.\^@!\? \'\']+$', Module: 'vendedores'},
  {Identifier: 'internationalState', Value: '^([^\/])*$', Module: 'vendedores'},
  {Identifier: 'internationalCity', Value: '^([^\/])*$', Module: 'vendedores'},
  {Identifier: 'daneCode', Value: '^[0-9]*$', Module: 'vendedores'},
  {Identifier: 'address', Value: '^([^\/])*$', Module: 'vendedores'},
];

fdescribe('RegisterSellerComponent', () => {
  const userData = {sellerProfile: 'administrator'};
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

  // Components and fixtures
  let component: RegisterSellerComponent;
  let fixture: ComponentFixture<RegisterSellerComponent>;

  // Services
  let cityService: CitiesServices;
  let stateService: StatesService;
  let registerService: RegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterSellerComponent,
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
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
        EndpointService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    registerService = TestBed.get(RegisterService);
    cityService = TestBed.get(CitiesServices);
    stateService = TestBed.get(StatesService);
    fixture = TestBed.createComponent(RegisterSellerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(registerService).toBeTruthy();
    expect(stateService).toBeTruthy();
    expect(cityService).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('Admin login', () => {
    beforeEach(async () => {
      const mockUser = Object.assign({}, userData);
      const responseRegex = {
        body: {
          body: JSON.stringify({Data: registerRegex })
        }
      };
      mockBasicInformationService.getRegexInformationBasic.and.returnValue(of(responseRegex));
      const responseGetUser = {
        body: {
          body: JSON.stringify({ Data: mockUser })
        }
      };
      mockAuthService.getMenu.and.returnValue(registerMenu);
      mockUserParameterService.getUserData.and.returnValue(of(responseGetUser));
      mockUserLoginService.isAuthenticated.and.returnValue(true);
      await component.isLoggedIn('', true);
    });

    it('sould be charge regex', () => {
      expect(!!component.sellerRegex.payoneer).toBeFalsy();
      expect(!!component.sellerRegex.address).toBeFalsy();
      expect(!!component.sellerRegex.contactName).toBeFalsy();
      expect(!!component.sellerRegex.daneCode).toBeFalsy();
      expect(!!component.sellerRegex.email).toBeFalsy();
      expect(!!component.sellerRegex.internationalCity).toBeFalsy();
      expect(!!component.sellerRegex.internationalNit).toBeFalsy();
      expect(!!component.sellerRegex.internationalPostalCode).toBeFalsy();
      expect(!!component.sellerRegex.internationalRut).toBeFalsy();
      expect(!!component.sellerRegex.internationalState).toBeFalsy();
      expect(!!component.sellerRegex.nameStore).toBeFalsy();
      expect(!!component.sellerRegex.nit).toBeFalsy();
      expect(!!component.sellerRegex.phoneNumber).toBeFalsy();
      expect(!!component.sellerRegex.rut).toBeFalsy();
      component.getRegex();
      expect(!!component.sellerRegex.payoneer).toBeTruthy();
      expect(!!component.sellerRegex.address).toBeTruthy();
      expect(!!component.sellerRegex.contactName).toBeTruthy();
      expect(!!component.sellerRegex.daneCode).toBeTruthy();
      expect(!!component.sellerRegex.email).toBeTruthy();
      expect(!!component.sellerRegex.internationalCity).toBeTruthy();
      expect(!!component.sellerRegex.internationalNit).toBeTruthy();
      expect(!!component.sellerRegex.internationalPostalCode).toBeTruthy();
      expect(!!component.sellerRegex.internationalRut).toBeTruthy();
      expect(!!component.sellerRegex.internationalState).toBeTruthy();
      expect(!!component.sellerRegex.nameStore).toBeTruthy();
      expect(!!component.sellerRegex.nit).toBeTruthy();
      expect(!!component.sellerRegex.phoneNumber).toBeTruthy();
      expect(!!component.sellerRegex.rut).toBeTruthy();
    });

    describe('is Colombian Select', () => {
      beforeEach(() => {
        component.isColombiaSelect = true;
        fixture.detectChanges();
      });

      it('should be fail nit with number', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
      });
    });

    describe('is not Colombia Select', () => {
      beforeEach(() => {

      });
    });
  });
});
