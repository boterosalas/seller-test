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

export const registerRegex = {
  phoneNumber: '',
  contactName: '',
  email: '',
  nameStore: '',
  nit: '',
  rut: '',
  internationalNit: '',
  internationalRut: '',
  internationalPostalCode: '',
  payoneer: '',
  internationalState: '',
  internationalCity: '',
  daneCode: '',
  address: '',
};

fdescribe('RegisterSellerComponent', () => {
  // Mock Services
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
  const mockCitiesService = jasmine.createSpyObj('CitiesServices', ['fetchData']);
  const mockStatesSiervice = jasmine.createSpyObj('StatesService', ['fetchData']);
  const mockRegisterService = jasmine.createSpyObj('RegisterService', ['fetchData', 'typeProfile', 'registerUser']);
  const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getRegexInformationBasic']);

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
        {provide: RegisterService, useValue: mockRegisterService},
        {provide: LoadingService, useValue: mockLoadingService},
        {provide: ModalService, useValue: mockDialogError},
        {provide: UserLoginService, useValue: UserLoginService},
        {provide: UserParametersService, useValue: UserParametersService},
        {provide: AuthService, useValue: mockAuthService},
        {provide: CitiesServices, useValue: mockCitiesService},
        {provide: StatesService, useValue: mockStatesSiervice},
        {provide: BasicInformationService, useValue: mockBasicInformationService},
        EndpointService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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
      beforeEach(() => {
        mockBasicInformationService.getRegexInformationBasic.and.returnValue(JSON.stringify({body: { body: { Data: registerRegex}}}));
        component.ngOnInit();
      });

      it('sould be charge regex', () => {

      });
  });
});
