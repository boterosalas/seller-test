import { async } from '@angular/core/testing';
import { LoadingService } from '@app/core';
import { Observable, of } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { EventEmitterDialogs } from './../events/eventEmitter-dialogs.service';
import { ModalService } from '@app/core';
import { MatDialog } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/** Own imports */
import { ListTransporterService } from './list-transporter.service';
import { ListTransporterComponent } from './list-transporter.component';

import { QuotingAdminService } from '../quoting-administrator.service';
import { CreateDialogComponent } from '../dialogs/create/create-dialog.component';
import { ShippingMethodsService } from '../shipping-methods/shipping-methods.service';
import { TransportModel } from '../dialogs/models/transport.model';
import { ShippingMethodsModel } from '../shipping-methods/shipping-methods.model';
import { SharedModule } from '@app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListTransporterComponent', () => {

    /** Initialize required data to execute unit test */
    /** First required data */

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

    const shippingMethodsList = [
        new ShippingMethodsModel('Por Categoria', 'library_books', 1),
        new ShippingMethodsModel('Rango de precio', 'local_offer', 2),
        new ShippingMethodsModel('Rango de peso', 'assignment', 3),
    ];

    const structureShippingJson = {
        statusCode: 200,
        body: JSON.stringify(({ Data: shippingMethodsList }))
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
        }
    };
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
    const loadingService = new LoadingService();
    const shippingMethodsService = <ShippingMethodsService>{
        getShippingMethods(): Observable<any> {
            return of(structureShippingJson);
        }
    };
    const quotingService = new QuotingAdminService();

    /** END required constructor data */

    /** Elements to launch and manipulate component */
    let fixture: ComponentFixture<ListTransporterComponent>;
    let component: ListTransporterComponent;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ListTransporterComponent,
                CreateDialogComponent
            ],
            providers: [
                { provide: ListTransporterService, useValue: listTransporterService },
                { provide: EventEmitterDialogs, useValue: events },
                { provide: ModalService, useValue: modalService },
                QuotingAdminService,
                { provide: MatDialog, useValue: matDialog },
                { provide: LoadingService, useValue: loadingService },
                { provide: ListTransporterService, useValue: listTransporterService },
                { provide: ShippingMethodsService, useValue: shippingMethodsService },
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

    beforeEach(() => {
        fixture = TestBed.createComponent(ListTransporterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ListTransporterComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should get error from petition get transporters list', () => {
        structureJson.status = 400;
        structureJson.statusCode = 400;
        structureShippingJson.statusCode = 400;
        fixture.destroy();
        fixture = TestBed.createComponent(ListTransporterComponent);
        component.getListTransporters();
        component.deleteTransporter(transport.Id, 0);
        fixture.detectChanges();
        const transportList = component.listTransporters;
        expect(transportList).not.toBeNull();
        structureJson.status = 200;
        structureJson.statusCode = 200;
        structureShippingJson.statusCode = 200;
    });


    it('should be put id "null" and openModelCreate "false"', () => {
        component.createTransporter();
        expect(component.idToEdit).toBeNull();
        expect(component.openModalCreate).toBeTruthy();
    });

    it('should be put id (number) and openModelCreate "true"', () => {
        component.editTransporter(transport);
        expect(component.idToEdit).toBe(transport.Id);
        expect(component.openModalCreate).toBeTruthy();
    });

    it('should get again list after delete a transport', () => {
        component.listTransporters = null;
        component.deleteTransporter(transport.Id, 0);
        fixture.detectChanges();
        const transportList = component.listTransporters;
        expect(transportList[0].Name).toBe(tranposts[0].Name);
        expect(transportList[0].Method).toBe(tranposts[0].Method);
        expect(transportList[1].Name).toBe(tranposts[1].Name);
        expect(transportList[1].Method).toBe(tranposts[1].Method);
    });

    it('should close spinner by (4) request execute', () => {
        component.getListTransporters();
        component.getListTransporters();
        component.getListTransporters();
        component.getListTransporters();
        component.getShippingMethods();
        const transportList = component.listTransporters;
        expect(transportList[0].Name).toBe(tranposts[0].Name);
        expect(transportList[0].Method).toBe(tranposts[0].Method);
        expect(transportList[1].Name).toBe(tranposts[1].Name);
        expect(transportList[1].Method).toBe(tranposts[1].Method);
    });

    it('should get method name by his id', () => {
        const nameMethod = component.getNameMethod(shippingMethodsList[0].Id);
        expect(nameMethod).toBe(shippingMethodsList[0].Name);
    });

    it('should get "No encontrado" from method name by his id', () => {
        const nameMethod = component.getNameMethod(5);
        expect(nameMethod).toBe('No encontrado');
    });

});
