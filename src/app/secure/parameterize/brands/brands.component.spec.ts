/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrandsComponent } from './brands.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrandService } from './brands.component.service';
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

export const registerRegex = [
    { Identifier: 'formatNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
];

export interface Sort {
    active: string;
    direction: SortDirection;
}

export interface ListFilterBrands {
    name: string;
    value: string;
    nameFilter: string;
}

export interface Brands {
    Id: number;
    Name: string;
    Status: boolean;
    PaginationToken: string;
}


describe('BrandsComponent', () => {
    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
    };

    const brands = [
        { Id: 1, Name: 'carulla', Status: true, PaginationToken: '1|65' },
        { Id: 2, Name: 'Troopx', Status: true, PaginationToken: '2|65' },
        { Id: 3, Name: 'Textil', Status: false, PaginationToken: '3|65' },
        { Id: 4, Name: 'Taeq', Status: false, PaginationToken: '4|65' },
        { Id: 5, Name: 'Surtimax', Status: true, PaginationToken: '5|65' },
        { Id: 6, Name: 'Super Inter', Status: true, PaginationToken: '6|65' },
        { Id: 7, Name: 'Porchi', Status: false, PaginationToken: '7|65' },
        { Id: 8, Name: 'Pomona', Status: false, PaginationToken: '8|65' },
        { Id: 9, Name: 'Exito', Status: true, PaginationToken: '9|65' }
    ];

    const response = {
        body: '{"Message":"Operación realizada éxitosamente.","Errors":[],"Data":{ "Brands":[{"Id":636934381618814126,"Name":"---------","Status":0,"IdVTEX":"2000500","UpdateStatus":false}, {"Id":636934381618814126,"Name":"---------","Status":1,"IdVTEX":"2000500","UpdateStatus":false}]}}',
        headers: null,
        isBase64Encoded: false,
        multiValueHeaders: null,
        statusCode: 200
    };

    const responseEmpty = {
        body: '{"Message":"Operación realizada éxitosamente.","Errors":[],"Data":null}',
        headers: null,
        isBase64Encoded: false,
        multiValueHeaders: null,
        statusCode: 200
    };

    const sort: Sort = { active: 'name', direction: 'desc' };

    const filterBrands = new FormGroup({
        filterBrandsId: new FormControl('636934381618814126'),
        filterBrandsName: new FormControl('---------'),
    });

    // Mock Services
    const mockBrandsService = jasmine.createSpyObj('BrandService', ['getAllBrands', 'changeStatusBrands', 'validateExistBrands', 'createBrands']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const data = {
        title: '',
        message: '',
        icon: '',
        form: null
    };
    const formBuilder: FormBuilder = new FormBuilder();

    // Create Variables for services and component
    let fixture: ComponentFixture<BrandsComponent>;
    let brandsComponent: BrandsComponent;
    let brandService: BrandService;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;
    let supportService: SupportService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientModule
            ],
            declarations: [
                BrandsComponent,
                DialogWithFormComponent
            ],
            providers: [
                { provide: BrandService, useValue: mockBrandsService },
                EndpointService,
                { provide: LoadingService, useValue: mockLoadingService },
                // { provide: SupportService, useValue: mockSupportService },
                SupportService,
                { provide: AuthService, useValue: mockAuthService },
                UserParametersService,
                CognitoUtil,
                { provide: UserLoginService, useValue: mockUserLoginService },
                { provide: ModalService, useValue: mockDialogError },
                { provide: MatDialog, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: mockDialogRef },
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
        fixture = TestBed.createComponent(BrandsComponent);
        brandsComponent = fixture.componentInstance;
        brandService = TestBed.get(BrandService);
        supportService = TestBed.get(SupportService);
        dialogFixture = TestBed.createComponent(DialogWithFormComponent);
        dialogComponent = dialogFixture.componentInstance;
        mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
        mockBrandsService.getAllBrands.and.returnValue(of(response));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(brandService).toBeTruthy();
        expect(brandsComponent).toBeTruthy();
    });


    describe('Brands list', () => {
        beforeEach(() => {
            brandsComponent.pageSize = 50;
            brandsComponent.pagepaginator = 0;
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(of(response));
        });

        it('Brands list with data', () => {
            fixture.detectChanges();
            brandsComponent.getAllBrands();
            expect(brandsComponent.brandsList).not.toBeNull();
        });
        it('Brands list with filter name and id', () => {
            brandsComponent.filterBrands = filterBrands;
            brandsComponent.getAllBrands();
            expect(brandsComponent.brandsList).not.toBeNull();
        });
        it('Brands list with page size and page paginator undefined', () => {
            brandsComponent.pageSize = undefined;
            brandsComponent.pagepaginator = undefined;
            brandsComponent.getAllBrands();
            expect(brandsComponent.brandsList).not.toBeNull();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Brands list', () => {
        beforeEach(() => {
            brandsComponent.pageSize = 50;
            brandsComponent.pagepaginator = 0;
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(of(responseEmpty));
        });

        it('Brands list with response empty', () => {
            fixture.detectChanges();
            brandsComponent.getAllBrands();
            expect(brandsComponent.brandsList).not.toBeNull();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Brands list', () => {
        beforeEach(() => {
            brandsComponent.pageSize = 50;
            brandsComponent.pagepaginator = 0;
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(throwError('falle'));
        });

        it('Brands list with response error', () => {
            fixture.detectChanges();
            brandsComponent.getAllBrands();

        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Sort Data', () => {
        beforeEach(() => {
            brandsComponent.pageSize = 50;
            brandsComponent.pagepaginator = 0;
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(of(responseEmpty));
        });

        it('Sort data with data', () => {
            fixture.detectChanges();
            brandsComponent.sortData(sort);
            expect(brandsComponent.brandsList).not.toBeNull();
        });
        it('Sort data with params empty ', () => {
            fixture.detectChanges();
            brandsComponent.sortData({ active: '', direction: '' });
            expect(brandsComponent.brandsList).not.toBeNull();
        });
        it('Sort data with order id', () => {
            sort.active = 'id';
            fixture.detectChanges();
            brandsComponent.sortData(sort);
            const sortDataId = brandsComponent.sortData(sort);
            expect(sortDataId).not.toBeNull();
        });
        it('sort data with order status', () => {
            sort.active = 'status';
            fixture.detectChanges();
            brandsComponent.sortData(sort);
            const sortDataId = brandsComponent.sortData(sort);
            expect(sortDataId).not.toBeNull();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Set data change', () => {
        beforeEach(() => {
            brandsComponent.pageSize = 50;
            brandsComponent.pagepaginator = 0;
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(of(responseEmpty));
        });

        it('set data with id', () => {
            const brandsData = { Id: '636934381618814126', Name: '---------', Status: true, IdVTEX: '2000500', UpdateStatus: false };
            const brandsStatus = brandsComponent.setDataChangeStatusDialog(brandsData);
            expect(brandsStatus.icon).toEqual('edit');
        });
        it('set data with id empty', () => {
            const brandsData = {};
            const brandsStatus = brandsComponent.setDataChangeStatusDialog(brandsData);
            expect(brandsStatus.icon).toEqual('control_point');
        });
        it('clear all filter', () => {
            brandsComponent.cleanAllFilter();
            expect(brandsComponent.listFilterBrands).toEqual([]);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Change status', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            mockDialog.open.and.returnValue(mockDialogRef);
            mockDialogRef.componentInstance.and.returnValue(dialogComponent);
            fixture.detectChanges();
        });
        it('change status with data empty', () => {
            const event = jasmine.createSpyObj('event', ['preventDefault']);
            const brand = {};
            brandsComponent.changeStatusBrands(event, brand);
        });
        it('change status with data', () => {
            const event = jasmine.createSpyObj('event', ['preventDefault']);
            const brand = { Id: '636934381618814126', Name: '---------', Status: true, IdVTEX: '2000500', UpdateStatus: false };
            brandsComponent.changeStatusBrands(event, brand);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Apply filter', () => {
        beforeEach(() => {
            brandsComponent.pageSize = 50;
            brandsComponent.pagepaginator = 0;
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(of(response));
        });
        it('apply filter with data', () => {
            const newForm = new FormGroup({ filterBrandsId: new FormControl('123456789'), filterBrandsName: new FormControl('SUPERPOPIS') });
            brandsComponent.filterBrands = newForm;
            const drawerr = {
                toggle: () => { return; }
            };
            brandsComponent.filterApply(drawerr);
            expect(brandsComponent.pagepaginator).toEqual(0);
        });
        it('aplly filter with data empty', () => {
            const newForm = new FormGroup({ filterBrandsId: new FormControl(''), filterBrandsName: new FormControl('') });
            brandsComponent.filterBrands = newForm;
            const drawerr = {
                toggle: () => { return; }
            };
            brandsComponent.filterApply(drawerr);
            expect(brandsComponent.pagepaginator).toEqual(0);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Remove chips filter', () => {
        beforeEach(() => {
            brandsComponent.pageSize = 50;
            brandsComponent.pagepaginator = 0;
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(of(response));
        });
        it('remove chips', () => {
            const listFilterBrands: ListFilterBrands = { name: 'filterBrandsId', value: 'filterBrandsId', nameFilter: 'filterBrandsId' };
            brandsComponent.listFilterBrands.push(listFilterBrands);
            brandsComponent.remove(listFilterBrands);
            expect(brandsComponent.listFilterBrands).not.toBeNull();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Change paginator brands', () => {
        beforeEach(() => {
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(of(response));
        });
        it('change paginator with page index and page size empty', () => {
            const params = { pageSize: 0, pageIndex: 0 };
            brandsComponent.changePaginatorBrands(params);
            expect(brandsComponent.pagepaginator).toEqual(0);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Confirmation', () => {
        beforeEach(() => {
            mockBrandsService.changeStatusBrands.and.returnValue(of(response));
            mockBrandsService.createBrands.and.returnValue(of(response));
            mockBrandsService.getAllBrands.and.returnValue(of(response));
            mockBrandsService.validateExistBrands.and.returnValue(of(response));
        });
        it('Confirmation create brands', () => {
            const newForm = new FormGroup({ idBrands: new FormControl('123456789'), nameBrands: new FormControl('SUPERPOPIS') });
            brandsComponent.form = newForm;
            brandsComponent.confirmation();
            expect(brandsComponent.body).not.toBeNull();
        });
        it('confirmation create with data empty', () => {
            brandsComponent.confirmation();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Validate exist', () => {
        beforeEach(() => {
            mockBrandsService.changeStatusBrands.and.returnValue(of(response));
            mockBrandsService.createBrands.and.returnValue(of(response));
            mockBrandsService.getAllBrands.and.returnValue(of(response));
            mockBrandsService.validateExistBrands.and.returnValue(of(response));
        });
        it('validate brands with data', () => {
            const event = { target: { value: 'MARCA' } };
            brandsComponent.validateExist(event);
            expect(brandsComponent.newBrands).not.toBeNull();
        });
        it('validate brands with data empty', () => {
            const event = { target: { value: '' } };
            const brandsExist = brandsComponent.validateExist(event);
            expect(brandsExist).toBeFalsy();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Confimation response error', () => {
        beforeEach(() => {
            mockBrandsService.changeStatusBrands.and.returnValue(of(response));
            mockBrandsService.createBrands.and.returnValue(of(response));
            mockBrandsService.getAllBrands.and.returnValue(of(response));
            mockBrandsService.validateExistBrands.and.returnValue(throwError('falle'));
        });
        it('confirmation response error and name brands', () => {
            const event = { target: { value: 'MARCA' } };
            brandsComponent.validateExist(event);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Confirmation validate exist false', () => {
        beforeEach(() => {
            mockBrandsService.changeStatusBrands.and.returnValue(of(response));
            mockBrandsService.createBrands.and.returnValue(of(response));
            mockBrandsService.getAllBrands.and.returnValue(of(response));
            mockBrandsService.validateExistBrands.and.returnValue(of(responseEmpty));
        });
        it('confirmacition brands', () => {
            const event = { target: { value: 'MARCA' } };
            brandsComponent.validateExist(event);
            expect(brandsComponent.validateExit).toBeFalsy();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
});
