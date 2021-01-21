import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService, UserParametersService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ParamSpecsService } from '../specifications.component.service';

import { DownloadSpecsComponent } from './download-specs.component';

describe('DownloadSpecsComponent', () => {
    let component: DownloadSpecsComponent;
    let fixture: ComponentFixture<DownloadSpecsComponent>;

    const data = {
        sellerId: '11618',
        sellerProfile: 'seller',
        sellerNit: '123',
        sellerName: 'la tienda de cristian 2019 vs 512',
        sellerEmail: 'ccbustamante221@misena.edu.co',
    };

    const dataToSendDownloadSpecsOk = {
        data: true
    };
    const dataToSendDownloadSpecsKo = {
        data: false
    };

    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);
    const mockParamSpecsService = jasmine.createSpyObj('ParamSpecsService', ['getDownloadSpecs']);
    const formBuilder: FormBuilder = new FormBuilder();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot({}),
            ],
            declarations: [DownloadSpecsComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                FormBuilder,
                ComponentsService,
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: UserParametersService, useValue: mockUserParameterService },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: FormBuilder, useValue: formBuilder },
                { provide: ParamSpecsService, useValue: mockParamSpecsService }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DownloadSpecsComponent);
        component = fixture.componentInstance;
        mockUserParameterService.getUserData.and.returnValue(of(data));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('dialog should be closed after onNoClick()', () => {
        component.onNoClick();
        expect(component).toBeTruthy();
    });
    it('dialog should be closed after onNoClickOk()', () => {
        component.onNoClickOk();
        expect(component).toBeTruthy();
    });

    describe('Funcion obtener descarga de las especificaciones()', () => {
        beforeEach(() => {
            const myform = formBuilder.group({
                email: { value: '' },
            });
            component.myform = myform;
            mockParamSpecsService.getDownloadSpecs.and.returnValue(of(dataToSendDownloadSpecsOk));
        });
        it('DOwnload list cancels()', () => {
            component.sendExportDownload();
        });
    });
    describe('Funcion obtener descarga de las especificaciones => data res serv = false', () => {
        beforeEach(() => {
            const myform = formBuilder.group({
                email: { value: '' },
            });
            component.myform = myform;
            mockParamSpecsService.getDownloadSpecs.and.returnValue(of(dataToSendDownloadSpecsKo));
        });
        it('DOwnload list cancels()', () => {
            component.sendExportDownload();
        });
    });

    describe('Funcion obtenerdescarga de las especificaciones res service false', () => {
        beforeEach(() => {
            const myform = formBuilder.group({
                email: { value: '' },
            });
            component.myform = myform;
            const dataFalse = false;
            mockParamSpecsService.getDownloadSpecs.and.returnValue(of(null));
        });
        it('DOwnload list cancels()', () => {
            component.sendExportDownload();
        });
    });
});
