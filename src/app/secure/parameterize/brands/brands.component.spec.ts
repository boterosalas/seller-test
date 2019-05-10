/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrandsComponent } from './brands.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrandService } from './brands.component.service';
import { LoadingService, ModalService, EndpointService, UserParametersService, CognitoUtil, UserLoginService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@app/secure/auth/auth.routing';
import { Observable, throwError } from 'rxjs';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

export const registerRegex = [
    { Identifier: 'formatNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
];

export interface Sort {
    active: string;
    direction: SortDirection;
}

fdescribe('BrandsComponent', () => {
    const registerMenu = {
        Functionalities: [{
            NameFunctionality: 'Crear',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Crear'
        }],
    };

    const brands = [
        { id: 1, name: 'carulla', status: true, paginationToken: '1|65' },
        { id: 2, name: 'Troopx', status: true, paginationToken: '2|65' },
        { id: 3, name: 'Textil', status: false, paginationToken: '3|65' },
        { id: 4, name: 'Taeq', status: false, paginationToken: '4|65' },
        { id: 5, name: 'Surtimax', status: true, paginationToken: '5|65' },
        { id: 6, name: 'Super Inter', status: true, paginationToken: '6|65' },
        { id: 7, name: 'Porchi', status: false, paginationToken: '7|65' },
        { id: 8, name: 'Pomona', status: false, paginationToken: '8|65' },
        { id: 9, name: 'Exito', status: true, paginationToken: '9|65' }
    ];

    const sort: Sort = { active: 'name', direction: 'desc' };

    // Mock Services
    const mockBrandsService = jasmine.createSpyObj('BrandService', ['getAllBrands', 'changeStatusBrands', 'validateExistBrands']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
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
                {provide: MatDialog, useValue: mockDialog},
                {provide: MAT_DIALOG_DATA, useValue: data},
                {provide: MatDialogRef, useValue: mockDialogRef},
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
            brandsComponent.pageSize = undefined;
            brandsComponent.pagepaginator = undefined;
            brandsComponent.countFilter = undefined;
        });

        it('Should be fail nit with characters', () => {
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
        });
        it('sort data id', () => {
            sort.active = 'id';
            fixture.detectChanges();
            brandsComponent.sortData(sort);
        });
        it('sort data asc', () => {
            sort.direction = 'asc';
            fixture.detectChanges();
            brandsComponent.sortData(sort);
        });
        it('sort data null', () => {
            sort.active = null;
            fixture.detectChanges();
            brandsComponent.sortData(sort);
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
            const brandsData = { id: 1, name: 'carulla', status: true, paginationToken: '1|65' };
            brandsComponent.setDataChangeStatusDialog(brandsData, 'active', 0);
        });
        it('brands create', () => {
            const brandsData = {};
            brandsComponent.setDataChangeStatusDialog(brandsData, 'active', 0);
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

        it('close and filter', () => {
            brandsComponent.closeFilter();
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
            const brand = { id: 1, name: 'marca', status: false };
            brandsComponent.setStatusBrand(brand);
        });
        it('status active', () => {
            const brand = { id: 1, name: 'marca', status: true };
            brandsComponent.setStatusBrand(brand);
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });

    describe('filter apply', () => {
        beforeEach(() => {
            brandsComponent.brandsList = brands;
            fixture.detectChanges();
        });
        it('status active', () => {
            const brand = { id: 1, name: 'marca', status: false };
            brandsComponent.filterApply(brand);
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
        it('change paginator brands', () => {
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
        it('change paginator brands', () => {
            const event = { target: {value: 'MARCA'}};
            brandsComponent.validateExist(event);
        });
        it('change paginator brands', () => {
            const event = { target: {value: ''}};
            brandsComponent.validateExist(event);
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
            const event = jasmine.createSpyObj('event', [ 'preventDefault' ]);
            const brand = { id: 1, name: 'marca', status: false };
            brandsComponent.changeStatusBrands(event, brand );
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
});
