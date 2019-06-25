import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerModule } from '../seller.module';
import { SellerListComponent } from './list-sellers.component';
import { MaterialModule } from '@app/material.module';
import { LoadingService, ModalService } from '@app/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of, Observable } from 'rxjs';
import { SellerRoutingModule } from '../seller.routing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { componentFactoryName } from '@angular/compiler';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MenuModel } from '../profiles/models/menu.model';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export const response = {
    status: 200,
    body: {
        body: JSON.stringify({
            Data: [
                {
                    Address: 'Direccion A',
                    City: 'Marinilla',
                    DaneCode: '123456',
                    Email: 'asdb@ajj.com',
                    EndVacations: '0001-01-01T00:00:00',
                    GotoCarrulla: true,
                    GotoCatalogo: true,
                    GotoExito: true,
                    IdSeller: 51278,
                    IsLogisticsExito: false,
                    IsShippingExito: true,
                    Name: 'test 1',
                    Nit: '18026014',
                    StartVacations: '0001-01-01T00:00:00',
                    Status: 'Enable'
                },
                {
                    Address: 'Direccion B',
                    City: 'Marinilla',
                    DaneCode: '123455',
                    Email: 'asdb@ajj.com',
                    EndVacations: '0001-01-01T00:00:00',
                    GotoCarrulla: true,
                    GotoCatalogo: true,
                    GotoExito: true,
                    IdSeller: 9876547,
                    IsLogisticsExito: false,
                    IsShippingExito: true,
                    Name: 'test 2',
                    Nit: '18026013',
                    StartVacations: '0001-01-01T00:00:00',
                    Status: 'Disable'
                },
                {
                    Address: 'Direccion C',
                    City: 'Marinilla',
                    DaneCode: '123457',
                    Email: 'asdb@ajj.com',
                    EndVacations: new Date(new Date().getDate() + 2).toString(),
                    GotoCarrulla: true,
                    GotoCatalogo: true,
                    GotoExito: true,
                    IdSeller: 36589962,
                    IsLogisticsExito: false,
                    IsShippingExito: true,
                    Name: 'test 3',
                    Nit: '18026015',
                    StartVacations: new Date(new Date().getDate() - 1 ).toString(),
                    Status: 'Vacation'
                }
            ]
        })
    }
};

const constSellerList = [
    {
        Address: 'Direccion A',
        City: 'Marinilla',
        DaneCode: '123456',
        Email: 'asdb@ajj.com',
        EndVacations: null,
        GotoCarrulla: true,
        GotoCatalogo: true,
        GotoExito: true,
        IdSeller: 51278,
        IsLogisticsExito: false,
        IsShippingExito: true,
        Name: 'test 1',
        Nit: '18026014',
        StartVacations: null,
        Status: 'Enable'
    },
    {
        Address: 'Direccion B',
        City: 'Marinilla',
        DaneCode: '123455',
        Email: 'asdb@ajj.com',
        EndVacations: null,
        GotoCarrulla: true,
        GotoCatalogo: true,
        GotoExito: true,
        IdSeller: 9876547,
        IsLogisticsExito: false,
        IsShippingExito: true,
        Name: 'test 2',
        Nit: '18026013',
        StartVacations: null,
        Status: 'Disable'
    },
    {
        Address: 'Direccion C',
        City: 'Marinilla',
        DaneCode: '123457',
        Email: 'asdb@ajj.com',
        EndVacations: new Date(new Date().getDate() + 2),
        GotoCarrulla: true,
        GotoCatalogo: true,
        GotoExito: true,
        IdSeller: 36589962,
        IsLogisticsExito: false,
        IsShippingExito: true,
        Name: 'test 3',
        Nit: '18026015',
        StartVacations: new Date(new Date().getDate() - 1 ),
        Status: 'vacation'
    }
];

