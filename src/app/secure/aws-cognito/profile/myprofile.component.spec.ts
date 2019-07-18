import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { AwsCognitoRoutingModule } from '../aws-cognito.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { MyProfileComponent } from './myprofile.component';
import { UserLoginService, UserParametersService, LoadingService, ModalService } from '@app/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerIntl, MatDatepickerModule } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { element } from '@angular/core/src/render3/instructions';
import { By } from '@angular/platform-browser';
import { ShellComponent } from '@app/core/shell';
import { SecureHomeComponent } from '../landing/securehome.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from '@app/secure/dashboard/dashboard.component';
import { LogoutComponent } from '@app/public/auth/confirm/confirmRegistration.component';
import { JwtComponent } from '../jwttokens/jwt.component';
import { UseractivityComponent } from '../useractivity/useractivity.component';
import { CoreModule } from '@angular/flex-layout';
import { SidebarComponent } from '@app/core/shell/sidebar/sidebar.component';
import { SearchOrderMenuComponent } from '@app/core/shell/search-order-menu/search-order-menu.component';
import { HeaderComponent } from '@app/core/shell/header/header.component';
import { ToolbarLinkComponent } from '@app/core/shell/toolbar-link';
import { SearchOrderFormComponent } from '@app/core/shell/search-order-menu/search-order-form/search-order-form.component';
import { SearchBillingFormComponent } from '@app/core/shell/search-order-menu/search-billing-form/search-billing-form.component';
import { SearchPendingDevolutionFormComponent } from '@app/core/shell/search-order-menu/search-pending-devolution-form/search-pending-devolution-form.component';
import { SearchEnviosExitoFormComponent } from '@app/core/shell/search-order-menu/search-envios-exito-form/search-envios-exito-form.component';
import { MyProfileService } from './myprofile.service';
import { of, BehaviorSubject } from 'rxjs';
import { AuthService } from '@app/secure/auth/auth.routing';

const userData = {
    Address: 'calle falsa de algun lugar de este mundo',
    City: 'Sabaneta',
    DaneCode: '05440000',
    Email: 'ccbustamante2@misena.edu.co',
    EndVacations: '30/04/2019',
    GotoCarrulla: true,
    GotoCatalogo: true,
    GotoExito: true,
    IdSeller: 11618,
    IsLogisticsExito: true,
    IsShippingExito: true,
    Name: 'La Tienda De Cristian 2019 Vs 4',
    Nit: '1128438122',
    StartVacations: '15/04/2019',
    Status: 'Enable'
};

