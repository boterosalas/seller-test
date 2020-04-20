import { async, fakeAsync } from '@angular/core/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EventEmitterDialogs } from './../../events/eventEmitter-dialogs.service';
import { ModalService, LoadingService } from '@app/core';
import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Own imports */
import { CreateDialogComponent } from './create-dialog.component';
import { ShippingMethodsModel } from '../../shipping-methods/shipping-methods.model';
import { ShippingMethodsService } from '../../shipping-methods/shipping-methods.service';
import { ListTransporterService } from '../../list-transporter/list-transporter.service';
import { ListZonesService } from '../../list-zones/list-zones.service';
import { TransportModel } from '../../dialogs/models/transport.model';
import { ZoneModel } from '../../dialogs/models/zone.model';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateDialogComponent', () => {

    /** Elements to launch and manipulate component */
    let fixture: ComponentFixture<CreateDialogComponent>;
    let component: CreateDialogComponent;

    const events = <EventEmitterDialogs>{
        openDialogCreate(dialog: boolean): void {
            /** Mock to do it nothing */
        }
    };

    const modalService = <ModalService>{
        showModal(type: string) {
            return null;
        }
    };

    const shippingMethodsList = [
        new ShippingMethodsModel('Por Categoria', 'library_books', 1),
        new ShippingMethodsModel('Rango de precio', 'local_offer', 2),
        new ShippingMethodsModel('Rango de peso', 'assignment', 3),
    ];
    const structureShippingJson = {
        statusCode: 200,
        body: JSON.stringify(({ Data: shippingMethodsList }))
    };
    const transport = new TransportModel('Transport 1', 'Method 1', 1, 1);
    const tranposts = [
        transport,
        new TransportModel('Transport 2', 'Method 2', 2, 2),
        new TransportModel('Transport 3', 'Method 3', 3, 3),
    ];

    const structureJson = {
        statusCode: 200,
        status: 200,
        body: { body: JSON.stringify({ Data: tranposts }) }
    };

    const structureUpdateTransportJson = {
        statusCode: 200,
        status: 200,
        body: JSON.stringify({ Data: transport })
    };

    const structureTransportJson = {
        statusCode: 200,
        status: 200,
        body: { body: JSON.stringify({ Data: transport }) }
    };

    const zone1 = new ZoneModel('Zona 1', '12345678', 1);

    const structureJsonZone = {
        statusCode: 200,
        status: 200,
        body: { body: JSON.stringify({ Data: zone1 }) }
    };

    const shippingMethodsService = <ShippingMethodsService>{
        getShippingMethods(): Observable<any> {
            return of(structureShippingJson);
        }
    };

    /**
     *  Initialize services and requirement elements to test of ListZonesComponent.
     * 1. ListZonesService: service mock to get required data.
     */
    const listZonesService = <ListZonesService>{
        getListZones(): Observable<{}> {
            return of(structureJsonZone);
        },
        getDialogType(): number {
            return 2;
        },
        getZone(id: number): Observable<{}> {
            return of(structureJsonZone);
        },
        addZone(data: ZoneModel[]): Observable<{}> {
            return of(structureJsonZone);
        },
        updateZone(data: ZoneModel[]): Observable<{}> {
            return of(structureJsonZone);
        }
    };

    /**
     * Initialize all required to charge component like services.
     */
    const listTransporterService = <ListTransporterService>{
        getDialogType(): number {
            return 1;
        },
        getListTransporters(): Observable<{}> {
            return of(structureJson);
        },
        deleteTransporter(id: number): Observable<{}> {
            return of(structureJson);
        },
        createTransporter(data: TransportModel): Observable<{}> {
            return  of(structureJson);
        },
        getTransport(id: number): Observable<{}> {
            return  of(structureTransportJson);
        },
        updateTransporter(data: TransportModel): Observable<{}> {
            return  of(structureUpdateTransportJson);
        }
    };


    const matSnackBar = <MatSnackBar>{
        open(msg: string) {
            /** Mock to do it nothing */
        }
    };
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner', 'viewProgressBar', 'closeProgressBar' ]);

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                CreateDialogComponent
            ],
            providers: [
                { provide: EventEmitterDialogs, useValue: events },
                { provide: ModalService, useValue: modalService },
                { provide: ShippingMethodsService, useValue: shippingMethodsService },
                { provide: ListTransporterService, useValue: listTransporterService },
                { provide: ListZonesService, useValue: listZonesService },
                { provide: MatSnackBar, useValue: matSnackBar },
                { provide: LoadingService, useValue: mockLoadingService}
            ], imports: [
                MaterialModule,
                MatFormFieldModule,
                ReactiveFormsModule,
                FormsModule,
                BrowserAnimationsModule,
                SharedModule,
                HttpClientTestingModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    afterAll(() => {
        fixture.destroy();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create CreateDialogComponent', (done) => {
        expect(component).toBeTruthy();
        done();
    });

    it('should create zone', (done) => {
        component.dialogMode = false;
        component.saveZone();
        fixture.detectChanges();
        done();
    });

    it('should update zone', (done) => {
        component.dialogMode = true;
        component.idToEdit = 1;
        structureJsonZone.status = 201;
        component.saveZone();
        done();
    });

    it('shoult create zone dialog', (done) => {
        component.dialogMode = false;
        component.idToEdit = null;
        component.ngOnInit();
        expect(component.formZone.valid).toBeFalsy();
        done();
    });

    it('shoult create zone dialog but charge zone get error', (done) => {
        component.dialogMode = true;
        component.idToEdit = 1;
        component.ngOnInit();
        structureJsonZone.status = 400;
        component.saveZone();
        done();
    });

    it('should create CreateDialogComponent to transports and validate his validators', (done) => {
        component.typeDialog = 1;
        component.idToEdit = null;
        component.dialogMode = false;
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.formTransporter.valid).toBeFalsy();
        const nameTransport = component.formTransporter.controls['Name'];
        const idShippingMethod = component.formTransporter.controls['IdShippingMethod'];
        /** Validate  */
        expect(nameTransport.valid).toBeFalsy();
        expect(idShippingMethod.valid).toBeFalsy();

        expect(nameTransport.errors['required']).toBeTruthy();
        expect(idShippingMethod.errors['required']).toBeTruthy();

        /** Put data  */
        nameTransport.setValue('name 1');
        idShippingMethod.setValue(shippingMethodsList[0].Id);
        expect(component.formTransporter.valid).toBeTruthy();
        component.saveTransport();
        done();
    });

    it('should update transport', (done) => {
        component.typeDialog = 1;
        component.idToEdit = transport.Id;
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.formTransporter.valid).toBeTruthy();
        component.saveTransport();
        done();
    });
});
