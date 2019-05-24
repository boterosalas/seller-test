import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkLoadProductComponent } from './bulk-load-product.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { BulkLoadProductService } from '../bulk-load-product.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LoadingService, UserLoginService, UserParametersService, ModalService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { SupportService } from '@app/secure/support-modal/support.service';
import { of, BehaviorSubject } from 'rxjs';
import { BasicInformationService } from '../../create-product-unit/basic-information/basic-information.component.service';
import { FormBuilder } from '@angular/forms';
import { SearchService } from '../../create-product-unit/categorization/search.component.service';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';

export const registerRegex = [
    { Identifier: 'number', Value: '^[0-9]+$', Module: 'productos' },
    { Identifier: 'eanProduct', Value: '^([A-Z0-9]{5,16})$|0{1}$', Module: 'productos' },
    { Identifier: 'nameProduct', Value: '^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ+\-\,\.\s]{1,60}$', Module: 'productos' },
    { Identifier: 'eanComboProduct', Value: '^[a-zA-Z0-9\,]*$', Module: 'productos' },
    { Identifier: 'brandProduct', Value: 'brandProduct', Module: 'productos' },
    { Identifier: 'keyWordsProduct', Value: '^[\w\W\s\d]{1,500}$', Module: 'productos' },
    { Identifier: 'detailProduct', Value: '^[\w\W\s\d]{1,29}$', Module: 'productos' },
    { Identifier: 'eanImageProduct', Value: 'JPG$|jpg$', Module: 'productos' },
    { Identifier: 'SkuShippingSizeProduct', Value: '^[1-5]{1}$', Module: 'productos' },
    { Identifier: 'Package', Value: '^([0-9]{1,7})(\,[0-9]{1,2})$|^([0-9]{1,10})$', Module: 'productos' },
    { Identifier: 'descriptionProduct', Value: '^((?!<script>|<SCRIPT>|<Script>)[\s\S])*$', Module: 'productos' },
    { Identifier: 'size', Value: '^[^\s]{1,10}$', Module: 'productos' },
    { Identifier: 'hexColourCodePDPProduct', Value: '^[a-zA-Z0-9]{1,6}$', Module: 'productos' },
    { Identifier: 'limitCharsSixty', Value: '^[\w\W\s\d]{1,60}$', Module: 'productos' },
    { Identifier: 'sizeProduct', Value: '^((\S){1,10})$', Module: 'productos' },
    { Identifier: 'colorProduct', Value: '^(Beige|Negro|Blanco|Azul|Amarillo|Cafe|Gris|Verde|Naranja|Rosa|Morado|Rojo|Plata|Dorado|MultiColor)$', Module: 'productos' },
    { Identifier: 'typeCategory', Value: '^(Technology|Clothing)$', Module: 'productos' },
    { Identifier: 'descUnidadMedidaProduct', Value: '^(Gramo|Mililitro|Metro|Unidad)$', Module: 'productos' },
    { Identifier: 'factConversionProduct', Value: '^(([1-9][0-9]{0,10})|([1-9][0-9]{0,8}([,\.][0-9]{1}))|(([0-9]([0-9]{0,7}([,\.][0-9]{2})|([,\.][1-9]{1})))))?$', Module: 'productos' },
    { Identifier: 'eanCombo', Value: '((^([A-Z0-9]{5,16}))+)+([,](([A-Z0-9]{5,16})))*)$', Module: 'productos' },
];

