import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SellerModule } from "../seller.module";
import { SellerListComponent } from "./list-sellers.component";
import { DialogWithFormComponent } from "./dialog-with-form/dialog-with-form.component";
import { MaterialModule } from "@app/material.module";
import { LoadingService } from "@app/core";
import { StoresService } from "@app/secure/offers/stores/stores.service";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { of, Observable } from "rxjs";
import { SellerRoutingModule } from "../seller.routing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { componentFactoryName } from "@angular/compiler";
import { AuthService } from "@app/secure/auth/auth.routing";

export const constSellerList = [
    {
        Address: 'Direccion A',
        DaneCode: '123456',
        GotoCarrulla: true,
        GotoCatalogo: true,
        GotoExito: true,
        IdSeller: 51278,
        IsLogisticsExito: false,
        IsShippingExito: true,
        Name: 'test 1',
        Nit: '18026014',
        status: 'enabled'
    },
    {
        Address: 'Direccion B',
        DaneCode: '123455',
        GotoCarrulla: true,
        GotoCatalogo: true,
        GotoExito: true,
        IdSeller: 9876547,
        IsLogisticsExito: false,
        IsShippingExito: true,
        Name: 'test 2',
        Nit: '18026013',
        status: 'disabled'
    },
    {
        Address: 'Direccion C',
        DaneCode: '123457',
        GotoCarrulla: true,
        GotoCatalogo: true,
        GotoExito: true,
        IdSeller: 36589962,
        IsLogisticsExito: false,
        IsShippingExito: true,
        Name: 'test 3',
        Nit: '18026015',
        status: 'vacation'
    }
]; 

