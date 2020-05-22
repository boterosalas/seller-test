// /* 3rd party components */
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BulkLoadComponent } from './bulk-load.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BulkLoadService } from '../bulk-load.service';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@app/secure/auth/auth.routing';
import { of, throwError } from 'rxjs';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentsService, RoutesConst } from '@app/shared';
import { SharedModule } from '@app/shared/shared.module';



export const responseRegexbody = [
    { Identifier: 'formatNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'ofertas' },
    { Identifier: 'promiseDelivery', Value: '(\\d+\\sa\\s\\d+)$', Module: 'ofertas' },
    { Identifier: 'isUpdatedStock', Value: '^([0]|[1])$', Module: 'ofertas' },
];

const arrayInformation = [
    {
        EAN: '102256325556',
        Stock: '',
        Price: '',
        DiscountPrice: '',
        AverageFreightCost: '',
        PromiseDelivery: '',
        IsFreeShipping: '',
        IsEnviosExito: ' ',
        IsFreightCalculator: '',
        Warranty: '',
        IsLogisticsExito: '',
        IsUpdatedStock: '',
        errorRow: false
    }
];
const responseStatus = {
    status: 200,
    body: {
        statusCode: 200,
        body: JSON.stringify({
            Data: {
                Status: 1,
                Data: [
                    { EAN: '1987081822179', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '6581480417371', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: null, message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no registrado en la base de datos' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                    { EAN: '571825208827', NAME: 'PRUEBA3', message: 'Producto 1987081822179 no indexado, por favor intentar más tarde.' },
                ]
            }
        })
    }
};

const statusResponse = {
    body: {
        data: {
            checked: 'false',
            idSeller: 11216,
            response: '',
            status: 0
        }
    },
    headers: '',
    ok: true,
    status: 200,
    statusText: 'OK',
    type: 4,
    url: ''
};

describe('BulkLoadComponent', () => {
    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
    };



    // Mock Services
    const mockBulkLoadService = jasmine.createSpyObj('BulkLoadService', ['verifyStatusBulkLoad']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner', 'viewProgressBar', 'closeProgressBar']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport', 'sendSupportMessage']);
    const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openConfirmAlert', 'openSnackBar']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);

    const data = {
        title: '',
        message: '',
        icon: '',
        form: null
    };
    const formBuilder: FormBuilder = new FormBuilder();

    // Create Variables for services and component
    let fixture: ComponentFixture<BulkLoadComponent>;
    let bulkLoadComponent: BulkLoadComponent;
    let bulkLoadService: BulkLoadService;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;
    let supportService: SupportService;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientModule,
                SharedModule
            ],
            declarations: [
                BulkLoadComponent
            ],
            providers: [
                { provide: BulkLoadService, useValue: mockBulkLoadService },
                { provide: ComponentsService, useValue: mockComponentsService },
                { provide: UserLoginService, useValue: mockUserLoginService },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: ModalService, useValue: mockDialogError },
                { provide: SupportService, useValue: mockSupportService },
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: mockDialogRef },
                UserParametersService,
                CognitoUtil,
                EndpointService,
                // { provide: UserParametersService, useValue: mockUserParameterService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DialogWithFormComponent]
            }
        });
    }));

    beforeEach(() => {
        mockAuthService.getMenu.and.returnValue(registerMenu);
        fixture = TestBed.createComponent(BulkLoadComponent);
        bulkLoadComponent = fixture.componentInstance;
        bulkLoadService = TestBed.get(BulkLoadService);
        supportService = TestBed.get(SupportService);
        dialogFixture = TestBed.createComponent(DialogWithFormComponent);
        mockBulkLoadService.verifyStatusBulkLoad.and.returnValue(of(statusResponse));
        const responseRegex = {
            body: {
                body: JSON.stringify({ Data: responseRegexbody })
            }
        };
        mockSupportService.getRegexFormSupport.and.returnValue(of(responseRegex));
        dialogComponent = dialogFixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(bulkLoadService).toBeTruthy();
        expect(bulkLoadComponent).toBeTruthy();
    });

    describe('', () => {
        beforeEach(() => {
        });

        it('Reset variable', () => {
            fixture.detectChanges();
            bulkLoadComponent.resetVariableUploadFile();
            fixture.detectChanges();
            expect(bulkLoadComponent.numberElements ).toEqual(0);
        });
        it('Reset uploadFile', () => {
            fixture.detectChanges();
            bulkLoadComponent.resetUploadFIle();
            fixture.detectChanges();
            expect(bulkLoadComponent.inputFileUpload.nativeElement.value).toEqual('');
        });
        it('validate subtitle En', () => {
            fixture.detectChanges();
            const array = [['EAN', 'Inventario', 'Precio', 'Precio con Descuento', 'Costo de Flete Promedio', 'Promesa de Entrega', 'Free Shipping', 'Indicador Envios Exito', 'Cotizador de Flete', 'Logistica Exito', 'Garantia', 'Actualizacion de Inventario']];
            const titleEn = 'Price';
            const titleEs = 'Precio';
            const titleFr = 'Precio';
            bulkLoadComponent.validateSubTitle(array, titleEn, titleEs, titleFr);
            fixture.detectChanges();
        });
        it('validate subtitle Es', () => {
            fixture.detectChanges();
            const array = [['EAN', 'Inventario', 'Price', 'Precio con Descuento', 'Costo de Flete Promedio', 'Promesa de Entrega', 'Free Shipping', 'Indicador Envios Exito', 'Cotizador de Flete', 'Logistica Exito', 'Garantia', 'Actualizacion de Inventario']];
            const titleEn = 'Price';
            const titleEs = 'Precio';
            const titleFr = 'Precio';
            bulkLoadComponent.validateSubTitle(array, titleEn, titleEs, titleFr);
            fixture.detectChanges();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('validate input', () => {
        beforeEach(() => {
        });
        it('valida exist ean price number', () => {
            fixture.detectChanges();
            const ean = '6581480417371';
            const price = 10000;
            const iVal = '';
            const cantidadCombo = 200;
            bulkLoadComponent.EanArray = [{ iVal: '', ean: '6581480417371', totalPrice: 300000 }];
            bulkLoadComponent.validExistEan(ean, price, iVal, cantidadCombo);
            fixture.detectChanges();
            expect(bulkLoadComponent.EanArray ).not.toBeNull();
        });
        it('valida exist ean price text', () => {
            fixture.detectChanges();
            const ean = 'testt_price';
            const price = undefined;
            const iVal = '';
            const cantidadCombo = 200;
            bulkLoadComponent.EanArray = [{ iVal: '', ean: '6581480417371', totalPrice: 300000 }];
            bulkLoadComponent.validExistEan(ean, price, iVal, cantidadCombo);
            fixture.detectChanges();
            expect(bulkLoadComponent.EanArray ).not.toBeNull();
        });
        it('validate exist ean text', () => {
            fixture.detectChanges();
            const ean = 'testt_price';
            const price = undefined;
            const iVal = '';
            const cantidadCombo = 200;
            bulkLoadComponent.EanArray = [{ iVal: '', ean: '6581480417371', totalPrice: 'test_price' }];
            bulkLoadComponent.validExistEan(ean, price, iVal, cantidadCombo);
            fixture.detectChanges();
            expect(bulkLoadComponent.EanArray ).not.toBeNull();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('set errors columns', () => {
        beforeEach(() => {
        });
        it('errors columns', () => {
            fixture.detectChanges();
            bulkLoadComponent.arrayInformation = [{
                EAN: 6581480417371,
                Stock: 10,
                Price: 300000,
                DiscountPrice: 250000,
                AverageFreightCost: 8000,
                PromiseDelivery: '1 a 2',
                IsFreeShipping: 0,
                IsEnviosExito: 0,
                IsFreightCalculator: 0,
                Warranty: 2,
                IsLogisticsExito: 0,
                IsUpdatedStock: 0,
                errorRow: true,
                Currency: true,
                errorEan: true,
                errorStock: true,
                errorPrice: true,
                errorDiscountPrice: true,
                errorAverageFreightCost: true,
                errorPromiseDelivery: true,
                errorIsFreeShipping: true,
                errorIsEnviosExito: true,
                errorIsFreightCalculator: true,
                errorWarranty: true,
                errorIsLogisticsExito: true,
                errorIsUpdatedStock: true,
                ComboQuantity: '',
                EanCombo: '',
                errorEanCombo: true,
                errorComboQuantity: true,
                errorCurrency: true,
                Periodicity: 1,
                Address: '',
                DaneCode: 12
            }];
            bulkLoadComponent.setErrrorColumns();
            fixture.detectChanges();
            expect(bulkLoadComponent.arrayInformation).not.toBeNull();
        });
        it('set error columns', () => {
            fixture.detectChanges();
            bulkLoadComponent.arrayInformation = [{
                EAN: 6581480417371,
                Stock: 10,
                Price: 300000,
                DiscountPrice: 250000,
                AverageFreightCost: 8000,
                PromiseDelivery: '1 a 2',
                IsFreeShipping: 0,
                IsEnviosExito: 0,
                IsFreightCalculator: 0,
                Warranty: 2,
                IsLogisticsExito: 0,
                IsUpdatedStock: 0,
                errorRow: true,
                Currency: true,
                errorEan: true,
                errorStock: true,
                errorPrice: true,
                errorDiscountPrice: true,
                errorAverageFreightCost: true,
                errorPromiseDelivery: true,
                errorIsFreeShipping: true,
                errorIsEnviosExito: true,
                errorIsFreightCalculator: true,
                errorWarranty: true,
                errorIsLogisticsExito: true,
                errorIsUpdatedStock: true,
                ComboQuantity: '',
                EanCombo: '',
                errorEanCombo: true,
                errorComboQuantity: true,
                errorCurrency: true,
                Periodicity: 1,
                Address: '',
                DaneCode: 12
            }];
            fixture.detectChanges();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('download massive', () => {
        beforeEach(() => {
        });
        it('international', () => {
            fixture.detectChanges();
            bulkLoadComponent.downloadFormatMassiveOfferLoadInternational('us');
            fixture.detectChanges();
        });
        it('national', () => {
            fixture.detectChanges();
            bulkLoadComponent.downloadFormatMassiveOfferLoad('es');
            fixture.detectChanges();
        });
        it('calculate interval time size file(5) > 0 ', () => {
            bulkLoadComponent.arrayInformationForSend.length = 5;
            fixture.detectChanges();
            bulkLoadComponent.calculateIntervalTime();
            fixture.detectChanges();
            expect(bulkLoadComponent.arrayInformationForSend).not.toBeNull();
        });
        it(' calculate interval time size file(101) > 0', () => {
            bulkLoadComponent.arrayInformationForSend.length = 101;
            fixture.detectChanges();
            bulkLoadComponent.calculateIntervalTime();
            fixture.detectChanges();
            expect(bulkLoadComponent.arrayInformationForSend).not.toBeNull();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
});
