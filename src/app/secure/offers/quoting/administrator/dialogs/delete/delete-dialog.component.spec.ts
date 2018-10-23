import { async } from '@angular/core/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListTransporterService } from '../../list-transporter/list-transporter.service';
import { ListZonesService } from '../../list-zones/list-zones.service';

/** Own imports */
import { DeleteDialogComponent } from './delete-dialog.component';

describe('DeleteDialogComponent', () => {

    /** Elements to launch and manipulate component */
    let fixture: ComponentFixture<DeleteDialogComponent>;
    let component: DeleteDialogComponent;

    const listTransporterService = new ListTransporterService(null, null);
    const listZonesService = new ListZonesService(null, null);
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DeleteDialogComponent
            ],
            providers: [
                ListTransporterService,
                ListZonesService,
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: ListTransporterService, useValue: listTransporterService },
                { provide: ListZonesService, useValue: listZonesService }
            ], imports: [
                MaterialModule
            ]
        }).compileComponents();
    }));

    afterAll(() => {
        fixture.destroy();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.dialogRef.close = (bool) => { };
    });

    it('should create DeleteDialogComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should create DeleteDialogComponent', () => {
       component.closeDialog(true);
    });

});
