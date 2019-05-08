import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkLoadProductComponent } from './bulk-load-product.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { BulkLoadProductService } from '../bulk-load-product.service';
import { MatDialog } from '@angular/material';
import { LoadingService, UserLoginService, UserParametersService, ModalService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { SupportService } from '@app/secure/support-modal/support.service';
import { of, BehaviorSubject } from 'rxjs';

describe('BulkLoad Products Component', () => {

    const mockAuthService = {
        profileType$: new BehaviorSubject<any>('Tienda'),
        getMenu: () => {

        }
    };

    // Mockeo de servicios por spy
    const mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openSnackBar']);
    const mockBulkLoadProductService = jasmine.createSpyObj('BulkLoadProductService', ['getAmountAvailableLoads', 'setProductsModeration',
        'setProducts', 'getCargasMasivas']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    // const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu', 'profileType$']);
    const mockUserParametersService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockModalService = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);

    let fixture: ComponentFixture<BulkLoadProductComponent>;
    let component: BulkLoadProductComponent;

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
            { provide: SupportService, useValue: mockSupportService }],
            // Ignora todo lo que no hace parte de ese componente.
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BulkLoadProductComponent);
        component = fixture.componentInstance;
    });

    it('should create seller list component', () => {
        expect(component).toBeTruthy();
    });

    describe('Seller login', () => {
        beforeEach(() => {
        });

        it('', () => {
            component.getAvaliableLoads();
            expect(component.isAdmin).toBeFalsy();
            // Se verifica el llamado del metodo getAmountAvailableLoads
            expect(mockBulkLoadProductService.getAmountAvailableLoads).not.toHaveBeenCalled();
        });
    });

    describe('Admin login', () => {
        beforeEach(() => {
            mockAuthService.profileType$.next('Admin');
        });
        it('', () => {
            component.getAvaliableLoads();
            expect(component.isAdmin).toBeTruthy();
            // Se verifica el llamado del metodo getAmountAvailableLoads
            expect(mockBulkLoadProductService.getAmountAvailableLoads).toHaveBeenCalled();
        });
    });

});