export const  sellerListMenu = {
    Id: undefined,
    NameMenu: 'Listado de Vendedores',
    NameMenuBack: 'listado de vendedores',
    ProfileType: 1,
    ShowMenu: true,
    ShowMenuProduction: true,
    UrlRedirect: 'securehome/seller-center/vendedores/lista',
    Functionalities: [
        {
            NameFunctionality: 'Consultar',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Consultar'
        },
        {
            NameFunctionality: 'Visualizar',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Visualizar'
        },
        {
            NameFunctionality: 'Habilitar',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Habilitar'
        },
        {
            NameFunctionality: 'Deshabilitar',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Deshabilitar'
        },
        {
            NameFunctionality: 'Vacaciones',
            ShowFunctionality: true,
            nameFunctionalityBack: 'Vacaciones'
        }
    ]
};

describe('List Seller Component', () => {

    // Create a Mock Services
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'changeStateSeller']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner', 'viewProgressBar', 'closeProgressBar']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getPermissionForMenu']);
    const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
    const data = {
        title: '',
        message: '',
        icon: '',
        form: null,
        showButtons: true,
        btnConfirmationText: null
    };

    // Create Variables for services and component
    let fixture: ComponentFixture<SellerListComponent>;
    let sellerListComponent: SellerListComponent;
    let loadingService: LoadingService;
    let storeService: StoresService;
    let matDialog: MatDialog;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SellerListComponent],
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                SharedModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: LoadingService, useValue: mockLoadingService},
                {provide: StoresService, useValue: mockStoresService},
                {provide: MatDialog, useValue: mockDialog},
                {provide: MAT_DIALOG_DATA, useValue: data},
                {provide: MatDialogRef, useValue: mockDialogRef},
                {provide: AuthService, useValue: mockAuthService},
                {provide: ModalService, useValue: mockDialogError},
            ]
        }).compileComponents();

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DialogWithFormComponent]
            }
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SellerListComponent);
        sellerListComponent = fixture.componentInstance;
        loadingService = TestBed.get(LoadingService);
        storeService = TestBed.get(StoresService);
        matDialog = TestBed.get(MatDialog);
        dialogFixture = TestBed.createComponent(DialogWithFormComponent);
        dialogComponent = dialogFixture.componentInstance;
        mockAuthService.getPermissionForMenu.and.returnValue(true);
    });

    it('should create seller list component', () => {
        expect(sellerListComponent).toBeTruthy();
        expect(storeService).toBeTruthy();
        expect(loadingService).toBeTruthy();
    });

    describe('List with data', () => {

        beforeEach(() => {
            const responseGetAllUsers = Object.assign({}, response);
            mockStoresService.getAllStoresFull.and.returnValue(of(responseGetAllUsers));
            mockDialog.open.and.returnValue(mockDialogRef);
            mockDialogRef.componentInstance.and.returnValue(dialogComponent);
            mockDialogRef.afterClosed.and.returnValue(new Observable<any>());
            mockDialog.open.calls.reset();
            mockStoresService.getAllStoresFull.calls.reset();
            mockDialogRef.componentInstance.calls.reset();
            mockDialogRef.afterClosed.calls.reset();
            sellerListComponent.ngOnInit();
        });

        it('Should be exist btn status', () => {
            fixture.detectChanges();
            expect(sellerListComponent.sellerList.length).toEqual(3);
            const btnEnabledSeller = fixture.debugElement.query(By.css('#btn-enabled-seller')).nativeElement;
            const btnDisabledSeller = fixture.debugElement.query(By.css('#btn-disabled-seller')).nativeElement;
            const btnVacationSeller = fixture.debugElement.query(By.css('#btn-vacation-seller')).nativeElement;
            expect(btnDisabledSeller).toBeTruthy();
            expect(btnEnabledSeller).toBeTruthy();
            expect(btnVacationSeller).toBeTruthy();
        });

        it('should be build form for dialog to disabled status', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm({status: 'disabled', posSeller: 0});
            expect(stateForm.get('Reasons')).toBeTruthy();
            expect(stateForm.get('Observations')).toBeTruthy();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
        });

        it('should be build form for dialog to vacation status', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm({status: 'vacation', posSeller: 0});
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeTruthy();
            expect(stateForm.get('StartDateVacation')).toBeTruthy();
        });

        it('Should be build form for dialog to enabled status', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm({status: 'enabled', posSeller: 1});
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
        });

        it('should be build status form for change from disabled to vacation', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm({status: 'disabled', posSeller: 0});
            expect(stateForm.get('Reasons')).toBeTruthy();
            expect(stateForm.get('Observations')).toBeTruthy();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
            sellerListComponent.putComplementDataInStatusForm({status: 'vacation', posSeller: 0});
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeTruthy();
            expect(stateForm.get('StartDateVacation')).toBeTruthy();
        });

        it('should be build status form for change from vacation to disabled', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm({status: 'vacation', posSeller: 0});
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeTruthy();
            expect(stateForm.get('StartDateVacation')).toBeTruthy();
            sellerListComponent.putComplementDataInStatusForm({status: 'disabled', posSeller: 0});
            expect(stateForm.get('Reasons')).toBeTruthy();
            expect(stateForm.get('Observations')).toBeTruthy();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
        });

        it('should be build status form for change from vacation to enabled', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm({status: 'vacation', posSeller: 2});
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeTruthy();
            expect(stateForm.get('StartDateVacation')).toBeTruthy();
            sellerListComponent.putComplementDataInStatusForm({status: 'enabled', posSeller: 2});
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();

        });

        it('should be build status form for change from disabled to enabled', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm({status: 'disabled', posSeller: 2});
            expect(stateForm.get('Reasons')).toBeTruthy();
            expect(stateForm.get('Observations')).toBeTruthy();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
            sellerListComponent.putComplementDataInStatusForm({status: 'enabled', posSeller: 0});
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
        });

        // it('should be return a data for enabled Dialog of an disabled Seller', () => {
        //     sellerListComponent.initStatusForm();
        //     const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[1], 'enabled', 1);
        //     expect(resultData.title).toEqual('Activación');
        // });

        // it('should be return a data for enabled Dialog of an disabled Seller', () => {
        //     sellerListComponent.initStatusForm();
        //     const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[2], 'enabled', 2);
        //     expect(resultData.title).toEqual('Activación');
        // });

        // it('should be return a data for disabled Dialog of an enabled Seller', () => {
        //     sellerListComponent.initStatusForm();
        //     const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[0], 'disabled', 0);
        //     expect(resultData.title).toEqual('Desactivación');
        // });

        // it('should be return a data for disabled Dialog of an vacation Seller', () => {
        //     sellerListComponent.initStatusForm();
        //     const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[2], 'disabled', 2);
        //     expect(resultData.title).toEqual('Desactivación');
        // });

        // it('should be return a data for vacation Dialog of an enabled Seller', () => {
        //     sellerListComponent.initStatusForm();
        //     const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[0], 'vacation', 0);
        //     expect(resultData.title).toEqual('Vacaciones');
        // });

        it('Should not be return a data for enabled dialog of an enabled seller', () => {
            sellerListComponent.initStatusForm();
            const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[0], 'enabled', 0);
            expect(resultData.title).toEqual('');
        });

        it('Should not be return a data for disabled dialog of an disabled seller', () => {
            sellerListComponent.initStatusForm();
            const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[1], 'disabled', 1);
            expect(resultData.title).toEqual('');
        });

        it('Should not be return a data for vacation dialog of a disabled seller', () => {
            sellerListComponent.initStatusForm();
            const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[1], 'vacation', 1);
            expect(resultData.title).toEqual('');
        });

        // it('should be active a disabled seller dialog', () => {
        //     sellerListComponent.initStatusForm();
        //     sellerListComponent.changeSellerStatus(constSellerList[0], 'disabled', 0);
        //     expect(mockDialog.open).toHaveBeenCalled();
        // });

        it('should not be active a active seller dialog', () => {
            sellerListComponent.initStatusForm();
            sellerListComponent.changeSellerStatus(constSellerList[0], 'enabled', 0);
            expect(mockDialog.open).toHaveBeenCalledTimes(0);
        });

        // it('should be return data for cancel vacation dialog', () => {
        //     const dataDialog = sellerListComponent.setDataCancelVacationsDialog();
        //     expect(dataDialog.title).toEqual('Cancelar vacaciones');
        // });

        it('should be open dialog cancel vacations', () => {
            const dataDialog = sellerListComponent.setDataCancelVacationsDialog();
            const dialogInstance = sellerListComponent.openCancelVacationDialog(dataDialog);
            expect(mockDialog.open).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledTimes(1);
        });

        it('should be send to open dialog cancel vacations', () => {
            sellerListComponent.sendToOpenCancelVacationDialog(2);
            expect(mockDialog.open).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledTimes(1);
        });

        it('should be update a seller disabled to enabled', () => {
// tslint:disable-next-line: no-shadowed-variable
            const response = {
                posSeller: 1,
                status: 'enabled'
            };
            expect(sellerListComponent.sellerList[1].Status).toEqual('Disable');
            sellerListComponent.updateSeller(response);
            expect(sellerListComponent.sellerList[1].Status).toEqual('Enable');
        });

        it('should be update a seller enabled to disabled', () => {
// tslint:disable-next-line: no-shadowed-variable
            const response: any = {
                posSeller: 0,
                status: 'disabled'
            };
            expect(sellerListComponent.sellerList[0].Status).toEqual('Enable');
            sellerListComponent.updateSeller(response);
            expect(sellerListComponent.sellerList[0].Status).toEqual('Disable');
        });

        it('should be update a seller enabled to programVacation', () => {
// tslint:disable-next-line: no-shadowed-variable
            const response: any = {
                posSeller: 0,
                status: 'vacation'
            };
            const list = sellerListComponent.sellerList;
            sellerListComponent.setDataChangeStatusDialog(list[0], 'vacation', 0);
            sellerListComponent.startDateVacation.setValue(new Date());
            sellerListComponent.endDateVacation.setValue(new Date(new Date().getDate() + 5));
            expect(list[0].StartVacations).toBeNull();
            expect(list[0].EndVacations).toBeNull();
            sellerListComponent.updateSeller(response);
            expect(list[0].StartVacations).not.toBeNull();
            expect(list[0].EndVacations).not.toBeNull();
        });
    });

    describe('List without data', () => {
        beforeEach(() => {
            const newResponse = {
                status: 200,
                body: {
                    body: JSON.stringify({
                        Data: []
                    })
                }
            };
            mockStoresService.getAllStoresFull.and.returnValue(of(newResponse));
            mockDialog.open.and.returnValue(mockDialogRef);
            mockDialogRef.componentInstance.and.returnValue(dialogComponent);
            mockDialogRef.afterClosed.and.returnValue(new Observable<any>());
            mockDialog.open.calls.reset();
            mockStoresService.getAllStoresFull.calls.reset();
            mockDialogRef.componentInstance.calls.reset();
            mockDialogRef.afterClosed.calls.reset();
            sellerListComponent.ngOnInit();
        });

        it('Should not be exist btn status', () => {
            fixture.detectChanges();
            const btnEnabledSeller = fixture.debugElement.query(By.css('#btn-enabled-seller'));
            const btnDisabledSeller = fixture.debugElement.query(By.css('#btn-disabled-seller'));
            const btnVacationSeller = fixture.debugElement.query(By.css('#btn-vacation-seller'));
            expect(btnDisabledSeller).toBeNull();
            expect(btnEnabledSeller).toBeNull();
            expect(btnVacationSeller).toBeNull();
        });

    });

});
