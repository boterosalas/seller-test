/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrandsComponent } from './brands.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrandService } from './brands.component.service';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@app/secure/auth/auth.routing';
import { of } from 'rxjs';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDrawer } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

export const registerRegex = [
    { Identifier: 'formatNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
];

export interface Sort {
    active: string;
    direction: SortDirection;
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
        body: JSON.stringify({Data: brands }),
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
    }

    const sort: Sort = { active: 'name', direction: 'desc' };

    // Mock Services
    const mockBrandsService = jasmine.createSpyObj('BrandService', ['getAllBrands', 'changeStatusBrands', 'validateExistBrands', 'createBrands']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockDrawer = jasmine.createSpyObj('MatDrawer', ['toggle']);
    const data = {
        title: '',
        message: '',
        icon: '',
        form: null,
        btnConfirmationText: null,
        showButtons: false
    };
    const formBuilder: FormBuilder = new FormBuilder();

    // Create Variables for services and component
    let fixture: ComponentFixture<BrandsComponent>;
    let brandsComponent: BrandsComponent;
    let brandService: BrandService;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;

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
                BrandService,
                EndpointService,
                LoadingService,
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
        dialogFixture = TestBed.createComponent(DialogWithFormComponent);
        dialogComponent = dialogFixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(brandService).toBeTruthy();
        expect(brandsComponent).toBeTruthy();
    });


    describe('get all branchs with pagination and limit undefined', () => {
        beforeEach(() => {
            brandsComponent.pageSize = 50;
            brandsComponent.pagepaginator = 0;
            brandsComponent.countFilter = 1;
            mockBrandsService.getAllBrands.and.returnValue(of(responseEmpty));
        });

        it('Should be fail nit with characters', () => {
            brandsComponent.filterBrandsControlsId = 636934381618814126;
            brandsComponent.filterBrandsControlsName = '---------';
            fixture.detectChanges();
            brandsComponent.getAllBrands();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('sortData', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            fixture.detectChanges();
        });

        it('sort data active and direction', () => {
            brandsComponent.sortData(sort);
            expect(brandsComponent.sortedData).not.toBeNull();
        });
        it('sort data id', () => {
            sort.active = 'id';
            fixture.detectChanges();
            brandsComponent.sortData(sort);
            const sortDataId = brandsComponent.sortData(sort);
            expect(sortDataId).not.toBeNull();
        });
        it('sort data asc', () => {
            sort.direction = 'asc';
            fixture.detectChanges();
            brandsComponent.sortData(sort);
            const sortDataAsc = brandsComponent.sortData(sort);
            expect(sortDataAsc).not.toBeNull();
        });
        it('sort data null', () => {
            sort.active = null;
            fixture.detectChanges();
            const sortDataNull = brandsComponent.sortData(sort);
            expect(sortDataNull).not.toBeNull();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('set Data Change Status Dialog', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('brands status edit', () => {
            const brandsData = { Id: 1, Name: 'carulla', Status: true, PaginationToken: '1|65' };
            const brandsStatus = brandsComponent.setDataChangeStatusDialog(brandsData);
            expect(brandsStatus.icon).toEqual('edit');
        });
        it('brands create', () => {
            const brandsData = {};
            const brandsStatusCreate = brandsComponent.setDataChangeStatusDialog(brandsData);
            expect(brandsStatusCreate.icon).toEqual('control_point');
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('close and clear Filter', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            brandsComponent.filterBrandsName = 'test clear filter';
            fixture.detectChanges();
        });
        it('button clear filter', () => {
            brandsComponent.cleanAllFilter();
        });
        it('button clear filter', () => {
            brandsComponent.onNoClick();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });

    describe('set status brand', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            fixture.detectChanges();
        });
        it('status active', () => {
            const brand = { Id: 1, Name: 'carulla', Status: false };
            brandsComponent.setStatusBrand(brand);
            expect(brandsComponent.brandsList[1].Status).toEqual(true);
        });
        it('status active', () => {
            const brand = { Id: 2, Name: 'Troopx', Status: true };
            brandsComponent.setStatusBrand(brand);
            expect(brandsComponent.brandsList[1].Status).toEqual(true);
        });
        it('status change 1 to true', () => {
            const brandsStatus = brandsComponent.changeStatus('1');
            expect(brandsStatus).toEqual(true);
        });
        it('status change 0 to false', () => {
            const brandsStatus = brandsComponent.changeStatus('0');
            expect(brandsStatus).toEqual(false);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });

    describe('filter apply', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            mockDrawer.toggle.and.returnValue();
            fixture.detectChanges();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('change paginator brands', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            fixture.detectChanges();
        });
        it('change paginator brands with param with space black', () => {
            const param = { pageSize: '', pageIndex: '', };
            brandsComponent.changePaginatorBrands(param);
        });
        it('change paginator brands', () => {
            const param = { pageSize: 50, pageIndex: 0, };
            brandsComponent.changePaginatorBrands(param);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('validate Exist', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            fixture.detectChanges();
        });
        it('validte exist in bd with new brands', () => {
            const event = { target: { value: 'MARCA' } };
            brandsComponent.validateExist(event);
            expect(brandsComponent.validateExit).toEqual(true);
        });
        it('validate exist in bd with space black', () => {
            const event = { target: { value: '' } };
            const bradnsValidate = brandsComponent.validateExist(event);
            expect(bradnsValidate).toBeNull();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('config Data Dialog Act-Des', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            mockDialog.open.and.returnValue(mockDialogRef);
            mockDialogRef.componentInstance.and.returnValue(dialogComponent);
            fixture.detectChanges();
        });
        it('config Data Dialog Act-Des', () => {
            const event = jasmine.createSpyObj('event', ['preventDefault']);
            const brand = { id: 1, name: 'marca', status: false };
            brandsComponent.changeStatusBrands(event, brand);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
});
