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

fdescribe('PortsComponent', () => {
    // Mock Services
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockPortsService = jasmine.createSpyObj('PortsService', ['fetchData']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);

    // Components and fixtures
    let component: PortsComponent;
    let fixture: ComponentFixture<PortsComponent>;
    let formGroupMock: FormGroup;

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
                // SharedModule,
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
        })
    })
});
