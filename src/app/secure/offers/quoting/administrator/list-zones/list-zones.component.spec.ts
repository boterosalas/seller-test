import { async, fakeAsync } from '@angular/core/testing';
import { LoadingService } from '@app/core';
import { Observable, of } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { ListZonesComponent } from './list-zones.component';
import { ListTransporterService } from '../list-transporter/list-transporter.service';
import { EventEmitterDialogs } from './../events/eventEmitter-dialogs.service';
import { ModalService } from '@app/core';
import { QuotingAdminService } from '../quoting-administrator.service';
import { CreateDialogComponent } from '../dialogs/create/create-dialog.component';
import { ShippingMethodsService } from '../shipping-methods/shipping-methods.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ZoneModel } from '../dialogs/models/zone.model';

/** Own imports */
import { ListZonesService } from './list-zones.service';
import { SharedModule } from '@app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListZonesComponent', () => {

    let fixture: ComponentFixture<ListZonesComponent>;
    let component: ListZonesComponent;

    const zone1 = new ZoneModel('Zona 1', '12345678', 1);

    const zones = [
        zone1,
        new ZoneModel('Zona 2', '12345679', 2),
        new ZoneModel('Zona 3', '12345670', 3),
    ];

    const structureJson = {
        statusCode: 200,
        status: 200,
        body: { body: JSON.stringify({ Data: zones }) }
    };

    /**
     *  Initialize services and requirement elements to test of ListZonesComponent.
     * 1. ListZonesService: service mock to get required data.
     */
    const listZonesService = <ListZonesService>{
        getListZones(): Observable<{}> {
            return of(structureJson);
        },
        getDialogType(): number {
            return ;
        },
        deleteZone(id: number): Observable<{}> {
            return of(structureJson);
        },
    };

    const listTransporterService = <ListTransporterService>{};
    const shippingMethodsService = <ShippingMethodsService>{};
    const events = new EventEmitterDialogs();
    const modalService = <ModalService>{
        showModal(type: string) {
            return null;
        }
    };

    const matDialog = <MatDialog>{
        open(mat1: any, mat2: any) {
            return {
                afterClosed: () => of(true)
              };
        }
    };

    const quotingService = new QuotingAdminService();
    const matSnackBar: MatSnackBar = null;
    const loadingService = new LoadingService();

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ListZonesComponent,
                CreateDialogComponent
            ],
            providers: [
                { provide: ListZonesService, useValue: listZonesService },
                { provide: EventEmitterDialogs, useValue: events },
                { provide: ModalService, useValue: modalService },
                QuotingAdminService,
                { provide: MatDialog, useValue: matDialog },
                { provide: LoadingService, useValue: loadingService },
                { provide: ListTransporterService, useValue: listTransporterService },
                { provide: ShippingMethodsService, useValue: shippingMethodsService },
                { provide: MatSnackBar, useValue: matSnackBar },
            ], imports: [
                MaterialModule,
                MatFormFieldModule,
                ReactiveFormsModule,
                FormsModule,
                SharedModule,
                HttpClientTestingModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(async() => {
        fixture = TestBed.createComponent(ListZonesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ListZonesComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should get zones list but with all request execute (4)', () => {
        expect(quotingService.getNumberOfService()).toBe(false);
        expect(quotingService.getNumberOfService()).toBe(false);
        expect(quotingService.getNumberOfService()).toBe(false);
        expect(quotingService.getNumberOfService()).toBe(true);
        component.getListZones();
        component.getListZones();
        fixture.detectChanges();
        component.getListZones();
        fixture.detectChanges();
        const zonesList = component.listZones;
        expect(zonesList[0].Name).toBe(zones[0].Name);
        expect(zonesList[0].DaneCode).toBe(zones[0].DaneCode);
        expect(zonesList[1].Name).toBe(zones[1].Name);
        expect(zonesList[1].DaneCode).toBe(zones[1].DaneCode);
    });

    it('should get error from petition get zones list', () => {
        component.listZones = null;
        structureJson.status = 400;
        structureJson.statusCode = 400;
        component.getListZones();
        fixture.detectChanges();
        const zonesList = component.listZones;
        expect(zonesList).toBeNull();
        structureJson.status = 200;
        structureJson.statusCode = 200;
    });

    it('should be put id "null" and openModelCreate "false"', () => {
        component.createZone();
        expect(component.idToEdit).toBeNull();
        expect(component.openModalCreate).toBeTruthy();
    });

    it('should be put id (number) and openModelCreate "true"', () => {
        component.editZone(1);
        expect(component.idToEdit).toBe(1);
        expect(component.openModalCreate).toBeTruthy();
    });

    it('should get again list after delete a zone', () => {
        component.listZones = null;
        component.deleteZone(zone1, 0);
        fixture.detectChanges();
        const zonesList = component.listZones;
        expect(zonesList[0].Name).toBe(zones[0].Name);
        expect(zonesList[0].DaneCode).toBe(zones[0].DaneCode);
        expect(zonesList[1].Name).toBe(zones[1].Name);
        expect(zonesList[1].DaneCode).toBe(zones[1].DaneCode);
    });

    it('should be error delete', () => {
        component.listZones = null;
        structureJson.status = 400;
        structureJson.statusCode = 400;
        component.deleteZone(zone1, 0);
        fixture.detectChanges();
        structureJson.status = 200;
        structureJson.statusCode = 200;
        listZonesService.getDialogType();
    });



});
