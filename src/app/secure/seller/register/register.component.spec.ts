import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { detectChanges } from '@angular/core/src/render3';
import { PayoneerService } from './payoneer.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

export const registerRegex = [
  {Identifier: 'phoneNumber', Value: '^[0-9+\-\s]*$', Module: 'vendedores'},
  {Identifier: 'contactName', Value: '^[0-9A-Za-zá é í ó ú ü ñà è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$', Module: 'vendedores'},
  {Identifier: 'email', Value: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9]?(?:[a-zA-Z0-9-]{0,}[a-zA-Z0-9]+\.)+[a-z]{2,}$', Module: 'vendedores'},
  {Identifier: 'nameStore', Value: '^((?!\.com$)(?!\.co$)(?!\.net$)(?!\.gov$)(?!\.edu$)(?!\ss\.a\.s$)(?!\ss\.a$)(?!\ss\.a\.$)(?!\ss\.a\.$)(?!\ssa\.s$)(?!\ssas$)(?!\ssa$)(?!\sltda$)(?!\sltda\.$).)*$', Module: 'vendedores'},
  {Identifier: 'integerNumber', Value: '^[0-9]*$', Module: 'vendedores'},
  {Identifier: 'internationalIdentifier', Value: '^[0-9a-zA-Z-]*$', Module: 'vendedores'},
  {Identifier: 'internationalPostalCode', Value: '^[0-9a-zA-Z]*$', Module: 'vendedores'},
  {Identifier: 'payoneer', Value: '^[\w_\-\.\^@!\? \'\']+$', Module: 'vendedores'},
  {Identifier: 'internationalLocation', Value: '^([^\/])*$', Module: 'vendedores'}
];