describe('My Profile', () => {
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'changeStateSeller']);
    const userMockService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);
    let availableModules = [{Name: 'Perfil', Menus: [{Actions: ['Vacaciones', 'Cancelar Vacaciones'], Name: 'Perfil'}], ProfileType: 'Seller'}]
    const mockAuthService = {
        availableModules: availableModules,
        availableModules$: new BehaviorSubject(availableModules)
    }
    const data = {
        title: '',
        message: '',
        icon: '',
        form: null,
        showButtons: true,
        btnConfirmationText : null
    };

    let fixture: ComponentFixture<MyProfileComponent>;
    let component: MyProfileComponent;
    let loadingService: LoadingService;
    let storeService: StoresService;
    let matDialog: MatDialog;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyProfileComponent,
                ShellComponent,
                SecureHomeComponent,
                DashboardComponent,
                LogoutComponent,
                JwtComponent,
                UseractivityComponent,
                SidebarComponent,
                SearchOrderMenuComponent,
                HeaderComponent,
                ToolbarLinkComponent,
                SearchOrderFormComponent,
                SearchBillingFormComponent,
                SearchPendingDevolutionFormComponent,
                SearchEnviosExitoFormComponent
            ],
            imports: [
                CommonModule,
                SharedModule,
                AwsCognitoRoutingModule,
                ReactiveFormsModule,
                MaterialModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                FormsModule
            ],
            providers: [
                {provide: UserLoginService, useValue: userMockService},
                {provide: MyProfileService, useValue: mockProfileService},
                {provide: LoadingService, useValue: mockLoadingService},
                {provide: StoresService, useValue: mockStoresService},
                {provide: MatDialog, useValue: mockDialog},
                {provide: MAT_DIALOG_DATA, useValue: data},
                {provide: MatDialogRef, useValue: mockDialogRef},
                {provide: ModalService, useValue: mockDialogError},
                {provide: AuthService, useValue: mockAuthService}
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MyProfileComponent);
        component = fixture.componentInstance;
        loadingService = TestBed.get(LoadingService);
        storeService = TestBed.get(StoresService);
        matDialog = TestBed.get(MatDialog);
        authService = TestBed.get(AuthService);
        dialogFixture = TestBed.createComponent(DialogWithFormComponent);
        dialogComponent = dialogFixture.componentInstance;
        mockDialog.open.and.returnValue(mockDialogRef);
        mockDialogRef.componentInstance.and.returnValue(dialogComponent);
        mockDialog.open.calls.reset();
        mockDialogRef.componentInstance.calls.reset();
        component.ngOnInit();
    });

    it('should create my profile component', () => {
        expect(component).toBeTruthy();
    });

    describe('user admin login', () => {
        beforeEach( async () => {
            const mockUser = Object.assign({}, userData);
            mockUser.City = null;
            availableModules = [];
            const responseGetUser = {
                body: {
                    body: JSON.stringify({Data: mockUser})
                }
            };
            mockProfileService.getUser.and.returnValue(of(responseGetUser));
            await component.isLoggedIn('', true);
        });

        it('Should be admin', () => {
            expect(component.isAdmin).toBeTruthy();
        });

        it('should not be exist programVacations', () => {
            const btnProgramVacation = fixture.debugElement.query(By.css('#btn-program-vacation'));
            expect(btnProgramVacation).toBeNull();
        });

        it('should not be exist Info of Vacation', () => {
            const btnProgramVacation = fixture.debugElement.query(By.css('#info-vacation'));
            expect(btnProgramVacation).toBeNull();
        });
    });

    describe('User seller Login With vacations', () => {
        beforeEach(async () => {
            availableModules = [{Name: 'Perfil', Menus: [{Actions: ['Vacaciones', 'Cancelar Vacaciones'], Name: 'Perfil'}], ProfileType: 'Seller'}];
            const responseGetUser = {
                body: {
                    body: JSON.stringify({Data: userData})
                }
            };
            mockProfileService.getUser.and.returnValue(of(responseGetUser));
            await component.isLoggedIn('', true);
        });

        it('Should be seller', () => {
            expect(component.isAdmin).toBeFalsy();
        });

        it('should not be exist programVacations', () => {
            const btnProgramVacation = fixture.debugElement.query(By.css('#btn-program-vacation'));
            expect(btnProgramVacation).toBeNull();
        });

        it('should be exist Info of Vacation', () => {
            fixture.detectChanges();
            expect(component.isInVacation).toBeTruthy();
            const btnProgramVacation = fixture.debugElement.query(By.css('#info-vacation'));
            expect(btnProgramVacation).toBeTruthy();
        });

        it('should be return data for cancel vacation dialog', () => {
            const dataDialog = component.setDataCancelVacationsDialog();
            expect(dataDialog.title).toEqual('Cancelar vacaciones');
        });

        it('should be open dialog cancel vacations', () => {
            const dataDialog = component.setDataCancelVacationsDialog();
            const dialogInstance = component.openCancelVacationDialog(dataDialog);
            expect(mockDialog.open).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledTimes(1);
        });

        it('should be send to open dialog cancel vacations', () => {
            component.sendToOpenCancelVacationDialog();
            expect(mockDialog.open).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledTimes(1);
        });
    });

    describe('User seller Login without vacations', () => {
        beforeEach( async () => {
            const mockUser = Object.assign({}, userData);
            mockUser.StartVacations = '0001-01-01T00:00:00';
            mockUser.EndVacations = '0001-01-01T00:00:00';
            const responseGetUser = {
                body: {
                    body: JSON.stringify({Data: mockUser})
                }
            };
            mockProfileService.getUser.and.returnValue(of(responseGetUser));
            await component.isLoggedIn('', true);
        });

        it('Should be seller', () => {
            expect(component.isAdmin).toBeFalsy();
        });

        it('should be exist programVacations', () => {
            fixture.detectChanges();
            expect(component.isInVacation).toBeFalsy();
            const btnProgramVacation = fixture.debugElement.query(By.css('#btn-program-vacation')).nativeElement;
            expect(btnProgramVacation).toBeTruthy();
        });

        it('should not be exist Info of Vacation', () => {
            const btnProgramVacation = fixture.debugElement.query(By.css('#info-vacation'));
            expect(btnProgramVacation).toBeNull();
        });

        it('Should be set data to program vacations', () => {
            const dataDialog = component.setDataVacationsDialog();
            expect(dataDialog.title).toEqual('Vacaciones');
        });

        it('should be open a dialog to prgram vacations', () => {
            component.sendToOpenVacationDialog();
            fixture.detectChanges();
            expect(mockDialog.open).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledTimes(1);
        });
    });
});