fdescribe('BulkLoad Products Component', () => {

    const mockAuthService = {
        profileType$: new BehaviorSubject<any>('Tienda'),
        getMenu: () => {

        }
    };

    // Mockeo de servicios por spy
    const mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openSnackBar']);
    const mockBulkLoadProductService = jasmine.createSpyObj('BulkLoadProductService', ['getAmountAvailableLoads', 'setProductsModeration',
        'setProducts', 'getCargasMasivas', 'verifyStateCharge']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    // const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu', 'profileType$']);
    const mockUserParametersService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockModalService = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getActiveBrands']);
    const mockFormBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
    const mockSearchService = jasmine.createSpyObj('SearchService', ['getCategories']);
    const mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    const mockFileServer = jasmine.createSpyObj('FileSaver', ['saveAs']);

    const response = {
        status: 200,
        body: {
            data: {
                status: 0,
                checked: 'true',
                Data: 'Success',
                Response: {
                    Error: [],
                    Message: 'Operación realizada exitosamente',
                    Data: {
                        Error: 0,
                        FileName: '',
                        ProductNotify: [],
                        SpecsNotify: [],
                        Successful: 0,
                        TotalProcess: 0,
                        productWaiting: []
                    }
                }
            }
        }
    };


    let fixture: ComponentFixture<BulkLoadProductComponent>;
    let component: BulkLoadProductComponent;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // Se declara el componente a testear
            declarations: [BulkLoadProductComponent],
            imports: [MaterialModule],
            providers: [{ provide: ComponentsService, useValue: mockComponentsService },
            { provide: BulkLoadProductService, useValue: mockBulkLoadProductService },
            { provide: MatDialog, useValue: mockMatDialog },
            { provide: LoadingService, useValue: mockLoadingService },
            { provide: UserParametersService, useValue: mockUserParametersService },
            { provide: ModalService, useValue: mockModalService },
            { provide: AuthService, useValue: mockAuthService },
            { provide: SupportService, useValue: mockSupportService },
            { provide: BasicInformationService, useValue: mockBasicInformationService },
            { provide: FormBuilder, useValue: mockFormBuilder },
            { provide: SearchService, useValue: mockSearchService },
            { provide: MatSnackBar, useValue: mockMatSnackBar }],
            // Ignora todo lo que no hace parte de ese componente.
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BulkLoadProductComponent);
        component = fixture.componentInstance;
        const result = {
            status: 200,
            body: {
                data: JSON.stringify({ Data: 'Success' })
            }
        };
        mockBulkLoadProductService.getAmountAvailableLoads.and.returnValue(of(result));
        const res = {
            body: {
                body: JSON.stringify({ Data: registerRegex })
            }
        };
        mockSupportService.getRegexFormSupport.and.returnValue(of(res));

        mockBulkLoadProductService.getCargasMasivas.and.returnValue(of(response));
    });
    afterEach(() => {
        fixture = TestBed.createComponent(BulkLoadProductComponent);
        component = fixture.componentInstance;
        const result = {
            status: 300,
            body: {
                body: JSON.stringify({ Data: 'Success' })
            }
        };
        mockBulkLoadProductService.getAmountAvailableLoads.and.returnValue(of(result));
    });

    it('should create seller list component', () => {
        expect(component).toBeTruthy();
    });



    describe('Seller login', () => {
        beforeEach(() => {
        });

        describe('Seller login', () => {
            beforeEach(() => {
                dialogFixture = TestBed.createComponent(DialogWithFormComponent);
                dialogComponent = dialogFixture.componentInstance;
            });

            it('Get quantity charges in seller', () => {
                component.getAvaliableLoads();
                expect(component.isAdmin).toBeFalsy();
                // Se verifica el llamado del metodo getAmountAvailableLoads
                expect(mockBulkLoadProductService.getAmountAvailableLoads).not.toHaveBeenCalled();
            });

            it('Reset variables', () => {
                component.listLog = [];
                component.countErrors = 0;
                component.countRowUpload = 0;
                component.arrayInformation = [];
                component.arrayInformationForSend = [];
                component.orderListLength = true;
                component.numberElements = 0;
                component.fileName = '';
                component.arrayNecessaryData = [];
                component.resetVariableUploadFile();
                expect(component.resetVariableUploadFile).toBeTruthy();
            });

            it('Get regex', () => {
                component.validateFormSupport();
                expect(mockSupportService.getRegexFormSupport).toHaveBeenCalled();
            });

            it('Download excel', () => {
                component.downloadFormatMassiveOfferLoadinternacional();
            });

            it('Download excel spanish', () => {
                component.downloadFormatMassiveOfferLoad();
            });

            it('Validate status charge', () => {
                component.verifyStateCharge();
                expect(mockBulkLoadProductService.getCargasMasivas).toHaveBeenCalled();
            });

            it('Validate status charge checked true', () => {
                console.log('55', response);
                response.body.data.status = 1;
                component.verifyStateCharge();
                expect(mockBulkLoadProductService.getCargasMasivas).toHaveBeenCalled();
            });

            it('Validate datos plantilla technology', () => {
                component.getDataFormFileTechnology();
                const prueba = component.getDataFormFileTechnology();
                expect(prueba.categoria).toBeTruthy();
            });

            it('Validate datos plantilla clothing', () => {
                component.getDataFormFileClothing();
                const prueba = component.getDataFormFileClothing();
                expect(prueba.categoria).toBeTruthy();
            });

            it('Configuracion de la tabla', () => {
                component.configDataDialog();
                const pruebaDialog = component.configDataDialog();
                expect(pruebaDialog).toBeTruthy();
            });

            it('Configuracion abre modal', () => {
                component.openModalVtexTree();
                const pruebaDialogModal = component.openModalVtexTree();
                expect(pruebaDialogModal).toBeTruthy();
            });

            /*
            describe('abc', () => {
                beforeEach(() => {
                    const response1 = {
                        status: 200,
                        body: {
                            data: {
                                status: 1,
                                checked: 'true',
                                Data: 'Success',
                                Response: {
                                    Error: [],
                                    Message: 'Operación realizada exitosamente',
                                    Data: {
                                        Error: 0,
                                        FileName: '',
                                        ProductNotify: [],
                                        SpecsNotify: [],
                                        Successful: 0,
                                        TotalProcess: 0,
                                        productWaiting: [ ]
                                    }
                                }
                            }
                        }
                    };
                    mockBulkLoadProductService.verifyStateCharge.and.returnValue(of(response1));

                });
                it('Validate status charge status 1 ', () => {
                    // response.body.data.checked = 'false';
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        component.verifyStateCharge();
                        expect(mockBulkLoadProductService.verifyStateCharge).toHaveBeenCalled();
                    });
                });
            }); */
        });
    });

    describe('Admin login', () => {
        beforeEach(() => {
            mockAuthService.profileType$.next('Admin');
        });
        it('Get quantity charges in seller', () => {
            component.getAvaliableLoads();
            expect(component.isAdmin).toBeTruthy();
            // Se verifica el llamado del metodo getAmountAvailableLoads
            expect(mockBulkLoadProductService.getAmountAvailableLoads).toHaveBeenCalled();
        });
        it('Reset variables', () => {
            component.listLog = [];
            component.countErrors = 0;
            component.countRowUpload = 0;
            component.arrayInformation = [];
            component.arrayInformationForSend = [];
            component.orderListLength = true;
            component.numberElements = 0;
            component.fileName = '';
            component.arrayNecessaryData = [];
            component.resetVariableUploadFile();
            expect(component.resetVariableUploadFile).toBeTruthy();
        });
    });

});

