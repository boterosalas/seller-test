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
        SellerSku: '',
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
            expect(bulkLoadComponent.numberElements).toEqual(0);
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
            expect(bulkLoadComponent.EanArray).not.toBeNull();
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
            expect(bulkLoadComponent.EanArray).not.toBeNull();
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
            expect(bulkLoadComponent.EanArray).not.toBeNull();
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
                SellerSku: 1,
                Reference: false,
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
                errorSellerSku: true,
                errorReference: true,
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
                SellerSku: 1,
                Reference: true,
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
                errorSellerSku: true,
                errorReference: true,
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
        it('international FR', () => {
            fixture.detectChanges();
            bulkLoadComponent.downloadFormatMassiveOfferLoad('fr');
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
    describe('validPrice', () => {
        beforeEach(() => {
            bulkLoadComponent.EanArray = [
                { iVal: '', ean: 6581480417371, totalPrice: 300000 },
                { iVal: '', ean: '6581480417372', totalPrice: 450000 }];
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
                SellerSku: 1,
                Reference: true,
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
                errorSellerSku: true,
                errorReference: true,
                ComboQuantity: '',
                EanCombo: '',
                errorEanCombo: true,
                errorComboQuantity: true,
                errorCurrency: true,
                Periodicity: 1,
                Address: '',
                DaneCode: 12
            }];
        });
        it('validPrice', () => {
            const currency = 'COP';
            fixture.detectChanges();
            bulkLoadComponent.validPrice(12000, currency);
            fixture.detectChanges();
        });
        it('validatePrices', () => {
            fixture.detectChanges();
            bulkLoadComponent.validatePrices();
            fixture.detectChanges();
        });
        it('setErrrorColumns', () => {
            fixture.detectChanges();
            bulkLoadComponent.setErrrorColumns();
            fixture.detectChanges();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('validFormat ', () => {
        beforeEach(() => {
        });
        it('validFormat', () => {
            const eanRegex = /^([A-Za-z0-9]{0,16})$/;
            fixture.detectChanges();
            bulkLoadComponent.validFormat('1 - 20', 'formatPromEntrega');
            bulkLoadComponent.validFormat('28095', 'alphanumeric');
            bulkLoadComponent.validFormat('COP', 'currency');
            bulkLoadComponent.validFormat('12094', 'greaterThanZero');
            bulkLoadComponent.validFormat('1', 'boolean');
            bulkLoadComponent.validFormat('96', 'greaterWarranty');
            bulkLoadComponent.validFormat('Avenida Siempre Viva 837', 'address');
            bulkLoadComponent.validFormat('05001000', 'daneCode');
            bulkLoadComponent.validFormat('1', 'formatPeriodicity');
            bulkLoadComponent.validFormat('1', 'atleastonealphanumeric');
            fixture.detectChanges();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('validFormat error', () => {
        beforeEach(() => {
        });
        it('validFormat error', () => {
            const eanRegex = /^([A-Za-z0-9]{0,16})$/;
            let valueReturn: Boolean = false;
            fixture.detectChanges();
            bulkLoadComponent.validFormat(undefined, 'formatPromEntrega');
            bulkLoadComponent.validFormat('/*-+', 'formatPromEntrega');
            bulkLoadComponent.validFormat('-123.5', 'formatNumber');
            bulkLoadComponent.validFormat('/*-+', 'alphanumeric');
            bulkLoadComponent.validFormat('FR', 'currency');
            bulkLoadComponent.validFormat('0', 'greaterThanZero');
            bulkLoadComponent.validFormat('a', 'boolean');
            bulkLoadComponent.validFormat('-5', 'greaterWarranty');
            bulkLoadComponent.validFormat('', 'address');
            bulkLoadComponent.validFormat('asdf/*-', 'daneCode');
            bulkLoadComponent.validFormat(undefined, 'formatPeriodicity');
            bulkLoadComponent.validFormat('/*-+', 'atleastonealphanumeric');
            fixture.detectChanges();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('validateDataFromFile', () => {
        beforeEach(() => {
        });
        it('validateDataFromFile', () => {
            const res = [
                [{
                    0: 'EAN',
                    1: 'Nombre del Producto',
                    2: 'Modelo',
                    3: 'Inventario',
                    4: 'Precio',
                    5: 'Precio con Descuento',
                    6: 'Costo de Flete Promedio',
                    7: 'Promesa de Entrega',
                    8: 'Free Shipping',
                    9: 'Indicador Envios Exito',
                    10: 'Actualizacion de Inventario',
                    11: 'Cotizador de Flete',
                    12: 'Garantia',
                    13: 'Ean combo',
                    14: 'Cantidad en combo',
                    15: 'Tipo de moneda',
                    16: 'Direccion de Recogida',
                    17: 'Ciudad de Recogida',
                    18: 'Periodicidad',
                    19: 'SKU Vendedor'
                }],
                [{
                    0: 'IZ20000020932',
                    1: 'Tenis deportivos cambio 1',
                    2: '2020',
                    3: '25095',
                    4: '12095',
                    5: '12094',
                    6: '10096',
                    7: '1 - 20',
                    8: '0',
                    9: '0',
                    10: '1',
                    11: '0',
                    12: '96',
                    13: null,
                    14: null,
                    15: 'COP',
                    16: 'Avenida Siempre Viva 837',
                    17: '05001000',
                    18: '1',
                    19: '/*-'
                }]
            ];

            const file = {
                bubbles: true,
                cancelBubble: false,
                cancelable: false,
                composed: false,
                currentTarget: null,
                defaultPrevented: false,
                eventPhase: 0,
                isTrusted: true,
                path: null,
                returnValue: true,
                srcElement: null,
                target: null,
                timeStamp: 71849.04499999902,
                type: 'change'
            };
            bulkLoadComponent.validateDataFromFile(res, file);
            fixture.detectChanges();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
});