describe('RegisterSellerComponent', () => {
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
  const mockPayoneerService = jasmine.createSpyObj('PayoneerService', ['getStatusById']);

  // Components and fixtures
  let component: RegisterSellerComponent;
  let fixture: ComponentFixture<RegisterSellerComponent>;
  let spyValidateNotColombia;

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
        { provide: PayoneerService, useValue: mockPayoneerService},
        EndpointService,
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
    fixture = TestBed.createComponent(RegisterSellerComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
  });

  it('should create', () => {
    expect(registerService).toBeTruthy();
    expect(stateService).toBeTruthy();
    expect(cityService).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('Admin login', () => {
    // BeforeEach asincrono debido a la ejecución del metodo de logeo
    beforeAll(async () => {
      // clona el modelo de respuesta de un usuario
      const mockUser = Object.assign({}, userData);
      // construccion del modelo de respuesta del regex del servicio
      const responseRegex = {
        body: {
          body: JSON.stringify({Data: registerRegex })
        }
      };
      // Define la respuesta del servicio de regex
      mockBasicInformationService.getRegexInformationBasic.and.returnValue(of(responseRegex));
      // Construcción del modelo de respuesta de la información de un usario
      const responseGetUser = {
        body: {
          body: JSON.stringify({ Data: mockUser })
        }
      };
      // Define la respuesta del metodo getMenu
      mockAuthService.getMenu.and.returnValue(registerMenu);
      // Define la respuesta de la información de un usuario
      mockUserParameterService.getUserData.and.returnValue(of(responseGetUser));
      mockUserLoginService.isAuthenticated.and.returnValue(true);
      // espera la respuesta del metodo isLoggedIn para continuar
      await component.isLoggedIn('', true);
    });

    it('sould be charge regex', () => {
      expect(!!component.sellerRegex.payoneer).toBeFalsy();
      expect(!!component.sellerRegex.internationalLocation).toBeFalsy();
      expect(!!component.sellerRegex.contactName).toBeFalsy();
      expect(!!component.sellerRegex.integerNumber).toBeFalsy();
      expect(!!component.sellerRegex.email).toBeFalsy();
      expect(!!component.sellerRegex.internationalLocation).toBeFalsy();
      expect(!!component.sellerRegex.internationalIdentifier).toBeFalsy();
      expect(!!component.sellerRegex.internationalPostalCode).toBeFalsy();
      expect(!!component.sellerRegex.internationalIdentifier).toBeFalsy();
      expect(!!component.sellerRegex.internationalLocation).toBeFalsy();
      expect(!!component.sellerRegex.nameStore).toBeFalsy();
      expect(!!component.sellerRegex.integerNumber).toBeFalsy();
      expect(!!component.sellerRegex.phoneNumber).toBeFalsy();
      expect(!!component.sellerRegex.integerNumber).toBeFalsy();
      component.getRegex();
      expect(!!component.sellerRegex.payoneer).toBeTruthy();
      expect(!!component.sellerRegex.internationalLocation).toBeTruthy();
      expect(!!component.sellerRegex.contactName).toBeTruthy();
      expect(!!component.sellerRegex.integerNumber).toBeTruthy();
      expect(!!component.sellerRegex.email).toBeTruthy();
      expect(!!component.sellerRegex.internationalLocation).toBeTruthy();
      expect(!!component.sellerRegex.internationalIdentifier).toBeTruthy();
      expect(!!component.sellerRegex.internationalPostalCode).toBeTruthy();
      expect(!!component.sellerRegex.internationalIdentifier).toBeTruthy();
      expect(!!component.sellerRegex.internationalLocation).toBeTruthy();
      expect(!!component.sellerRegex.nameStore).toBeTruthy();
      expect(!!component.sellerRegex.integerNumber).toBeTruthy();
      expect(!!component.sellerRegex.phoneNumber).toBeTruthy();
      expect(!!component.sellerRegex.integerNumber).toBeTruthy();
    });

    describe('is Colombian Select', () => {
      beforeEach(() => {
        component.ngOnInit();
        component.putColombiaByDefault();
        fixture.detectChanges();
        const response = {
          status: 200,
          body: {
            body: JSON.stringify({Data: 'Success'})
          }
        };
        mockRegisterService.registerUser.and.returnValue(of(response));
      });

      it('should be pass nit with number', () => {
        // consulta del HTML el elemento con el id register-nit
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        // Verifica que exista el elemento
        expect(nitField).toBeTruthy();
        // construlle el elemento de manera nativa
        const nitNativeElement = nitField.nativeElement;
        // se le asigna el valor al elemento nativo
        nitNativeElement.value = '1234567453';
        // Se ejecuta el evento input (para simular la escritura del valor previamente definido del input)
        nitNativeElement.dispatchEvent(new Event('input'));
        // se detectan lso cambios
        fixture.detectChanges();
        // se valida la existancia de errores dentro del formulario correspondiente al campo
        expect(component.Nit.errors).toBeNull();
      });

      it('Should be fail nit with characters', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        const nitNativeElement = nitField.nativeElement;
        nitNativeElement.value = '123kkcld4533';
        nitNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Nit.errors).toBeTruthy();
      });

      it('Should be pass Nit with length <= 20', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        const nitNativeElement = nitField.nativeElement;
        nitNativeElement.value = '12345674530987432345';
        nitNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Nit.errors).toBeNull();
      });

      it('Should be fail Nit with length > 20', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        const nitNativeElement = nitField.nativeElement;
        nitNativeElement.value = '123456745323459875431';
        nitNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Nit.errors).toBeTruthy();
      });

      it('should be pass nit required', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        const nitNativeElement = nitField.nativeElement;
        nitNativeElement.value = '1234567453';
        nitNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Nit.errors).toBeNull();
      });

      it('should be fail nit required', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        fixture.detectChanges();
        expect(component.Nit.errors).toBeTruthy();
      });

      it('Should be pass rut with numbers', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        const rutFieldElement = rutField.nativeElement;
        rutFieldElement.value = '123456789';
        rutFieldElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Rut.errors).toBeNull();
      });

      it('Should be fail rut with characters', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        const rutNativeelement = rutField.nativeElement;
        rutNativeelement.value = '13245lakjdfasdf';
        rutNativeelement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Rut.errors).toBeTruthy();
      });

      it('Should be pass Rut with length <= 20', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        const rutNativeElement = rutField.nativeElement;
        rutNativeElement.value = '12345674530987432345';
        rutNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Rut.errors).toBeNull();
      });

      it('Should be fail Rut with length > 20', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        const rutNativeElement = rutField.nativeElement;
        rutNativeElement.value = '123456745323459875431';
        rutNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Rut.errors).toBeTruthy();
      });

      it('should be pass Rut required', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        const rutNativeElement = rutField.nativeElement;
        rutNativeElement.value = '1234567453';
        rutNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Rut.errors).toBeNull();
      });

      it('should be fail Rut required', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        fixture.detectChanges();
        expect(component.Rut.errors).toBeTruthy();
      });
    });

    // it('Sohoul be submiter a National seller', () => {
    //   component.ngOnInit();
    //   component.Country.setValue('COLOMBIA');
    //   component.State.setValue('Antioquia');
    //   component.City.setValue('Sabaneta');
    //   component.PostalCode.setValue('05631000');
    //   component.PhoneNumber.setValue('3124567823');
    //   component.Nit.setValue('8473645323');
    //   component.Rut.setValue('8473645323');
    //   component.ContactName.setValue('cristian bustamante');
    //   component.Email.setValue('probando@test.com');
    //   component.Name.setValue('La tienda de cristian bustamante');
    //   component.Address.setValue('asdfvasd');
    //   component.Exito.setValue(true);
    //   component.LogisticExito.setValue(true);
    //   component.Profile.setValue('seller');
    //   component.Carulla.setValue(true);
    //   component.submitSellerRegistrationForm();
    //   expect(mockRegisterService.registerUser).toHaveBeenCalled();
    // });

    it('Should be submiter a admin', () => {

    });

    describe('is not Colombia Select', () => {
      beforeEach( () => {
        component.ngOnInit();
        // se genera un Spy para saber si el metodo validationsForNotColombiaSelectSellerForm es llamado
        spyValidateNotColombia = spyOn(component, 'validationsForNotColombiaSelectSellerForm');
        // se cambia el valor del formulario en el campo Country a uno diferente de colombia
        component.Country.setValue('CHINA');
        // se detectan los cambios
        fixture.detectChanges();
      });

      it('Should be call validationsForNotColombiaSelectSellerForm', () => {
        // se verifica el llamado del metodo validationsForNotColombiaSelectSellerForm
        expect(spyValidateNotColombia).toHaveBeenCalled();
      });

      it('Should be exist payoneer field', () => {
        component.validationsForNotColombiaSelectSellerForm();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          tick();
          expect(component.Payoneer).toBeTruthy();
          expect(component.Payoneer.enabled).toBeTruthy();
        });
      });

      it('should be pass nit with number', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        const nitNativeElement = nitField.nativeElement;
        nitNativeElement.value = '1234567453';
        nitNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Nit.errors).toBeNull();
      });

      it('Should be pass nit with characters', () => {
        // promesa que se ejecuta una vez se termina la detección de los cambios
        fixture.whenStable().then(() => {
          // metodo que da una corta espera (setTimeout)
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const nitField = fixture.debugElement.query(By.css('#register-nit'));
          expect(nitField).toBeTruthy();
          const nitNativeElement = nitField.nativeElement;
          nitNativeElement.value = '123kkcld4533';
          nitNativeElement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.Nit.errors).toBeNull();
        });
      });

      it('Should be pass Nit with length <= 30', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const nitField = fixture.debugElement.query(By.css('#register-nit'));
          expect(nitField).toBeTruthy();
          const nitNativeElement = nitField.nativeElement;
          nitNativeElement.value = '123456745309874323459834234321';
          nitNativeElement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.Nit.errors).toBeNull();
        });
      });

      it('Should be fail Nit with length > 30', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        const nitNativeElement = nitField.nativeElement;
        nitNativeElement.value = '1234567453234598754319098437645';
        nitNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Nit.errors).toBeTruthy();
      });

      it('should be pass nit required', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        const nitNativeElement = nitField.nativeElement;
        nitNativeElement.value = '1234567453';
        nitNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Nit.errors).toBeNull();
      });

      it('should be fail nit required', () => {
        const nitField = fixture.debugElement.query(By.css('#register-nit'));
        expect(nitField).toBeTruthy();
        fixture.detectChanges();
        expect(component.Nit.errors).toBeTruthy();
      });

      it('Should be pass rut with numbers', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        const rutFieldElement = rutField.nativeElement;
        rutFieldElement.value = '123456789';
        rutFieldElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Rut.errors).toBeNull();
      });

      it('Should be pass rut with characters', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const rutField = fixture.debugElement.query(By.css('#register-rut'));
          expect(rutField).toBeTruthy();
          const rutNativeelement = rutField.nativeElement;
          rutNativeelement.value = '13245lakjdfasdf';
          rutNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.Rut.errors).toBeNull();
        });
      });

      it('Should be pass Rut with length <= 30', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const rutField = fixture.debugElement.query(By.css('#register-rut'));
          expect(rutField).toBeTruthy();
          const rutNativeElement = rutField.nativeElement;
          rutNativeElement.value = '123456745309874323453123412324';
          rutNativeElement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.Rut.errors).toBeNull();
        });
      });

      it('Should be fail Rut with length > 30', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        const rutNativeElement = rutField.nativeElement;
        rutNativeElement.value = '1234567453234598754313430939222';
        rutNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Rut.errors).toBeTruthy();
      });

      it('should be pass Rut required', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        const rutNativeElement = rutField.nativeElement;
        rutNativeElement.value = '1234567453';
        rutNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.Rut.errors).toBeNull();
      });

      it('should be fail Rut required', () => {
        const rutField = fixture.debugElement.query(By.css('#register-rut'));
        expect(rutField).toBeTruthy();
        fixture.detectChanges();
        expect(component.Rut.errors).toBeTruthy();
      });

      it('Should be pass PostalCode with numbers', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const postalCodeField = fixture.debugElement.query(By.css('#register-postal-code'));
          expect(postalCodeField).toBeTruthy();
          const postalCodeNativeElement = postalCodeField.nativeElement;
          postalCodeNativeElement.value = '87654637';
          postalCodeNativeElement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.PostalCode.errors).toBeNull();
        });
      });

      it('Should be pass PostalCode with lowercase characters', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const postalCodeField = fixture.debugElement.query(By.css('#register-postal-code'));
          expect(postalCodeField).toBeTruthy();
          const postalCodeNativeElement = postalCodeField.nativeElement;
          postalCodeNativeElement.value = 'plofjske';
          postalCodeNativeElement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.PostalCode.errors).toBeNull();
        });
      });

      it('Should be pass PostalCode with uppercase characters', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const postalCodeField = fixture.debugElement.query(By.css('#register-postal-code'));
          expect(postalCodeField).toBeTruthy();
          const postalCodeNativeElement = postalCodeField.nativeElement;
          postalCodeNativeElement.value = 'POLIKSJD';
          postalCodeNativeElement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.PostalCode.errors).toBeNull();
        });
      });

      it('Should be fail PostalCode with less than 4 characters', () => {
        fixture.whenStable().then(() => {
          tick();
          const postalCodeField = fixture.debugElement.query(By.css('#register-postal-code'));
          expect(postalCodeField).toBeTruthy();
          const postalCodeNativeElement = postalCodeField.nativeElement;
          postalCodeNativeElement.value = 'sj6';
          postalCodeNativeElement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.PostalCode.errors).toBeTruthy();
        });
      });

      it('Should be fail PostalCode with more than 8 characters', () => {
        fixture.whenStable().then(() => {
          tick();
          const postalCodeField = fixture.debugElement.query(By.css('#register-postal-code'));
          expect(postalCodeField).toBeTruthy();
          const postalCodeNativeElement = postalCodeField.nativeElement;
          postalCodeNativeElement.value = '98543564r';
          postalCodeNativeElement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.PostalCode.errors).toBeTruthy();
        });
      });

      it('Should be fail PostalCode required', () => {
        const postalCodeField = fixture.debugElement.query(By.css('#register-postal-code'));
        expect(postalCodeField).toBeTruthy();
        fixture.detectChanges();
        expect(component.PostalCode.errors).toBeTruthy();
      });

      it('Should be pass PostalCode required', () => {
        const postalCodeField = fixture.debugElement.query(By.css('#register-postal-code'));
        expect(postalCodeField).toBeTruthy();
        const postalCodeNativeElement = postalCodeField.nativeElement;
        postalCodeNativeElement.value = '98543564';
        postalCodeNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.PostalCode.errors).toBeNull();
      });

      it('Should be pass Satate with length <= 60', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const stateField = fixture.debugElement.query(By.css('#register-state'));
          expect(stateField).toBeTruthy();
          const stateNativeelement = stateField.nativeElement;
          stateNativeelement.value = 'Departamento de una ciudad muy larga342 54234 *vasdf_ asdlka';
          stateNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.State.errors).toBeNull();
        });
      });

      it('Should be fail State with lenfth > 60', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const stateField = fixture.debugElement.query(By.css('#register-state'));
          expect(stateField).toBeTruthy();
          const stateNativeelement = stateField.nativeElement;
          stateNativeelement.value = 'Departamento de una ciudad muy larga342 54234 *vasdf_ asdlkasd';
          stateNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.State.errors).toBeTruthy();
        });
      });

      it('Should be fail State with /', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const stateField = fixture.debugElement.query(By.css('#register-state'));
          expect(stateField).toBeTruthy();
          const stateNativeelement = stateField.nativeElement;
          stateNativeelement.value = 'Departamento de una ciudad /';
          stateNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.State.errors).toBeTruthy();
        });
      });

      it('Should be fail State with \\', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const stateField = fixture.debugElement.query(By.css('#register-state'));
          expect(stateField).toBeTruthy();
          const stateNativeelement = stateField.nativeElement;
          stateNativeelement.value = 'Departamento de una ciudad \\';
          stateNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.State.errors).toBeTruthy();
        });
      });

      it('Should be pass City with length <= 60', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const cityField = fixture.debugElement.query(By.css('#register-city'));
          expect(cityField).toBeTruthy();
          const cityNativeelement = cityField.nativeElement;
          cityNativeelement.value = 'Departamento de una ciudad muy larga342 54234 *vasdf_ asdlka';
          cityNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.City.errors).toBeNull();
        });
      });

      it('Should be fail City with lenfth > 60', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const cityField = fixture.debugElement.query(By.css('#register-city'));
          expect(cityField).toBeTruthy();
          const cityNativeelement = cityField.nativeElement;
          cityNativeelement.value = 'Departamento de una ciudad muy larga342 54234 *vasdf_ asdlkasd';
          cityNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.City.errors).toBeTruthy();
        });
      });

      it('Should be fail City with /', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const cityField = fixture.debugElement.query(By.css('#register-city'));
          expect(cityField).toBeTruthy();
          const cityNativeelement = cityField.nativeElement;
          cityNativeelement.value = 'Departamento de una ciudad /';
          cityNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.City.errors).toBeTruthy();
        });
      });

      it('Should be fail City with \\', () => {
        fixture.whenStable().then(() => {
          tick();
          expect(component.isColombiaSelect).toBeFalsy();
          const cityField = fixture.debugElement.query(By.css('#register-city'));
          expect(cityField).toBeTruthy();
          const cityNativeelement = cityField.nativeElement;
          cityNativeelement.value = 'Departamento de una ciudad \\';
          cityNativeelement.dispatchEvent(new Event('input'));
          fixture.detectChanges();
          expect(component.City.errors).toBeTruthy();
        });
      });

      it('Should be submiter a International Seller', () => {

      });
    });
  });
});
