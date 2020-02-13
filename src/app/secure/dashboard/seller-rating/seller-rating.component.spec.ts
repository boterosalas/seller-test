import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialogModule, MatInputModule, MatIconModule, MatSnackBarModule } from '@angular/material';
import { SellerRatingComponent } from './seller-rating.component';
import { MaterialModule } from '@app/material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService, UserParametersService, CognitoUtil, EndpointService, ModalService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { DashboardService } from '../services/dashboard.service';
import { of } from 'rxjs';
import { ComponentsService } from '@app/shared';

export const registerRegex = [
    { Identifier: 'dateMonthYear', Value: '^(0[0-9]||1[0-2])\/([0-9]{4})$', Module: 'dashboard' },
];

describe('SellerRatingComponent', () => {
    let component: SellerRatingComponent;
    let fixture: ComponentFixture<SellerRatingComponent>;

    const UserInformation = {
        sellerEmail: 'ccbustamante2@misena.edu.co',
        sellerId: '11618',
        sellerName: 'la tienda de cristian 2019 vs 5',
        sellerNit: '1128438122',
        sellerProfile: 'seller',
    };

    const resSellerRating = {
        body: {
            viewModel: {
                idSeller: 11811,
                qualificationDate: 202012,
                generatedDate: 20201227,
                urlFile: 'https://s3.amazonaws.com/seller.center.exito.seller/qualificationDev/1234_Noviembre_2019_spanish.html',
                qualitative: 'Deficiente'
            }
        },
        status: 200
    };

    const params = {
        'sellerId': UserInformation.sellerId,
        'datequalificationinitial': null,
        'dateQualificationFinal': null,
        'generatedDateInitial': null,
        'generatedDateFinal': null,
        'paginationToken': '{}',
        'limit': 10,
    };

    const resRegex = {
        body: {
            body: JSON.stringify({ Data: registerRegex })
        }
    };


    const dialogMock = { close: () => { } };
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserParametersService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockSuportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport', 'getClassification']);
    const mockDashboardService = jasmine.createSpyObj('DashboardService', ['getRatingSellers']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);

    let loadingService: LoadingService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SellerRatingComponent],
            imports: [MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                MatDialogModule,
                HttpClientModule,
                CommonModule,
                ReactiveFormsModule,
                MatIconModule,
                MatSnackBarModule,
                MatInputModule,
                SharedModule,
                RouterTestingModule,
                TranslateModule.forRoot({})
            ],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: UserParametersService, useValue: mockUserParametersService },
                { provide: ModalService, useValue: mockDialogError },
                // UserParametersService,
                // DashboardService,
                DatePipe,
                EndpointService,
                CognitoUtil,
                ComponentsService,
                TranslateService,
                { provide: SupportService, useValue: mockSuportService },
                { provide: DashboardService, useValue: mockDashboardService },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SellerRatingComponent);
        component = fixture.componentInstance;
        mockUserParametersService.getUserData.and.returnValue(of(UserInformation));
        mockSuportService.getRegexFormSupport.and.returnValue(of(resRegex));
        mockDashboardService.getRatingSellers.and.returnValue(of(resSellerRating));
        loadingService = TestBed.get(LoadingService);
        localStorage.setItem('userId', UserInformation.sellerId);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Get regex', () => {
        const dashboard = {
            dateMonthYear: '^(0[0-9]||1[0-2])/([0-9]{4})$',
        };
        expect(component.BrandsRegex).toEqual(dashboard);
        component.validateFormSupport();
        // expect(component.BrandsRegex).not.toEqual(dashboard);
    });
    it('clear all filter', () => {
        component.cleanAllFilter();
        expect(component.listFilterBrands).toEqual([]);
    });

    it('open pdf', () => {
        component.getPDF('docs.google.com/document/d/1HQx56fbvQMFuw34vgTQrnCuwEBf8SYNk17yjJogaLNI/edit');
        // expect(component.listFilterBrands).toEqual([]);
    });

    // it('open modal', () => {
    //     expect(loadingService).toBeTruthy();
    //     component.openDialogSupport();
    //     // expect(component.listFilterBrands).toEqual([]);
    // });

    describe('Rating with data', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(SellerRatingComponent);
            component = fixture.componentInstance;
            mockDashboardService.getRatingSellers.and.returnValue(of(resSellerRating));
            localStorage.setItem('userId', UserInformation.sellerId);
            fixture.detectChanges();
        });

        it('getSellerRating', () => {
            resSellerRating.status = 401;
            // expect(component.arraySellerRating).toEqual(dashboard);
            component.getSellerRating();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });

    });

    describe('Rating with data fuera del body', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(SellerRatingComponent);
            component = fixture.componentInstance;
            mockDashboardService.getRatingSellers.and.returnValue(of({status: 400}));
            localStorage.setItem('userId', UserInformation.sellerId);
            fixture.detectChanges();
        });

        it('getSellerRating', () => {
            resSellerRating.status = 401;
            // expect(component.arraySellerRating).toEqual(dashboard);
            component.getSellerRating();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Compair date', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(SellerRatingComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('compareDate', () => {
            component.compareDate();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    describe('Compair date greater than', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(SellerRatingComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('compareDate', () => {
            component.initial = '102020';
            component.final = '092020';
            component.compareDate();
        });
        afterAll(() => {
            TestBed.resetTestingModule();
        });
    });
    // describe('Open modal', () => {
    //     beforeEach(() => {
    //         fixture = TestBed.createComponent(SellerRatingComponent);
    //     // mockLoadingService.LoadingService.and.returnValue();
    //         component = fixture.componentInstance;
    //         fixture.detectChanges();
    //     });

    //     it('openDialogSupport', () => {
    //         component.openDialogSupport();
    //     });
    //     afterAll(() => {
    //         TestBed.resetTestingModule();
    //     });
    // });
});
