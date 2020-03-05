import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalQuotingSellerComponent } from './modal-quoting-seller.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatIconModule, MatSnackBarModule, MatInputModule, MatDialogRef, MatSnackBar } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '@app/material.module';
import { LoadingService, UserParametersService, ModalService } from '@app/core';
import { ShippingMethodsService } from '../../administrator/shipping-methods/shipping-methods.service';
import { ListZonesService } from '../../administrator/list-zones/list-zones.service';
import { ListTransporterService } from '../../administrator/list-transporter/list-transporter.service';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ComponentsService } from '@app/shared';
import { SearchService } from '@app/secure/products/create-product-unit/categorization/search.component.service';
import { QuotingService } from '../../quoting.service';
import { SharedModule } from '@app/shared/shared.module';
import { of } from 'rxjs';

export const registerRegex = [
    { Identifier: 'formatNumberInfinito', Value: '^([0-9]+([.][0-9]{2})?)$|^((Infinito|Infinite)$)', Module: 'ofertas' },
    { Identifier: 'priceInfinite', Value: '^[0-9]+$|^((Infinito|Infinite)$)', Module: 'ofertas' },

];

fdescribe('ModalQuotingSellerComponent', () => {
    let component: ModalQuotingSellerComponent;
    let fixture: ComponentFixture<ModalQuotingSellerComponent>;

    const UserInformation = {
        sellerEmail: 'ccbustamante2@misena.edu.co',
        sellerId: '11618',
        sellerName: 'la tienda de cristian 2019 vs 5',
        sellerNit: '1128438122',
        sellerProfile: 'seller',
    };

    const resRegex = {
        body: {
            body: JSON.stringify({ Data: registerRegex })
        }
    };

    const resShipingMethods = {
        statusCode: 200,
        body: {
            Errors: [],
            Data: [
                { Id: 1, Name: 'Por categoria', Icon: 'library_books' },
                { Id: 3, Name: 'Por rango de peso', Icon: 'assignment' },
                { Id: 2, Name: 'Por rango de precio', Icon: 'local_offer' }
            ]
        }
    };

    const resListTransport = {
        status: 200,
        body: {
            statusCode: 200,
            Errors: [],
            body: {
                Data: [
                    { Id: 29, Name: 'aja', IdShippingMethod: 1 },
                ]
            }
        }
    };

    const resListZones = {
        status: 200,
        body: {
            statusCode: 200,
            Errors: [],
            body: {
                Data: [
                    { Id: 9, Name: 'Antioquia', DaneCode: '12345678,50000000,10000000' },
                ]
            }
        }
    };

    const resCategory = {
        status: 200,
        body: {
            statusCode: 200,
            Errors: [],
            body: {
                Data: [
                    { Id: 50035 },
                ]
            }
        }
    };

    const dialogMock = { close: () => { } };
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserParametersService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockShippingMethodsService = jasmine.createSpyObj('ShippingMethodsService', ['getShippingMethods']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockListZonesService = jasmine.createSpyObj('ListZonesService', ['getListZones']);
    const mockListTransporterService = jasmine.createSpyObj('ListTransporterService', ['getListTransporters']);
    const mockQuotingService = jasmine.createSpyObj('QuotingService', ['deleteQuotingSeller']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    // const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['']);
    // const mockTranslateService = jasmine.createSpyObj('TranslateService', ['']);
    const mockSearchService = jasmine.createSpyObj('SearchService', ['getCategories']);
    const mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    let loadingService: LoadingService;
    // let shippingMethodsService: ShippingMethodsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalQuotingSellerComponent],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                MatDialogModule,
                HttpClientModule,
                ReactiveFormsModule,
                MatIconModule,
                MatSnackBarModule,
                MatInputModule,
                MaterialModule,
                SharedModule,
                TranslateModule.forRoot({})
            ],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                TranslateService,
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: UserParametersService, useValue: mockUserParametersService },
                { provide: ModalService, useValue: mockDialogError },
                { provide: ShippingMethodsService, useValue: mockShippingMethodsService },
                { provide: ListZonesService, useValue: mockListZonesService },
                { provide: ListTransporterService, useValue: mockListTransporterService },
                { provide: QuotingService, useValue: mockQuotingService },
                { provide: SupportService, useValue: mockSupportService },
                // { provide: ComponentsService, useValue: mockComponentsService },
                // { provide: TranslateService, useValue: mockTranslateService },
                { provide: SearchService, useValue: mockSearchService },
                { provide: MatSnackBar, useValue: mockMatSnackBar },
                ComponentsService,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalQuotingSellerComponent);
        component = fixture.componentInstance;
        mockUserParametersService.getUserData.and.returnValue(of(UserInformation));
        mockSupportService.getRegexFormSupport.and.returnValue(of(resRegex));
        mockShippingMethodsService.getShippingMethods.and.returnValue(of(resShipingMethods));
        mockListTransporterService.getListTransporters.and.returnValue(of(resListTransport));
        mockListZonesService.getListZones.and.returnValue(of(resListZones));
        mockSearchService.getCategories.and.returnValue(of(resCategory));
        loadingService = TestBed.get(LoadingService);
        localStorage.setItem('userId', UserInformation.sellerId);
        fixture.detectChanges();
    });

    it('should create component QUOTING SELLER', () => {
        expect(component).toBeTruthy();
    });
    it('Get regex', () => {
        const ofertas = {
            formatNumberInfinito: '^([0-9]+([.][0-9]{2})?)$|^((Infinito|Infinite)$)',
            priceInfinite: '^[0-9]+$|^((Infinito|Infinite)$)'
        };
        expect(component.quotingRegex).toEqual(ofertas);
        component.validateFormSupport();
        // expect(component.BrandsRegex).not.toEqual(dashboard);
    });
});
