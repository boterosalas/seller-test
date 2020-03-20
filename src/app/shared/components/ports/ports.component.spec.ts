import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { detectChanges } from '@angular/core/src/render3';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService, ModalService, EndpointService } from '@app/core';

import { PortsComponent } from './ports.component';
import { PortsService } from './ports.service';
import { PortEntity } from '@app/shared/models';

describe('PortsComponent', () => {
    // Mock Services
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockPortsService = jasmine.createSpyObj('PortsService', ['getPortByCountryName']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);

    // Components and fixtures
    let component: PortsComponent;
    let fixture: ComponentFixture<PortsComponent>;
    let formGroupMock: FormGroup;

    const listPorts: Array<PortEntity> = [
        {
            Id: 1,
            Name: 'Port 1'
        },
        {
            Id: 2,
            Name: 'Port 2'
        },
        {
            Id: 3,
            Name: 'Port 3'
        }
    ];

    const portEmittedDataMock = {id: 3, name: 'Port 3'};
    const country = 'PANAMA';

    // Services
    let portsService: PortsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PortsComponent
            ],
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot({})
            ],
            providers: [
                { provide: PortsService, useValue: mockPortsService },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: ModalService, useValue: mockDialogError },
                { provide: AuthService, useValue: mockAuthService },
                EndpointService,
            ],
            // No_Errors_schema (Evita errores de importación de otros Componentes)
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        // Injección de servicios por medio de TestBed
        portsService = TestBed.get(PortsService);
        fixture = TestBed.createComponent(PortsComponent);
        component = fixture.componentInstance;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(portsService).toBeTruthy();
        expect(component).toBeTruthy();
    });

    describe('Loading ports data', () => {
        beforeEach(() => {

            formGroupMock = new FormGroup({
                portsFormControl: new FormControl({ value: 'prueba', disabled: true }, [Validators.required])
            });

        });
        it('Should validateFormRegister be created', () => {
            component.validateFormRegister = formGroupMock;
            expect(component.validateFormRegister.controls['portsFormControl'].value).toEqual('prueba');
        });

        it('Should getPortsDropdown be called', () => {
            const getPortsSpy = spyOn(component, 'getPortsDropdown');
            component.countryName = country;
            component.ngOnChanges();
            expect(getPortsSpy).toHaveBeenCalledWith(country);
        });

        it('Should getPortsDropdown return an array of ports', () => {
            fixture.whenStable().then(() => {
                component.getPortsDropdown(country);
                mockPortsService.getPortByCountryName.and.returnValue(of(listPorts));
                tick();
                if (!component.disabledComponent) {
                    expect(component.validateFormRegister.controls['portsFormControl'].enabled).toBeTruthy();
                }
                expect(component.listPorts.length).toBe(3);
            });
        });

        it('Should validateElementLoaded should return an array', () => {
            const portId = 1;
            const validateElementLoadedSpy = spyOn(component, 'validateElementLoaded');

            fixture.whenStable().then(() => {
                tick();
                expect(validateElementLoadedSpy).toHaveBeenCalledWith(portId);
                expect(component.validateFormRegister.controls['portsFormControl'].value).toBe(portId);
            });
        });

        it('Should emit a value when select value changes', () => {
            fixture.whenStable().then(() => {
                tick();
                const select: HTMLSelectElement = fixture.debugElement.query(By.css('#register-ports')).nativeElement;
                select.value = select.options[2].value;
                select.dispatchEvent(new Event('change'));
                fixture.detectChanges();
                expect(component.portItemEmmited.emit).toHaveBeenCalledWith(portEmittedDataMock);
            });
        });
    });
});
