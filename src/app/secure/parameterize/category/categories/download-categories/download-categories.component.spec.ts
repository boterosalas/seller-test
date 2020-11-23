import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService, UserParametersService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { ParamSpecsService } from '@app/secure/parameterize/specifications/specifications.component.service';
import { ComponentsService } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DownloadCategoriesComponent } from './download-categories.component';

describe('DownloadCategoriesComponent', () => {
    let component: DownloadCategoriesComponent;
    let fixture: ComponentFixture<DownloadCategoriesComponent>;

    const data = {
        sellerId: '11618',
        sellerProfile: 'seller',
        sellerNit: '123',
        sellerName: 'la tienda de cristian 2019 vs 512',
        sellerEmail: 'ccbustamante221@misena.edu.co',
    };

    const dataToSendDownloadCategoriesOk = {
        body: {
            Data: true
        }
    };
    const dataToSendDownloadCategoriesKo = {
        body: {
            Data: false
        }
    };

    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);
    const mockParamCategoriesService = jasmine.createSpyObj('ParamSpecsService', ['downloadCategories']);
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
            declarations: [DownloadCategoriesComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                FormBuilder,
                ComponentsService,
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: UserParametersService, useValue: mockUserParameterService },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                { provide: FormBuilder, useValue: formBuilder },
                { provide: ParamSpecsService, useValue: mockParamCategoriesService }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DownloadCategoriesComponent);
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

    // describe('Funcion obtener descarga de las categorías()', () => {
    //     beforeEach(() => {
    //         const myform = formBuilder.group({
    //             email: { value: '' },
    //         });
    //         component.myform = myform;
    //         const dataString = JSON.stringify(dataToSendDownloadCategoriesOk);
    //         const dataParse = JSON.parse(dataString);
    //         mockParamCategoriesService.downloadCategories.and.returnValue(of(dataParse.body.Data));
    //     });
    //     it('DOwnload list categoires cancels()', () => {
    //         component.sendExportDownloadCategories();
    //     });
    // });
    // describe('Funcion obtener descarga de las categorías => data res serv = false', () => {
    //     beforeEach(() => {
    //         const myform = formBuilder.group({
    //             email: { value: '' },
    //         });
    //         component.myform = myform;
    //         const dataString = JSON.stringify(dataToSendDownloadCategoriesKo);
    //         const dataParse = JSON.parse(dataString);
    //         mockParamCategoriesService.downloadCategories.and.returnValue(of(dataParse.body.Data));
    //     });
    //     it('DOwnload list cancels()', () => {
    //         component.sendExportDownloadCategories();
    //     });
    // });

    // describe('Funcion obtenerdescarga de las categorías res service false', () => {
    //     beforeEach(() => {
    //         const myform = formBuilder.group({
    //             email: { value: '' },
    //         });
    //         component.myform = myform;
    //         const dataFalse = false;
    //         mockParamCategoriesService.downloadCategories.and.returnValue(of(null));
    //     });
    //     it('DOwnload list cancels()', () => {
    //         component.sendExportDownloadCategories();
    //     });
    // });

});
