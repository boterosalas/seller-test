import { async } from '@angular/core/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TermsComponent } from './terms.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EndpointService, LoadingService } from '@app/core';
import { HttpClient } from '@angular/common/http';
import { BillingOrdersService } from '@app/secure/orders/billing-orders/billing-orders.service';


describe('TermsComponent', () => {

    /** Elements to launch and manipulate component */
    let fixture: ComponentFixture<TermsComponent>;
    let component: TermsComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TermsComponent,
            ],
            providers: [
                {
                    provide: MatDialogRef, useValue: {
                        close: function () {
                        }
                    }
                },
                { provide: MAT_DIALOG_DATA, useValue: 'https://s3.amazonaws.com/sellercenter.nuget/Logger/Acuerdo+Comercial+Marketplace+-+Actualizado+16-11-2018.pdf' },
                { provide: HttpClient, useValue: {
                } },
                {
                    provide: EndpointService, useValue: {
                        get(): string {
                            return null;
                        }
                    }
                },
                { provide: BillingOrdersService, useValue: {} },
                { provide: LoadingService, useValue: {} },
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
        fixture = TestBed.createComponent(TermsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /*it('Deberia crear el componente TermsComponent', () => {
        expect(component).toBeTruthy();
    });

    it('Deberia intentar guardar pero el formulario no es valido', () => {
        component.saveTerms();
        expect(component.formTerms.valid).toBeFalsy();
    });

    it('Deberia intentar guardar cuando el formulario es valido', () => {
        component.formTerms.controls.responsable.setValue('Luis Miguel E');
        component.formTerms.controls.identification.setValue('12345678');
        component.formTerms.controls.accept.setValue(true);
        expect(component.formTerms.valid).toBeTruthy();
    });

    it('Deberia tener el formulario invalido ya que solo tiene el responsable', () => {
        component.formTerms.controls.responsable.setValue('Luis Miguel E');
        component.formTerms.controls.identification.setValue('');
        component.formTerms.controls.accept.setValue(false);
        expect(component.formTerms.valid).toBeFalsy();
    });

    it('Deberia tener el formulario invalido ya que solo tiene el acepta las condiciones', () => {
        component.formTerms.controls.responsable.setValue('');
        component.formTerms.controls.identification.setValue('');
        component.formTerms.controls.accept.setValue(true);
        expect(component.formTerms.valid).toBeFalsy();
    });

    it('Deberia tener el formulario invalido ya que solo tiene la identificacion', () => {
        component.formTerms.controls.responsable.setValue('');
        component.formTerms.controls.identification.setValue('12345678');
        component.formTerms.controls.accept.setValue(false);
        expect(component.formTerms.valid).toBeFalsy();
    });
    */

});
