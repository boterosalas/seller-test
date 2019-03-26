import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSellerComponent } from './register.component';
import { MaterialModule } from '@app/material.module';
import { RegisterService } from './register.service';
import { LoadingService, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatesComponent } from '@app/shared/components/states';
import { CitiesComponent } from '@app/shared/components/cities';
import { StatesService } from '@app/shared/components/states/states.service';
import { CitiesServices } from '@app/shared/components/cities/cities.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';



fdescribe('RegisterSellerComponent', () => {
  // Mock Services
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
  const mockCitiesService = jasmine.createSpyObj('CitiesServices', ['fetchData']);
  const mockStatesSiervice = jasmine.createSpyObj('StatesService', ['fetchData']);
  const mockRegisterService = jasmine.createSpyObj('RegisterService', ['fetchData', 'registerUser', 'typeProfile']);

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
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
    registerService = TestBed.get(RegisterService);
    cityService = TestBed.get(CitiesServices);
    stateService = TestBed.get(StatesService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(registerService).toBeTruthy();
    expect(stateService).toBeTruthy();
    expect(cityService).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
