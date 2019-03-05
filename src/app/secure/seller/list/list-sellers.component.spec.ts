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

fdescribe('List Seller Component',() => {

    //Create a Mock Services
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
    const mockStoresService = jasmine.createSpyObj('StoresService', ['getAllStoresFull', 'changeStateSeller']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
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
                {provide: MatDialogRef, useValue: mockDialogRef}
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

        it('Should net be exist btn status', () => {
            sellerListComponent.sellerList = [];
            const btnEnabledSeller = fixture.debugElement.query(By.css('#btn-enabled-seller'));
            const btnDisabledSeller = fixture.debugElement.query(By.css('#btn-disabled-seller'));
            const btnVacationSeller = fixture.debugElement.query(By.css('#btn-vacation-seller'));
            expect(btnDisabledSeller).toBeNull();
            expect(btnEnabledSeller).toBeNull();
            expect(btnVacationSeller).toBeNull();
        })

        it('should be activate a disabled seller', async(() => {
            const listOfSeller = sellerListComponent.sellerList;
            console.log(11, dialogComponent);
            sellerListComponent.changeSellerState(listOfSeller[1],'enabled');
            fixture.detectChanges();
            dialogFixture.detectChanges();
            console.log(22, dialogComponent);

            expect();
        }));

        /*
        it('should not be activate an enabled seller', () => {
            
        });

        it('should be activate a seller in vacation', () => {
            
        });

        it('should be disabled a enabled seller', () => {
            
        });

        it('should not be disabled a disabled seller', () => {
            
        });

        it('should be disabled a seller in vacation', () => {
            
        });

        it('should be program a vacation of enabled seller', () => {
            
        });

        it('should not be program a vacation of disabled seller', () => {
            
        });

        it('should be reprogram a vacation of seller in vacation', () => {
            
        });
        */
    });

});