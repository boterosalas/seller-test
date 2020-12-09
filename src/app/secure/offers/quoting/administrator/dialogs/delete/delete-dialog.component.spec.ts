import { async, fakeAsync } from '@angular/core/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListTransporterService } from '../../list-transporter/list-transporter.service';
import { ListZonesService } from '../../list-zones/list-zones.service';

/** Own imports */
import { DeleteDialogComponent } from './delete-dialog.component';
import { SupportService } from '@app/secure/support-modal/support.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { of } from 'rxjs';

export const registerRegex = [
    { Identifier: 'formatIntegerNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'parametrizacion' },
  ];

describe('DeleteDialogComponent', () => {

    /** Elements to launch and manipulate component */
    let fixture: ComponentFixture<DeleteDialogComponent>;
    let component: DeleteDialogComponent;
    let supportService: SupportService;

    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const listTransporterService = new ListTransporterService(null, null);
    const listZonesService = new ListZonesService(null, null);
    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                DeleteDialogComponent
            ],
            providers: [
                ListTransporterService,
                ListZonesService,
                SupportService,
                HttpClient,
                HttpHandler,
                EndpointService,
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: ListTransporterService, useValue: listTransporterService },
                { provide: ListZonesService, useValue: listZonesService }
            ], imports: [
                MaterialModule
            ]
        }).compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteDialogComponent);
        component = fixture.componentInstance;
        supportService = TestBed.get(SupportService);
        mockSupportService.getRegexFormSupport.and.returnValue(of(registerRegex));
        fixture.detectChanges();
        component.dialogRef.close = (bool) => { };
    });

    it('should create DeleteDialogComponent', (done) => {
        expect(component).toBeTruthy();
        done();
    });

    it('should create DeleteDialogComponent', (done) => {
       component.closeDialog(true);
       done();
    });

    afterAll(() => {
        TestBed.resetTestingModule();
    });
});
