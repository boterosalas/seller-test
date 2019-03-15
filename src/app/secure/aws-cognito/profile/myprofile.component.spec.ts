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

class CognitoAttribute {
    Name: string;
    Value: string;
    constructor(name: string, value: string) {
        this.Name = name;
        this.Value = value;
    }

    getCognitoAttribute() {
        const Name = this.Name;
        const Value = this.Value;
        return {Name, Value};
    }
}

const userData = [
    new CognitoAttribute('sub', '1657563xc-as564asd3').getCognitoAttribute(),
    new CognitoAttribute('email_verified', 'true').getCognitoAttribute(),
    new CognitoAttribute('custom:SellerId', '11618').getCognitoAttribute(),
    new CognitoAttribute('custom:Roles', 'seller').getCognitoAttribute(),
    new CognitoAttribute('name', 'Pruebas Cristian').getCognitoAttribute(),
    new CognitoAttribute('custom:Nit', '1593578462').getCognitoAttribute(),
    new CognitoAttribute('email', 'prueba@prueba.com').getCognitoAttribute()
];

fdescribe('My Profile', () => {
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'changeStateSeller']);
    const userMockService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const userParametersService = jasmine.createSpyObj('UserParametersService', ['getParameters']);
    const data = {
        title: '',
        message: '',
        icon: '',
        form: null
    };

    let fixture: ComponentFixture<MyProfileComponent>;
    let component: MyProfileComponent;
    let loadingService: LoadingService;
    let storeService: StoresService;
    let matDialog: MatDialog;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;

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
                {provide: UserParametersService, useValue: userParametersService},
                {provide: LoadingService, useValue: mockLoadingService},
                {provide: StoresService, useValue: mockStoresService},
                {provide: MatDialog, useValue: mockDialog},
                {provide: MAT_DIALOG_DATA, useValue: data},
                {provide: MatDialogRef, useValue: mockDialogRef},
                {provide: ModalService, useValue: mockDialogError},
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MyProfileComponent);
        component = fixture.componentInstance;
        loadingService = TestBed.get(LoadingService);
        storeService = TestBed.get(StoresService);
        matDialog = TestBed.get(MatDialog);
        dialogFixture = TestBed.createComponent(DialogWithFormComponent);
        dialogComponent = dialogFixture.componentInstance;
    });

    it('should create my profile component', () => {
        expect(component).toBeTruthy();
    });

    describe('user admin login', () => {
        beforeEach(() => {
            const userAdmin = userData;
            userAdmin.map(res => res.Name === 'custom:Roles' ? res.Value = 'admin' : null);
            userParametersService.getParameters.and.returnValue(userData);
            userMockService.isAuthenticated.and.returnValue(null);
        });

        it('should not be exist programVacations', () => {
            const btnProgramVacation = fixture.debugElement.query(By.css('#btn-program-vacation'));
            expect(btnProgramVacation).toBeNull();
        });
    });

    describe('User seller Login', () => {
        beforeEach(async(() => {
            const userAdmin = userData;
            userAdmin.map(res => res.Name === 'custom:Roles' ? res.Value = 'seller' : null);
            userParametersService.getParameters.and.returnValue(userData);
            component.isInVacation = false;
            component.isLoggedIn('', true);
        }));

        it('should be exist programVacations', async(() => {
            fixture.detectChanges();
            const btnProgramVacation = fixture.debugElement.query(By.css('#btn-program-vacation')).nativeElement;
            expect(btnProgramVacation).toBeTruthy();
        }));
    });
});
