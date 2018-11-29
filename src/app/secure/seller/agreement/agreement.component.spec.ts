import { async } from '@angular/core/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AgreementComponent } from './agreement.component';
import { AgreementService, Agreement } from './agreement.component.service';
import { Observable, of } from 'rxjs';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';



fdescribe('AgreementComponent', () => {

    /** Elements to launch and manipulate component */
    let fixture: ComponentFixture<AgreementComponent>;
    let component: AgreementComponent;
    const objecto = [{
        Id: 1,
        Name: 'Acuerdo 1 10/15/2018'
    }, {
        Id: 1,
        Name: 'Acuerdo 2 10/15/2019'
    }];


    const agreementService = <AgreementService>{
        getAgreements(idSeller: number): Observable<any> {
            return of(objecto);
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AgreementComponent,
            ],
            providers: [
                { provide: MatDialogRef, useValue: {
                    close: function() {
                    }
                } },
                EventEmitterSeller,
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: AgreementService, useValue: agreementService},
            ], imports: [
                ReactiveFormsModule,
                MaterialModule,
                PdfViewerModule,
                BrowserAnimationsModule
            ]
        }).compileComponents();
    }));

    afterAll(() => {
        fixture.destroy();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AgreementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Deberia crear el componente AgreementComponent', () => {
        expect(component).toBeTruthy();
    });

});