describe('List Seller Component',() => {

    //Create a Mock Services
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'changeStateSeller']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu'])
    const data = {
        title: '',
        message: '',
        icon: '',
        form: null
    }

    //Create Variables for services and component
    let fixture: ComponentFixture<SellerListComponent>;
    let sellerListComponent: SellerListComponent;
    let loadingService: LoadingService;
    let storeService: StoresService;
    let matDialog: MatDialog;
    let dialogFixture: ComponentFixture<DialogWithFormComponent>;
    let dialogComponent: DialogWithFormComponent;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SellerListComponent, DialogWithFormComponent],
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule
            ],
            providers:[
                {provide: LoadingService, useValue: mockLoadingService},
                {provide: StoresService, useValue: mockStoresService},
                {provide: MatDialog, useValue: mockDialog},
                {provide: MAT_DIALOG_DATA, useValue: data},
                {provide: MatDialogRef, useValue: mockDialogRef},
                {provide: AuthService, useValue: mockAuthService}
            ]
        }).compileComponents();

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DialogWithFormComponent]
            }
        })
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SellerListComponent);
        sellerListComponent = fixture.componentInstance;
        loadingService = TestBed.get(LoadingService);
        storeService = TestBed.get(StoresService);
        matDialog = TestBed.get(MatDialog);
        dialogFixture = TestBed.createComponent(DialogWithFormComponent);
        dialogComponent = dialogFixture.componentInstance;
    });

    it('should create seller list component', () => {
        expect(sellerListComponent).toBeTruthy();
        expect(storeService).toBeTruthy();
        expect(loadingService).toBeTruthy();
    });

    describe('List with data',() => {

        beforeEach(async(() => {
            sellerListComponent.sellerList = constSellerList;
            sellerListComponent.sellerLength = constSellerList.length;
            mockStoresService.getAllStoresFull.and.returnValue(of(JSON.stringify(constSellerList)));
            mockDialog.open.and.returnValue(mockDialogRef);
            mockDialogRef.componentInstance.and.returnValue(dialogComponent);
            mockDialogRef.afterClosed.and.returnValue(new Observable<any>());
            mockDialog.open.calls.reset();
            mockStoresService.getAllStoresFull.calls.reset();
            mockDialogRef.componentInstance.calls.reset();
            mockDialogRef.afterClosed.calls.reset();
        })); 

        it('Should be exist btn status',() => {
            () => {
                expect(sellerListComponent.sellerList.length).toEqual(3);
                const btnEnabledSeller = fixture.debugElement.query(By.css('#btn-enabled-seller')).nativeElement;
                const btnDisabledSeller = fixture.debugElement.query(By.css('#btn-disabled-seller')).nativeElement;
                const btnVacationSeller = fixture.debugElement.query(By.css('#btn-vacation-seller')).nativeElement;
                expect(btnDisabledSeller).toBeTruthy();
                expect(btnEnabledSeller).toBeTruthy();
                expect(btnVacationSeller).toBeTruthy();
            }
        });

        it('Should not be exist btn status', () => {
            sellerListComponent.sellerList = [];
            const btnEnabledSeller = fixture.debugElement.query(By.css('#btn-enabled-seller'));
            const btnDisabledSeller = fixture.debugElement.query(By.css('#btn-disabled-seller'));
            const btnVacationSeller = fixture.debugElement.query(By.css('#btn-vacation-seller'));
            expect(btnDisabledSeller).toBeNull();
            expect(btnEnabledSeller).toBeNull();
            expect(btnVacationSeller).toBeNull();
        });

        it('should be build form for dialog to disabled status', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm('disabled');
            expect(stateForm.get('Reasons')).toBeTruthy();
            expect(stateForm.get('Observations')).toBeTruthy();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
        });

        it('should be build form for dialog to vacation status', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm('vacation');
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeTruthy();
            expect(stateForm.get('StartDateVacation')).toBeTruthy();
        });

        it('Should be build form for dialog to enabled status', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm('enabled');
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
        });

        it('should be build status form for change from disabled to vacation', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm('disabled');
            expect(stateForm.get('Reasons')).toBeTruthy();
            expect(stateForm.get('Observations')).toBeTruthy();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
            sellerListComponent.putComplementDataInStatusForm('vacation');
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeTruthy();
            expect(stateForm.get('StartDateVacation')).toBeTruthy();
        });

        it('should be build status form for change from vacation to disabled', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm('vacation');
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeTruthy();
            expect(stateForm.get('StartDateVacation')).toBeTruthy();
            sellerListComponent.putComplementDataInStatusForm('disabled');
            expect(stateForm.get('Reasons')).toBeTruthy();
            expect(stateForm.get('Observations')).toBeTruthy();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
        });

        it('should be build status form for change from vacation to enabled', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm('vacation');
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeTruthy();
            expect(stateForm.get('StartDateVacation')).toBeTruthy();
            sellerListComponent.putComplementDataInStatusForm('enabled');
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();

        });

        it('should be build status form for change from disabled to enabled', () => {
            sellerListComponent.initStatusForm();
            const stateForm = sellerListComponent.statusForm;
            sellerListComponent.putComplementDataInStatusForm('disabled');
            expect(stateForm.get('Reasons')).toBeTruthy();
            expect(stateForm.get('Observations')).toBeTruthy();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
            sellerListComponent.putComplementDataInStatusForm('enabled');
            expect(stateForm.get('Reasons')).toBeNull();
            expect(stateForm.get('Observations')).toBeNull();
            expect(stateForm.get('EndDateVacation')).toBeNull();
            expect(stateForm.get('StartDateVacation')).toBeNull();
        });

        it('should be transform a specific date to a date with format DD/MM/YYYY', () => {
            const date = new Date();
            const resultDate = sellerListComponent.setFormatDate(date);
            expect(resultDate).toEqual(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
        });

        it('should be return a data for enabled Dialog of an disabled Seller', () => {
            sellerListComponent.initStatusForm();
            const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[1], 'enabled', 1);
            expect(resultData.title).toEqual('Activación');
        });

        it('should be return a data for enabled Dialog of an disabled Seller', () => {
            sellerListComponent.initStatusForm();
            const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[2], 'enabled', 2);
            expect(resultData.title).toEqual('Activación');
        });

        it('should be return a data for disabled Dialog of an enabled Seller', () => {
            sellerListComponent.initStatusForm();
            const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[0], 'disabled', 0);
            expect(resultData.title).toEqual('Desactivación');
        });

        it('should be return a data for disabled Dialog of an vacation Seller', () => {
            sellerListComponent.initStatusForm();
            const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[2], 'disabled', 2);
            expect(resultData.title).toEqual('Desactivación');
        });

        it('should be return a data for vacation Dialog of an enabled Seller', () => {
            sellerListComponent.initStatusForm();
            const resultData = sellerListComponent.setDataChangeStatusDialog(constSellerList[0], 'vacation', 0);
            expect(resultData.title).toEqual('Vacaciones');
        });

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

        it('should be active a disabled seller dialog', () => {
            sellerListComponent.initStatusForm();
            sellerListComponent.changeSellerStatus(constSellerList[0], 'disabled', 0);
            expect(mockDialog.open).toHaveBeenCalled();
        });

        it('should not be active a active seller dialog', () => {
            sellerListComponent.initStatusForm();
            sellerListComponent.changeSellerStatus(constSellerList[0], 'enabled', 0);
            expect(mockDialog.open).toHaveBeenCalledTimes(0);
        });

    });

});